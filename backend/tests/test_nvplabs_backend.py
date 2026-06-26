"""
NVP Labs backend regression tests.
Covers: health, public forms, public reads, auth flow, brute-force lockout,
admin gating, blog + careers CMS.
"""
import os
import time
import uuid
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://nvp-premium-showcase.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "nvplabs@gmail.com"
ADMIN_PASSWORD = "NVPLabs@2025"


def _uniq(prefix="TEST"):
    return f"{prefix}_{uuid.uuid4().hex[:10]}"


def _slug_uniq(prefix="post"):
    # slug-safe (no underscores; server slugifies non-[a-z0-9-] chars)
    return f"{prefix}-{uuid.uuid4().hex[:10]}"


# ---------- fixtures ----------
@pytest.fixture(scope="module")
def admin_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    body = r.json()
    assert body["role"] == "admin"
    assert "access_token" in s.cookies
    return s


@pytest.fixture(scope="module")
def client_session():
    s = requests.Session()
    email = f"{_uniq('client').lower()}@test.com"
    r = s.post(f"{API}/auth/register", json={"email": email, "password": "Passw0rd!", "name": "Client User"})
    assert r.status_code == 200, f"register failed: {r.status_code} {r.text}"
    assert r.json()["role"] == "client"
    s.email = email
    return s


# ---------- health ----------
class TestHealth:
    def test_root(self):
        r = requests.get(f"{API}/")
        assert r.status_code == 200
        body = r.json()
        assert body.get("message")

    def test_health(self):
        r = requests.get(f"{API}/health")
        assert r.status_code == 200
        assert r.json().get("status") == "ok"


# ---------- public forms ----------
class TestPublicForms:
    def test_contact(self):
        payload = {"name": "TEST Tester", "email": "test_contact@test.com",
                   "phone": "1234567890", "subject": "Hi", "message": "Hello"}
        r = requests.post(f"{API}/contact", json=payload)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["success"] is True
        assert "id" in body

    def test_newsletter_first_and_idempotent(self):
        email = f"{_uniq('news').lower()}@test.com"
        r1 = requests.post(f"{API}/newsletter", json={"email": email})
        assert r1.status_code == 200
        assert r1.json()["success"] is True
        # idempotent
        r2 = requests.post(f"{API}/newsletter", json={"email": email})
        assert r2.status_code == 200
        assert r2.json()["success"] is True

    def test_quote(self):
        payload = {"name": "TEST Q", "email": "test_q@test.com", "service": "Web App",
                   "description": "Build me something nice", "budget": "$10k", "timeline": "1 month"}
        r = requests.post(f"{API}/quote", json=payload)
        assert r.status_code == 200
        body = r.json()
        assert body["success"] is True
        assert "id" in body

    def test_calculator(self):
        payload = {"name": "TEST C", "email": "test_c@test.com",
                   "project_type": "Web App", "features": ["auth", "payments"],
                   "pages": 10, "design_complexity": "premium",
                   "timeline_weeks": 8, "estimated_min": 5000, "estimated_max": 12000}
        r = requests.post(f"{API}/calculator", json=payload)
        assert r.status_code == 200
        assert r.json()["success"] is True


# ---------- public reads ----------
class TestPublicReads:
    def test_blog_list_seeded(self):
        r = requests.get(f"{API}/blog")
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 3
        slugs = {p["slug"] for p in items}
        # confirm seed slugs exist
        assert any(s in slugs for s in [
            "future-of-premium-software-2026",
            "designing-with-restraint",
            "shipping-useful-ai-products",
        ])

    def test_blog_detail_seed(self):
        r = requests.get(f"{API}/blog/future-of-premium-software-2026")
        assert r.status_code == 200
        body = r.json()
        assert body["slug"] == "future-of-premium-software-2026"
        assert body.get("title")

    def test_blog_detail_unknown(self):
        r = requests.get(f"{API}/blog/this-slug-does-not-exist-xyz")
        assert r.status_code == 404

    def test_careers_list_seeded(self):
        r = requests.get(f"{API}/careers")
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list) and len(items) >= 3


# ---------- auth ----------
class TestAuth:
    def test_register_sets_cookies(self):
        s = requests.Session()
        email = f"{_uniq('reg').lower()}@test.com"
        r = s.post(f"{API}/auth/register", json={"email": email, "password": "secret123", "name": "Reg Tester"})
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["email"] == email
        assert body["role"] == "client"
        assert "access_token" in s.cookies
        assert "refresh_token" in s.cookies

    def test_register_duplicate_email_fails(self):
        email = f"{_uniq('dup').lower()}@test.com"
        s = requests.Session()
        r1 = s.post(f"{API}/auth/register", json={"email": email, "password": "secret123", "name": "Dup"})
        assert r1.status_code == 200
        r2 = requests.post(f"{API}/auth/register", json={"email": email, "password": "secret123", "name": "Dup"})
        assert r2.status_code == 400

    def test_admin_login_me_logout_flow(self):
        s = requests.Session()
        r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200, r.text
        assert r.json()["role"] == "admin"

        me = s.get(f"{API}/auth/me")
        assert me.status_code == 200
        assert me.json()["email"] == ADMIN_EMAIL

        lo = s.post(f"{API}/auth/logout")
        assert lo.status_code == 200

        # cookies should be cleared
        me2 = s.get(f"{API}/auth/me")
        assert me2.status_code == 401

    def test_login_invalid_credentials(self):
        # use unique email to avoid lockout interference
        email = f"{_uniq('bad').lower()}@test.com"
        r = requests.post(f"{API}/auth/login", json={"email": email, "password": "wrong"})
        assert r.status_code == 401


# ---------- brute force ----------
class TestBruteForce:
    def test_lockout_after_5_failures(self):
        # Use unique email so we don't poison admin or other tests.
        email = f"{_uniq('bf').lower()}@test.com"
        # Register the user first so account exists but with valid password
        s = requests.Session()
        reg = s.post(f"{API}/auth/register", json={"email": email, "password": "rightpass", "name": "BF User"})
        assert reg.status_code == 200

        # 5 failed attempts (count -> 5), all should be 401
        for i in range(5):
            r = requests.post(f"{API}/auth/login", json={"email": email, "password": "wrongpass"})
            assert r.status_code == 401, f"attempt {i+1} unexpected {r.status_code}"

        # 6th attempt -> 429 lockout
        r6 = requests.post(f"{API}/auth/login", json={"email": email, "password": "wrongpass"})
        assert r6.status_code == 429, f"expected 429, got {r6.status_code} {r6.text}"
        assert "minutes" in r6.json().get("detail", "").lower() or "too many" in r6.json().get("detail", "").lower()


# ---------- admin gating ----------
ADMIN_GET_ENDPOINTS = [
    "/admin/leads",
    "/admin/newsletter",
    "/admin/calculator-leads",
    "/admin/blog",
    "/admin/careers",
]


class TestAdminGating:
    @pytest.mark.parametrize("path", ADMIN_GET_ENDPOINTS)
    def test_unauthenticated_401(self, path):
        r = requests.get(f"{API}{path}")
        assert r.status_code == 401, f"{path} expected 401 got {r.status_code}"

    @pytest.mark.parametrize("path", ADMIN_GET_ENDPOINTS)
    def test_client_403(self, path, client_session):
        r = client_session.get(f"{API}{path}")
        assert r.status_code == 403, f"{path} expected 403 got {r.status_code}"

    @pytest.mark.parametrize("path", ADMIN_GET_ENDPOINTS)
    def test_admin_200(self, path, admin_session):
        r = admin_session.get(f"{API}{path}")
        assert r.status_code == 200, f"{path} expected 200 got {r.status_code}"
        assert isinstance(r.json(), list)


# ---------- blog CMS ----------
class TestBlogCMS:
    def test_blog_create_update_delete_and_public_side_effects(self, admin_session):
        slug = _slug_uniq("post")
        payload = {
            "title": "TEST Post",
            "slug": slug,
            "excerpt": "exc",
            "content": "content",
            "tags": ["test"],
            "published": True,
        }
        r = admin_session.post(f"{API}/admin/blog", json=payload)
        assert r.status_code == 200, r.text
        created = r.json()
        post_id = created["id"]
        assert created["slug"] == slug

        # duplicate slug should 400
        r_dup = admin_session.post(f"{API}/admin/blog", json=payload)
        assert r_dup.status_code == 400

        # appears in public list / detail
        public = requests.get(f"{API}/blog/{slug}")
        assert public.status_code == 200
        assert public.json()["title"] == "TEST Post"

        # update
        upd = {**payload, "title": "TEST Post Updated"}
        r_upd = admin_session.put(f"{API}/admin/blog/{post_id}", json=upd)
        assert r_upd.status_code == 200
        # verify via public
        verified = requests.get(f"{API}/blog/{slug}")
        assert verified.status_code == 200
        assert verified.json()["title"] == "TEST Post Updated"

        # unpublish + verify hidden
        upd2 = {**payload, "title": "TEST Post Updated", "published": False}
        r_unp = admin_session.put(f"{API}/admin/blog/{post_id}", json=upd2)
        assert r_unp.status_code == 200
        hidden = requests.get(f"{API}/blog/{slug}")
        assert hidden.status_code == 404

        # delete
        d = admin_session.delete(f"{API}/admin/blog/{post_id}")
        assert d.status_code == 200
        # second delete is 404
        d2 = admin_session.delete(f"{API}/admin/blog/{post_id}")
        assert d2.status_code == 404


# ---------- careers CMS ----------
class TestCareersCMS:
    def test_career_crud(self, admin_session):
        payload = {
            "title": "TEST Engineer",
            "department": "Engineering",
            "location": "Remote",
            "type": "Full-time",
            "description": "TEST role",
            "requirements": ["Python"],
            "salary_range": "Comp",
            "published": True,
        }
        r = admin_session.post(f"{API}/admin/careers", json=payload)
        assert r.status_code == 200, r.text
        created = r.json()
        job_id = created["id"]

        # appears in public list
        public = requests.get(f"{API}/careers")
        assert public.status_code == 200
        assert any(j["id"] == job_id for j in public.json())

        # update
        upd = {**payload, "title": "TEST Engineer Updated"}
        r_upd = admin_session.put(f"{API}/admin/careers/{job_id}", json=upd)
        assert r_upd.status_code == 200
        public2 = requests.get(f"{API}/careers")
        assert any(j["id"] == job_id and j["title"] == "TEST Engineer Updated" for j in public2.json())

        # delete
        d = admin_session.delete(f"{API}/admin/careers/{job_id}")
        assert d.status_code == 200
        d2 = admin_session.delete(f"{API}/admin/careers/{job_id}")
        assert d2.status_code == 404
