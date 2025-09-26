import { NextApiRequest, NextApiResponse } from 'next';
import { createDatabaseIfNotExists, ensureTablesExist, migrateProductsFromList } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    console.log('🚀 Iniciando configuração do banco de dados...');
    
    // 1. Criar database se não existir
    await createDatabaseIfNotExists();
    
    // 2. Criar tabelas se não existirem
    await ensureTablesExist();
    
    // 3. Migrar produtos do listaItems se necessário
    await migrateProductsFromList();
    
    console.log('✅ Banco de dados configurado com sucesso!');
    
    return res.status(200).json({ 
      success: true, 
      message: 'Banco de dados inicializado com sucesso' 
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