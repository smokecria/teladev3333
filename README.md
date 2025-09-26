# PC Shop - E-commerce de Componentes de Computador

## 📋 Descrição do Projeto

Este é um projeto de e-commerce completo para venda de componentes de computador, desenvolvido com Next.js, TypeScript, Redux e MySQL. O sistema inclui um painel administrativo completo para gerenciamento de produtos, pedidos e configurações da loja.

## 🚀 Tecnologias Utilizadas

- **Frontend:** Next.js, React, TypeScript, Redux Toolkit, SASS
- **Backend:** Next.js API Routes, MySQL
- **Database:** MySQL (XAMPP)
- **Pagamentos:** PIX API, Cartão de Crédito (simulado)
- **Testes:** Cypress
- **UI:** FontAwesome, CSS Modules

## 🛠️ Configuração para Produção

### Pré-requisitos

1. **Node.js** (versão 16 ou superior)
2. **XAMPP** com MySQL ativo
3. **Git** (opcional)

### Instalação e Configuração

1. **Clone ou baixe o projeto**
```bash
git clone <url-do-repositorio>
cd pcshop
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
   - Inicie o XAMPP
   - Ative o serviço MySQL
   - O banco será criado automaticamente na primeira execução

4. **Configure as variáveis de ambiente**
   - O arquivo `.env.local` já está configurado para XAMPP padrão
   - Para PIX, configure suas credenciais reais:
   ```env
   PIX_CLIENT_ID=sua_credencial_aqui
   PIX_CLIENT_SECRET=sua_credencial_secreta_aqui
   ```

### 🚀 Comandos para Produção

#### Build para Produção
```bash
npm run build:prod
```

#### Iniciar Servidor de Produção
```bash
npm run start:prod
```

#### Comando Manual (alternativo)
```bash
npm run build
npm run start
```

### 📱 Acessos

- **Loja:** http://localhost:3000
- **Admin:** http://localhost:3000/admin
  - Usuário: `admin`
  - Senha: `admin123`

### 🌐 Acesso pela Rede Local

Para acessar de outros dispositivos na mesma rede:
```
http://SEU_IP_LOCAL:3000
```

Para descobrir seu IP:
- Windows: `ipconfig`
- Linux/Mac: `ifconfig`

## 🎯 Funcionalidades

### Loja Online
- ✅ Catálogo de produtos por categoria
- ✅ Sistema de busca e filtros
- ✅ Carrinho de compras
- ✅ Checkout completo
- ✅ Pagamento via PIX e Cartão
- ✅ Cálculo de frete por CEP
- ✅ Design responsivo

### Painel Administrativo
- ✅ Gerenciamento completo de produtos
- ✅ Visualização e controle de pedidos
- ✅ Configurações da loja
- ✅ Configuração do gateway PIX
- ✅ Dashboard com estatísticas

### Banco de Dados
- ✅ Migração automática dos produtos existentes
- ✅ Tabelas otimizadas com índices
- ✅ Backup automático das configurações
- ✅ Logs do sistema

## 🔧 Estrutura do Banco de Dados

O sistema cria automaticamente as seguintes tabelas:

- `products` - Produtos da loja
- `orders` - Pedidos dos clientes
- `store_config` - Configurações da loja
- `admin_users` - Usuários administrativos
- `system_logs` - Logs do sistema

## 📊 Monitoramento e Logs

O sistema registra automaticamente:
- Criação/edição/exclusão de produtos
- Novos pedidos e mudanças de status
- Alterações nas configurações
- Erros e exceções

## 🔒 Segurança

- Validação de dados no frontend e backend
- Sanitização de inputs
- Proteção contra SQL Injection
- Hash de senhas administrativas
- Logs de auditoria

## 🚀 Deploy em Produção

### VPS/Servidor Dedicado

1. **Instalar Node.js e MySQL**
2. **Clonar o projeto**
3. **Configurar variáveis de ambiente**
4. **Executar build**
```bash
npm run build:prod
```
5. **Iniciar com PM2**
```bash
npm install -g pm2
pm2 start npm --name "pcshop" -- run start
pm2 startup
pm2 save
```

### Configuração de Proxy (Nginx)
```nginx
server {
    listen 80;
    server_name seudominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🐛 Solução de Problemas

### Erro de Conexão com Banco
1. Verifique se o XAMPP/MySQL está rodando
2. Confirme as credenciais no `.env.local`
3. Teste a conexão: `npm run db:init`

### Produtos não aparecem
1. Acesse `/api/init-database` para migrar produtos
2. Verifique logs no console do navegador
3. Confirme se o banco foi criado corretamente

### Erro de Build
1. Limpe o cache: `rm -rf .next`
2. Reinstale dependências: `npm ci`
3. Execute build novamente: `npm run build`

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs no console
2. Consulte a documentação das APIs
3. Teste em ambiente de desenvolvimento primeiro

## 📄 Licença

Este projeto é para fins educacionais e demonstrativos.

---

**Desenvolvido com ❤️ para demonstrar um e-commerce completo em Next.js**