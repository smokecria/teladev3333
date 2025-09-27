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

2. **Configure o firewall**
```cmd
netsh advfirewall firewall add rule name="Next.js App" dir=in action=allow protocol=TCP localport=3000
```

3. **Instale as dependências**
```cmd
npm install --legacy-peer-deps --no-audit --no-fund
```

4. **Faça o build**
```cmd
npm run build
```

5. **Configure as variáveis de ambiente**
   - Edite o arquivo `.env.local` com suas configurações
   - Para PIX, configure suas credenciais reais

### 🚀 Comandos para Produção

#### Método 1: Scripts Automatizados
```cmd
# Build para produção
npm run build:prod

# Iniciar servidor
npm run start:prod
```

#### Método 2: Arquivos .bat (Windows)
```cmd
# Setup completo
scripts\setup-windows-vps.bat

# Iniciar servidor
scripts\start-windows-service.bat
```

#### Método 3: Comandos Manuais
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

### 🌐 Configuração de Rede

Para acessar de qualquer lugar:
1. Configure o firewall da VPS para permitir porta 3000
2. Se usar provedor de nuvem (AWS, Azure, etc.), configure o Security Group
3. O servidor já está configurado para escutar em `0.0.0.0:3000`

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
npm install --legacy-peer-deps
npm run build
```
6. **Iniciar servidor:**
```cmd
npm run start
```

### Configuração de Proxy Reverso (IIS - Opcional)
```xml
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="ReverseProxyInboundRule1" stopProcessing="true">
          <match url="(.*)" />
          <action type="Rewrite" url="http://localhost:3000/{R:1}" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

## 🐛 Solução de Problemas

### Erro de Dependências
```cmd
# Limpar cache
npm cache clean --force

# Remover node_modules
rmdir /s /q node_modules

# Reinstalar
npm install --legacy-peer-deps --force
```

### Erro de Conexão com Banco
1. Verifique se o XAMPP/MySQL está rodando
2. Confirme as credenciais no `.env.local`
3. Teste a conexão: acesse `/api/init-database`

### Erro de Firewall
```cmd
# Verificar regras
netsh advfirewall firewall show rule name="Next.js App"

# Recriar regra
netsh advfirewall firewall delete rule name="Next.js App"
netsh advfirewall firewall add rule name="Next.js App" dir=in action=allow protocol=TCP localport=3000
```

### Erro de Build
```cmd
# Limpar cache do Next.js
rmdir /s /q .next

# Rebuild
npm run build
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs no console
2. Consulte a documentação das APIs
3. Execute os scripts de diagnóstico
4. Verifique as configurações de firewall

## 📄 Licença

Este projeto é para fins educacionais e demonstrativos.

---

**Desenvolvido com ❤️ para demonstrar um e-commerce completo em Next.js otimizado para VPS Windows**