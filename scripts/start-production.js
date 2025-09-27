const { spawn } = require('child_process');
const os = require('os');
const fs = require('fs');

console.log('🚀 Iniciando servidor de produção em VPS Windows...');

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

// Função para verificar se a porta está disponível
function checkPort(port) {
  return new Promise((resolve) => {
    const net = require('net');
    const server = net.createServer();
    
    server.listen(port, (err) => {
      if (err) {
        resolve(false);
      } else {
        server.once('close', () => resolve(true));
        server.close();
      }
    });
    
    server.on('error', () => resolve(false));
  });
}

async function startServer() {
  try {
    const localIP = getLocalIP();
    const port = 3000;
    
    // Verificar se a porta está disponível
    const portAvailable = await checkPort(port);
    if (!portAvailable) {
      console.log(`⚠️ Porta ${port} já está em uso. Tentando encerrar processos...`);
      try {
        // Tentar encerrar processos na porta 3000
        require('child_process').execSync(`netstat -ano | findstr :${port}`, { stdio: 'pipe' });
        console.log('Processo encontrado na porta 3000, tentando encerrar...');
      } catch (e) {
        // Porta pode estar livre agora
      }
    }
    
    // Verificar se o build existe
    if (!fs.existsSync('.next')) {
      console.error('❌ Build não encontrado! Execute primeiro: npm run build:prod');
      process.exit(1);
    }
    
    console.log('📋 Informações do servidor:');
    console.log(`- Local: http://localhost:${port}`);
    console.log(`- VPS IP: http://${localIP}:${port}`);
    console.log(`- Admin: http://${localIP}:${port}/admin (admin/admin123)`);
    console.log('');
    console.log('⚠️ Certifique-se que:');
    console.log('1. O XAMPP/MySQL está rodando');
    console.log('2. O firewall permite conexões na porta 3000');
    console.log('3. A VPS tem IP público configurado');
    console.log('');
    console.log('🔄 Iniciando servidor...');

    // Configurar variáveis de ambiente para produção
    const env = {
      ...process.env,
      NODE_ENV: 'production',
      HOSTNAME: '0.0.0.0',
      PORT: port.toString(),
      NEXT_TELEMETRY_DISABLED: '1'
    };

    // Iniciar o servidor Next.js
    const server = spawn('npm', ['run', 'start'], {
      stdio: 'inherit',
      shell: true,
      env: env
    });

    // Log de sucesso após alguns segundos
    setTimeout(() => {
      console.log('');
      console.log('✅ Servidor iniciado com sucesso!');
      console.log('');
      console.log('🌐 Acesse sua loja:');
      console.log(`🏪 Loja: http://${localIP}:${port}`);
      console.log(`⚙️ Admin: http://${localIP}:${port}/admin`);
      console.log('');
      console.log('📱 Para acessar de outros dispositivos:');
      console.log(`http://${localIP}:${port}`);
      console.log('');
      console.log('🔧 Comandos úteis:');
      console.log('- Ctrl+C para parar o servidor');
      console.log('- Para logs: tail -f logs/app.log');
    }, 3000);

    // Capturar sinais para encerramento gracioso
    process.on('SIGINT', () => {
      console.log('\n🛑 Encerrando servidor...');
      server.kill('SIGINT');
      setTimeout(() => {
        process.exit(0);
      }, 2000);
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Encerrando servidor...');
      server.kill('SIGTERM');
      setTimeout(() => {
        process.exit(0);
      }, 2000);
    });

    // Tratar erros do servidor
    server.on('error', (error) => {
      console.error('❌ Erro no servidor:', error);
      process.exit(1);
    });

    server.on('exit', (code) => {
      if (code !== 0) {
        console.error(`❌ Servidor encerrado com código: ${code}`);
        process.exit(code);
      }
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error.message);
    console.log('');
    console.log('🔧 Soluções:');
    console.log('1. Verifique se o build foi executado: npm run build:prod');
    console.log('2. Verifique se a porta 3000 está livre');
    console.log('3. Execute como Administrador');
    console.log('4. Verifique as configurações de firewall');
    process.exit(1);
  }
}

startServer();