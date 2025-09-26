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

    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE || 'pcshop'}`);
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Tabela de configurações da loja
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS store_config (
        id INT PRIMARY KEY AUTO_INCREMENT,
        config_key VARCHAR(255) UNIQUE NOT NULL,
        config_value JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
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