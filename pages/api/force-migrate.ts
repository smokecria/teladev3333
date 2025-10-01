import { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '../../lib/db';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('🚀 MIGRAÇÃO FORÇADA DE PRODUTOS INICIADA...');
    
    const connection = await getConnection();
    const { clearExisting } = req.query;
    
    // Se solicitado, limpar produtos existentes
    if (clearExisting === 'true') {
      await connection.execute('DELETE FROM products');
      console.log('🗑️ Produtos existentes removidos');
    }
    
    // Verificar quantos produtos existem
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM products');
    const count = (rows as any)[0].count;
    
    console.log(`📊 Produtos existentes no banco: ${count}`);
    
    // PRODUTOS COMPLETOS DA SUA LOJA
    const produtosCompletos = [
      {
        id: 'cpu-intel-i5-12400f',
        name: 'Processador Intel Core i5-12400F 2.5GHz (4.4GHz Turbo), 6-Cores 12-Threads, LGA 1700',
        modelo: 'i5-12400F',
        categoria: 'processador',
        fabricante: 'Intel',
        price: 899.99,
        img: '/images/cpu/i5-1.jpg',
        img2: '/images/cpu/i5-2.jpg',
        garantia: '36 meses',
        specs: [{"Especificações": ["6 núcleos", "12 threads", "2.5GHz base", "4.4GHz turbo", "LGA 1700"]}],
        promo: false,
        pathName: 'intel-core-i5-12400f',
        tags: ['intel', 'processador', 'gaming', 'lga1700'],
        destaque: true
      },
      {
        id: 'cpu-intel-i7-12700f',
        name: 'Processador Intel Core i7-12700F 2.1GHz (4.9GHz Turbo), 12-Cores 20-Threads, LGA 1700',
        modelo: 'i7-12700F',
        categoria: 'processador',
        fabricante: 'Intel',
        price: 1599.99,
        img: '/images/cpu/i7-1.jpg',
        img2: '/images/cpu/i7-2.jpg',
        garantia: '36 meses',
        specs: [{"Especificações": ["12 núcleos", "20 threads", "2.1GHz base", "4.9GHz turbo", "LGA 1700"]}],
        promo: true,
        pathName: 'intel-core-i7-12700f',
        tags: ['intel', 'processador', 'gaming', 'lga1700'],
        destaque: true
      },
      {
        id: 'cpu-intel-i9-12900f',
        name: 'Processador Intel Core i9-12900F 2.4GHz (5.1GHz Turbo), 16-Cores 24-Threads, LGA 1700',
        modelo: 'i9-12900F',
        categoria: 'processador',
        fabricante: 'Intel',
        price: 2299.99,
        img: '/images/cpu/i9-1.jpg',
        img2: '/images/cpu/i9-2.jpg',
        garantia: '36 meses',
        specs: [{"Especificações": ["16 núcleos", "24 threads", "2.4GHz base", "5.1GHz turbo", "LGA 1700"]}],
        promo: false,
        pathName: 'intel-core-i9-12900f',
        tags: ['intel', 'processador', 'gaming', 'lga1700'],
        destaque: true
      },
      {
        id: 'cpu-amd-r5-5600x',
        name: 'Processador AMD Ryzen 5 5600X 3.7GHz (4.6GHz Turbo), 6-Cores 12-Threads, AM4',
        modelo: 'Ryzen 5 5600X',
        categoria: 'processador',
        fabricante: 'AMD',
        price: 799.99,
        img: '/images/cpu/r5-1.jpg',
        img2: '/images/cpu/r-2.jpg',
        garantia: '36 meses',
        specs: [{"Especificações": ["6 núcleos", "12 threads", "3.7GHz base", "4.6GHz turbo", "AM4"]}],
        promo: true,
        pathName: 'amd-ryzen-5-5600x',
        tags: ['amd', 'processador', 'gaming', 'am4'],
        destaque: false
      },
      {
        id: 'cpu-amd-r7-5700x',
        name: 'Processador AMD Ryzen 7 5700X 3.4GHz (4.6GHz Turbo), 8-Cores 16-Threads, AM4',
        modelo: 'Ryzen 7 5700X',
        categoria: 'processador',
        fabricante: 'AMD',
        price: 1199.99,
        img: '/images/cpu/r7-1.jpg',
        img2: '/images/cpu/r-2.jpg',
        garantia: '36 meses',
        specs: [{"Especificações": ["8 núcleos", "16 threads", "3.4GHz base", "4.6GHz turbo", "AM4"]}],
        promo: false,
        pathName: 'amd-ryzen-7-5700x',
        tags: ['amd', 'processador', 'gaming', 'am4'],
        destaque: true
      },
      {
        id: 'gpu-rtx-3060ti',
        name: 'Placa de Vídeo RTX 3060 Ti 8GB GDDR6 256-bit',
        modelo: 'RTX 3060 Ti',
        categoria: 'placa-de-video',
        fabricante: 'NVIDIA',
        price: 2499.99,
        img: '/images/gpu/rtx-3060ti-1.jpg',
        img2: '/images/gpu/rtx-3060ti-2.jpg',
        garantia: '24 meses',
        specs: [{"Especificações": ["8GB GDDR6", "256-bit", "Ray Tracing", "DLSS"]}],
        promo: true,
        pathName: 'rtx-3060-ti-8gb',
        tags: ['nvidia', 'gpu', 'gaming', 'ray-tracing'],
        destaque: true
      },
      {
        id: 'gpu-rtx-3050',
        name: 'Placa de Vídeo RTX 3050 8GB GDDR6 128-bit',
        modelo: 'RTX 3050',
        categoria: 'placa-de-video',
        fabricante: 'NVIDIA',
        price: 1899.99,
        img: '/images/gpu/rtx-3050-1.jpg',
        img2: '/images/gpu/rtx-3050-2.jpg',
        garantia: '24 meses',
        specs: [{"Especificações": ["8GB GDDR6", "128-bit", "Ray Tracing", "DLSS"]}],
        promo: false,
        pathName: 'rtx-3050-8gb',
        tags: ['nvidia', 'gpu', 'gaming'],
        destaque: false
      },
      {
        id: 'gpu-rx-6600xt',
        name: 'Placa de Vídeo RX 6600 XT 8GB GDDR6 128-bit',
        modelo: 'RX 6600 XT',
        categoria: 'placa-de-video',
        fabricante: 'AMD',
        price: 2199.99,
        img: '/images/gpu/rx-6600xt-1.jpg',
        img2: '/images/gpu/rx-6600xt-2.jpg',
        garantia: '24 meses',
        specs: [{"Especificações": ["8GB GDDR6", "128-bit", "RDNA 2", "Ray Tracing"]}],
        promo: true,
        pathName: 'rx-6600-xt-8gb',
        tags: ['amd', 'gpu', 'gaming', 'rdna2'],
        destaque: false
      },
      {
        id: 'mb-asus-b550m',
        name: 'Placa-Mãe ASUS PRIME B550M-A WiFi, AMD AM4, mATX, DDR4',
        modelo: 'B550M-A WiFi',
        categoria: 'placa-mae',
        fabricante: 'ASUS',
        price: 699.99,
        img: '/images/motherboard/asus-b550m-1.jpg',
        img2: '/images/motherboard/asus-b550m-2.jpg',
        garantia: '24 meses',
        specs: [{"Especificações": ["Socket AM4", "DDR4", "PCIe 4.0", "WiFi 6"]}],
        promo: false,
        pathName: 'asus-prime-b550m-a-wifi',
        tags: ['asus', 'motherboard', 'am4', 'wifi'],
        destaque: true
      },
      {
        id: 'mb-gigabyte-b560m',
        name: 'Placa-Mãe Gigabyte B560M DS3H, Intel LGA 1200, mATX, DDR4',
        modelo: 'B560M DS3H',
        categoria: 'placa-mae',
        fabricante: 'Gigabyte',
        price: 599.99,
        img: '/images/motherboard/gigabyte-b560m-1.jpg',
        img2: '/images/motherboard/gigabyte-b560m-2.jpg',
        garantia: '24 meses',
        specs: [{"Especificações": ["Socket LGA 1200", "DDR4", "PCIe 4.0", "USB 3.2"]}],
        promo: false,
        pathName: 'gigabyte-b560m-ds3h',
        tags: ['gigabyte', 'motherboard', 'lga1200'],
        destaque: false
      },
      {
        id: 'ram-corsair-16gb',
        name: 'Memória RAM Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz',
        modelo: 'Vengeance LPX',
        categoria: 'memoria-ram',
        fabricante: 'Corsair',
        price: 399.99,
        img: '/images/ram/corsair-2400-1.jpg',
        img2: '/images/ram/corsair-2400-2.jpg',
        garantia: '24 meses',
        specs: [{"Especificações": ["16GB (2x8GB)", "DDR4", "3200MHz", "CL16"]}],
        promo: true,
        pathName: 'corsair-vengeance-lpx-16gb',
        tags: ['corsair', 'ram', 'ddr4', 'gaming'],
        destaque: true
      },
      {
        id: 'ram-xpg-32gb',
        name: 'Memória RAM XPG Spectrix D60G 32GB (2x16GB) DDR4 3600MHz RGB',
        modelo: 'Spectrix D60G',
        categoria: 'memoria-ram',
        fabricante: 'XPG',
        price: 899.99,
        img: '/images/ram/xpg-3600-1.jpg',
        img2: '/images/ram/xpg-3600-2.jpg',
        garantia: '24 meses',
        specs: [{"Especificações": ["32GB (2x16GB)", "DDR4", "3600MHz", "RGB"]}],
        promo: false,
        pathName: 'xpg-spectrix-d60g-32gb',
        tags: ['xpg', 'ram', 'ddr4', 'rgb'],
        destaque: false
      },
      {
        id: 'ssd-kingston-500gb',
        name: 'SSD Kingston A400 500GB SATA III 2.5"',
        modelo: 'A400',
        categoria: 'ssd',
        fabricante: 'Kingston',
        price: 299.99,
        img: '/images/ssd/kingston-500-1.jpg',
        img2: '/images/ssd/kingston-500-2.jpg',
        garantia: '36 meses',
        specs: [{"Especificações": ["500GB", "SATA III", "2.5\"", "500MB/s leitura"]}],
        promo: false,
        pathName: 'kingston-a400-500gb',
        tags: ['kingston', 'ssd', 'storage'],
        destaque: false
      },
      {
        id: 'ssd-wd-1tb',
        name: 'SSD WD Blue 1TB M.2 NVMe PCIe Gen3',
        modelo: 'WD Blue SN570',
        categoria: 'ssd',
        fabricante: 'Western Digital',
        price: 599.99,
        img: '/images/ssd/wd-2tb-1.jpg',
        img2: '/images/ssd/wd-2tb-2.jpg',
        garantia: '60 meses',
        specs: [{"Especificações": ["1TB", "M.2 NVMe", "PCIe Gen3", "3500MB/s"]}],
        promo: true,
        pathName: 'wd-blue-1tb-nvme',
        tags: ['wd', 'ssd', 'nvme', 'storage'],
        destaque: true
      },
      {
        id: 'psu-xpg-650w',
        name: 'Fonte XPG Core Reactor 650W 80+ Gold Modular',
        modelo: 'Core Reactor',
        categoria: 'fonte',
        fabricante: 'XPG',
        price: 499.99,
        img: '/images/fonte/xpg-650-1.jpg',
        img2: '/images/fonte/xpg-650-2.jpg',
        garantia: '60 meses',
        specs: [{"Especificações": ["650W", "80+ Gold", "Modular", "PFC Ativo"]}],
        promo: true,
        pathName: 'xpg-core-reactor-650w',
        tags: ['xpg', 'fonte', 'modular', 'gold'],
        destaque: false
      },
      {
        id: 'psu-gigabyte-550w',
        name: 'Fonte Gigabyte P550B 550W 80+ Bronze',
        modelo: 'P550B',
        categoria: 'fonte',
        fabricante: 'Gigabyte',
        price: 299.99,
        img: '/images/fonte/gigabyte-p550b-1.jpg',
        img2: '/images/fonte/gigabyte-p550b-2.jpg',
        garantia: '36 meses',
        specs: [{"Especificações": ["550W", "80+ Bronze", "Não Modular"]}],
        promo: false,
        pathName: 'gigabyte-p550b-550w',
        tags: ['gigabyte', 'fonte', 'bronze'],
        destaque: false
      },
      {
        id: 'case-corsair-4000d',
        name: 'Gabinete Corsair 4000D Airflow Mid-Tower ATX',
        modelo: '4000D Airflow',
        categoria: 'gabinete',
        fabricante: 'Corsair',
        price: 599.99,
        img: '/images/gabinete/corsair-1.jpg',
        img2: '/images/gabinete/corsair-2.jpg',
        garantia: '12 meses',
        specs: [{"Especificações": ["Mid Tower", "ATX", "Vidro Temperado", "Airflow Otimizado"]}],
        promo: false,
        pathName: 'corsair-4000d-airflow',
        tags: ['corsair', 'gabinete', 'mid-tower', 'airflow'],
        destaque: true
      },
      {
        id: 'case-redragon-gc-601',
        name: 'Gabinete Gamer Redragon Sideswipe GC-601 Mid Tower',
        modelo: 'Sideswipe GC-601',
        categoria: 'gabinete',
        fabricante: 'Redragon',
        price: 399.99,
        img: '/images/gabinete/redragon-1.jpg',
        img2: '/images/gabinete/redragon-2.jpg',
        garantia: '12 meses',
        specs: [{"Especificações": ["Mid Tower", "ATX", "RGB", "Lateral de Vidro"]}],
        promo: true,
        pathName: 'redragon-sideswipe-gc601',
        tags: ['redragon', 'gabinete', 'gaming', 'rgb'],
        destaque: false
      }
    ];
    
    console.log(`🔄 Inserindo ${produtosCompletos.length} produtos no banco...`);
    
    let successCount = 0;
    for (const produto of produtosCompletos) {
      try {
        await connection.execute(`
          INSERT INTO products (
            id, name, modelo, categoria, fabricante, price, img, img2, 
            garantia, specs, promo, pathName, tags, destaque
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          produto.id,
          produto.name,
          produto.modelo,
          produto.categoria,
          produto.fabricante,
          produto.price,
          produto.img,
          produto.img2,
          produto.garantia,
          JSON.stringify(produto.specs),
          produto.promo,
          produto.pathName,
          JSON.stringify(produto.tags),
          produto.destaque
        ]);
        successCount++;
        console.log(`✅ Produto inserido: ${produto.name}`);
      } catch (error) {
        console.error(`❌ Erro ao inserir produto ${produto.name}:`, error);
      }
    }
    
    connection.release();
    
    console.log(`🎉 MIGRAÇÃO CONCLUÍDA: ${successCount}/${produtosCompletos.length} produtos inseridos`);
    
    return res.status(200).json({
      success: true,
      message: `${successCount} produtos migrados com sucesso!`,
      total: produtosCompletos.length,
      migrated: successCount
    });
    
  } catch (error) {
    console.error('❌ Erro na migração forçada:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro na migração de produtos',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}