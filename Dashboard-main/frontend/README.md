# Frontend (Next.js)

Base de frontend para consumir el backend Python (FastAPI).

## Requisitos

- Node.js 20+

## Configuracion

1. Copiar variables de entorno:

```bash
cp .env.local.example .env.local
```

2. Ajustar URL del backend si corresponde.

## Ejecucion

```bash
npm install
npm run dev
```

Abrir: `http://localhost:3000`

## Estado actual

- Login y registro conectados a `POST /api/v1/auth/register` y `POST /api/v1/auth/login`
- Home con tabla de estudios y acciones de monitoreo/analisis
- Flujo de creacion de estudio conectado a `POST /api/v1/studies/`
- Pantalla de analisis conectada a `POST /api/v1/analytics/nps/csv`

## Arquitectura de estilos

Los estilos reutilizables se centralizan en `assets/styles`:

- `assets/styles/tokens.css`: variables de color, sombras y tokens de tema
- `assets/styles/base.css`: reset y estilos globales base
- `assets/styles/layout.css`: layout estructural (topbar, paneles, secciones)
- `assets/styles/components.css`: botones, tablas, formularios, mensajes
- `assets/styles/auth.css`: estilos del flujo visual de login/registro
- `assets/styles/index.css`: punto unico de importacion (cargado en `app/layout.tsx`)
