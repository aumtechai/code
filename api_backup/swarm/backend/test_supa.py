import os
import json
from supabase import create_client

url = 'https://rfkoylpcuptzkakmqotq.supabase.co'
key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJma295bHBjdXB0emtha21xb3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MzY0MDYsImV4cCI6MjA4ODQxMjQwNn0.kcUD2GGSmMJLcG0tyJZtbCd9h9gB2S8jFYDz9RJKMe8'
client = create_client(url, key)

try:
    # See if we can create a table via rpc or if mod10 exists
    res = client.rpc('exec_sql', {'sql_string': 'CREATE TABLE IF NOT EXISTS mod10_migration_predictions (id serial primary key, student_id int, out_of_major_courses jsonb, migration_probability float);'}).execute()
    print("RPC executed:", res)
except Exception as e:
    print("RPC error:", e)

# Also let's just query everything in Mod00, Mod01 to see if there's any JSONB field we can hijack
try:
    print(client.table('mod01_student_profiles').select('*').limit(1).execute())
except Exception as e:
    print("Mod 01 Error:", e)
