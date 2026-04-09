-- Mod-04: Catalog (Courses)
CREATE TABLE IF NOT EXISTS mod04_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES mod00_institutions(id),
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    department TEXT,
    credits NUMERIC(2, 1),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);

-- Mod-04: Catalog (Sections)
CREATE TABLE IF NOT EXISTS mod04_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES mod04_courses(id),
    instructor_id UUID REFERENCES mod00_users(id),
    term TEXT NOT NULL,
    session TEXT,
    schedule TEXT,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);

-- Mod-04: Catalog (Enrollments)
CREATE TABLE IF NOT EXISTS mod04_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES mod00_users(id),
    section_id UUID REFERENCES mod04_sections(id),
    grade TEXT,
    status TEXT CHECK (status IN ('active', 'withdrawn', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);
