
import re
import sys
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'Student Success Navigator - Training Manual', 0, 1, 'C')
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

    def chapter_title(self, title):
        self.set_font('Arial', 'B', 16)
        self.set_fill_color(200, 220, 255)
        self.cell(0, 10, title, 0, 1, 'L', 1)
        self.ln(4)

    def chapter_subtitle(self, title):
        self.set_font('Arial', 'B', 14)
        self.cell(0, 10, title, 0, 1, 'L')
        self.ln(2)
        
    def section_header(self, title):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 8, title, 0, 1, 'L')
    
    def body_text(self, text):
        self.set_font('Arial', '', 11)
        self.multi_cell(0, 6, text)
        self.ln(2)
        
    def bullet_point(self, text):
        self.set_font('Arial', '', 11)
        self.cell(5) # Indent
        self.cell(5, 6, chr(149), 0, 0) # Bullet char
        self.multi_cell(0, 6, text)
        self.ln(1)

def sanitize_text(text):
    # Replace common unicode chars incompatible with default latin-1 FPDF
    replacements = {
        '\u2014': '-',   # em dash
        '\u2013': '-',   # en dash
        '\u2018': "'",   # left single quote
        '\u2019': "'",   # right single quote
        '\u201c': '"',   # left double quote
        '\u201d': '"',   # right double quote
        '\u2022': '*',   # bullet
        '\u2026': '...', # ellipsis
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
    
    # Finally encode/decode to strip anything else
    return text.encode('latin-1', 'replace').decode('latin-1')

def parse_markdown_to_pdf(input_file, output_file):
    pdf = PDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        line = sanitize_text(line)

        # Header 1
        if line.startswith('# '):
            pdf.chapter_title(line[2:])
        # Header 2
        elif line.startswith('## '):
            pdf.chapter_subtitle(line[3:])
        # Header 3
        elif line.startswith('### '):
            pdf.section_header(line[4:])
        # Bullet points
        elif line.startswith('- ') or line.startswith('* '):
            pdf.bullet_point(line[2:])
        # Numbered list logic (simple)
        elif re.match(r'^\d+\.', line):
             pdf.set_font('Arial', '', 11)
             pdf.cell(5)
             pdf.multi_cell(0, 6, line)
             pdf.ln(1)
        # Bold text simulated in body (very basic)
        else:
            # Check if it's strictly a bold line like **Target Audience:**
            if line.startswith('**') and line.endswith('**'):
                 pdf.set_font('Arial', 'B', 11)
                 pdf.multi_cell(0, 6, line.replace('**', ''))
                 pdf.set_font('Arial', '', 11)
            else:
                 pdf.body_text(line.replace('**', ''))

    pdf.output(output_file)
    print(f"PDF generated: {output_file}")

if __name__ == "__main__":
    input_file = sys.argv[1] if len(sys.argv) > 1 else 'TRAINING_MANUAL.md'
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'TRAINING_MANUAL.pdf'
    try:
        parse_markdown_to_pdf(input_file, output_file)
    except Exception as e:
        print(f"Error: {e}")
