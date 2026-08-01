-- Schema principal para Supabase (PostgreSQL)
-- Ejecutar en SQL Editor de Supabase

create table if not exists users (
    id bigserial primary key,
    username text not null unique,
    password_hash text not null,
    nombre_completo text,
    correo text,
    created_at timestamptz not null default now()
);

create table if not exists studies (
    id bigserial primary key,
    titulo text not null,
    fecha_inicio date,
    fecha_fin date,
    empresa text,
    muestra integer,
    tecnica text,
    estado text not null default 'Creacion de Estudio',
    cuotas_json jsonb,
    link_cuestionario text,
    created_at timestamptz not null default now()
);

create table if not exists questionnaire_items (
    id bigserial primary key,
    estudio_id bigint not null references studies(id) on delete cascade,
    pregunta_texto text not null,
    columna_csv text,
    tipo_pregunta text
);

create table if not exists paneles (
    id bigserial primary key,
    id_externo text not null unique,
    nombre text,
    comuna text,
    edad integer,
    genero text,
    fecha_registro date
);

create index if not exists idx_studies_estado on studies(estado);
create index if not exists idx_questionnaire_items_estudio_id on questionnaire_items(estudio_id);
create index if not exists idx_paneles_id_externo on paneles(id_externo);
