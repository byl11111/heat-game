@echo off
setlocal
cd /d "%~dp0"
set "PORT=8099"
set "NODE_EXE=C:\Program Files\nodejs\node.exe"
if not exist "%NODE_EXE%" set "NODE_EXE=node"
echo Starting local preview server on port %PORT%...
echo.
echo Keep the server window open while testing on iPad.
echo If Windows Firewall asks, allow Node.js on Private networks.
echo.
echo Try these addresses on iPad, using the IPv4 address that belongs to your Wi-Fi:
for /f "tokens=2 delims=:" %%A in ('ipconfig ^| findstr /i "IPv4"') do (
  for /f "tokens=* delims= " %%B in ("%%A") do (
    echo   http://%%B:%PORT%/check.html
    echo   http://%%B:%PORT%/index.html
    echo %%B | findstr /b "100." >nul
    if not errorlevel 1 (
      echo   WARNING: %%B is often a public/campus isolated-network address.
      echo   If iPad is blank, use phone hotspot or a private router Wi-Fi.
    )
  )
)
echo.
echo Open check.html first. If check.html is blank too, the iPad is not reaching this computer/server.
echo If the iPad is reaching this server, the server window will print a GET /check.html line.
echo.
start "Heat Pad Preview Server" cmd /k ""%NODE_EXE%" "%~dp0local-server.cjs" %PORT%"
pause
