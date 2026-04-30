import re

with open('c:/Projects/AA/at/ednex_about_page.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Extract CSS
css_match = re.search(r'<style>(.*?)</style>', html_content, re.DOTALL)
if css_match:
    css_content = css_match.group(1).strip()
    with open('c:/Projects/AA/at/3_code/frontend/src/components/EdNexArticle.css', 'w', encoding='utf-8') as f:
        f.write(css_content)

# Extract body
body_match = re.search(r'<div class="hero">(.*)</body>', html_content, re.DOTALL)
if body_match:
    body_html = '<div className="hero">' + body_match.group(1)
    
    # Simple React conversions
    body_html = body_html.replace('class=', 'className=')
    body_html = body_html.replace('style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);"', 'style={{ position:"absolute", width:"1px", height:"1px", overflow:"hidden", clip:"rect(0,0,0,0)" }}')
    body_html = body_html.replace('style="background:#E6F1FB;"', 'style={{ background: "#E6F1FB" }}')
    body_html = body_html.replace('style="stroke:#185FA5"', 'style={{ stroke: "#185FA5" }}')
    body_html = body_html.replace('style="background:#E1F5EE;"', 'style={{ background: "#E1F5EE" }}')
    body_html = body_html.replace('style="stroke:#0F6E56"', 'style={{ stroke: "#0F6E56" }}')
    body_html = body_html.replace('style="background:#EEEDFE;"', 'style={{ background: "#EEEDFE" }}')
    body_html = body_html.replace('style="stroke:#534AB7"', 'style={{ stroke: "#534AB7" }}')
    body_html = body_html.replace('style="background:#FAEEDA;"', 'style={{ background: "#FAEEDA" }}')
    body_html = body_html.replace('style="stroke:#854F0B"', 'style={{ stroke: "#854F0B" }}')
    body_html = body_html.replace('style="background:#FAECE7;"', 'style={{ background: "#FAECE7" }}')
    body_html = body_html.replace('style="stroke:#993C1D"', 'style={{ stroke: "#993C1D" }}')
    body_html = body_html.replace('style="background:#EAF3DE;"', 'style={{ background: "#EAF3DE" }}')
    body_html = body_html.replace('style="stroke:#3B6D11"', 'style={{ stroke: "#3B6D11" }}')
    body_html = body_html.replace('style="background:#185FA5;"', 'style={{ background: "#185FA5" }}')
    body_html = body_html.replace('style="background:#534AB7;"', 'style={{ background: "#534AB7" }}')
    body_html = body_html.replace('style="background:#0F6E56;"', 'style={{ background: "#0F6E56" }}')
    body_html = body_html.replace('style="background:#854F0B;"', 'style={{ background: "#854F0B" }}')
    body_html = body_html.replace('style="background:#993C1D;"', 'style={{ background: "#993C1D" }}')
    body_html = body_html.replace('style="background:#E6F1FB;color:#185FA5;"', 'style={{ background: "#E6F1FB", color: "#185FA5" }}')
    body_html = body_html.replace('style="background:#EEEDFE;color:#534AB7;"', 'style={{ background: "#EEEDFE", color: "#534AB7" }}')
    body_html = body_html.replace('style="background:#E1F5EE;color:#0F6E56;"', 'style={{ background: "#E1F5EE", color: "#0F6E56" }}')
    body_html = body_html.replace('style="background:#FAEEDA;color:#854F0B;"', 'style={{ background: "#FAEEDA", color: "#854F0B" }}')
    body_html = body_html.replace('style="background:#FAECE7;color:#993C1D;"', 'style={{ background: "#FAECE7", color: "#993C1D" }}')
    body_html = body_html.replace('style="font-size:12px;color:var(--color-text-tertiary);margin-top:1.5rem;"', 'style={{ fontSize: "12px", color: "var(--color-text-tertiary)", marginTop: "1.5rem" }}')
    
    # SVGs 
    body_html = body_html.replace('stroke-width=', 'strokeWidth=')
    body_html = body_html.replace('stroke-linecap=', 'strokeLinecap=')
    body_html = body_html.replace('stroke-linejoin=', 'strokeLinejoin=')

    # Remove self-closing tags errors
    body_html = body_html.replace('<br>', '<br />')

    # Button onclick
    body_html = body_html.replace('onclick="sendPrompt(\'I want to request a demo of EdNex from aumtech.ai\')"', 'onClick={() => navigate("/login")}')
    body_html = body_html.replace('onclick="sendPrompt(\'Tell me more about EdNex pricing and implementation\')"', 'onClick={() => navigate("/login")}')

    jsx_content = """import React from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from './PublicLayout';
import './EdNexArticle.css';

const EdNexArticle = () => {
    const navigate = useNavigate();

    return (
        <PublicLayout>
            <div className="ednex-article-container" style={{ background: '#fff', color: '#0f172a' }}>
                <h2 className="sr-only" style={{ position:"absolute", width:"1px", height:"1px", overflow:"hidden", clip:"rect(0,0,0,0)" }}>EdNex platform by aumtech.ai – About page describing student success modules for academic and career outcomes</h2>
                {/* Content Start */}
                """ + body_html + """
            </div>
        </PublicLayout>
    );
};

export default EdNexArticle;
"""
    with open('c:/Projects/AA/at/3_code/frontend/src/components/EdNexArticle.jsx', 'w', encoding='utf-8') as f:
        f.write(jsx_content)

print('Done converting')
