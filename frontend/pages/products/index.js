import { useRouter } from 'next/dist/client/router';
import Pagination from '../../components/Pagination';
import Products from '../../components/Products';

export default function ProductsPage() {
  const { query } = useRouter();
  const pageNumber = parseInt(query.page, 10) || 1;

  return (
    <div>
      <Pagination pageNumber={pageNumber} />
      <Products pageNumber={pageNumber} />
      <Pagination pageNumber={pageNumber} />
    </div>
  );
}
