"""
apply_rls_via_api.py — Apply RLS policies using Supabase service role key.

Since Supabase service_role bypasses RLS automatically, we use it here to:
1. Execute DDL (CREATE POLICY etc.) via supabase.rpc() if a stored procedure exists,
   OR via direct psql using the Supabase connection string.

This script tries TWO approaches:
  A) Direct psycopg2 connection to Supabase PostgreSQL
  B) If no DB URL, prints the SQL for manual application in the Supabase SQL editor.

Usage:
    python apply_rls_via_api.py
    
Set SUPABASE_DB_URL in .env:
    postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
    
Find it at: Supabase Dashboard → Settings → Database → Connection String → URI
"""

import os, sys

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://rfkoylpcuptzkakmqotq.supabase.co")
SERVICE_KEY  = os.environ.get("SUPABASE_SERVICE_KEY", "")
SUPABASE_DB_URL = os.environ.get("SUPABASE_DB_URL", "")

# ── The RLS policies SQL (condensed for API execution) ───────
POLICIES = [
    # mod00_users
    ("DROP POLICY IF EXISTS \"service_role_all_users\" ON mod00_users", "drop"),
    ("DROP POLICY IF EXISTS \"anon_read_users\" ON mod00_users", "drop"),
    ("ALTER TABLE mod00_users ENABLE ROW LEVEL SECURITY", "alter"),
    ("CREATE POLICY \"service_role_all_users\" ON mod00_users FOR ALL TO service_role USING (true) WITH CHECK (true)", "create"),
    ("CREATE POLICY \"anon_read_users\" ON mod00_users FOR SELECT TO anon USING (true)", "create"),
    # mod01_student_profiles
    ("DROP POLICY IF EXISTS \"service_role_all_profiles\" ON mod01_student_profiles", "drop"),
    ("DROP POLICY IF EXISTS \"anon_read_profiles\" ON mod01_student_profiles", "drop"),
    ("ALTER TABLE mod01_student_profiles ENABLE ROW LEVEL SECURITY", "alter"),
    ("CREATE POLICY \"service_role_all_profiles\" ON mod01_student_profiles FOR ALL TO service_role USING (true) WITH CHECK (true)", "create"),
    ("CREATE POLICY \"anon_read_profiles\" ON mod01_student_profiles FOR SELECT TO anon USING (true)", "create"),
    # mod01_programs
    ("DROP POLICY IF EXISTS \"service_role_all_programs\" ON mod01_programs", "drop"),
    ("DROP POLICY IF EXISTS \"anon_read_programs\" ON mod01_programs", "drop"),
    ("ALTER TABLE mod01_programs ENABLE ROW LEVEL SECURITY", "alter"),
    ("CREATE POLICY \"service_role_all_programs\" ON mod01_programs FOR ALL TO service_role USING (true) WITH CHECK (true)", "create"),
    ("CREATE POLICY \"anon_read_programs\" ON mod01_programs FOR SELECT TO anon USING (true)", "create"),
    # mod02_student_accounts
    ("DROP POLICY IF EXISTS \"service_role_all_accounts\" ON mod02_student_accounts", "drop"),
    ("DROP POLICY IF EXISTS \"anon_read_accounts\" ON mod02_student_accounts", "drop"),
    ("ALTER TABLE mod02_student_accounts ENABLE ROW LEVEL SECURITY", "alter"),
    ("CREATE POLICY \"service_role_all_accounts\" ON mod02_student_accounts FOR ALL TO service_role USING (true) WITH CHECK (true)", "create"),
    ("CREATE POLICY \"anon_read_accounts\" ON mod02_student_accounts FOR SELECT TO anon USING (true)", "create"),
    # mod03_advising_appointments
    ("DROP POLICY IF EXISTS \"service_role_all_appointments\" ON mod03_advising_appointments", "drop"),
    ("DROP POLICY IF EXISTS \"anon_read_appointments\" ON mod03_advising_appointments", "drop"),
    ("ALTER TABLE mod03_advising_appointments ENABLE ROW LEVEL SECURITY", "alter"),
    ("CREATE POLICY \"service_role_all_appointments\" ON mod03_advising_appointments FOR ALL TO service_role USING (true) WITH CHECK (true)", "create"),
    ("CREATE POLICY \"anon_read_appointments\" ON mod03_advising_appointments FOR SELECT TO anon USING (true)", "create"),
    # mod03_intervention_flags
    ("DROP POLICY IF EXISTS \"service_role_all_flags\" ON mod03_intervention_flags", "drop"),
    ("DROP POLICY IF EXISTS \"anon_read_flags\" ON mod03_intervention_flags", "drop"),
    ("ALTER TABLE mod03_intervention_flags ENABLE ROW LEVEL SECURITY", "alter"),
    ("CREATE POLICY \"service_role_all_flags\" ON mod03_intervention_flags FOR ALL TO service_role USING (true) WITH CHECK (true)", "create"),
    ("CREATE POLICY \"anon_read_flags\" ON mod03_intervention_flags FOR SELECT TO anon USING (true)", "create"),
    # mod04_courses
    ("DROP POLICY IF EXISTS \"service_role_all_courses\" ON mod04_courses", "drop"),
    ("DROP POLICY IF EXISTS \"anon_read_courses\" ON mod04_courses", "drop"),
    ("ALTER TABLE mod04_courses ENABLE ROW LEVEL SECURITY", "alter"),
    ("CREATE POLICY \"service_role_all_courses\" ON mod04_courses FOR ALL TO service_role USING (true) WITH CHECK (true)", "create"),
    ("CREATE POLICY \"anon_read_courses\" ON mod04_courses FOR SELECT TO anon USING (true)", "create"),
    # mod04_enrollments
    ("DROP POLICY IF EXISTS \"service_role_all_enrollments\" ON mod04_enrollments", "drop"),
    ("DROP POLICY IF EXISTS \"anon_read_enrollments\" ON mod04_enrollments", "drop"),
    ("ALTER TABLE mod04_enrollments ENABLE ROW LEVEL SECURITY", "alter"),
    ("CREATE POLICY \"service_role_all_enrollments\" ON mod04_enrollments FOR ALL TO service_role USING (true) WITH CHECK (true)", "create"),
    ("CREATE POLICY \"anon_read_enrollments\" ON mod04_enrollments FOR SELECT TO anon USING (true)", "create"),
    # mod05_companies
    ("DROP POLICY IF EXISTS \"service_role_all_companies\" ON mod05_companies", "drop"),
    ("DROP POLICY IF EXISTS \"anon_read_companies\" ON mod05_companies", "drop"),
    ("ALTER TABLE mod05_companies ENABLE ROW LEVEL SECURITY", "alter"),
    ("CREATE POLICY \"service_role_all_companies\" ON mod05_companies FOR ALL TO service_role USING (true) WITH CHECK (true)", "create"),
    ("CREATE POLICY \"anon_read_companies\" ON mod05_companies FOR SELECT TO anon USING (true)", "create"),
    # mod06_admissions_applications
    ("DROP POLICY IF EXISTS \"service_role_all_admissions\" ON mod06_admissions_applications", "drop"),
    ("DROP POLICY IF EXISTS \"anon_read_admissions\" ON mod06_admissions_applications", "drop"),
    ("ALTER TABLE mod06_admissions_applications ENABLE ROW LEVEL SECURITY", "alter"),
    ("CREATE POLICY \"service_role_all_admissions\" ON mod06_admissions_applications FOR ALL TO service_role USING (true) WITH CHECK (true)", "create"),
    ("CREATE POLICY \"anon_read_admissions\" ON mod06_admissions_applications FOR SELECT TO anon USING (true)", "create"),
    # mod07_degree_audits
    ("DROP POLICY IF EXISTS \"service_role_all_audits\" ON mod07_degree_audits", "drop"),
    ("DROP POLICY IF EXISTS \"anon_read_audits\" ON mod07_degree_audits", "drop"),
    ("ALTER TABLE mod07_degree_audits ENABLE ROW LEVEL SECURITY", "alter"),
    ("CREATE POLICY \"service_role_all_audits\" ON mod07_degree_audits FOR ALL TO service_role USING (true) WITH CHECK (true)", "create"),
    ("CREATE POLICY \"anon_read_audits\" ON mod07_degree_audits FOR SELECT TO anon USING (true)", "create"),
    # mod08_aid_packages
    ("DROP POLICY IF EXISTS \"service_role_all_aid\" ON mod08_aid_packages", "drop"),
    ("DROP POLICY IF EXISTS \"anon_read_aid\" ON mod08_aid_packages", "drop"),
    ("ALTER TABLE mod08_aid_packages ENABLE ROW LEVEL SECURITY", "alter"),
    ("CREATE POLICY \"service_role_all_aid\" ON mod08_aid_packages FOR ALL TO service_role USING (true) WITH CHECK (true)", "create"),
    ("CREATE POLICY \"anon_read_aid\" ON mod08_aid_packages FOR SELECT TO anon USING (true)", "create"),
]

VERIFY_SQL = """
SELECT tablename, policyname, roles::text, cmd
FROM pg_policies
WHERE tablename LIKE 'mod%'
ORDER BY tablename, policyname;
"""

def apply_via_psycopg2(db_url):
    try:
        import psycopg2
    except ImportError:
        print("  psycopg2 not available — try: pip install psycopg2-binary")
        return False

    print(f"Connecting to Supabase PostgreSQL...")
    try:
        conn = psycopg2.connect(db_url, sslmode="require")
        conn.autocommit = True
        cur = conn.cursor()

        ok = err = 0
        for sql, kind in POLICIES:
            try:
                cur.execute(sql)
                ok += 1
                label = sql[:60].replace("\n", " ")
                print(f"  OK  [{kind}] {label}...")
            except Exception as e:
                msg = str(e).strip()
                if "does not exist" in msg:
                    ok += 1  # expected for DROP IF EXISTS on fresh tables
                else:
                    print(f"  WARN [{kind}] {msg[:100]}")
                    err += 1

        print(f"\n  Applied {ok} statements, {err} warnings.")

        # Verify
        cur.execute(VERIFY_SQL)
        rows = cur.fetchall()
        print(f"\n  Policies in Supabase ({len(rows)} total):")
        print(f"  {'Table':<35} {'Policy':<35} {'Roles':<15} {'Cmd'}")
        print(f"  {'-'*90}")
        for row in rows:
            print(f"  {row[0]:<35} {row[1]:<35} {row[2]:<15} {row[3]}")

        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"  Connection failed: {e}")
        return False


def apply_via_httpx(service_key):
    """
    Supabase Management API approach — applies SQL via the management API.
    Requires: pip install httpx
    """
    try:
        import httpx
    except ImportError:
        return False

    project_ref = "rfkoylpcuptzkakmqotq"
    mgmt_url = f"https://api.supabase.com/v1/projects/{project_ref}/database/query"

    all_sql = ";\n".join(sql for sql, _ in POLICIES) + ";\n" + VERIFY_SQL

    print(f"Trying Supabase Management API...")
    try:
        resp = httpx.post(
            mgmt_url,
            headers={
                "Authorization": f"Bearer {service_key}",
                "Content-Type": "application/json",
            },
            json={"query": all_sql},
            timeout=30,
        )
        if resp.status_code == 200:
            print(f"  Management API success!")
            data = resp.json()
            print(f"  Result: {str(data)[:500]}")
            return True
        else:
            print(f"  Management API returned {resp.status_code}: {resp.text[:200]}")
            return False
    except Exception as e:
        print(f"  Management API failed: {e}")
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("EdNex RLS Policy Apply Script")
    print("=" * 60)

    if not SERVICE_KEY:
        print("ERROR: SUPABASE_SERVICE_KEY not set in .env")
        sys.exit(1)

    success = False

    # Approach A: Direct psycopg2
    if SUPABASE_DB_URL:
        success = apply_via_psycopg2(SUPABASE_DB_URL)

    # Approach B: Management API
    if not success:
        success = apply_via_httpx(SERVICE_KEY)

    if not success:
        print("\n" + "=" * 60)
        print("MANUAL APPLICATION REQUIRED")
        print("=" * 60)
        print("\nCopy and paste the following SQL into:")
        print("Supabase Dashboard → SQL Editor → New Query → Run\n")
        print("URL: https://supabase.com/dashboard/project/rfkoylpcuptzkakmqotq/sql/new")
        print("\n" + "-" * 60)
        
        all_sql = ";\n".join(sql for sql, _ in POLICIES) + ";\n"
        print(all_sql)
        
        print("-" * 60)
        print("\nTo also add SUPABASE_DB_URL for automated apply, find your connection string at:")
        print("Supabase Dashboard → Settings → Database → Connection String → URI")
        print("Then add to .env: SUPABASE_DB_URL=postgresql://postgres.[ref]:[pass]@...")
