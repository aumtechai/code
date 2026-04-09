-- Mod-08: Financial Aid
CREATE TABLE IF NOT EXISTS mod08_aid_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES mod00_users(id),
    aid_type TEXT CHECK (aid_type IN ('scholarship', 'grant', 'loan', 'work-study')),
    amount NUMERIC(15, 2) NOT NULL,
    status TEXT CHECK (status IN ('offered', 'accepted', 'declined', 'disbursed')),
    academic_year TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);
