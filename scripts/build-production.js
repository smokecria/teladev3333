const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🚀 Iniciando build para produção em VPS Windows...');

// Função para obter o IP da máquina
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  return 'localhost';
}

try {
  const localIP = getLocalIP();
  
  // 1. Verificar Node.js e npm
  console.log('🔍 Verificando versões...');
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`Node.js: ${nodeVersion}`);
    console.log(`npm: ${npmVersion}`);
  } catch (error) {
    console.error('❌ Erro ao verificar versões:', error.message);
    throw error;
  }

  // 2. Limpar cache e arquivos antigos
  console.log('🧹 Limpando cache e arquivos antigos...');
  try {
    if (fs.existsSync('.next')) {
      execSync('rmdir /s /q .next', { stdio: 'inherit', shell: true });
    }
    if (fs.existsSync('node_modules')) {
      console.log('Removendo node_modules antigo...');
      execSync('rmdir /s /q node_modules', { stdio: 'inherit', shell: true });
    }
    // Limpar cache do npm
    execSync('npm cache clean --force', { stdio: 'inherit' });
  } catch (error) {
    console.warn('⚠️ Aviso ao limpar cache:', error.message);
  }

  // 3. Instalar dependências com flags de compatibilidade
  console.log('📦 Instalando dependências...');
  try {
    execSync('npm install --legacy-peer-deps --no-audit --no-fund', { 
      stdio: 'inherit',
      timeout: 300000 // 5 minutos timeout
    });
  } catch (error) {
    console.log('Tentando instalação alternativa...');
    execSync('npm install --force --no-audit --no-fund', { 
      stdio: 'inherit',
      timeout: 300000
    });
  }

  // 4. Verificar se as dependências foram instaladas
  if (!fs.existsSync('node_modules')) {
    throw new Error('Falha na instalação das dependências');
  }

  // 5. Build do projeto
  console.log('🏗️ Fazendo build do projeto...');
  execSync('npm run build', { 
    stdio: 'inherit',
    env: { 
      ...process.env, 
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1'
    }
  });

  // 6. Verificar se o build foi bem-sucedido
  if (!fs.existsSync('.next')) {
    throw new Error('Build falhou - pasta .next não foi criada');
  }

  // 7. Criar arquivo de configuração para Windows
  const windowsConfig = {
    host: '0.0.0.0',
    port: 3000,
    localIP: localIP,
    buildTime: new Date().toISOString()
  };
  
  fs.writeFileSync('windows-config.json', JSON.stringify(windowsConfig, null, 2));

  console.log('✅ Build concluído com sucesso!');
  console.log('');
  console.log('🌐 Informações de Acesso:');
  console.log(`- Local: http://localhost:3000`);
  console.log(`- VPS IP: http://${localIP}:3000`);
  console.log(`- Admin: http://${localIP}:3000/admin`);
  console.log('');
  console.log('📋 Próximos passos:');
  console.log('1. Inicie o XAMPP e certifique-se que o MySQL está rodando');
  console.log('2. Configure o firewall do Windows para permitir porta 3000');
  console.log('3. Execute: npm run start:prod');
  console.log('');
  console.log('🔧 Configurações de Firewall (execute como Administrador):');
  console.log('netsh advfirewall firewall add rule name="Next.js App" dir=in action=allow protocol=TCP localport=3000');
  console.log('');
  console.log('🔑 Admin Panel:');
  console.log('- Usuário: admin');
  console.log('- Senha: admin123');

} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  console.log('');
  console.log('🔧 Soluções possíveis:');
  console.log('1. Execute como Administrador');
  console.log('2. Verifique se o Node.js está atualizado');
  console.log('3. Limpe o cache: npm cache clean --force');
  console.log('4. Delete node_modules e package-lock.json manualmente');
  process.exit(1);
}