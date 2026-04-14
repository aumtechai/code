with open(r'c:\Projects\AA\at\3_code\frontend\src\components\DeanDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()
    open_braces = content.count('{')
    close_braces = content.count('}')
    print(f"Open: {open_braces}, Close: {close_braces}")
    
    # Try to find imbalance
    stack = []
    for i, char in enumerate(content):
        if char == '{':
            stack.append(i)
        elif char == '}':
            if not stack:
                print(f"Unexpected closing brace at index {i}")
            else:
                stack.pop()
    if stack:
        for s in stack:
            print(f"Unclosed opening brace at index {s}")
            # Snippet:
            print(content[s:s+50])
