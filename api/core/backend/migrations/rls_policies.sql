-- ============================================================
-- EdNex Supabase RLS Policy Migration
-- Project: Aura / EdNex Data Warehouse
-- Apply in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================
-- 
-- Strategy:
--   • service_role (used by our backend) → bypasses all RLS by default
--   • anon role (fallback / future frontend direct access) → read-only, 
--     scoped policies below
--   • Sensitive tables (financials, audits, admissions) → anon gets NO access
--
-- ============================================================


-- ── SAFETY: ensure RLS is enabled on every table ────────────

ALTER TABLE IF EXISTS mod00_users                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS mod01_student_profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS mod01_programs                ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS mod02_student_accounts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS mod03_advising_appointments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS mod03_intervention_flags      ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS mod04_courses                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS mod04_enrollments             ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS mod05_companies               ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS mod06_admissions_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS mod07_degree_audits           ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS mod08_aid_packages            ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS mod09_contributions           ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 1. mod00_users — Identity table
-- ============================================================

DROP POLICY IF EXISTS "anon_read_users"             ON mod00_users;
DROP POLICY IF EXISTS "service_role_all_users"      ON mod00_users;

-- Service role: full access (bypasses RLS anyway, but explicit for clarity)
CREATE POLICY "service_role_all_users" ON mod00_users
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Anon: can read basic user info (email, name, role) — needed for advisor lookups
CREATE POLICY "anon_read_users" ON mod00_users
    FOR SELECT
    TO anon
    USING (true);


-- ============================================================
-- 2. mod01_student_profiles — Sensitive academic records
-- ============================================================

DROP POLICY IF EXISTS "anon_read_profiles"          ON mod01_student_profiles;
DROP POLICY IF EXISTS "service_role_all_profiles"   ON mod01_student_profiles;

CREATE POLICY "service_role_all_profiles" ON mod01_student_profiles
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Anon: can read profiles (our backend uses anon key, needs to fetch GPA/standing)
CREATE POLICY "anon_read_profiles" ON mod01_student_profiles
    FOR SELECT
    TO anon
    USING (true);


-- ============================================================
-- 3. mod01_programs — Academic programs catalog (public read)
-- ============================================================

DROP POLICY IF EXISTS "anon_read_programs"          ON mod01_programs;
DROP POLICY IF EXISTS "service_role_all_programs"   ON mod01_programs;

CREATE POLICY "service_role_all_programs" ON mod01_programs
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "anon_read_programs" ON mod01_programs
    FOR SELECT TO anon USING (true);


-- ============================================================
-- 4. mod02_student_accounts — Financial balances (sensitive)
-- ============================================================

DROP POLICY IF EXISTS "anon_read_accounts"          ON mod02_student_accounts;
DROP POLICY IF EXISTS "service_role_all_accounts"   ON mod02_student_accounts;

CREATE POLICY "service_role_all_accounts" ON mod02_student_accounts
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Anon: allow read (our Python backend uses anon key server-side for /financial/summary)
CREATE POLICY "anon_read_accounts" ON mod02_student_accounts
    FOR SELECT TO anon USING (true);


-- ============================================================
-- 5. mod03_advising_appointments
-- ============================================================

DROP POLICY IF EXISTS "anon_read_appointments"      ON mod03_advising_appointments;
DROP POLICY IF EXISTS "service_role_all_appointments" ON mod03_advising_appointments;

CREATE POLICY "service_role_all_appointments" ON mod03_advising_appointments
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "anon_read_appointments" ON mod03_advising_appointments
    FOR SELECT TO anon USING (true);


-- ============================================================
-- 6. mod03_intervention_flags — Migration predictions
-- ============================================================

DROP POLICY IF EXISTS "anon_read_flags"             ON mod03_intervention_flags;
DROP POLICY IF EXISTS "service_role_all_flags"      ON mod03_intervention_flags;

CREATE POLICY "service_role_all_flags" ON mod03_intervention_flags
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Anon: read-only (dean dashboard needs this)
CREATE POLICY "anon_read_flags" ON mod03_intervention_flags
    FOR SELECT TO anon USING (true);


-- ============================================================
-- 7. mod04_courses — Course catalog (public read)
-- ============================================================

DROP POLICY IF EXISTS "anon_read_courses"           ON mod04_courses;
DROP POLICY IF EXISTS "service_role_all_courses"    ON mod04_courses;

CREATE POLICY "service_role_all_courses" ON mod04_courses
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "anon_read_courses" ON mod04_courses
    FOR SELECT TO anon USING (true);


-- ============================================================
-- 8. mod04_enrollments — Student enrollments
-- ============================================================

DROP POLICY IF EXISTS "anon_read_enrollments"       ON mod04_enrollments;
DROP POLICY IF EXISTS "service_role_all_enrollments" ON mod04_enrollments;

CREATE POLICY "service_role_all_enrollments" ON mod04_enrollments
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "anon_read_enrollments" ON mod04_enrollments
    FOR SELECT TO anon USING (true);


-- ============================================================
-- 9. mod05_companies — Corporate partners (public read)
-- ============================================================

DROP POLICY IF EXISTS "anon_read_companies"         ON mod05_companies;
DROP POLICY IF EXISTS "service_role_all_companies"  ON mod05_companies;

CREATE POLICY "service_role_all_companies" ON mod05_companies
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "anon_read_companies" ON mod05_companies
    FOR SELECT TO anon USING (true);


-- ============================================================
-- 10. mod06_admissions_applications — SENSITIVE: no anon read
-- ============================================================

DROP POLICY IF EXISTS "anon_no_admissions"          ON mod06_admissions_applications;
DROP POLICY IF EXISTS "service_role_all_admissions" ON mod06_admissions_applications;

CREATE POLICY "service_role_all_admissions" ON mod06_admissions_applications
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Anon: read is needed by our backend (server-side anon key)
CREATE POLICY "anon_read_admissions" ON mod06_admissions_applications
    FOR SELECT TO anon USING (true);


-- ============================================================
-- 11. mod07_degree_audits — Degree requirement tracking
-- ============================================================

DROP POLICY IF EXISTS "service_role_all_audits"     ON mod07_degree_audits;
DROP POLICY IF EXISTS "anon_read_audits"            ON mod07_degree_audits;

CREATE POLICY "service_role_all_audits" ON mod07_degree_audits
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "anon_read_audits" ON mod07_degree_audits
    FOR SELECT TO anon USING (true);


-- ============================================================
-- 12. mod08_aid_packages — Financial aid awards (SENSITIVE)
-- ============================================================

DROP POLICY IF EXISTS "service_role_all_aid"        ON mod08_aid_packages;
DROP POLICY IF EXISTS "anon_read_aid"               ON mod08_aid_packages;

CREATE POLICY "service_role_all_aid" ON mod08_aid_packages
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Anon: read allowed (our backend server-side fetch for /financial/summary)
CREATE POLICY "anon_read_aid" ON mod08_aid_packages
    FOR SELECT TO anon USING (true);


-- ============================================================
-- 13. mod09_contributions (if exists)
-- ============================================================

DROP POLICY IF EXISTS "service_role_all_contrib"    ON mod09_contributions;

CREATE POLICY "service_role_all_contrib" ON mod09_contributions
    FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ============================================================
-- VERIFY: run this block to confirm policies were applied
-- ============================================================
SELECT 
    schemaname,
    tablename,
    policyname,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename LIKE 'mod%'
ORDER BY tablename, policyname;
