/* eslint-disable no-underscore-dangle */
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import useForm from '../lib/useForm';
import { GET_USER_QUERY } from './User';
import DisplayError from './DisplayError';
import StyledForm from './styles/StyledForm';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          email
          name
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`;

export default function SignIn() {
  const { values, handleInputChange, resetForm } = useForm({ email: '', password: '' });
  const [signInUser, { data, error, loading }] = useMutation(SIGNIN_MUTATION, {
    variables: { email: values.email, password: values.password },
    refetchQueries: [{ query: GET_USER_QUERY }], // refetch the currently logged in user
  });

  async function handleSubmit(e) {
    e.preventDefault();
    await signInUser();
    resetForm();
  }

  const _error =
    data?.authenticateUserWithPassword.__typename === 'UserAuthenticationWithPasswordFailure'
      ? data?.authenticateUserWithPassword
      : undefined;

  return (
    <StyledForm method="POST" onSubmit={handleSubmit}>
      <h2>Sign Into Your Account</h2>
      <DisplayError error={error || _error} />
      <fieldset disabled={loading}>
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
        <button type="submit">Sign In!</button>
      </fieldset>
    </StyledForm>
  );
}
