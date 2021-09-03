import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import StyledForm from './styles/StyledForm';
import useForm from '../lib/useForm';
import DisplayError from './DisplayError';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION($email: String!, $password: String!, $token: String!) {
    redeemUserPasswordResetToken(email: $email, token: $token, password: $password) {
      code
      message
    }
  }
`;

export default function Reset({ token }) {
  const { values, handleInputChange, resetForm } = useForm({
    email: '',
    password: '',
    token,
  });
  const [resetPassword, { data, loading, error }] = useMutation(RESET_MUTATION, {
    variables: values,
  });

  const successfulError = data?.redeemUserPasswordResetToken?.code ? data?.redeemUserPasswordResetToken : undefined;

  async function handleSubmit(e) {
    e.preventDefault();
    // eslint-disable-next-line no-console
    await resetPassword().catch(console.error);
    resetForm();
  }

  return (
    <StyledForm method="POST" onSubmit={handleSubmit}>
      <h2>Reset Your Password</h2>

      <DisplayError error={error || successfulError} />

      <fieldset disabled={loading}>
        {data?.redeemUserPasswordResetToken === null && <p>Success! You can Now sign in</p>}

        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            autoComplete="email"
            value={values.email}
            onChange={handleInputChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            value={values.password}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Request Reset!</button>
      </fieldset>
    </StyledForm>
  );
}
