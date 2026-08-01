from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import analytics, auth, studies
from app.core.config import settings
from app.db.models import Base
from app.db.session import engine

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="API para gestion y analisis de estudios de mercado.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(auth.router, prefix=settings.api_v1_prefix, tags=["auth"])
app.include_router(studies.router, prefix=settings.api_v1_prefix, tags=["studies"])
app.include_router(analytics.router, prefix=settings.api_v1_prefix, tags=["analytics"])
