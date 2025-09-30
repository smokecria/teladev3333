import mysql from 'mysql2/promise';

// Configuração de conexão otimizada para VPS Windows
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'pcshop',
  charset: 'utf8mb4',
  timezone: '+00:00',
  multipleStatements: false
};

// Pool de conexões para melhor performance
let pool: mysql.Pool | null = null;

function createPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
}

// Função para obter conexão do pool
export async function getConnection() {
  try {
    const connectionPool = createPool();
    const connection = await connectionPool.getConnection();
    return connection;
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    throw error;
  }
}

// Função para criar o banco de dados se não existir
export async function createDatabaseIfNotExists() {
  let connection;
  try {
    // Conectar sem especificar database
    connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      charset: 'utf8mb4',
      timezone: '+00:00'
    });

    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log('✅ Database criado/verificado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao criar database:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Função que garante que todas as tabelas existem
export async function ensureTablesExist() {
  let connection;
  try {
    connection = await getConnection();

    // Tabela de produtos com índices otimizados
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(36) PRIMARY KEY,
        name TEXT NOT NULL,
        modelo VARCHAR(255) DEFAULT '',
        categoria VARCHAR(255) DEFAULT '',
        fabricante VARCHAR(255) DEFAULT '',
        price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        img TEXT DEFAULT '',
        img2 TEXT DEFAULT '',
        garantia VARCHAR(255) DEFAULT '',
        specs JSON,
        promo BOOLEAN DEFAULT FALSE,
        pathName TEXT,
        tags JSON,
        destaque BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_categoria (categoria),
        INDEX idx_promo (promo),
        INDEX idx_destaque (destaque),
        INDEX idx_price (price),
        INDEX idx_created_at (created_at),
        FULLTEXT idx_search (name, modelo, fabricante)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabela de pedidos
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(36) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_cpf VARCHAR(14) NOT NULL,
        customer_address JSON,
        items JSON NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        payment_method ENUM('credit_card', 'pix') NOT NULL,
        payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
        card_data JSON,
        pix_data JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_payment_status (payment_status),
        INDEX idx_payment_method (payment_method),
        INDEX idx_created_at (created_at),
        INDEX idx_customer_email (customer_email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabela de configurações da loja
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS store_config (
        id INT PRIMARY KEY AUTO_INCREMENT,
        config_key VARCHAR(255) UNIQUE NOT NULL,
        config_value JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_config_key (config_key)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabela de usuários admin
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        last_login TIMESTAMP NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_username (username),
        INDEX idx_is_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabela de clientes
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        cpf VARCHAR(14) UNIQUE,
        phone VARCHAR(20),
        birth_date DATE,
        address JSON,
        is_active BOOLEAN DEFAULT TRUE,
        email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_cpf (cpf),
        INDEX idx_is_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabela de cartões salvos dos clientes
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS customer_cards (
        id INT PRIMARY KEY AUTO_INCREMENT,
        customer_id INT NOT NULL,
        card_name VARCHAR(255) NOT NULL,
        card_number_masked VARCHAR(19) NOT NULL,
        card_brand VARCHAR(50),
        expiry_month INT NOT NULL,
        expiry_year INT NOT NULL,
        is_default BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        INDEX idx_customer_id (customer_id),
        INDEX idx_is_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabela de sessões de clientes
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS customer_sessions (
        id VARCHAR(36) PRIMARY KEY,
        customer_id INT NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_customer_id (customer_id),
        INDEX idx_expires_at (expires_at),
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabela de logs do sistema
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS system_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        action VARCHAR(255) NOT NULL,
        entity_type VARCHAR(100),
        entity_id VARCHAR(36),
        user_id INT,
        details JSON,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_action (action),
        INDEX idx_entity (entity_type, entity_id),
        INDEX idx_created_at (created_at),
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabela de sessões (para controle de login)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id VARCHAR(36) PRIMARY KEY,
        user_id INT NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_expires_at (expires_at),
        FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('✅ Tabelas criadas/verificadas com sucesso');
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Função para migrar produtos do listaItems para o banco
export async function migrateProductsFromList() {
  let connection;
  try {
    connection = await getConnection();
    
    // Verificar se já existem produtos no banco
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM products');
    const count = (rows as any)[0].count;
    
    if (count > 0) {
      console.log('✅ Produtos já existem no banco de dados');
      return;
    }

    // Tentar importar produtos do arquivo listaItems
    let itemsList: any[] = [];
    try {
      // Tentar diferentes caminhos para o arquivo listaItems
      const possiblePaths = [
        '../listaItems/index.tsx',
        './listaItems/index.tsx',
        '../../listaItems/index.tsx',
        '../../../listaItems/index.tsx'
      ];
      
      let listaItemsModule = null;
      
      for (const path of possiblePaths) {
        try {
          const resolvedPath = require.resolve(path);
          delete require.cache[resolvedPath];
          listaItemsModule = require(path);
          console.log(`📦 Arquivo listaItems encontrado em: ${path}`);
          break;
        } catch (e) {
          // Continuar tentando outros caminhos
        }
      }
      
      if (!listaItemsModule) {
        throw new Error('Arquivo listaItems não encontrado em nenhum caminho');
      }
      
      // Verificar diferentes formas de export
      if (listaItemsModule.default && Array.isArray(listaItemsModule.default)) {
        itemsList = listaItemsModule.default;
      } else if (listaItemsModule.listaItems && Array.isArray(listaItemsModule.listaItems)) {
        itemsList = listaItemsModule.listaItems;
      } else if (Array.isArray(listaItemsModule)) {
        itemsList = listaItemsModule;
      } else if (listaItemsModule.items && Array.isArray(listaItemsModule.items)) {
        itemsList = listaItemsModule.items;
      } else {
        // Tentar encontrar qualquer array no módulo
        const keys = Object.keys(listaItemsModule);
        for (const key of keys) {
          if (Array.isArray(listaItemsModule[key])) {
            itemsList = listaItemsModule[key];
            console.log(`📦 Array de produtos encontrado na propriedade: ${key}`);
            break;
          }
        }
        
        if (itemsList.length === 0) {
          throw new Error('Nenhum array de produtos encontrado no arquivo');
        }
      }
      
      if (!Array.isArray(itemsList) || itemsList.length === 0) {
        throw new Error('Lista de produtos vazia ou inválida');
      }
      
      console.log(`📦 Encontrados ${itemsList.length} produtos no listaItems`);
    } catch (error) {
      console.log(`❌ Falha ao carregar listaItems: ${error}. Criando produtos de exemplo...`);
      itemsList = createSampleProducts();
    }
    
    console.log(`🔄 Migrando ${itemsList.length} produtos para o banco de dados...`);
    
    let successCount = 0;
    for (const item of itemsList) {
      try {
        await connection.execute(`
          INSERT INTO products (
            id, name, modelo, categoria, fabricante, price, img, img2, 
            garantia, specs, promo, pathName, tags, destaque
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          item.id || generateId(),
          item.name || 'Produto sem nome',
          item.modelo || '',
          item.categoria || 'geral',
          item.fabricante || '',
          parseFloat(item.pPrazo || item.price || 0),
          item.img || '/images/sample.jpg',
          item.img2 || '/images/sample.jpg',
          item.garantia || '12 meses',
          JSON.stringify(item.specs || []),
          Boolean(item.promo),
          item.pathName || generatePathName(item.name || 'produto'),
          JSON.stringify(item.tags || []),
          Boolean(item.destaque)
        ]);
        successCount++;
      } catch (itemError: any) {
        console.warn(`⚠️ Erro ao migrar produto ${item.name}:`, itemError?.message || 'Erro desconhecido');
      }
    }

    console.log(`✅ ${successCount} produtos migrados com sucesso para o banco de dados`);
  } catch (error) {
    console.error('❌ Erro ao migrar produtos:', error);
    // Não fazer throw aqui para não quebrar a inicialização
    console.log('⚠️ Continuando sem migração de produtos...');
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Função para criar produtos de exemplo se listaItems não existir
function createSampleProducts() {
  return [
    {
      id: 'sample-1',
      name: 'Processador Intel Core i5-12400F',
      modelo: 'i5-12400F',
      categoria: 'processador',
      fabricante: 'Intel',
      pPrazo: 899.99,
      img: '/images/cpu/i5-1.jpg',
      img2: '/images/cpu/i5-2.jpg',
      garantia: '36 meses',
      specs: [{"Especificações": ["6 núcleos", "12 threads", "2.5GHz base"]}],
      promo: false,
      pathName: 'intel-core-i5-12400f',
      tags: ['intel', 'processador', 'gaming'],
      destaque: true
    },
    {
      id: 'sample-2',
      name: 'Placa de Vídeo RTX 3060 Ti',
      modelo: 'RTX 3060 Ti',
      categoria: 'placa-de-video',
      fabricante: 'NVIDIA',
      pPrazo: 2499.99,
      img: '/images/gpu/rtx-2060-1.jpg',
      img2: '/images/gpu/rtx-2060-2.jpg',
      garantia: '24 meses',
      specs: [{"Especificações": ["8GB GDDR6", "Ray Tracing", "DLSS"]}],
      promo: true,
      pathName: 'rtx-3060-ti',
      tags: ['nvidia', 'gpu', 'gaming'],
      destaque: true
    },
    {
      id: 'sample-3',
      name: 'Gabinete Corsair 4000D',
      modelo: '4000D',
      categoria: 'gabinete',
      fabricante: 'Corsair',
      pPrazo: 599.99,
      img: '/images/gabinete/corsair-1.jpg',
      img2: '/images/gabinete/corsair-2.jpg',
      garantia: '12 meses',
      specs: [{"Especificações": ["Mid Tower", "Vidro Temperado", "ATX"]}],
      promo: false,
      pathName: 'corsair-4000d',
      tags: ['corsair', 'gabinete', 'mid-tower'],
      destaque: false
    },
    {
      id: 'sample-4',
      name: 'Memória RAM Corsair 16GB DDR4',
      modelo: 'Vengeance LPX',
      categoria: 'memoria-ram',
      fabricante: 'Corsair',
      pPrazo: 399.99,
      img: '/images/ram/corsair-2400-1.jpg',
      img2: '/images/ram/corsair-2400-2.jpg',
      garantia: '24 meses',
      specs: [{"Especificações": ["16GB", "DDR4", "2400MHz"]}],
      promo: true,
      pathName: 'corsair-vengeance-lpx-16gb',
      tags: ['corsair', 'ram', 'ddr4'],
      destaque: true
    },
    {
      id: 'sample-5',
      name: 'SSD Kingston 500GB',
      modelo: 'A400',
      categoria: 'ssd',
      fabricante: 'Kingston',
      pPrazo: 299.99,
      img: '/images/ssd/kingston-500-1.jpg',
      img2: '/images/ssd/kingston-500-2.jpg',
      garantia: '36 meses',
      specs: [{"Especificações": ["500GB", "SATA III", "500MB/s"]}],
      promo: false,
      pathName: 'kingston-a400-500gb',
      tags: ['kingston', 'ssd', 'storage'],
      destaque: false
    },
    {
      id: 'sample-6',
      name: 'Placa-Mãe ASUS B550M',
      modelo: 'B550M-A',
      categoria: 'placa-mae',
      fabricante: 'ASUS',
      pPrazo: 699.99,
      img: '/images/motherboard/asus-b550m-1.jpg',
      img2: '/images/motherboard/asus-b550m-2.jpg',
      garantia: '24 meses',
      specs: [{"Especificações": ["Socket AM4", "DDR4", "PCIe 4.0"]}],
      promo: false,
      pathName: 'asus-b550m-a',
      tags: ['asus', 'motherboard', 'am4'],
      destaque: true
    },
    {
      id: 'sample-7',
      name: 'Fonte XPG 650W',
      modelo: 'Core Reactor',
      categoria: 'fonte',
      fabricante: 'XPG',
      pPrazo: 499.99,
      img: '/images/fonte/xpg-650-1.jpg',
      img2: '/images/fonte/xpg-650-2.jpg',
      garantia: '60 meses',
      specs: [{"Especificações": ["650W", "80+ Gold", "Modular"]}],
      promo: true,
      pathName: 'xpg-core-reactor-650w',
      tags: ['xpg', 'fonte', 'modular'],
      destaque: false
    }
  ];
}

// Função para gerar ID único
function generateId() {
  return 'prod-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Função para gerar pathName
function generatePathName(name: string) {
  return name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 100);
}

// Função para inserir configurações padrão da loja
export async function insertDefaultStoreConfig() {
  let connection;
  try {
    connection = await getConnection();
    
    // Verificar se já existem configurações
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM store_config');
    const count = (rows as any)[0].count;
    
    if (count > 0) {
      console.log('✅ Configurações da loja já existem');
      return;
    }

    // Inserir configurações padrão
    const defaultConfigs = [
      {
        key: 'store_info',
        value: {
          storeName: 'PC Shop',
          storeAddress: {
            street: 'Rua xxxxxxxxxx',
            number: '100',
            neighborhood: 'Bairro xxxxxxx',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '11111-111'
          },
          workingHours: {
            weekdays: 'Segunda à Sexta-feira de 8:00h às 18h',
            saturday: 'Fechado devido ao Coronavírus (COVID-19)',
            sunday: 'Fechado'
          },
          contact: {
            whatsapp: '',
            email: ''
          }
        }
      },
      {
        key: 'pix_config',
        value: {
          clientId: '',
          clientSecret: '',
          isActive: false
        }
      }
    ];

    for (const config of defaultConfigs) {
      await connection.execute(
        'INSERT INTO store_config (config_key, config_value) VALUES (?, ?)',
        [config.key, JSON.stringify(config.value)]
      );
    }

    console.log('✅ Configurações padrão da loja inseridas com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inserir configurações padrão:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Função para criar usuário admin padrão
export async function createDefaultAdmin() {
  let connection;
  try {
    connection = await getConnection();
    
    // Verificar se já existe um admin
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM admin_users');
    const count = (rows as any)[0].count;
    
    if (count > 0) {
      console.log('✅ Usuário admin já existe');
      return;
    }

    // Criar hash simples para a senha (em produção, use bcrypt)
    const crypto = require('crypto');
    const passwordHash = crypto.createHash('sha256').update('admin123').digest('hex');

    await connection.execute(
      'INSERT INTO admin_users (username, password_hash, email, is_active) VALUES (?, ?, ?, ?)',
      ['admin', passwordHash, 'admin@pcshop.com', true]
    );

    console.log('✅ Usuário admin padrão criado (username: admin, password: admin123)');
  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Função para fechar pool de conexões
export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}