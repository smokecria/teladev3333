import mysql from 'mysql2/promise';

// Função para obter a conexão com o banco de dados
export async function getConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'pcshop',
    });
    return connection;
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    throw error;
  }
}

// Função para criar o banco de dados se não existir
export async function createDatabaseIfNotExists() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE || 'pcshop'} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.end();
    console.log('✅ Database criado/verificado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao criar database:', error);
    throw error;
  }
}

// Função que garante que todas as tabelas existem
export async function ensureTablesExist() {
  try {
    const connection = await getConnection();

    // Tabela de produtos
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(36) PRIMARY KEY,
        name TEXT NOT NULL,
        modelo VARCHAR(255),
        categoria VARCHAR(255),
        fabricante VARCHAR(255),
        price DECIMAL(10, 2) NOT NULL,
        img TEXT,
        img2 TEXT,
        garantia VARCHAR(255),
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
        INDEX idx_pathName (pathName(255))
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
        INDEX idx_created_at (created_at)
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_username (username)
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_action (action),
        INDEX idx_entity (entity_type, entity_id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.end();
    console.log('✅ Tabelas criadas/verificadas com sucesso');
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
    throw error;
  }
}

// Função para migrar produtos do listaItems para o banco
export async function migrateProductsFromList() {
  try {
    const connection = await getConnection();
    
    // Verificar se já existem produtos no banco
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM products');
    const count = (rows as any)[0].count;
    
    if (count > 0) {
      console.log('✅ Produtos já existem no banco de dados');
      await connection.end();
      return;
    }

    // Importar produtos do arquivo listaItems
    const itemsList = require('../listaItems').default;
    
    console.log(`🔄 Migrando ${itemsList.length} produtos para o banco de dados...`);
    
    for (const item of itemsList) {
      await connection.execute(`
        INSERT INTO products (
          id, name, modelo, categoria, fabricante, price, img, img2, 
          garantia, specs, promo, pathName, tags, destaque
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        item.id,
        item.name,
        item.modelo,
        item.categoria,
        item.fabricante,
        item.pPrazo,
        item.img,
        item.img2,
        item.garantia,
        JSON.stringify(item.specs || []),
        item.promo || false,
        item.pathName,
        JSON.stringify(item.tags || []),
        item.destaque || false
      ]);
    }

    await connection.end();
    console.log(`✅ ${itemsList.length} produtos migrados com sucesso para o banco de dados`);
  } catch (error) {
    console.error('❌ Erro ao migrar produtos:', error);
    throw error;
  }
}

// Função para inserir configurações padrão da loja
export async function insertDefaultStoreConfig() {
  try {
    const connection = await getConnection();
    
    // Verificar se já existem configurações
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM store_config');
    const count = (rows as any)[0].count;
    
    if (count > 0) {
      console.log('✅ Configurações da loja já existem');
      await connection.end();
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

    await connection.end();
    console.log('✅ Configurações padrão da loja inseridas com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inserir configurações padrão:', error);
    throw error;
  }
}

// Função para criar usuário admin padrão
export async function createDefaultAdmin() {
  try {
    const connection = await getConnection();
    
    // Verificar se já existe um admin
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM admin_users');
    const count = (rows as any)[0].count;
    
    if (count > 0) {
      console.log('✅ Usuário admin já existe');
      await connection.end();
      return;
    }

    // Criar hash simples para a senha (em produção, use bcrypt)
    const crypto = require('crypto');
    const passwordHash = crypto.createHash('sha256').update('admin123').digest('hex');

    await connection.execute(
      'INSERT INTO admin_users (username, password_hash, email) VALUES (?, ?, ?)',
      ['admin', passwordHash, 'admin@pcshop.com']
    );

    await connection.end();
    console.log('✅ Usuário admin padrão criado (username: admin, password: admin123)');
  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error);
    throw error;
  }
}