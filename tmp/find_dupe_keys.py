import os
import re

def check_duplicate_keys(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all style={{ ... }} blocks
    styles = re.findall(r'style=\{\{\s*(.*?)\s*\}\}', content, re.DOTALL)
    for style in styles:
        # Split by comma (naive split)
        items = style.split(',')
        keys = []
        for item in items:
            match = re.search(r'^\s*([a-zA-Z0-9]+)\s*:', item.strip())
            if match:
                key = match.group(1)
                if key in keys:
                    print(f"DUP KEY '{key}' in {file_path}")
                keys.append(key)

root = r'c:\Projects\AA\SS_12_26\frontend\src\components'
for f in os.listdir(root):
    if f.endswith('.jsx'):
        check_duplicate_keys(os.path.join(root, f))
