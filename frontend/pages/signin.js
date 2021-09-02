import styled from 'styled-components';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 3rem;
`;

export default function SignInPage() {
  return (
    <StyledGrid>
      <SignIn />
      <SignUp />
    </StyledGrid>
  );
}
