@echo off
echo ========================================
echo    CORRIGINDO DEPENDENCIAS - PC SHOP
echo ========================================
echo.

echo 1. Limpando cache npm...
npm cache clean --force
echo ✅ Cache limpo

echo.
echo 2. Removendo arquivos antigos...
if exist node_modules (
    echo Removendo node_modules...
    rmdir /s /q node_modules
)
if exist package-lock.json (
    echo Removendo package-lock.json...
    del package-lock.json
)
if exist .next (
    echo Removendo .next...
    rmdir /s /q .next
)
echo ✅ Arquivos antigos removidos

echo.
echo 3. Instalando dependências com versões compatíveis...
npm install --legacy-peer-deps --no-audit --no-fund --exact
if %errorlevel% neq 0 (
    echo ❌ Erro na instalação! Tentando com --force...
    npm install --force --no-audit --no-fund
    if %errorlevel% neq 0 (
        echo ❌ Falha crítica na instalação!
        echo.
        echo Tente manualmente:
        echo 1. npm cache clean --force
        echo 2. rmdir /s /q node_modules
        echo 3. del package-lock.json
        echo 4. npm install --legacy-peer-deps --force
        pause
        exit /b 1
    )
)

echo.
echo ✅ Dependências instaladas com sucesso!
echo.
echo Próximo passo: npm run build
pause