import { NextApiRequest, NextApiResponse } from 'next';
import { 
  createDatabaseIfNotExists, 
  ensureTablesExist, 
  migrateProductsFromList,
  insertDefaultStoreConfig,
  createDefaultAdmin
} from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    console.log('🚀 Iniciando configuração completa do banco de dados...');
    
    // 1. Criar database se não existir
    console.log('📊 Criando/verificando database...');
    await createDatabaseIfNotExists();
    
    // 2. Criar tabelas se não existirem
    console.log('🏗️ Criando/verificando tabelas...');
    await ensureTablesExist();
    
    // 3. Migrar produtos do listaItems se necessário
    console.log('📦 Migrando produtos do listaItems...');
    await migrateProductsFromList();
    
    // 4. Inserir configurações padrão da loja
    console.log('⚙️ Inserindo configurações padrão...');
    await insertDefaultStoreConfig();
    
    // 5. Criar usuário admin padrão
    console.log('👤 Criando usuário admin padrão...');
    await createDefaultAdmin();
    
    console.log('✅ Banco de dados configurado completamente com sucesso!');
    
    return res.status(200).json({ 
      success: true, 
      message: 'Banco de dados inicializado com sucesso',
      details: {
        database: 'Criado/verificado',
        tables: 'Criadas/verificadas',
        products: 'Migrados do listaItems',
        storeConfig: 'Configurações padrão inseridas',
        adminUser: 'Usuário admin criado (admin/admin123)'
      }
    });
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Erro ao inicializar banco de dados',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}