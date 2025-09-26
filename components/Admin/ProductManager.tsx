import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Interface do Produto
interface Product {
  id: string; 
  name: string;
  modelo: string;
  categoria: string;
  fabricante: string;
  price: number; 
  img: string;
  img2: string;
  garantia: string;
  specs: any[]; 
  promo: boolean;
  pathName: string;
  tags: string[];
  destaque: boolean;
}

// API Client para se comunicar com o backend
const apiClient = {
  getProducts: async (): Promise<Product[]> => {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error('Falha ao buscar produtos');
    const data = await response.json();
    return data.map((p: any) => ({
        ...p,
        specs: p.specs || [],
        tags: p.tags || []
    }));
  },
  addProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Falha ao adicionar produto');
    return response.json();
  },
  updateProduct: async (product: Product): Promise<Product> => {
     const response = await fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Falha ao atualizar produto');
    return response.json();
  },
  deleteProduct: async (productId: string): Promise<void> => {
     const response = await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: productId }),
    });
    if (!response.ok) throw new Error('Falha ao deletar produto');
  }
};

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
);
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
);

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const initialFormState = {
      name: '', modelo: '', fabricante: '', categoria: '', price: '',
      img: '', img2: '', garantia: '', specs: '[]', promo: false,
      pathName: '', tags: '[]', destaque: false, id: ''
  };
  const [formState, setFormState] = useState<any>(initialFormState);
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProducts = await apiClient.getProducts();
        setProducts(fetchedProducts);
      } catch (err: any) {
        setError('Falha ao carregar produtos do servidor: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormState((prev: any) => ({
        ...prev,
        [name]: checkbox.checked,
      }));
    } else {
      setFormState((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const priceNumber = parseFloat(formState.price);
    if (!formState.name || !formState.modelo || isNaN(priceNumber) || priceNumber <= 0) {
      alert('Por favor, preencha pelo menos Nome, Modelo e um Preço válido.');
      setLoading(false);
      return;
    }

    let specsData, tagsData;
    try {
        specsData = JSON.parse(formState.specs);
        tagsData = JSON.parse(formState.tags);
    } catch (jsonError) {
        alert("O formato das especificações ou tags (JSON) é inválido.");
        setLoading(false);
        return;
    }

    try {
      if (isEditing) {
        const productToUpdate = { ...formState, price: priceNumber, specs: specsData, tags: tagsData };
        const updatedProduct = await apiClient.updateProduct(productToUpdate);
        setProducts(products.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
      } else {
        const { id, ...newProductData } = formState;
        const productToAdd = { ...newProductData, price: priceNumber, specs: specsData, tags: tagsData };
        const addedProduct = await apiClient.addProduct(productToAdd);
        setProducts([addedProduct, ...products]);
      }

      setIsEditing(null);
      setIsFormVisible(false);
      setFormState(initialFormState);
    } catch (err: any) {
      setError("Erro ao salvar produto: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setIsEditing(product.id);
    setIsFormVisible(true);
    setFormState({
        ...product,
        price: product.price.toString(),
        specs: JSON.stringify(product.specs || [], null, 2),
        tags: JSON.stringify(product.tags || [], null, 2),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        setLoading(true);
        await apiClient.deleteProduct(productId);
        setProducts(products.filter(p => p.id !== productId));
      } catch (err: any) {
         setError("Erro ao deletar produto: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const cancelEdit = () => {
    setIsEditing(null);
    setIsFormVisible(false);
    setFormState(initialFormState);
  };

  const isFormOpen = isEditing || isFormVisible;

  const categorias = [
    'placa-mae', 'processador', 'placa-de-video', 'fonte', 
    'gabinete', 'memoria-ram', 'ssd'
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Gerenciador de Produtos</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          {isFormOpen ? (
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">{isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <input 
                    type="text" 
                    name="name" 
                    value={formState.name} 
                    onChange={handleInputChange} 
                    className="mt-1 block w-full input-style" 
                    placeholder="Nome do Produto" 
                    required 
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      name="modelo" 
                      value={formState.modelo} 
                      onChange={handleInputChange} 
                      className="mt-1 block w-full input-style" 
                      placeholder="Modelo" 
                      required 
                    />
                    <input 
                      type="number" 
                      name="price" 
                      value={formState.price} 
                      onChange={handleInputChange} 
                      className="mt-1 block w-full input-style" 
                      placeholder="Preço (R$)" 
                      step="0.01" 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      name="fabricante" 
                      value={formState.fabricante} 
                      onChange={handleInputChange} 
                      className="mt-1 block w-full input-style" 
                      placeholder="Fabricante" 
                    />
                    <select 
                      name="categoria" 
                      value={formState.categoria} 
                      onChange={handleInputChange} 
                      className="mt-1 block w-full input-style"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {categorias.map(cat => (
                        <option key={cat} value={cat}>
                          {cat.replace('-', ' ').toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                   <input 
                     type="text" 
                     name="garantia" 
                     value={formState.garantia} 
                     onChange={handleInputChange} 
                     className="mt-1 block w-full input-style" 
                     placeholder="Garantia (Ex: 12 meses)" 
                   />
                   <input 
                     type="text" 
                     name="pathName" 
                     value={formState.pathName} 
                     onChange={handleInputChange} 
                     className="mt-1 block w-full input-style" 
                     placeholder="URL do produto (deixe vazio para gerar automaticamente)" 
                   />
                   <textarea 
                     name="tags" 
                     value={formState.tags} 
                     onChange={handleInputChange} 
                     rows={3} 
                     className="mt-1 block w-full input-style font-mono text-sm" 
                     placeholder='Tags (formato JSON): ["tag1", "tag2"]'
                   />
                </div>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    name="img" 
                    value={formState.img} 
                    onChange={handleInputChange} 
                    className="mt-1 block w-full input-style" 
                    placeholder="URL Imagem Principal" 
                  />
                  <input 
                    type="text" 
                    name="img2" 
                    value={formState.img2} 
                    onChange={handleInputChange} 
                    className="mt-1 block w-full input-style" 
                    placeholder="URL Imagem Secundária" 
                  />
                  <textarea 
                    name="specs" 
                    value={formState.specs} 
                    onChange={handleInputChange} 
                    rows={4} 
                    className="mt-1 block w-full input-style font-mono text-sm" 
                    placeholder='Especificações (formato JSON): [{"categoria": ["spec1", "spec2"]}]'
                  />
                  <div className="flex items-center pt-2 space-x-8">
                      <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            name="promo" 
                            checked={formState.promo} 
                            onChange={handleInputChange} 
                            id="promo" 
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" 
                          />
                          <label htmlFor="promo" className="ml-2 block text-sm text-gray-900">Em promoção</label>
                      </div>
                       <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            name="destaque" 
                            checked={formState.destaque} 
                            onChange={handleInputChange} 
                            id="destaque" 
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" 
                          />
                          <label htmlFor="destaque" className="ml-2 block text-sm text-gray-900">Em destaque</label>
                      </div>
                  </div>
                </div>
                <div className="md:col-span-2 flex items-center space-x-4 pt-4">
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                  >
                    {loading ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Adicionar Produto')}
                  </button>
                  <button 
                    type="button" 
                    onClick={cancelEdit} 
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-700">Produtos Cadastrados</h2>
              <button 
                onClick={() => { setIsFormVisible(true); setFormState(initialFormState); }} 
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Adicionar Novo Produto
              </button>
            </div>
          )}
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="pl-6 pr-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                            <th className="pl-3 pr-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading && products.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-12 text-gray-500">Carregando produtos...</td></tr>
                        ) : (
                            products.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="pl-6 pr-3 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img 
                                                  className="h-10 w-10 rounded-md object-contain bg-gray-100" 
                                                  style={{ height: '40px', width: '40px' }}
                                                  src={product.img || 'https://placehold.co/40x40/e2e8f0/a0aec0?text=?'} 
                                                  alt={product.name} 
                                                />
                                            </div>
                                            <div className="ml-4 max-w-xs">
                                                <div className="text-sm font-medium text-gray-900 truncate" title={product.name}>{product.name}</div>
                                                <div className="text-sm text-gray-500">{product.fabricante}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 capitalize">{product.categoria?.replace('-', ' ')}</div>
                                    </td>
                                    <td className="px-3 py-4 whitespace-nowrap">
                                        {product.promo ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Promoção
                                            </span>
                                        ) : (
                                             <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                Padrão
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-3 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {typeof product.price === 'number' && product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </div>
                                    </td>
                                    <td className="pl-3 pr-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <div className="flex items-center justify-center space-x-4">
                                            <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900" title="Editar"><EditIcon /></button>
                                            <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900" title="Excluir"><TrashIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {!loading && products.length === 0 && (
                <div className="text-center py-12"><p className="text-gray-500">Nenhum produto cadastrado ainda.</p></div>
            )}
        </div>
      </div>
       <style jsx global>{`
            .input-style {
                border-width: 1px;
                border-color: #D1D5DB;
                border-radius: 0.375rem;
                padding: 0.5rem 0.75rem;
                width: 100%;
                box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            }
            .input-style:focus {
                outline: 2px solid transparent;
                outline-offset: 2px;
                --tw-ring-color: #6366F1;
                border-color: #6366F1;
            }
        `}</style>
    </div>
  );
};

export default ProductManager;