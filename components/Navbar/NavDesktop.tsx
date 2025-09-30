import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCartShopping,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

import NavDetalhesDesktop from "./NavDetalhesDesktop";
import LoginModal from "../Auth/LoginModal";

import styles from "../../styles/Navbar.module.scss";

interface Props {
  numCart: number;
}

function NavDesktop({ numCart }: Props) {
  const [open, setOpen] = useState(false);
  const [busca, setBusca] = useState("");
  const [storeName, setStoreName] = useState("PC Shop");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [customer, setCustomer] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedConfig = localStorage.getItem('storeConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setStoreName(config.storeName || 'PC Shop');
    }

    // Verificar se há sessão ativa
    const sessionId = localStorage.getItem('customerSession');
    if (sessionId) {
      verifySession(sessionId);
    }
  }, []);

  const verifySession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/customers?sessionId=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setCustomer(data.customer);
      } else {
        localStorage.removeItem('customerSession');
      }
    } catch (error) {
      localStorage.removeItem('customerSession');
    }
  };

  const handleLogin = (customerData: any, sessionId: string) => {
    setCustomer(customerData);
  };

  const handleLogout = () => {
    localStorage.removeItem('customerSession');
    setCustomer(null);
    setShowUserMenu(false);
  };
  function changeOpen() {
    setOpen(!open);
  }

  function handleBusca(evt: React.ChangeEvent<HTMLInputElement>) {
    let novaBusca = evt.target.value;
    setBusca(novaBusca);
  }

  function handleInputEnter(evt: React.KeyboardEvent<HTMLInputElement>) {
    if (evt.key === "Enter") {
      router.push(`/busca?q=${busca}`);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.containerNavbar}>
        <div className={styles.navNomeCategoria}>
          <h1 className={styles.nomeLoja}>
            <Link href="/">{storeName}</Link>
          </h1>
        </div>

        <div className={styles.busca}>
          <input
            type="text"
            placeholder="Digite o que você procura"
            onChange={handleBusca}
            onKeyPress={handleInputEnter}
          />
          <Link href={{ pathname: "busca", query: { q: busca } }} passHref>
            <button className={styles.buscaIcone}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </Link>
        </div>
        <div className={styles.containerLogin}>
          {customer ? (
            <div className={styles.userMenu}>
              <div 
                className={styles.userInfo}
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <FontAwesomeIcon icon={faUser} />
                <div>
                  <p>Olá, {customer.name.split(' ')[0]}</p>
                  <p>Minha Conta</p>
                </div>
              </div>
              {showUserMenu && (
                <div className={styles.userDropdown}>
                  <button onClick={() => setShowUserMenu(false)}>Meus Pedidos</button>
                  <button onClick={() => setShowUserMenu(false)}>Meus Dados</button>
                  <button onClick={() => setShowUserMenu(false)}>Cartões Salvos</button>
                  <button onClick={handleLogout}>Sair</button>
                </div>
              )}
            </div>
          ) : (
            <div onClick={() => setShowLoginModal(true)}>
              <FontAwesomeIcon icon={faUser} />
              <div>
                <p>Olá, seja bem-vindo</p>
                <p>Entrar</p>
              </div>
            </div>
          )}
        </div>
        <div className={styles.carrinho}>
          <Link href="/carrinho" passHref>
            <div data-cy="cart">
              <FontAwesomeIcon icon={faCartShopping} />
              <div className={styles.carrinhoNumeroItem} data-cy="num-cart">{numCart}</div>
            </div>
          </Link>
        </div>
      </div>
      <nav className={styles.navDesktop} onClick={changeOpen}>
        <ul>
          <Link href="/placa-mae" passHref >
            <li data-cy="category-motherboard">
              <span>PLACA-MÃE</span>
            </li>
          </Link>
          <Link href="/processador" passHref>
            <li data-cy="category-cpu">
              <span>PROCESSADOR </span>
            </li>
          </Link>
          <Link href="/placa-de-video" passHref>
            <li data-cy="category-gpu">
              <span>PLACA DE VÍDEO </span>
            </li>
          </Link>
          <Link href="/fonte" passHref>
            <li data-cy="category-psu">
              <span>FONTE </span>
            </li>
          </Link>
          <Link href="/gabinete" passHref>
            <li data-cy="category-pccase">
              <span> GABINETE </span>
            </li>
          </Link>
          <Link href="/memoria-ram" passHref>
            <li data-cy="category-ram">
              <span>MEMÓRIA RAM </span>
            </li>
          </Link>
          <Link href="/ssd" passHref>
            <li data-cy="category-ssd">
              <span>SSD</span>
            </li>
          </Link>
        </ul>
      </nav>
      <NavDetalhesDesktop />
      
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default NavDesktop;
