import Link from 'next/link';
import styled from 'styled-components';
import Cart from './Cart';

import Nav from './Nav';
import Search from './Search';

const Logo = styled.h1`
  font-size: 4rem;
  margin-left: 2rem;
  position: relative;
  z-index: 2;
  background: var(--red, red);
  transform: skew(-7deg);

  a {
    text-decoration: none;
    text-transform: uppercase;
    color: #f1f1f1;
    padding: 0.5rem 1rem;
  }
`;

const StyledHeader = styled.header`
  .bar {
    display: grid;
    grid-template-columns: auto 1fr;
    border-bottom: 1px solid var(--black, black);
    justify-content: space-between;
    align-items: stretch;
  }

  .sub-bar {
    display: grid;
    grid-template-columns: 1fr auto;
    border-bottom: 1px solid var(--black, black);
  }
`;

export default function Header() {
  return (
    <StyledHeader>
      <div className="bar">
        <Logo>
          <Link href="/">Sick Fits</Link>
        </Logo>
        <Nav />
      </div>
      <div className="sub-bar">
        <Search />
      </div>
      <Cart />
    </StyledHeader>
  );
}
