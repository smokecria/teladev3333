import { GetServerSideProps } from "next";
import Categoria from "../../components/Categorias/index";
import { getConnection } from "../../lib/db";

export default function index() {
  return (
    <div>
      <Categoria />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { category } = context.params!;

  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT COUNT(*) as count FROM products WHERE categoria = ?',
      [category]
    );
    await connection.end();

    const count = (rows as any)[0].count;
    
    if (count === 0) {
      return {
        notFound: true,
      };
    }

    return {
      props: {},
    };
  } catch (error) {
    console.error('Erro ao verificar categoria:', error);
    return {
      props: {},
    };
  }
};