import google.generativeai as genai
import os

key = "AIzaSyChZdfiXaDvKbFg2pqVid6CqOBbtCe2kUQ"
genai.configure(api_key=key)

try:
    model = genai.GenerativeModel('gemini-flash-latest')
    response = model.generate_content("Hello, reply with 'Gemini is working' if you see this.")
    print(f"RESPONSE: {response.text}")
except Exception as e:
    print(f"ERROR: {e}")
