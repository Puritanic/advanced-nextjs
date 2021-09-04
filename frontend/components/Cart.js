import styled from 'styled-components';
import Image from 'next/image';
import StyledCart from './styles/StyledCart';
import StyledSupreme from './styles/StyledSupreme';
import { useUser } from './User';
import formatMoney from '../lib/formatMoney';
import { useCart } from '../lib/cartState';
import StyledCloseButton from './styles/StyledCloseButton';
import RemoveFromCart from './RemoveFromCart';

const StyledCartItem = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid var(--lightGrey);
  display: grid;
  grid-template-columns: auto 1fr auto;

  img {
    margin-right: 1rem;
    height: auto;
  }

  h3,
  p {
    margin: 0;
  }
`;

function CartItem({ cartItem }) {
  const {
    id,
    quantity,
    product: { photo, name, price },
  } = cartItem;

  return (
    <StyledCartItem>
      <Image alt={name} src={photo.image.publicUrlTransformed} width={100} height={0} />
      <div>
        <h3>{name}</h3>
        <p>{formatMoney((price / 100) * quantity)}</p> -{' '}
        <em>
          {quantity} &times; {formatMoney(price / 100)} each
        </em>
      </div>
      <RemoveFromCart id={id} />
    </StyledCartItem>
  );
}

export default function Cart() {
  const user = useUser();
  const { cartOpen, closeCart } = useCart();

  if (!user) return null;

  let total = 0;

  return (
    <StyledCart open={cartOpen}>
      <header>
        <StyledSupreme>{user.name}&apos;s Cart</StyledSupreme>
        <StyledCloseButton onClick={closeCart}>&times;</StyledCloseButton>
      </header>
      <ul>
        {user.cart.map((cartItem) => {
          if (cartItem.product) {
            const pricePerItem = cartItem.product.price * cartItem.quantity;
            total += pricePerItem;
            return <CartItem key={cartItem.id} cartItem={cartItem} />;
          }
          return null;
        })}
      </ul>
      <footer>
        <p>Total: {formatMoney(total / 100)}</p>
      </footer>
    </StyledCart>
  );
}
