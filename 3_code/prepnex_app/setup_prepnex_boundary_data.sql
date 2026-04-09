-- setup_prepnex_boundary_data.sql (FIXED - Schema Calibration v3)
-- Generates 5,000+ Students based on the definitive PREPNEX_DB_SCHEMA

DO $$ 
DECLARE 
    i INTEGER;
    new_student_id UUID;
    scenario_type INTEGER;
    alignment INTEGER;
    grade INTEGER;
    stu_login_name TEXT; -- Using full_name for login-string compatibility
BEGIN
    FOR i IN 1..5000 LOOP
        -- Assign a Scenario Type (1-8)
        scenario_type := floor(random() * 8 + 1);
        
        -- Handle FIRST 8 as Static Guaranteed Scenarios
        IF i = 1 THEN new_student_id := '00000000-0000-0000-0000-000000000001'; scenario_type := 1;
        ELSIF i = 2 THEN new_student_id := '00000000-0000-0000-0000-000000000002'; scenario_type := 2;
        ELSIF i = 3 THEN new_student_id := '00000000-0000-0000-0000-000000000003'; scenario_type := 3;
        ELSIF i = 4 THEN new_student_id := '00000000-0000-0000-0000-000000000004'; scenario_type := 4;
        ELSIF i = 5 THEN new_student_id := '00000000-0000-0000-0000-000000000005'; scenario_type := 5;
        ELSIF i = 6 THEN new_student_id := '00000000-0000-0000-0000-000000000006'; scenario_type := 6;
        ELSIF i = 7 THEN new_student_id := '00000000-0000-0000-0000-000000000007'; scenario_type := 7;
        ELSIF i = 8 THEN new_student_id := '00000000-0000-0000-0000-000000000008'; scenario_type := 8;
        ELSE new_student_id := gen_random_uuid();
        END IF;

        stu_login_name := 'student' || i || '@prepnex-test.com';
        grade := 12;
        alignment := 90;

        -- Profile-Specific Data
        IF scenario_type = 1 THEN alignment := 98;
        ELSIF scenario_type = 2 THEN alignment := 75;
        ELSIF scenario_type = 6 THEN alignment := 60;
        END IF;

        -- 1. Create Student Table Record (Confirmed Columns: id, full_name, alignment_score, current_grade)
        INSERT INTO public.students (id, full_name, current_grade, alignment_score)
        VALUES (new_student_id, stu_login_name, grade, alignment);

        -- 2. Add Educational Data (Academic Roadmaps - where GPA is stored as course grades)
        INSERT INTO public.academic_roadmaps (student_id, course_type, course_name, grade, status)
        VALUES (new_student_id, 'Science', 'AP Physics C', 'A+', 'completed');

        -- 3. Add Testing Data (Test History - where SAT score is stored)
        INSERT INTO public.test_history (student_id, test_type, score, is_actual)
        VALUES (new_student_id, 'SAT', 1550, TRUE);

        -- 4. Tracker & Essay support (these use external tables linked by student_id)
        INSERT INTO public.student_universities (student_id, university_id, student_fit_score, status, tier)
        SELECT new_student_id::text, id, 95, 'In Progress', 'Reach' FROM universities LIMIT 3;

    END LOOP;
END $$;
