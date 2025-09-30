@echo off
echo ========================================
echo    CONFIGURACAO VPS WINDOWS - PC SHOP
echo ========================================
echo.

echo 1. Configurando Firewall...
netsh advfirewall firewall delete rule name="Next.js App" >nul 2>&1
netsh advfirewall firewall add rule name="Next.js App" dir=in action=allow protocol=TCP localport=3000
if %errorlevel% equ 0 (
    echo ✅ Firewall configurado para porta 3000
) else (
    echo ⚠️ Erro ao configurar firewall - Execute como Administrador
)

echo.
echo 2. Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado! Instale o Node.js 18+ primeiro.
    pause
    exit /b 1
) else (
    echo ✅ Node.js encontrado
    node --version
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
    npm --version
)

echo.
echo 4. Limpando cache e arquivos antigos...
npm cache clean --force >nul 2>&1
if exist node_modules rmdir /s /q node_modules >nul 2>&1
if exist .next rmdir /s /q .next >nul 2>&1
if exist package-lock.json del package-lock.json >nul 2>&1
echo ✅ Cache e arquivos antigos removidos

echo.
echo 5. Instalando dependências com versões fixas...
npm install --legacy-peer-deps --no-audit --no-fund --exact
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
echo 6. Fazendo build...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Erro no build!
    pause
    exit /b 1
)
echo ✅ Build concluído

echo.
echo 7. Testando conexão com banco...
echo Aguarde, testando MySQL...
timeout /t 3 >nul

echo.
echo ========================================
echo           CONFIGURACAO CONCLUIDA
echo ========================================
echo.
echo Para iniciar o servidor:
echo npm run start
echo.
echo Acesso:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4" ^| findstr /v "127.0.0.1"') do set IP=%%a
set IP=%IP: =%
echo - Local: http://localhost:3000
echo - VPS: http://%IP%:3000
echo - Admin: http://%IP%:3000/admin
echo.
echo Credenciais Admin:
echo Usuario: admin
echo Senha: admin123
echo.
echo ⚠️ IMPORTANTE PARA ACESSO PUBLICO:
echo 1. Configure o Security Group da VPS para permitir porta 3000
echo 2. Verifique se o IP %IP% é público
echo 3. Teste: http://SEU_IP_PUBLICO:3000
echo.
echo ⚠️ IMPORTANTE:
echo 1. Certifique-se que o XAMPP/MySQL está rodando
echo 2. Configure seu provedor de VPS para permitir acesso público na porta 3000
echo 3. Se usar firewall externo, libere a porta 3000
echo.
pause