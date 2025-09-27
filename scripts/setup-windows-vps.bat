@echo off
echo ========================================
echo    CONFIGURACAO VPS WINDOWS - PC SHOP
echo ========================================
echo.

echo 1. Configurando Firewall...
netsh advfirewall firewall delete rule name="Next.js App" >nul 2>&1
netsh advfirewall firewall add rule name="Next.js App" dir=in action=allow protocol=TCP localport=3000
echo ✅ Firewall configurado para porta 3000

echo.
echo 2. Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado! Instale o Node.js 18+ primeiro.
    pause
    exit /b 1
) else (
    echo ✅ Node.js encontrado
)

echo.
echo 3. Verificando npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm não encontrado!
    pause
    exit /b 1
) else (
    echo ✅ npm encontrado
)

echo.
echo 4. Limpando cache...
npm cache clean --force >nul 2>&1
echo ✅ Cache limpo

echo.
echo 5. Removendo node_modules antigo...
if exist node_modules rmdir /s /q node_modules >nul 2>&1
echo ✅ node_modules removido

echo.
echo 6. Instalando dependências...
npm install --legacy-peer-deps --no-audit --no-fund
if %errorlevel% neq 0 (
    echo ❌ Erro na instalação! Tentando método alternativo...
    npm install --force --no-audit --no-fund
    if %errorlevel% neq 0 (
        echo ❌ Falha na instalação das dependências!
        pause
        exit /b 1
    )
)
echo ✅ Dependências instaladas

echo.
echo 7. Fazendo build...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Erro no build!
    pause
    exit /b 1
)
echo ✅ Build concluído

echo.
echo ========================================
echo           CONFIGURACAO CONCLUIDA
echo ========================================
echo.
echo Para iniciar o servidor:
echo npm run start:prod
echo.
echo Acesso:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do set IP=%%a
set IP=%IP: =%
echo - Local: http://localhost:3000
echo - VPS: http://%IP%:3000
echo - Admin: http://%IP%:3000/admin
echo.
echo Credenciais Admin:
echo Usuario: admin
echo Senha: admin123
echo.
pause