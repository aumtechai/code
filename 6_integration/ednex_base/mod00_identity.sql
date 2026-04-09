-- Mod-00: Identity (Institutions)
CREATE TABLE IF NOT EXISTS mod00_institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    domain TEXT UNIQUE,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);

-- Mod-00: Identity (Users)
CREATE TABLE IF NOT EXISTS mod00_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES mod00_institutions(id),
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('student', 'faculty', 'advisor', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);
