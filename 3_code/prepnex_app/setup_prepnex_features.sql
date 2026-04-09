-- 1. UNIVERSITIES DIRECTORY
CREATE TABLE IF NOT EXISTS public.universities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g., 'Ivy League+', 'Core STEM', 'Liberal Arts'
    acceptance_rate NUMERIC,
    avg_gpa NUMERIC,
    avg_sat INTEGER,
    logo_url TEXT
);

-- 2. STUDENT COLLEGE LIST (TRACKER)
CREATE TABLE IF NOT EXISTS public.student_universities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT, -- Note: Text instead of UUID to match existing student context if it uses Auth IDs. 
                     -- Some schemas use UUID, let's keep it TEXT just in case or we'll cast it if it's strict.
                     -- PrepNex students table might use UUID, but `id` is usually UUID.
    university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
    student_fit_score NUMERIC, -- Vesta's predicted "chance"
    status TEXT DEFAULT 'Exploring', -- Exploring, Applying, Accepted, Waitlisted, Denied
    tier TEXT, -- Reach, Target, Safety
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ESSAY DRAFTS
CREATE TABLE IF NOT EXISTS public.essay_drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT,
    university_id UUID REFERENCES public.universities(id) ON DELETE SET NULL,
    prompt_title TEXT,
    prompt_text TEXT,
    content TEXT,
    vesta_feedback TEXT,
    word_limit INTEGER,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. APPLICATION DOCUMENTS (CHECKLIST)
CREATE TABLE IF NOT EXISTS public.application_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT,
    university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
    document_name TEXT,
    status TEXT DEFAULT 'Pending', -- Pending, In Progress, Complete
    due_date TIMESTAMP WITH TIME ZONE
);

-- -- SEED MOCK DATA -- --
-- Clear existing to prevent duplicates if re-run
DELETE FROM public.application_documents;
DELETE FROM public.essay_drafts;
DELETE FROM public.student_universities;
DELETE FROM public.universities;

-- Insert Universities
INSERT INTO public.universities (id, name, category, acceptance_rate, avg_gpa, avg_sat, logo_url)
VALUES 
    ('e1cb2a1d-a2f0-425b-b9f7-66c3abcb3e1c', 'Stanford University', 'Ivy League+', 3.9, 4.18, 1540, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Seal_of_Stanford_University.svg/1024px-Seal_of_Stanford_University.svg.png'),
    ('f2cb2a1d-a2f0-425b-b9f7-66c3abcb3e1d', 'Massachusetts Institute of Technology', 'Core STEM', 4.1, 4.17, 1550, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1024px-MIT_logo.svg.png'),
    ('a3cb2a1d-a2f0-425b-b9f7-66c3abcb3e1e', 'Harvard University', 'Ivy League+', 3.4, 4.15, 1560, 'https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Harvard_shield_wreath.svg/1024px-Harvard_shield_wreath.svg.png'),
    ('b4cb2a1d-a2f0-425b-b9f7-66c3abcb3e1f', 'University of Michigan', 'Public Target', 17.7, 3.9, 1430, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Seal_of_the_University_of_Michigan.svg/1024px-Seal_of_the_University_of_Michigan.svg.png'),
    ('c5cb2a1d-a2f0-425b-b9f7-66c3abcb3e1a', 'University of Illinois Urbana-Champaign', 'Public Target', 43.7, 3.8, 1400, 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/University_of_Illinois_at_Urbana%E2%80%93Champaign_seal.svg/1024px-University_of_Illinois_at_Urbana%E2%80%93Champaign_seal.svg.png');

-- Use a DO block to assign mock data to actual students in the DB
DO $$
DECLARE
    student_rec RECORD;
BEGIN
    FOR student_rec IN SELECT id FROM public.students LIMIT 10 LOOP
        
        -- Tracker Data
        INSERT INTO public.student_universities (student_id, university_id, student_fit_score, status, tier)
        VALUES 
            (student_rec.id::text, 'e1cb2a1d-a2f0-425b-b9f7-66c3abcb3e1c', 84, 'Applying', 'Reach'),
            (student_rec.id::text, 'f2cb2a1d-a2f0-425b-b9f7-66c3abcb3e1d', 92, 'Applying', 'Reach'),
            (student_rec.id::text, 'b4cb2a1d-a2f0-425b-b9f7-66c3abcb3e1f', 96, 'Exploring', 'Target');
            
        -- Essay Drafts
        INSERT INTO public.essay_drafts (student_id, university_id, prompt_title, prompt_text, content, vesta_feedback, word_limit)
        VALUES 
            (student_rec.id::text, 'e1cb2a1d-a2f0-425b-b9f7-66c3abcb3e1c', 'Stanford Roommate Essay', 'Write a note to your future roommate.', 'Hey roomie! I''m super excited to meet you. I''m passionate about rocketry and building things, so expect a few 3D printed gadgets in our dorm. I''m also a big fan of late-night ramen runs.', 'Vesta Insight: Good personal touch. Highlight your leadership in the robotics team briefly to demonstrate intellectual vitality alongside your casual intro.', 250);
            
        -- Application Documents
        INSERT INTO public.application_documents (student_id, university_id, document_name, status, due_date)
        VALUES 
            (student_rec.id::text, 'e1cb2a1d-a2f0-425b-b9f7-66c3abcb3e1c', 'Common App Essay', 'Complete', '2026-11-01 23:59:59'),
            (student_rec.id::text, 'e1cb2a1d-a2f0-425b-b9f7-66c3abcb3e1c', 'Math Teacher Recommendation', 'In Progress', '2026-11-01 23:59:59'),
            (student_rec.id::text, 'f2cb2a1d-a2f0-425b-b9f7-66c3abcb3e1d', 'MIT Creative Portfolio', 'Pending', '2026-01-01 23:59:59');
            
    END LOOP;
END $$;
