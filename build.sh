#!/bin/bash
# Vercel build script — builds the Vite frontend from source
set -e
cd "$(dirname "$0")/3_code/frontend"
npm install
npm run build
