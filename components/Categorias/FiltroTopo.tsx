import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

import styles from "../../styles/Categorias.module.scss";

interface Props {
  handleFiltro: Function;
  filtro: string;
}

function FiltroTopo({ handleFiltro, filtro }: Props) {
  const router = useRouter();
  const { category } = router.query;
  const [categoryName, setCategoryName] = useState<string>('');

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (category && typeof category === 'string') {
      setCategoryName(category.replace(/-/g, " ").toUpperCase());
    }
  }, [category]);

  function handleOpen() {
    setOpen(!open);
  }

  function handleEscolhaFiltro(opt: string) {
    handleFiltro(opt);
    setOpen(false);
  }

  return (
    <div className={styles.containerFiltro}>
      <h1 className={styles.categoriaNome}>
        {categoryName || 'CATEGORIA'}
      </h1>
      <div className={styles.filtro}>
        <p>FILTRAR:</p>
        <div
          className={
            open
              ? `${styles.botaoOrdenar} ${styles.ativo}`
              : styles.botaoOrdenar
          }
        >
          <button onClick={handleOpen} data-cy="filter-button">
            {filtro}
            <FontAwesomeIcon icon={faAngleDown} />
          </button>
          <ul>
            <li onClick={() => handleEscolhaFiltro("Padrão")}>Padrão</li>
            <li onClick={() => handleEscolhaFiltro("Menor Preço")} data-cy="filter-asc">
              Menor Preço
            </li>
            <li onClick={() => handleEscolhaFiltro("Maior Preço")} data-cy="filter-desc">
              Maior Preço
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FiltroTopo;