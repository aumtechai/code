-- Mod-07: Advisement (Audits)
CREATE TABLE IF NOT EXISTS mod07_degree_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES mod00_users(id),
    requirement_name TEXT NOT NULL,
    status TEXT CHECK (status IN ('satisfied', 'pending', 'waived')),
    description TEXT,
    credits_needed NUMERIC(3, 1),
    credits_earned NUMERIC(3, 1),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);
