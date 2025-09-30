import { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '../../lib/db';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    console.log('🚀 Iniciando migração manual de produtos...');
    
    const connection = await getConnection();
    
    // Verificar se já existem produtos
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM products');
    const count = (rows as any)[0].count;
    
    if (count > 0) {
      connection.release();
      return res.status(200).json({ 
        success: true, 
        message: 'Produtos já existem no banco de dados',
        count: count
      });
    }

    // Carregar produtos do JSON
    let itemsList: any[] = [];
    try {
      const fs = require('fs');
      const path = require('path');
      
      const jsonPath = path.join(process.cwd(), 'listaItems', 'products.json');
      
      if (fs.existsSync(jsonPath)) {
        const jsonData = fs.readFileSync(jsonPath, 'utf8');
        itemsList = JSON.parse(jsonData);
        console.log(`📦 Carregados ${itemsList.length} produtos do arquivo JSON`);
      } else {
        console.log('📦 Arquivo JSON não encontrado, criando produtos de exemplo...');
        itemsList = createSampleProducts();
      }
    } catch (error) {
      console.log(`❌ Erro ao carregar produtos: ${error}. Usando produtos de exemplo...`);
      itemsList = createSampleProducts();
    }
    
    console.log(`🔄 Migrando ${itemsList.length} produtos para o banco de dados...`);
    
    let successCount = 0;
    for (const item of itemsList) {
      try {
        const id = item.id || uuidv4();
        const pathName = item.pathName || generatePathName(item.name || 'produto');
        
        await connection.execute(`
          INSERT INTO products (
            id, name, modelo, categoria, fabricante, price, img, img2, 
            garantia, specs, promo, pathName, tags, destaque
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          id,
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
          pathName,
          JSON.stringify(item.tags || []),
          Boolean(item.destaque)
        ]);
        successCount++;
      } catch (itemError: any) {
        console.warn(`⚠️ Erro ao migrar produto ${item.name}:`, itemError?.message || 'Erro desconhecido');
      }
    }

    connection.release();
    
    return res.status(200).json({ 
      success: true, 
      message: `${successCount} produtos migrados com sucesso`,
      migrated: successCount,
      total: itemsList.length
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
      img: '/images/gpu/rtx-3060ti-1.jpg',
      img2: '/images/gpu/rtx-3060ti-2.jpg',
      garantia: '24 meses',
      specs: [{"Especificações": ["8GB GDDR6", "Ray Tracing", "DLSS"]}],
      promo: true,
      pathName: 'rtx-3060-ti',
      tags: ['nvidia', 'gpu', 'gaming'],
      destaque: true
    }
  ];
}

function generatePathName(name: string) {
  return name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 100);
}