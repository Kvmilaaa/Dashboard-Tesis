# DashboardTesis - Reorganizacion por capas

Este proyecto fue reorganizado para separar responsabilidades:

- `frontend/`: Next.js (UI)
- `backend/`: FastAPI + logica de negocio en Python
- `supabase/`: esquema SQL para PostgreSQL
- `backend/legacy/dashboard_automatizado_escalable.py`: copia del archivo original

## Arquitectura recomendada

```text
Next.js (frontend)
    -> consume -> FastAPI (backend)
        -> usa -> Supabase PostgreSQL (database)
```

## Estructura principal

```text
backend/
  app/
  tests/
  scripts/
  legacy/
frontend/
  app/
  components/
  lib/
supabase/
  schema.sql
```

## Flujo de inicio rapido

### 1) Database (Supabase)

- Crear proyecto Supabase
- Ejecutar `supabase/schema.sql`

### 2) Backend

```bash
cd backend
python -m pip install -r requirements.txt
cp .env.example .env
# editar DATABASE_URL y JWT_SECRET_KEY
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3) Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## Validacion inicial del backend

Desde `backend/`:

```bash
python tests/test_nps_service.py
python scripts/demo_nps_from_csv.py
```

## Sobre el archivo original

Se conserva en `backend/legacy/dashboard_automatizado_escalable.py` para migrar por etapas:

1. Extraer servicios reutilizables (NPS, texto, cuotas)
2. Exponer endpoints FastAPI por modulo
3. Reemplazar vistas Streamlit por pantallas Next.js
4. Mantener una sola fuente de datos en Supabase
