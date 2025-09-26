import { useEffect, useState } from "react";
import Item from "../Item/Item";
import styles from "../../styles/ProdutoPagina.module.scss";

function VerMais() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRandomProducts();
  }, []);

  async function loadRandomProducts() {
    try {
      const response = await fetch('/api/products');
      const products = await response.json();
      
      // Selecionar 5 produtos aleatórios
      const randomProducts = [];
      const usedIndexes = new Set();
      
      while (randomProducts.length < Math.min(5, products.length)) {
        const randomIndex = Math.floor(Math.random() * products.length);
        if (!usedIndexes.has(randomIndex)) {
          usedIndexes.add(randomIndex);
          randomProducts.push(products[randomIndex]);
        }
      }
      
      setProdutos(randomProducts);
    } catch (error) {
      console.error('Erro ao carregar produtos relacionados:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.containerVerMais}>
        <h1>PRODUTOS RELACIONADOS</h1>
        <div className="text-center py-4">
          <p>Carregando produtos relacionados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.containerVerMais}>
      <h1>PRODUTOS RELACIONADOS</h1>
      <div className={styles.itemVerMais}>
        {produtos.map((i, key) => (
          <Item
            modelo={i.modelo}
            key={key}
            img={i.img}
            img2={i.img2}
            name={i.name}
            pathName={i.pathName}
            pPrazo={i.pPrazo}
            categoria={i.categoria}
            fabricante={i.fabricante}
            id={i.id}
            garantia={i.garantia}
            specs={i.specs}
            promo={i.promo}
          />
        ))}
      </div>
    </div>
  );
}

export default VerMais;