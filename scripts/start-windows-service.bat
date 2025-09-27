@echo off
title PC Shop - Servidor de Producao

echo ========================================
echo      PC SHOP - INICIANDO SERVIDOR
echo ========================================
echo.

REM Verificar se o build existe
if not exist ".next" (
    echo ❌ Build não encontrado!
    echo Execute primeiro: npm run build:prod
    pause
    exit /b 1
)

REM Obter IP da máquina
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4" ^| findstr /v "127.0.0.1"') do set IP=%%a
set IP=%IP: =%

echo 🌐 Informações do Servidor:
echo - Local: http://localhost:3000
echo - VPS IP: http://%IP%:3000
echo - Admin: http://%IP%:3000/admin
echo.
echo 🔑 Credenciais Admin:
echo - Usuario: admin
echo - Senha: admin123
echo.
echo ⚠️ Certifique-se que:
echo 1. XAMPP/MySQL está rodando
echo 2. Firewall permite porta 3000
echo 3. VPS tem IP público
echo.
echo 🚀 Iniciando servidor...
echo.

REM Definir variáveis de ambiente
set NODE_ENV=production
set HOSTNAME=0.0.0.0
set PORT=3000
set NEXT_TELEMETRY_DISABLED=1

REM Iniciar servidor
npm run start

pause