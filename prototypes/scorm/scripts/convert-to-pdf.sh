#!/bin/bash

# SCORM Framework - Markdown to PDF Converter
# Converts all documentation to professional PDF format using Chrome headless

echo "📄 Converting Markdown documentation to PDF..."
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Chrome binary location
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Temporary directory for HTML files
TEMP_DIR=".temp-html"
mkdir -p "$TEMP_DIR"

# CSS for professional PDF styling
PDF_CSS="
<style>
    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
        font-size: 11pt;
        line-height: 1.6;
        color: #333;
        max-width: 8in;
        margin: 0 auto;
        padding: 0.5in;
    }
    h1 {
        color: #667eea;
        border-bottom: 3px solid #667eea;
        padding-bottom: 10px;
        margin-top: 30px;
    }
    h2 {
        color: #764ba2;
        border-bottom: 2px solid #e0e0e0;
        padding-bottom: 5px;
        margin-top: 25px;
    }
    h3 {
        color: #555;
        margin-top: 20px;
    }
    code {
        background-color: #f5f5f5;
        padding: 2px 5px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
        font-size: 10pt;
    }
    pre {
        background-color: #f5f5f5;
        padding: 15px;
        border-radius: 5px;
        overflow-x: auto;
        border-left: 4px solid #667eea;
    }
    pre code {
        background-color: transparent;
        padding: 0;
    }
    table {
        border-collapse: collapse;
        width: 100%;
        margin: 15px 0;
    }
    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }
    th {
        background-color: #667eea;
        color: white;
        font-weight: bold;
    }
    tr:nth-child(even) {
        background-color: #f9f9f9;
    }
    ul, ol {
        margin: 10px 0;
        padding-left: 25px;
    }
    li {
        margin: 5px 0;
    }
    blockquote {
        border-left: 4px solid #667eea;
        padding-left: 15px;
        margin: 15px 0;
        color: #666;
        font-style: italic;
    }
    a {
        color: #667eea;
        text-decoration: none;
    }
    .page-break {
        page-break-after: always;
    }
    @media print {
        body {
            margin: 0;
        }
    }
</style>
"

# Function to convert markdown to PDF
convert_to_pdf() {
    local md_file=$1
    local pdf_file="${md_file%.md}.pdf"
    local html_file="$TEMP_DIR/$(basename ${md_file%.md}.html)"

    echo -e "${BLUE}Converting:${NC} $md_file"

    # Step 1: Convert Markdown to HTML with pandoc
    if ! pandoc "$md_file" -f markdown -t html5 -s --metadata title="$(basename $md_file .md)" -o "$html_file" 2>/dev/null; then
        echo -e "${YELLOW}⚠ Pandoc failed for $md_file${NC}"
        return 1
    fi

    # Step 2: Inject custom CSS into HTML
    sed -i '' "s|</head>|$PDF_CSS</head>|" "$html_file"

    # Step 3: Convert HTML to PDF using Chrome headless
    if "$CHROME" --headless --disable-gpu --print-to-pdf="$pdf_file" --no-pdf-header-footer "$html_file" 2>/dev/null; then
        echo -e "${GREEN}✓ Created:${NC} $pdf_file"
        echo ""
        return 0
    else
        echo -e "${YELLOW}✗ Failed to create PDF${NC}"
        echo ""
        return 1
    fi
}

# Navigate to project root
cd "$(dirname "$0")/.."

# Convert all documentation files
echo "Converting main documentation..."
convert_to_pdf "README.md"
convert_to_pdf "QUICK-START.md"

echo "Converting docs/ folder..."
convert_to_pdf "docs/IT-REQUIREMENTS.md"
convert_to_pdf "docs/HIGHER-ED-STRATEGY.md"
convert_to_pdf "docs/TROUBLESHOOTING.md"

echo "Converting testing documentation..."
convert_to_pdf "testing/test-checklist.md"

# Clean up temporary files
rm -rf "$TEMP_DIR"

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ PDF conversion complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Generated PDFs:"
echo "  📕 README.pdf"
echo "  📗 QUICK-START.pdf"
echo "  📘 docs/IT-REQUIREMENTS.pdf"
echo "  📙 docs/HIGHER-ED-STRATEGY.pdf"
echo "  📔 docs/TROUBLESHOOTING.pdf"
echo "  📓 testing/test-checklist.pdf"
echo ""
echo -e "${GREEN}✓ Non-technical users can now easily read and print!${NC}"
