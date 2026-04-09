from app.ednex import get_supabase_client
def debug():
    s = get_supabase_client()
    res = s.table('mod00_users').select('id').eq('email', 'student@aumtech.ai').execute()
    sid = res.data[0]['id']
    sis = s.table('mod01_student_profiles').select('*').eq('user_id', sid).execute().data[0]
    print(f"User ID: {sid}")
    print(f"Full SIS Record: {sis}")
    print(f"GPA: {sis.get('cumulative_gpa')}")
    
    fin = s.table('mod02_student_accounts').select('*').eq('student_id', sid).execute().data[0]
    print(f"Finance Record: {fin}")

if __name__ == "__main__":
    debug()
