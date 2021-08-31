import Link from 'next/link';
import StyledNav from './styles/StyledNav';
import { useUser } from './User';

export default function Nav() {
  const user = useUser();

  return (
    <StyledNav>
      <Link href="/products">Products</Link>
      {user ? (
        <>
          <Link href="/sell">Sell</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/account">Account</Link>
        </>
      ) : (
        <Link href="/signin">Sign In</Link>
      )}
    </StyledNav>
  );
}
