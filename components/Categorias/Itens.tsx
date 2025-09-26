import { useEffect, useState } from "react";
import Item from "../Item/Item";
import styles from "../../styles/Categorias.module.scss";

interface Props {
  filtro: string;
  category: string | string[] | undefined;
}

function Filtro({ filtro, category }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [category]);

  async function loadProducts() {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const products = await response.json();
      const filteredItems = products.filter((i: any) => i.categoria === category);
      setItems(filteredItems);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  }

  const itemsMenorPreco = items.slice().sort((a, b) => {
    if (a.promo && b.promo) {
      return a.pPrazo * 0.7 > b.pPrazo * 0.7 ? 1 : -1;
    } else if (a.promo) {
      return a.pPrazo * 0.7 > b.pPrazo * 0.85 ? 1 : -1;
    } else if (b.promo) {
      return a.pPrazo * 0.85 > b.pPrazo * 0.7 ? 1 : -1;
    } else {
      return a.pPrazo * 0.85 > b.pPrazo * 0.85 ? 1 : -1;
    }
  });

  const itemsMaiorPreco = items.slice().sort((a, b) => {
    if (a.promo && b.promo) {
      return a.pPrazo * 0.7 > b.pPrazo * 0.7 ? -1 : 1;
    } else if (a.promo) {
      return a.pPrazo * 0.7 > b.pPrazo * 0.85 ? -1 : 1;
    } else if (b.promo) {
      return a.pPrazo * 0.85 > b.pPrazo * 0.7 ? -1 : 1;
    } else {
      return a.pPrazo * 0.85 > b.pPrazo * 0.85 ? -1 : 1;
    }
  });

  function renderItems(opt: string) {
    let itemsToRender = items;
    
    if (opt === "Menor Preço") {
      itemsToRender = itemsMenorPreco;
    } else if (opt === "Maior Preço") {
      itemsToRender = itemsMaiorPreco;
    }

    return itemsToRender.map((i, key) => (
      <Item
        modelo={i.modelo}
        key={key}
        img2={i.img2}
        img={i.img}
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
    ));
  }

  if (loading) {
    return (
      <div className={styles.containerItens}>
        <div className="text-center py-8">
          <p>Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.containerItens} data-cy="filter-items">
      {renderItems(filtro)}
    </div>
  );
}

export default Filtro;