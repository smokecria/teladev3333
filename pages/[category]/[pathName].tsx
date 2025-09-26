import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import Produto from "../../components/ProdutoPagina/Index";
import { getConnection } from "../../lib/db";

interface Props {
  modelo: string;
  categoria: string;
  img: string;
  img2: string;
  id: string;
  fabricante: string;
  name: string;
  pathName: string;
  pPrazo: number;
  garantia: string;
  specs: object[];
  promo: boolean;
}

interface IParams extends ParsedUrlQuery {
  category: string;
  pathName: string;
}

export default function ItemPage({
  modelo,
  categoria,
  fabricante,
  id,
  img,
  img2,
  garantia,
  name,
  pathName,
  pPrazo,
  specs,
  promo,
}: Props) {
  return (
    <div>
      <Produto
        modelo={modelo}
        categoria={categoria}
        fabricante={fabricante}
        id={id}
        img={img}
        img2={img2}
        garantia={garantia}
        name={name}
        pathName={pathName}
        pPrazo={pPrazo}
        specs={specs}
        promo={promo}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { category, pathName } = context.params as IParams;

  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM products WHERE categoria = ? AND pathName = ?',
      [category, pathName]
    );
    await connection.end();

    const products = rows as any[];
    
    if (products.length === 0) {
      return {
        notFound: true,
      };
    }

    const product = products[0];

    return {
      props: {
        modelo: product.modelo,
        categoria: product.categoria,
        fabricante: product.fabricante,
        id: product.id,
        img: product.img,
        img2: product.img2,
        garantia: product.garantia,
        name: product.name,
        pathName: product.pathName,
        pPrazo: product.price,
        specs: product.specs ? JSON.parse(product.specs) : [],
        promo: product.promo,
      },
    };
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return {
      notFound: true,
    };
  }
};