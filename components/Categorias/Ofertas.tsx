import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import Item from "../Item/Item";
import styles from "../../styles/Categorias.module.scss";

function Ofertas() {
  const [filtro, setFiltro] = useState("Padrão");
  const [itens, setItens] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const products = await response.json();
      const promoItems = products.filter((i: any) => i.promo === true);
      setItens(promoItems);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  }

  const itensMenorPreco = itens.slice().sort((a, b) => {
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

  const itensMaiorPreco = itens.slice().sort((a, b) => {
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

  function renderItens(opt: string) {
    let itemsToRender = itens;
    
    if (opt === "Menor Preço") {
      itemsToRender = itensMenorPreco;
    } else if (opt === "Maior Preço") {
      itemsToRender = itensMaiorPreco;
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

  function handleFiltro(opt: string) {
    setFiltro(opt);
    setOpen(false);
  }

  function handleOpen() {
    setOpen(!open);
  }

  if (loading) {
    return (
      <main className={styles.container}>
        <div className="text-center py-8">
          <p>Carregando ofertas...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.containerFiltro}>
        <h1 className={styles.categoriaNome}>OFERTAS</h1>
        <div className={styles.filtro}>
          <p>FILTRAR:</p>
          <div
            className={
              open
                ? `${styles.botaoOrdenar} ${styles.ativo}`
                : styles.botaoOrdenar
            }
          >
            <button onClick={handleOpen}>
              {filtro}
              <FontAwesomeIcon icon={faAngleDown} />
            </button>
            <ul>
              <li onClick={() => handleFiltro("Padrão")}>Padrão</li>
              <li onClick={() => handleFiltro("Menor Preço")}>Menor Preço</li>
              <li onClick={() => handleFiltro("Maior Preço")}>Maior Preço</li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.containerItens}>{renderItens(filtro)}</div>
    </main>
  );
}

export default Ofertas;