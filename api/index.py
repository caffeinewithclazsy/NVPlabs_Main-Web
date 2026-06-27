"""
Vercel Python serverless entry point for NVP Labs API.

Vercel automatically detects this file and serves it for any request
under /api/* (configured in vercel.json). Because the FastAPI app's
router already prefixes routes with /api, the full external path
(e.g. /api/health) is preserved here.
"""
import os
import sys

# Make sure we can import the existing backend module
_HERE = os.path.dirname(os.path.abspath(__file__))
_ROOT = os.path.dirname(_HERE)
sys.path.insert(0, _ROOT)
sys.path.insert(0, os.path.join(_ROOT, "backend"))

# Vercel sets VERCEL=1 in the runtime — flip cookies to secure cross-origin defaults
os.environ.setdefault("COOKIE_SECURE", "true")
os.environ.setdefault("COOKIE_SAMESITE", "lax")

from backend.server import app  # noqa: E402  (Vercel reads this `app`)

# Vercel's Python runtime detects the `app` object automatically (ASGI).
# Optional explicit handler (some Vercel templates expect this name):
handler = app
