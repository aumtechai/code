import os
from supabase import create_client
url = 'https://rfkoylpcuptzkakmqotq.supabase.co'
key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJma295bHBjdXB0emtha21xb3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MzY0MDYsImV4cCI6MjA4ODQxMjQwNn0.kcUD2GGSmMJLcG0tyJZtbCd9h9gB2S8jFYDz9RJKMe8'
client = create_client(url, key)
try:
    print("Mod04 Sections:", client.table('mod04_sections').select('capacity, enrolled_count').limit(5).execute())
except Exception as e: print("error", e)
