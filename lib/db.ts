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
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
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
      queueLimit: 0,
      acquireTimeout: 60000,
      timeout: 60000
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

    // Importar produtos do arquivo listaItems
    let itemsList;
    try {
      itemsList = require('../listaItems').default;
    } catch (error) {
      console.log('⚠️ Arquivo listaItems não encontrado, criando produtos de exemplo...');
      itemsList = createSampleProducts();
    }
    
    console.log(`🔄 Migrando ${itemsList.length} produtos para o banco de dados...`);
    
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
          item.pPrazo || item.price || 0,
          item.img || '/images/sample.jpg',
          item.img2 || '/images/sample.jpg',
          item.garantia || '12 meses',
          JSON.stringify(item.specs || []),
          item.promo || false,
          item.pathName || generatePathName(item.name || 'produto'),
          JSON.stringify(item.tags || []),
          item.destaque || false
        ]);
      } catch (itemError) {
        console.warn(`⚠️ Erro ao migrar produto ${item.name}:`, itemError.message);
      }
    }

    console.log(`✅ ${itemsList.length} produtos migrados com sucesso para o banco de dados`);
  } catch (error) {
    console.error('❌ Erro ao migrar produtos:', error);
    throw error;
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
      img: '/images/sample.jpg',
      img2: '/images/sample.jpg',
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
      img: '/images/sample.jpg',
      img2: '/images/sample.jpg',
      garantia: '24 meses',
      specs: [{"Especificações": ["8GB GDDR6", "Ray Tracing", "DLSS"]}],
      promo: true,
      pathName: 'rtx-3060-ti',
      tags: ['nvidia', 'gpu', 'gaming'],
      destaque: true
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