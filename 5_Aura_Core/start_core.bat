@echo off
title Aura Core Specialist Hub
echo Starting Aura Core Specialists on Port 8001...
cd /d %~dp0
set PYTHONPATH=%PYTHONPATH%;.
python tests/aura_test_server.py
pause
