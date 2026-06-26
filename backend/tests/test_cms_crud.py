"""
NVP Labs - CMS CRUD tests for Projects, Pricing Plans, Products, Site Content.
Covers seed-on-startup data, admin gating (401/403), full CRUD with auth cookies,
publish-flag visibility, site-content upsert idempotency, and public list sorting.
"""
import os
import uuid
import requests
import pytest

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "nvplabs@gmail.com"
ADMIN_PASSWORD = "NVPLabs@2025"


def _uniq(prefix="TEST"):
    return f"{prefix}_{uuid.uuid4().hex[:8]}"


# ---------- fixtures ----------
@pytest.fixture(scope="module")
def admin_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    assert r.json()["role"] == "admin"
    assert "access_token" in s.cookies
    return s


@pytest.fixture(scope="module")
def client_session():
    s = requests.Session()
    email = f"{_uniq('client').lower()}@test.com"
    r = s.post(f"{API}/auth/register", json={"email": email, "password": "Passw0rd!", "name": "Client User"})
    assert r.status_code == 200
    assert r.json()["role"] == "client"
    return s


# ---------- public seed data ----------
class TestPublicSeed:
    def test_projects_seeded(self):
        r = requests.get(f"{API}/projects")
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 8, f"expected at least 8 seeded projects, got {len(items)}"
        # validate shape
        first = items[0]
        for k in ("id", "title", "category", "description", "image", "tech", "published", "order"):
            assert k in first, f"missing key {k} in project"
        assert first["published"] is True

    def test_pricing_plans_seeded(self):
        r = requests.get(f"{API}/pricing-plans")
        assert r.status_code == 200
        items = r.json()
        assert len(items) >= 3
        # sorted by order ASC
        orders = [it["order"] for it in items]
        assert orders == sorted(orders), f"pricing plans not sorted by order: {orders}"
        names = [it["name"] for it in items]
        assert "Starter" in names and "Professional" in names and "Enterprise" in names

    def test_products_seeded(self):
        r = requests.get(f"{API}/products")
        assert r.status_code == 200
        items = r.json()
        assert len(items) >= 4

    def test_site_content_seeded(self):
        r = requests.get(f"{API}/site-content")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, dict)
        for k in ("hero_kicker", "hero_title_line_1", "cta_headline"):
            assert k in data, f"missing seeded site_content key {k}"
        assert data["hero_title_line_1"] == "Building Premium"


# ---------- admin gating ----------
class TestAdminGating:
    ENDPOINTS = [
        "/admin/projects",
        "/admin/pricing-plans",
        "/admin/products",
        "/admin/site-content",
    ]

    @pytest.mark.parametrize("ep", ENDPOINTS)
    def test_unauth_returns_401(self, ep):
        r = requests.get(f"{API}{ep}")
        assert r.status_code == 401, f"{ep} expected 401 unauth, got {r.status_code}"

    @pytest.mark.parametrize("ep", ENDPOINTS)
    def test_client_returns_403(self, client_session, ep):
        r = client_session.get(f"{API}{ep}")
        assert r.status_code == 403, f"{ep} expected 403 for client, got {r.status_code}"

    def test_admin_can_list(self, admin_session):
        for ep in self.ENDPOINTS:
            r = admin_session.get(f"{API}{ep}")
            assert r.status_code == 200, f"{ep} admin list failed: {r.status_code} {r.text}"
            assert isinstance(r.json(), list)


# ---------- Projects CRUD ----------
class TestProjectsCRUD:
    def test_full_crud_and_visibility(self, admin_session):
        title = _uniq("TEST_proj")
        payload = {
            "title": title,
            "category": "AI",
            "description": "automated test project",
            "image": "https://example.com/x.png",
            "tech": ["pytest", "fastapi"],
            "demo_url": "https://demo.example.com",
            "case_study_url": None,
            "featured": True,
            "published": True,
            "order": 999,
        }
        # CREATE
        r = admin_session.post(f"{API}/admin/projects", json=payload)
        assert r.status_code == 200, r.text
        created = r.json()
        assert created["title"] == title
        assert created["category"] == "AI"
        assert "id" in created and isinstance(created["id"], str)
        pid = created["id"]

        try:
            # public visibility - published=True
            pub = requests.get(f"{API}/projects").json()
            assert any(p["id"] == pid for p in pub), "newly created published project missing from public list"

            # UPDATE -> set published=False
            updated_payload = {**payload, "published": False, "description": "updated"}
            r = admin_session.put(f"{API}/admin/projects/{pid}", json=updated_payload)
            assert r.status_code == 200

            # public list should hide it
            pub = requests.get(f"{API}/projects").json()
            assert not any(p["id"] == pid for p in pub), "unpublished project still public"

            # admin list still shows it
            adm = admin_session.get(f"{API}/admin/projects").json()
            match = next((p for p in adm if p["id"] == pid), None)
            assert match is not None
            assert match["published"] is False
            assert match["description"] == "updated"
        finally:
            # DELETE
            r = admin_session.delete(f"{API}/admin/projects/{pid}")
            assert r.status_code == 200, r.text

        # confirm 404 on second delete (gone)
        r = admin_session.delete(f"{API}/admin/projects/{pid}")
        assert r.status_code == 404


# ---------- Pricing Plans CRUD ----------
class TestPricingCRUD:
    def test_full_crud_and_sorting(self, admin_session):
        name = _uniq("TEST_plan")
        payload = {
            "name": name,
            "price": "₹0",
            "period": "/test",
            "description": "test plan",
            "features": ["f1", "f2"],
            "cta": "Test",
            "popular": False,
            "published": True,
            "order": -1,  # should sort before existing plans (order 0,1,2)
        }
        r = admin_session.post(f"{API}/admin/pricing-plans", json=payload)
        assert r.status_code == 200, r.text
        pid = r.json()["id"]

        try:
            pub = requests.get(f"{API}/pricing-plans").json()
            ids = [p["id"] for p in pub]
            assert pid in ids
            # order=-1 should be first
            assert pub[0]["id"] == pid, f"order-1 plan should be first; orders={[p['order'] for p in pub]}"

            # unpublish
            r = admin_session.put(f"{API}/admin/pricing-plans/{pid}", json={**payload, "published": False})
            assert r.status_code == 200
            pub = requests.get(f"{API}/pricing-plans").json()
            assert pid not in [p["id"] for p in pub]
        finally:
            r = admin_session.delete(f"{API}/admin/pricing-plans/{pid}")
            assert r.status_code == 200


# ---------- Products CRUD ----------
class TestProductsCRUD:
    def test_full_crud(self, admin_session):
        name = _uniq("TEST_prod")
        payload = {
            "name": name,
            "category": "AI",
            "price": "₹999",
            "description": "test product",
            "image": "https://example.com/p.png",
            "tag": "Beta",
            "in_stock": True,
            "featured": False,
            "published": True,
            "order": 100,
        }
        r = admin_session.post(f"{API}/admin/products", json=payload)
        assert r.status_code == 200, r.text
        pid = r.json()["id"]

        try:
            pub = requests.get(f"{API}/products").json()
            assert any(p["id"] == pid for p in pub)

            # update price
            r = admin_session.put(f"{API}/admin/products/{pid}", json={**payload, "price": "₹1,299"})
            assert r.status_code == 200
            pub = requests.get(f"{API}/products").json()
            match = next((p for p in pub if p["id"] == pid), None)
            assert match and match["price"] == "₹1,299"
        finally:
            r = admin_session.delete(f"{API}/admin/products/{pid}")
            assert r.status_code == 200

        pub = requests.get(f"{API}/products").json()
        assert not any(p["id"] == pid for p in pub)


# ---------- Site Content upsert ----------
class TestSiteContent:
    def test_upsert_is_idempotent_by_key(self, admin_session):
        key = _uniq("test_key").lower()
        # First PUT -> create
        r = admin_session.put(f"{API}/admin/site-content", json={"key": key, "value": "v1"})
        assert r.status_code == 200
        data = requests.get(f"{API}/site-content").json()
        assert data.get(key) == "v1"

        # Second PUT same key -> update (no duplicate)
        r = admin_session.put(f"{API}/admin/site-content", json={"key": key, "value": "v2"})
        assert r.status_code == 200
        data = requests.get(f"{API}/site-content").json()
        assert data.get(key) == "v2"

        # Admin list count for this key should be exactly 1
        adm = admin_session.get(f"{API}/admin/site-content").json()
        occurrences = [it for it in adm if it["key"] == key]
        assert len(occurrences) == 1, f"key duplicated on upsert: {occurrences}"

        # DELETE
        r = admin_session.delete(f"{API}/admin/site-content/{key}")
        assert r.status_code == 200

        data = requests.get(f"{API}/site-content").json()
        assert key not in data

        # delete missing -> 404
        r = admin_session.delete(f"{API}/admin/site-content/{key}")
        assert r.status_code == 404


# ---------- End-to-end: admin-created project shows up publicly ----------
class TestEndToEnd:
    def test_admin_post_visible_on_public(self, admin_session):
        title = _uniq("TEST_e2e")
        payload = {
            "title": title, "category": "Websites", "description": "e2e",
            "image": "https://example.com/y.png", "tech": ["e2e"],
            "featured": False, "published": True, "order": 500,
        }
        r = admin_session.post(f"{API}/admin/projects", json=payload)
        assert r.status_code == 200
        pid = r.json()["id"]
        try:
            pub = requests.get(f"{API}/projects").json()
            titles = [p["title"] for p in pub]
            assert title in titles
        finally:
            admin_session.delete(f"{API}/admin/projects/{pid}")
