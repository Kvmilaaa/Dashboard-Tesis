# Backend (Python + FastAPI)

Base modular para reemplazar gradualmente el script monolitico y conectar con Supabase (PostgreSQL).

## Estructura

- `app/main.py`: entrada de la API
- `app/api/routes`: endpoints por dominio (`auth`, `studies`, `analytics`)
- `app/core`: configuracion y seguridad
- `app/db`: sesion SQLAlchemy y modelos
- `app/services`: logica reutilizable (NPS, limpieza de texto)
- `tests`: pruebas basicas de servicios
- `legacy/dashboard_automatizado_escalable.py`: copia del archivo original

## Configuracion

1. Copiar variables de entorno:

```bash
cp .env.example .env
```

2. Actualizar `DATABASE_URL` con tu cadena de Supabase.

## Ejecucion local

```bash
python -m pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Prueba rapida

```bash
python tests/test_nps_service.py
```

## Endpoints base

- `GET /health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/studies/`
- `POST /api/v1/studies/`
- `GET /api/v1/studies/{study_id}`
- `PATCH /api/v1/studies/{study_id}/estado`
- `DELETE /api/v1/studies/{study_id}`
- `POST /api/v1/analytics/nps`
- `POST /api/v1/analytics/nps/csv`
