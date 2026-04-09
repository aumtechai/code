import os
from supabase import create_client

url = "https://rfkoylpcuptzkakmqotq.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJma295bHBjdXB0emtha21xb3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MzY0MDYsImV4cCI6MjA4ODQxMjQwNn0.kcUD2GGSmMJLcG0tyJZtbCd9h9gB2S8jFYDz9RJKMe8"

client = create_client(url, key)
table = "mod01_programs"
try:
    # Use select('*') with count and limit 1 to get exact count without big fetch
    resp = client.table(table).select('*', count='exact').limit(1).execute()
    print(f"Response Object: {resp}")
    print(f"Attribute count: {resp.count}")
    print(f"Has data: {len(resp.data) if resp.data else 0}")
except Exception as e:
    print(f"Error: {e}")
