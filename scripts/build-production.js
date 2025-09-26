const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build para produção...');

try {
  // 1. Limpar cache do Next.js
  console.log('🧹 Limpando cache...');
  if (fs.existsSync('.next')) {
    execSync('rm -rf .next', { stdio: 'inherit' });
  }

  // 2. Instalar dependências
  console.log('📦 Instalando dependências...');
  execSync('npm ci', { stdio: 'inherit' });

  // 3. Build do projeto
  console.log('🏗️ Fazendo build do projeto...');
  execSync('npm run build', { stdio: 'inherit' });

  // 4. Verificar se o build foi bem-sucedido
  if (!fs.existsSync('.next')) {
    throw new Error('Build falhou - pasta .next não foi criada');
  }

  console.log('✅ Build concluído com sucesso!');
  console.log('');
  console.log('📋 Próximos passos:');
  console.log('1. Inicie o XAMPP e certifique-se que o MySQL está rodando');
  console.log('2. Execute: npm run start');
  console.log('3. Acesse: http://localhost:3000');
  console.log('4. Para acessar de outros dispositivos na rede: http://SEU_IP:3000');
  console.log('');
  console.log('🔧 Admin Panel:');
  console.log('- URL: http://localhost:3000/admin');
  console.log('- Usuário: admin');
  console.log('- Senha: admin123');

} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
}