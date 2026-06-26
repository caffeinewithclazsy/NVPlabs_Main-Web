from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import re
import uuid
import bcrypt
import jwt
import secrets
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Literal

from fastapi import FastAPI, APIRouter, Request, Response, HTTPException, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict

# --- DB ---
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# --- JWT ---
JWT_ALGORITHM = "HS256"

def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False

def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id, "email": email, "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=60),
        "type": "access",
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh",
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def set_auth_cookies(response: Response, access: str, refresh: str):
    response.set_cookie("access_token", access, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")

# --- App ---
app = FastAPI(title="NVP Labs API")
api_router = APIRouter(prefix="/api")

# --- Models ---
def uid() -> str:
    return str(uuid.uuid4())

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

class UserPublic(BaseModel):
    id: str
    email: EmailStr
    name: str
    role: str
    created_at: str

class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    name: str = Field(min_length=1, max_length=80)

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class ContactIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str = Field(min_length=1, max_length=4000)

class NewsletterIn(BaseModel):
    email: EmailStr

class QuoteIn(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    service: str
    budget: Optional[str] = None
    timeline: Optional[str] = None
    description: str

class CalculatorIn(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    project_type: str
    features: List[str] = []
    pages: Optional[int] = None
    design_complexity: Literal["basic", "premium", "luxury"] = "premium"
    timeline_weeks: Optional[int] = None
    estimated_min: float
    estimated_max: float
    notes: Optional[str] = None

class BlogIn(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    cover_image: Optional[str] = None
    tags: List[str] = []
    published: bool = True

class CareerIn(BaseModel):
    title: str
    department: str
    location: str
    type: str  # Full-time, Part-time, Contract
    description: str
    requirements: List[str] = []
    salary_range: Optional[str] = None
    published: bool = True

class ProjectIn(BaseModel):
    title: str
    category: str  # Websites | Apps | AI | Ecommerce | Dashboards
    description: str
    image: str
    tech: List[str] = []
    demo_url: Optional[str] = None
    case_study_url: Optional[str] = None
    featured: bool = False
    published: bool = True
    order: int = 0

class PricingPlanIn(BaseModel):
    name: str
    price: str
    period: str = ""
    description: str
    features: List[str] = []
    cta: str = "Get started"
    popular: bool = False
    published: bool = True
    order: int = 0

class ProductIn(BaseModel):
    name: str
    category: str
    price: str
    description: str
    image: str
    tag: Optional[str] = None  # Live | Beta | Coming Soon
    in_stock: bool = True
    featured: bool = False
    published: bool = True
    order: int = 0

class SiteContentIn(BaseModel):
    key: str = Field(min_length=1, max_length=120)
    value: str  # arbitrary text or JSON-encoded string

# --- Auth dep ---
async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# --- Health ---
@api_router.get("/")
async def root():
    return {"message": "NVP Labs API", "version": "1.0"}

@api_router.get("/health")
async def health():
    return {"status": "ok"}

# --- Auth endpoints ---
@api_router.post("/auth/register", response_model=UserPublic)
async def register(payload: RegisterIn, response: Response):
    email = payload.email.lower().strip()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = uid()
    user_doc = {
        "id": user_id,
        "email": email,
        "name": payload.name.strip(),
        "password_hash": hash_password(payload.password),
        "role": "client",
        "created_at": now_iso(),
    }
    await db.users.insert_one(user_doc)
    access = create_access_token(user_id, email, "client")
    refresh = create_refresh_token(user_id)
    set_auth_cookies(response, access, refresh)
    return UserPublic(id=user_id, email=email, name=payload.name.strip(), role="client", created_at=user_doc["created_at"])

@api_router.post("/auth/login", response_model=UserPublic)
async def login(payload: LoginIn, request: Request, response: Response):
    email = payload.email.lower().strip()
    fwd = request.headers.get("x-forwarded-for")
    ip = (fwd.split(",")[0].strip() if fwd else (request.client.host if request.client else "unknown"))
    identifier = f"{ip}:{email}"

    # Brute force check
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("count", 0) >= 5:
        last = attempt.get("last_attempt")
        if last:
            last_dt = datetime.fromisoformat(last)
            if (datetime.now(timezone.utc) - last_dt) < timedelta(minutes=15):
                raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
            else:
                await db.login_attempts.delete_one({"identifier": identifier})

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"last_attempt": now_iso()}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await db.login_attempts.delete_one({"identifier": identifier})
    access = create_access_token(user["id"], user["email"], user["role"])
    refresh = create_refresh_token(user["id"])
    set_auth_cookies(response, access, refresh)
    return UserPublic(id=user["id"], email=user["email"], name=user["name"], role=user["role"], created_at=user["created_at"])

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out"}

@api_router.get("/auth/me", response_model=UserPublic)
async def me(user: dict = Depends(get_current_user)):
    return UserPublic(**user)

@api_router.post("/auth/refresh")
async def refresh_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        access = create_access_token(user["id"], user["email"], user["role"])
        response.set_cookie("access_token", access, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
        return {"message": "refreshed"}
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

# --- Public lead endpoints ---
@api_router.post("/contact")
async def submit_contact(payload: ContactIn):
    doc = {"id": uid(), "type": "contact", **payload.model_dump(), "created_at": now_iso(), "status": "new"}
    await db.leads.insert_one(doc)
    doc.pop("_id", None)
    return {"success": True, "id": doc["id"]}

@api_router.post("/newsletter")
async def subscribe_newsletter(payload: NewsletterIn):
    email = payload.email.lower().strip()
    existing = await db.newsletter.find_one({"email": email})
    if existing:
        return {"success": True, "message": "Already subscribed"}
    await db.newsletter.insert_one({"id": uid(), "email": email, "created_at": now_iso()})
    return {"success": True, "message": "Subscribed"}

@api_router.post("/quote")
async def submit_quote(payload: QuoteIn):
    doc = {"id": uid(), "type": "quote", **payload.model_dump(), "created_at": now_iso(), "status": "new"}
    await db.leads.insert_one(doc)
    return {"success": True, "id": doc["id"]}

@api_router.post("/calculator")
async def submit_calculator(payload: CalculatorIn):
    doc = {"id": uid(), **payload.model_dump(), "created_at": now_iso(), "status": "new"}
    await db.calculator_leads.insert_one(doc)
    return {"success": True, "id": doc["id"]}

# --- Public blog/careers ---
@api_router.get("/blog")
async def public_blog_list():
    items = await db.blog.find({"published": True}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return items

@api_router.get("/blog/{slug}")
async def public_blog_detail(slug: str):
    item = await db.blog.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Post not found")
    return item

@api_router.get("/careers")
async def public_careers_list():
    items = await db.careers.find({"published": True}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return items

# Public projects / pricing / products / site content
@api_router.get("/projects")
async def public_projects():
    items = await db.projects.find({"published": True}, {"_id": 0}).sort([("order", 1), ("created_at", -1)]).to_list(500)
    return items

@api_router.get("/pricing-plans")
async def public_pricing_plans():
    items = await db.pricing_plans.find({"published": True}, {"_id": 0}).sort([("order", 1), ("created_at", 1)]).to_list(50)
    return items

@api_router.get("/products")
async def public_products():
    items = await db.products.find({"published": True}, {"_id": 0}).sort([("order", 1), ("created_at", -1)]).to_list(500)
    return items

@api_router.get("/site-content")
async def public_site_content():
    items = await db.site_content.find({}, {"_id": 0}).to_list(500)
    return {it["key"]: it["value"] for it in items}

# --- Admin endpoints ---
@api_router.get("/admin/leads")
async def admin_leads(user: dict = Depends(require_admin)):
    items = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return items

@api_router.get("/admin/newsletter")
async def admin_newsletter(user: dict = Depends(require_admin)):
    items = await db.newsletter.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return items

@api_router.get("/admin/calculator-leads")
async def admin_calc_leads(user: dict = Depends(require_admin)):
    items = await db.calculator_leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return items

# Blog CMS
@api_router.get("/admin/blog")
async def admin_blog_list(user: dict = Depends(require_admin)):
    items = await db.blog.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return items

@api_router.post("/admin/blog")
async def admin_blog_create(payload: BlogIn, user: dict = Depends(require_admin)):
    slug = re.sub(r"[^a-z0-9-]+", "-", payload.slug.lower()).strip("-")
    if await db.blog.find_one({"slug": slug}):
        raise HTTPException(status_code=400, detail="Slug already exists")
    doc = {"id": uid(), **payload.model_dump(), "slug": slug, "created_at": now_iso(), "updated_at": now_iso(), "author": user["name"]}
    await db.blog.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api_router.put("/admin/blog/{post_id}")
async def admin_blog_update(post_id: str, payload: BlogIn, user: dict = Depends(require_admin)):
    update = {**payload.model_dump(), "updated_at": now_iso()}
    res = await db.blog.update_one({"id": post_id}, {"$set": update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"success": True}

@api_router.delete("/admin/blog/{post_id}")
async def admin_blog_delete(post_id: str, user: dict = Depends(require_admin)):
    res = await db.blog.delete_one({"id": post_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"success": True}

# Careers CMS
@api_router.get("/admin/careers")
async def admin_careers_list(user: dict = Depends(require_admin)):
    items = await db.careers.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return items

@api_router.post("/admin/careers")
async def admin_careers_create(payload: CareerIn, user: dict = Depends(require_admin)):
    doc = {"id": uid(), **payload.model_dump(), "created_at": now_iso(), "updated_at": now_iso()}
    await db.careers.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api_router.put("/admin/careers/{job_id}")
async def admin_careers_update(job_id: str, payload: CareerIn, user: dict = Depends(require_admin)):
    update = {**payload.model_dump(), "updated_at": now_iso()}
    res = await db.careers.update_one({"id": job_id}, {"$set": update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"success": True}

@api_router.delete("/admin/careers/{job_id}")
async def admin_careers_delete(job_id: str, user: dict = Depends(require_admin)):
    res = await db.careers.delete_one({"id": job_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"success": True}

# Generic admin CRUD helper for projects / pricing-plans / products
def _admin_crud_routes(collection_name: str, schema, slug: str, name: str):
    @api_router.get(f"/admin/{slug}")
    async def _list(user: dict = Depends(require_admin)):
        items = await db[collection_name].find({}, {"_id": 0}).sort([("order", 1), ("created_at", -1)]).to_list(1000)
        return items

    @api_router.post(f"/admin/{slug}")
    async def _create(payload: schema, user: dict = Depends(require_admin)):
        doc = {"id": uid(), **payload.model_dump(), "created_at": now_iso(), "updated_at": now_iso()}
        await db[collection_name].insert_one(doc)
        doc.pop("_id", None)
        return doc

    @api_router.put(f"/admin/{slug}/{{item_id}}")
    async def _update(item_id: str, payload: schema, user: dict = Depends(require_admin)):
        update = {**payload.model_dump(), "updated_at": now_iso()}
        res = await db[collection_name].update_one({"id": item_id}, {"$set": update})
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail=f"{name} not found")
        return {"success": True}

    @api_router.delete(f"/admin/{slug}/{{item_id}}")
    async def _delete(item_id: str, user: dict = Depends(require_admin)):
        res = await db[collection_name].delete_one({"id": item_id})
        if res.deleted_count == 0:
            raise HTTPException(status_code=404, detail=f"{name} not found")
        return {"success": True}

    # Rename to avoid FastAPI duplicate operation_id warnings
    _list.__name__ = f"admin_{slug.replace('-', '_')}_list"
    _create.__name__ = f"admin_{slug.replace('-', '_')}_create"
    _update.__name__ = f"admin_{slug.replace('-', '_')}_update"
    _delete.__name__ = f"admin_{slug.replace('-', '_')}_delete"

_admin_crud_routes("projects", ProjectIn, "projects", "Project")
_admin_crud_routes("pricing_plans", PricingPlanIn, "pricing-plans", "Pricing plan")
_admin_crud_routes("products", ProductIn, "products", "Product")

# Site content (key-value upsert)
@api_router.get("/admin/site-content")
async def admin_site_content_list(user: dict = Depends(require_admin)):
    items = await db.site_content.find({}, {"_id": 0}).sort("key", 1).to_list(500)
    return items

@api_router.put("/admin/site-content")
async def admin_site_content_upsert(payload: SiteContentIn, user: dict = Depends(require_admin)):
    key = payload.key.strip()
    await db.site_content.update_one(
        {"key": key},
        {"$set": {"key": key, "value": payload.value, "updated_at": now_iso()}, "$setOnInsert": {"id": uid(), "created_at": now_iso()}},
        upsert=True,
    )
    return {"success": True, "key": key}

@api_router.delete("/admin/site-content/{key}")
async def admin_site_content_delete(key: str, user: dict = Depends(require_admin)):
    res = await db.site_content.delete_one({"key": key})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Key not found")
    return {"success": True}

# --- Startup ---
@app.on_event("startup")
async def startup_event():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.newsletter.create_index("email", unique=True)
    await db.leads.create_index("created_at")
    await db.blog.create_index("slug", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.projects.create_index("order")
    await db.pricing_plans.create_index("order")
    await db.products.create_index("order")
    await db.site_content.create_index("key", unique=True)

    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "id": uid(),
            "email": admin_email,
            "name": "NVP Labs Admin",
            "password_hash": hash_password(admin_password),
            "role": "admin",
            "created_at": now_iso(),
        })
        logging.info(f"Seeded admin user: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password), "role": "admin"}},
        )
        logging.info(f"Updated admin password for: {admin_email}")

    # Seed initial blog posts and careers if empty
    if await db.blog.count_documents({}) == 0:
        await db.blog.insert_many([
            {
                "id": uid(),
                "title": "The Future of Premium Software in 2026",
                "slug": "future-of-premium-software-2026",
                "excerpt": "How we craft software products that scale beautifully while staying performant, accessible, and a joy to use.",
                "content": "At NVP Labs we believe premium software is about restraint. Every pixel, every microinteraction, every API call earns its place. In this piece we walk you through our approach to designing scalable architectures, delightful interfaces, and a culture of craft that powers everything we ship.",
                "cover_image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200",
                "tags": ["product", "engineering", "design"],
                "published": True,
                "author": "NVP Labs Admin",
                "created_at": now_iso(),
                "updated_at": now_iso(),
            },
            {
                "id": uid(),
                "title": "Designing With Restraint: Lessons from Apple & Linear",
                "slug": "designing-with-restraint",
                "excerpt": "Whitespace is not empty — it's the canvas premium products are built on. A study of two iconic design systems.",
                "content": "Restraint is the hardest discipline in product design. Apple and Linear have mastered the art of removing everything that doesn't serve the user. Here's what we've learned and how we apply it at NVP Labs.",
                "cover_image": "https://images.unsplash.com/photo-1686061592689-312bbfb5c055?w=1200",
                "tags": ["design", "ux"],
                "published": True,
                "author": "NVP Labs Admin",
                "created_at": now_iso(),
                "updated_at": now_iso(),
            },
            {
                "id": uid(),
                "title": "Shipping AI Products That Actually Help People",
                "slug": "shipping-useful-ai-products",
                "excerpt": "Beyond the hype: how we integrate AI into client products with measurable, human-centered outcomes.",
                "content": "AI is only valuable when it removes friction or unlocks new capabilities for real users. Here's our playbook for building AI features that ship to production and stay there.",
                "cover_image": "https://images.pexels.com/photos/5380618/pexels-photo-5380618.jpeg?w=1200",
                "tags": ["ai", "engineering"],
                "published": True,
                "author": "NVP Labs Admin",
                "created_at": now_iso(),
                "updated_at": now_iso(),
            },
        ])

    if await db.careers.count_documents({}) == 0:
        await db.careers.insert_many([
            {
                "id": uid(),
                "title": "Senior Full-Stack Engineer",
                "department": "Engineering",
                "location": "Remote / Ahmedabad",
                "type": "Full-time",
                "description": "Build premium products with React, Next.js, FastAPI and MongoDB. Own features end-to-end from design system to deployment.",
                "requirements": ["5+ years full-stack experience", "Strong React + TypeScript", "Python or Node.js backend", "Product mindset"],
                "salary_range": "Competitive + Equity",
                "published": True,
                "created_at": now_iso(),
                "updated_at": now_iso(),
            },
            {
                "id": uid(),
                "title": "Product Designer",
                "department": "Design",
                "location": "Remote",
                "type": "Full-time",
                "description": "Craft world-class interfaces inspired by Apple, Linear and Vercel. Own end-to-end product design for client and internal projects.",
                "requirements": ["3+ years product design", "Figma mastery", "Motion design fundamentals", "Strong portfolio"],
                "salary_range": "Competitive",
                "published": True,
                "created_at": now_iso(),
                "updated_at": now_iso(),
            },
            {
                "id": uid(),
                "title": "AI Engineer",
                "department": "Engineering",
                "location": "Remote",
                "type": "Full-time",
                "description": "Integrate LLMs and ML pipelines into customer-facing products. Work across OpenAI, Gemini, Claude and custom models.",
                "requirements": ["2+ years ML/AI experience", "Python expert", "LLM integration experience", "Strong communication"],
                "salary_range": "Competitive",
                "published": True,
                "created_at": now_iso(),
                "updated_at": now_iso(),
            },
        ])

    # Seed projects
    if await db.projects.count_documents({}) == 0:
        projects_seed = [
            {"title": "Helio Analytics", "category": "Dashboards", "tech": ["Next.js", "FastAPI", "PostgreSQL"], "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200", "description": "Real-time analytics dashboard for a SaaS company. 300k+ daily events."},
            {"title": "Coda Commerce", "category": "Ecommerce", "tech": ["Next.js", "Stripe", "MongoDB"], "image": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200", "description": "Luxury fashion e-commerce with custom checkout and 0.8s LCP."},
            {"title": "Nova AI Assistant", "category": "AI", "tech": ["React", "Python", "OpenAI"], "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200", "description": "AI customer support assistant trained on 50k internal docs."},
            {"title": "Lumen Studio", "category": "Websites", "tech": ["Next.js", "Framer", "Sanity"], "image": "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=1200", "description": "Award-winning agency portfolio with custom WebGL hero."},
            {"title": "Pulse Health", "category": "Apps", "tech": ["Flutter", "Firebase", "HealthKit"], "image": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200", "description": "Cross-platform health tracking app with 200k+ active users."},
            {"title": "Vertex CRM", "category": "Dashboards", "tech": ["React", "Node.js", "PostgreSQL"], "image": "https://images.unsplash.com/photo-1686061592689-312bbfb5c055?w=1200", "description": "Enterprise CRM serving 500+ sales reps across 12 countries."},
            {"title": "Atlas Hotels", "category": "Websites", "tech": ["Next.js", "Sanity", "Stripe"], "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200", "description": "Boutique hotel chain with integrated booking and CMS."},
            {"title": "Cipher Trade", "category": "AI", "tech": ["Python", "FastAPI", "Gemini"], "image": "https://images.pexels.com/photos/5380618/pexels-photo-5380618.jpeg?w=1200", "description": "AI-powered trading signals platform with real-time alerts."},
        ]
        await db.projects.insert_many([
            {"id": uid(), **p, "demo_url": None, "case_study_url": None, "featured": i < 3, "published": True, "order": i, "created_at": now_iso(), "updated_at": now_iso()}
            for i, p in enumerate(projects_seed)
        ])

    # Seed pricing plans
    if await db.pricing_plans.count_documents({}) == 0:
        await db.pricing_plans.insert_many([
            {"id": uid(), "name": "Starter", "price": "₹49,000", "period": "/project", "description": "Perfect for startups and landing pages.", "features": ["Up to 5 pages", "Responsive design", "Basic SEO", "Contact form", "1 month support", "Hosting setup"], "cta": "Start Project", "popular": False, "published": True, "order": 0, "created_at": now_iso(), "updated_at": now_iso()},
            {"id": uid(), "name": "Professional", "price": "₹1,99,000", "period": "/project", "description": "For growing businesses ready to scale.", "features": ["Up to 20 pages", "Custom design system", "Advanced SEO + Analytics", "CMS integration", "3 months support", "API integrations", "Performance optimization", "Animations & micro-interactions"], "cta": "Most Popular", "popular": True, "published": True, "order": 1, "created_at": now_iso(), "updated_at": now_iso()},
            {"id": uid(), "name": "Enterprise", "price": "Custom", "period": "", "description": "For ambitious products at scale.", "features": ["Unlimited pages", "Custom architecture", "Dedicated team", "12 months support", "SLA + monitoring", "Multi-region deployment", "Compliance & security audits", "Quarterly product reviews"], "cta": "Talk to Sales", "popular": False, "published": True, "order": 2, "created_at": now_iso(), "updated_at": now_iso()},
        ])

    # Seed products (our own SaaS / templates)
    if await db.products.count_documents({}) == 0:
        await db.products.insert_many([
            {"id": uid(), "name": "Helio Cloud", "category": "Analytics", "price": "₹2,499/mo", "description": "Hosted SaaS analytics for product teams. From insight to action in one click.", "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900", "tag": "Live", "in_stock": True, "featured": True, "published": True, "order": 0, "created_at": now_iso(), "updated_at": now_iso()},
            {"id": uid(), "name": "Coda Storefront", "category": "Commerce", "price": "₹14,999 one-time", "description": "Headless commerce starter — Next.js, Stripe, Sanity. Ship in days.", "image": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900", "tag": "Live", "in_stock": True, "featured": True, "published": True, "order": 1, "created_at": now_iso(), "updated_at": now_iso()},
            {"id": uid(), "name": "Nova Assistant", "category": "AI", "price": "₹4,999/mo", "description": "Plug-and-play AI customer support that learns from your docs.", "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900", "tag": "Beta", "in_stock": True, "featured": False, "published": True, "order": 2, "created_at": now_iso(), "updated_at": now_iso()},
            {"id": uid(), "name": "Vertex CRM Lite", "category": "Sales", "price": "Coming Soon", "description": "Lightweight CRM for small teams. Pipeline, deals, contacts — done right.", "image": "https://images.unsplash.com/photo-1686061592689-312bbfb5c055?w=900", "tag": "Coming Soon", "in_stock": False, "featured": False, "published": True, "order": 3, "created_at": now_iso(), "updated_at": now_iso()},
        ])

    # Seed site content
    if await db.site_content.count_documents({}) == 0:
        await db.site_content.insert_many([
            {"id": uid(), "key": "hero_kicker", "value": "Now booking projects for 2026", "created_at": now_iso(), "updated_at": now_iso()},
            {"id": uid(), "key": "hero_title_line_1", "value": "Building Premium", "created_at": now_iso(), "updated_at": now_iso()},
            {"id": uid(), "key": "hero_title_line_2", "value": "Digital Products", "created_at": now_iso(), "updated_at": now_iso()},
            {"id": uid(), "key": "hero_title_line_3", "value": "That Scale.", "created_at": now_iso(), "updated_at": now_iso()},
            {"id": uid(), "key": "hero_subtitle", "value": "We design, develop and deploy world-class websites, mobile applications, AI solutions and enterprise software.", "created_at": now_iso(), "updated_at": now_iso()},
            {"id": uid(), "key": "cta_headline", "value": "Let's build something extraordinary.", "created_at": now_iso(), "updated_at": now_iso()},
            {"id": uid(), "key": "cta_subtitle", "value": "Tell us about your idea — we'll come back within 24 hours with a clear plan.", "created_at": now_iso(), "updated_at": now_iso()},
        ])

# --- App config ---
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
