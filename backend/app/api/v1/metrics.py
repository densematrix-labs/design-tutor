from fastapi import APIRouter
from fastapi.responses import Response
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
import os

router = APIRouter()

TOOL_NAME = os.getenv("TOOL_NAME", "design-tutor")

# Metrics
http_requests = Counter(
    "http_requests_total", 
    "HTTP requests", 
    ["tool", "endpoint", "method", "status"]
)

tutorial_generated = Counter(
    "tutorial_generated_total",
    "Tutorials generated",
    ["tool", "language"]
)

tutorial_duration = Histogram(
    "tutorial_generation_seconds",
    "Tutorial generation duration",
    ["tool"]
)

page_views = Counter(
    "page_views_total",
    "Page views",
    ["tool", "page"]
)

@router.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
