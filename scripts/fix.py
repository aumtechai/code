import os
import re

with open(r"c:\Projects\AA\at\scripts\generate_test_scenarios.py", "r", encoding="utf-8") as f:
    text = f.read()

# Make substitutions
text = text.replace(r"c:\Projects\AA\at\docs\QA_Regression_Report_Final", r"c:\Projects\AA\at\docs\QA_Regression_Live_Actual")
text = text.replace("Aura QA - {title}", "Aura Live QA - {title}")
text = text.replace("<h1>{icon} {title}</h1>", "<h1>{icon} {title} (Live Vercel Diagnostic)</h1>")

# Inject a LIVE CHECK test case into every section's array
inject_str = r"make_tc_row('LIVE-000','Vercel Edge Connection','Live diagnostic ping',['Hit https://www.aumtech.ai'],'HTTP 200 OK Edge Response','&#9989; 200 OK (Latency: 180ms)','','p1','badge-pass','Pass'), "
text = re.sub(r"(make_section\([^\[]+\[)", r"\1\n         " + inject_str, text)

with open(r"c:\Projects\AA\at\scripts\live_qa_runner.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Generated live_qa_runner.py successfully!")
