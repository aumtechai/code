-- Mod-01: SIS (Programs)
CREATE TABLE IF NOT EXISTS mod01_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES mod00_institutions(id),
    name TEXT NOT NULL,
    degree_type TEXT,
    department TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mod-01: SIS (Profiles)
CREATE TABLE IF NOT EXISTS mod01_student_profiles (
    user_id UUID PRIMARY KEY REFERENCES mod00_users(id),
    program_id UUID REFERENCES mod01_programs(id),
    gpa NUMERIC(3, 2),
    academic_standing TEXT,
    expected_graduation TIMESTAMPTZ,
    major TEXT,
    ai_insight TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);
