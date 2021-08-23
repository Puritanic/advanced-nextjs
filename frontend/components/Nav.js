import Link from 'next/link';
import StyledNav from './styles/StyledNav';

export default function Nav() {
  return (
    <StyledNav>
      <Link href="/products">products</Link>
      <Link href="/sell">sell</Link>
      <Link href="/orders">orders</Link>
      <Link href="/account">account</Link>
    </StyledNav>
  );
}
