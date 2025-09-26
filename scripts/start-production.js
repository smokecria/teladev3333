const { execSync, spawn } = require('child_process');
const os = require('os');

console.log('🚀 Iniciando servidor de produção...');

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
  
  console.log('📋 Informações do servidor:');
  console.log(`- Local: http://localhost:3000`);
  console.log(`- Rede: http://${localIP}:3000`);
  console.log(`- Admin: http://localhost:3000/admin (admin/admin123)`);
  console.log('');
  console.log('⚠️  Certifique-se que o XAMPP/MySQL está rodando!');
  console.log('');
  console.log('🔄 Iniciando servidor...');

  // Iniciar o servidor Next.js
  const server = spawn('npm', ['run', 'start'], {
    stdio: 'inherit',
    shell: true
  });

  // Capturar sinais para encerramento gracioso
  process.on('SIGINT', () => {
    console.log('\n🛑 Encerrando servidor...');
    server.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Encerrando servidor...');
    server.kill('SIGTERM');
    process.exit(0);
  });

} catch (error) {
  console.error('❌ Erro ao iniciar servidor:', error.message);
  process.exit(1);
}