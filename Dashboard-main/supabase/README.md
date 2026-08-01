# Supabase (PostgreSQL)

Esta carpeta contiene la base SQL para crear las tablas del proyecto en Supabase.

## Pasos

1. Crear proyecto en Supabase.
2. Ir a SQL Editor.
3. Ejecutar `schema.sql`.
4. Copiar la cadena de conexion y actualizar `backend/.env` en `DATABASE_URL`.

Formato recomendado para SQLAlchemy + psycopg:

```text
postgresql+psycopg://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres
```

## Nota

Para entorno productivo, se recomienda:

- Activar RLS en tablas expuestas directamente desde Supabase.
- Mantener escritura sensible via backend FastAPI.
- Gestionar secretos con variables de entorno seguras.
