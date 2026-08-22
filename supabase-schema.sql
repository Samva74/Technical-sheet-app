create extension if not exists pgcrypto;
create table if not exists technical_sheets (
 id uuid primary key default gen_random_uuid(), reference text unique not null,
 general jsonb not null default '{}'::jsonb, volumes jsonb not null default '{}'::jsonb,
 product jsonb not null default '{}'::jsonb, outerbox jsonb not null default '{}'::jsonb,
 validation jsonb not null default '{}'::jsonb, status text not null default 'Brouillon',
 created_by_user_id uuid, created_by_email text, updated_by_user_id uuid, updated_by_email text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists technical_sheet_components (
 id uuid primary key default gen_random_uuid(), technical_sheet_id uuid not null references technical_sheets(id) on delete cascade,
 sort_order integer not null default 0, data jsonb not null default '{}'::jsonb,
 created_by_user_id uuid, created_by_email text, updated_by_user_id uuid, updated_by_email text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists technical_sheet_markings (
 id uuid primary key default gen_random_uuid(), technical_sheet_id uuid not null references technical_sheets(id) on delete cascade,
 component_id uuid references technical_sheet_components(id) on delete set null, sort_order integer not null default 0,
 data jsonb not null default '{}'::jsonb, created_by_user_id uuid, created_by_email text,
 updated_by_user_id uuid, updated_by_email text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists technical_sheet_documents (
 id uuid primary key default gen_random_uuid(), technical_sheet_id uuid not null references technical_sheets(id) on delete cascade,
 component_id uuid references technical_sheet_components(id) on delete set null, marking_id uuid references technical_sheet_markings(id) on delete set null,
 storage_path text not null, file_name text not null, mime_type text, file_size bigint, document_type text,
 created_by_user_id uuid, created_by_email text, created_at timestamptz not null default now()
);
alter table technical_sheets enable row level security;
alter table technical_sheet_components enable row level security;
alter table technical_sheet_markings enable row level security;
alter table technical_sheet_documents enable row level security;
