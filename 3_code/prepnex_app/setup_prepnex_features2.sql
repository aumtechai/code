-- 5. MENTORSHIP & COMMUNITY (Q&A FORUM)
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_name TEXT NOT NULL,
    post_title TEXT NOT NULL,
    post_content TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. FINANCIAL READINESS (SCHOLARSHIPS)
CREATE TABLE IF NOT EXISTS public.scholarships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    amount_usd INTEGER,
    deadline TIMESTAMP WITH TIME ZONE,
    description TEXT,
    eligibility_criteria TEXT
);

CREATE TABLE IF NOT EXISTS public.student_scholarships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT NOT NULL,
    scholarship_id UUID REFERENCES public.scholarships(id) ON DELETE CASCADE,
    match_score INTEGER,
    status TEXT DEFAULT 'Not Started' -- 'Not Started', 'In Progress', 'Submitted', 'Awarded'
);

-- SEED MOCK DATA --
DELETE FROM public.student_scholarships;
DELETE FROM public.scholarships;
DELETE FROM public.community_posts;

-- Insert Community Posts
INSERT INTO public.community_posts (author_name, post_title, post_content, category, upvotes)
VALUES 
    ('Sarah (NY, Grade 12)', 'How to frame an independent research project for MIT?', 'I spent the summer building a machine learning model for detecting crop diseases, but I don''t have a formal professor sponsor. How should I list this on the MIT application?', 'Admissions Strategy', 124),
    ('David (TX, Grade 11)', 'What is a competitive AP load for engineering?', 'My school offers 8 APs. I am taking 5 of them (Calc BC, Physics C, Chem, US History, Lang). Is this rigorous enough for Top 20 engineering programs?', 'Academic Planning', 89),
    ('Alumni Admissions Officer', 'Vesta Insights: The "Spike" vs "Well-Rounded" Debate', 'A common misconception is that you need to be well-rounded. Elite universities want well-rounded *classes*, but they want *spiky* (specialized) students. Find your niche and go deep.', 'Expert Advice', 342);

-- Insert Scholarships
INSERT INTO public.scholarships (id, name, amount_usd, deadline, description, eligibility_criteria)
VALUES 
    ('a1cb2a1d-a2f0-425b-b9f7-66c3abcb3e1c', 'STEM Innovators Award', 10000, '2026-11-15 23:59:59', 'Awarded to high school seniors demonstrating exceptional innovation in computer science or engineering projects.', 'Minimum 3.8 GPA, CS/Engineering major declared'),
    ('b2cb2a1d-a2f0-425b-b9f7-66c3abcb3e1c', 'National Merit Semi-Finalist Grant', 2500, '2026-10-10 23:59:59', 'Automated grant for students who reach National Merit status based on PSAT/NMSQT cutoff scores.', 'PSAT Index > 221'),
    ('c3cb2a1d-a2f0-425b-b9f7-66c3abcb3e1c', 'Community Leadership Scholarship', 5000, '2026-12-01 23:59:59', 'For students who have launched and scaled a community service initiative impacting at least 500 people.', 'Demonstrable community impact');

-- Map Scholarships to Mock Students
DO $$
DECLARE
    student_rec RECORD;
BEGIN
    FOR student_rec IN SELECT id FROM public.students LIMIT 10 LOOP
        
        -- Tracker Data
        INSERT INTO public.student_scholarships (student_id, scholarship_id, match_score, status)
        VALUES 
            (student_rec.id::text, 'a1cb2a1d-a2f0-425b-b9f7-66c3abcb3e1c', 92, 'In Progress'),
            (student_rec.id::text, 'b2cb2a1d-a2f0-425b-b9f7-66c3abcb3e1c', 85, 'Not Started'),
            (student_rec.id::text, 'c3cb2a1d-a2f0-425b-b9f7-66c3abcb3e1c', 78, 'Not Started');
            
    END LOOP;
END $$;
