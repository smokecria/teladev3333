// Função para buscar produtos do banco de dados
export async function getProductsFromDB() {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error('Falha ao buscar produtos');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
}

// Função para buscar um produto específico por pathName e categoria
export async function getProductByPath(categoria: string, pathName: string) {
  try {
    const products = await getProductsFromDB();
    return products.find((p: any) => p.categoria === categoria && p.pathName === pathName);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return null;
  }
}

// Função para buscar produtos por categoria
export async function getProductsByCategory(categoria: string) {
  try {
    const products = await getProductsFromDB();
    return products.filter((p: any) => p.categoria === categoria);
  } catch (error) {
    console.error('Erro ao buscar produtos por categoria:', error);
    return [];
  }
}