import Link from 'next/link';
import SignOut from './SignOut';
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
          <SignOut />
        </>
      ) : (
        <Link href="/signin">Sign In</Link>
      )}
    </StyledNav>
  );
}
