@echo off
:loop
echo Starting tailscale funnel on port 3002...
tailscale funnel 3002
echo Tailscale funnel exited. Restarting in 5 seconds...
timeout /t 5 /nobreak > nul
goto loop
