create extension if not exists pgcrypto;
create table if not exists technical_sheets(id uuid primary key default gen_random_uuid(),reference_source text unique not null,data jsonb not null default '{}'::jsonb,created_at timestamptz default now(),updated_at timestamptz default now());
