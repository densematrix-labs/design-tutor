from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.v1 import tutor, metrics
import time
import os

app = FastAPI(
    title="Design Tutor API",
    description="Transform design screenshots into React tutorials",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request tracking middleware
@app.middleware("http")
async def track_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start
    
    # Track metrics
    metrics.http_requests.labels(
        tool=os.getenv("TOOL_NAME", "design-tutor"),
        endpoint=request.url.path,
        method=request.method,
        status=response.status_code
    ).inc()
    
    return response

# Routes
app.include_router(tutor.router)
app.include_router(metrics.router)

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "design-tutor"}

@app.get("/")
async def root():
    return {
        "name": "Design Tutor API",
        "description": "Upload design screenshots, get React tutorials",
        "docs": "/docs"
    }
