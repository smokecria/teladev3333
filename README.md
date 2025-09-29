# PC Shop - E-commerce de Componentes de Computador

## 📋 Descrição do Projeto

Este é um projeto de e-commerce completo para venda de componentes de computador, desenvolvido com Next.js, TypeScript, Redux e MySQL. O sistema inclui um painel administrativo completo para gerenciamento de produtos, pedidos e configurações da loja.

## 🚀 Tecnologias Utilizadas

- **Frontend:** Next.js 13, React 18, TypeScript, Redux Toolkit, SASS
- **Backend:** Next.js API Routes, MySQL
- **Database:** MySQL (XAMPP)
- **Pagamentos:** PIX API, Cartão de Crédito (simulado)
- **Testes:** Cypress
- **UI:** FontAwesome, CSS Modules

## 🛠️ Configuração para VPS Windows

### Pré-requisitos

1. **Windows Server/VPS** com acesso de administrador
2. **Node.js 18+** instalado
3. **XAMPP** com MySQL ativo
4. **Firewall** configurado para porta 3000

### Instalação Automática (Recomendado)

1. **Faça upload dos arquivos** para sua VPS
2. **Execute como Administrador:**
```cmd
scripts\setup-windows-vps.bat
```

### Instalação Manual

1. **Clone ou faça upload do projeto**
```cmd
cd C:\caminho\do\projeto
```

2. **Corrigir dependências (se necessário)**
```cmd
scripts\fix-dependencies.bat
```

3. **Configure o firewall**
```cmd
netsh advfirewall firewall add rule name="Next.js App" dir=in action=allow protocol=TCP localport=3000
```

4. **Instale as dependências**
```cmd
npm install --legacy-peer-deps --no-audit --no-fund --exact
```

5. **Faça o build**
```cmd
npm run build
```

6. **Configure as variáveis de ambiente**
   - Edite o arquivo `.env.local` com suas configurações
   - Para PIX, configure suas credenciais reais

### 🚀 Comandos para Produção

#### Método 1: Scripts Automatizados
```cmd
# Setup completo
scripts\setup-windows-vps.bat

# Iniciar servidor
scripts\start-windows-service.bat
```

#### Método 2: Comandos Manuais
```cmd
# Build
npm run build

# Iniciar (escuta em todas as interfaces)
npm run start
```

### 📱 Acessos

- **Loja:** http://IP_DA_VPS:3000
- **Admin:** http://IP_DA_VPS:3000/admin
  - Usuário: `admin`
  - Senha: `admin123`

### 🌐 Configuração de Rede para VPS

Para acessar de qualquer lugar:

1. **Firewall do Windows:**
```cmd
netsh advfirewall firewall add rule name="Next.js App" dir=in action=allow protocol=TCP localport=3000
```

2. **Provedor de VPS (AWS, Azure, Google Cloud, etc.):**
   - **AWS:** EC2 → Security Groups → Inbound Rules → Add Rule (TCP, Port 3000, Source: 0.0.0.0/0)
   - **Azure:** Network Security Group → Inbound security rules → Add (TCP, Port 3000, Source: Any)
   - **Google Cloud:** VPC Firewall → Create Rule (TCP, Port 3000, Source: 0.0.0.0/0)

3. **Verificar IP Público:**
   - Certifique-se que sua VPS tem IP público
   - Teste o acesso: `http://SEU_IP_PUBLICO:3000`

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
- ✅ Pool de conexões para performance
- ✅ Logs do sistema

## 🔧 Estrutura do Banco de Dados

O sistema cria automaticamente as seguintes tabelas:

- `products` - Produtos da loja
- `orders` - Pedidos dos clientes
- `store_config` - Configurações da loja
- `admin_users` - Usuários administrativos
- `system_logs` - Logs do sistema
- `user_sessions` - Sessões de usuário

## 📊 Monitoramento e Logs

O sistema registra automaticamente:
- Criação/edição/exclusão de produtos
- Novos pedidos e mudanças de status
- Alterações nas configurações
- Erros e exceções
- Sessões de usuário

## 🔒 Segurança

- Validação de dados no frontend e backend
- Sanitização de inputs
- Proteção contra SQL Injection
- Hash de senhas administrativas
- Logs de auditoria
- Headers de segurança
- Pool de conexões seguro

## 🚀 Deploy em VPS Windows

### Configuração Automática
1. **Execute o setup:**
```cmd
scripts\setup-windows-vps.bat
```

2. **Inicie o servidor:**
```cmd
scripts\start-windows-service.bat
```

### Configuração Manual
1. **Instalar Node.js 18+**
2. **Instalar XAMPP e ativar MySQL**
3. **Configurar firewall:**
```cmd
netsh advfirewall firewall add rule name="Next.js App" dir=in action=allow protocol=TCP localport=3000
```
4. **Fazer upload dos arquivos**
5. **Executar build:**
```cmd
npm install --legacy-peer-deps --exact
npm run build
```
6. **Iniciar servidor:**
```cmd
npm run start
```

### ⚠️ IMPORTANTE para Acesso Público

Para que sua loja seja acessível publicamente:

1. **Configure o Security Group da VPS:**
   - **AWS:** EC2 → Security Groups → Inbound Rules → Add Rule (TCP, Port 3000, Source: 0.0.0.0/0)
   - **Azure:** Network Security Group → Inbound security rules → Add (TCP, Port 3000, Source: Any)
   - **Google Cloud:** VPC Firewall → Create Rule (TCP, Port 3000, Source: 0.0.0.0/0)

2. **Verifique o IP Público:**
```cmd
curl ifconfig.me
```

3. **Teste o acesso:**
```
http://SEU_IP_PUBLICO:3000
```

## 🐛 Solução de Problemas

### Erro de Dependências
```cmd
# Usar script de correção
scripts\fix-dependencies.bat

# Ou manualmente:
npm cache clean --force
rmdir /s /q node_modules
del package-lock.json
npm install --legacy-peer-deps --force
```

### Erro de Conexão com Banco
1. Verifique se o XAMPP/MySQL está rodando
2. Confirme as credenciais no `.env.local`
3. Teste a conexão: acesse `/api/init-database`

### Site não acessível externamente
1. **Verifique o firewall do Windows**
2. **Configure o Security Group da VPS**
3. **Confirme que o servidor está escutando em 0.0.0.0:3000**
4. **Teste com o IP público da VPS**

### Erro de Build
```cmd
# Limpar cache do Next.js
rmdir /s /q .next

# Rebuild
npm run build
```

### Erro de Migração de Produtos
1. Verifique se o arquivo `listaItems/index.tsx` existe
2. Confirme que exporta um array de produtos
3. Execute manualmente: `POST /api/init-database`

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs no console
2. Consulte a documentação das APIs
3. Execute os scripts de diagnóstico
4. Verifique as configurações de firewall e Security Group

## 📄 Licença

Este projeto é para fins educacionais e demonstrativos.

---

**Desenvolvido com ❤️ para demonstrar um e-commerce completo em Next.js otimizado para VPS Windows**