import { NextApiRequest, NextApiResponse } from 'next';
import { migrateProductsFromList } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    console.log('🚀 Iniciando migração manual de produtos...');
    await migrateProductsFromList();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Migração de produtos executada com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro na migração manual:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Erro na migração de produtos',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}