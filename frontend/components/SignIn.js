/* eslint-disable no-underscore-dangle */
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Router } from 'next/router';
import useForm from '../lib/useForm';
import DisplayError from './DisplayError';
import StyledForm from './styles/StyledForm';
import { GET_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        sessionToken
      }
      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`;

export default function SignIn() {
  const { values, handleInputChange, clearForm } = useForm({ email: '', password: '' });
  const [signInUser, { data, error, loading }] = useMutation(SIGNIN_MUTATION, {
    variables: { email: values.email, password: values.password },
    refetchQueries: [{ query: GET_USER_QUERY }],
  });

  const _error =
    data?.authenticateUserWithPassword.__typename === 'UserAuthenticationWithPasswordFailure'
      ? data?.authenticateUserWithPassword
      : undefined;

  return (
    <StyledForm
      method="POST"
      onSubmit={async (e) => {
        e.preventDefault();
        await signInUser();
        clearForm();
        Router.push({
          pathname: '/',
        });
      }}
    >
      <DisplayError error={error || _error} />

      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="email">
          Email
          <input
            value={values.email}
            onChange={handleInputChange}
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            placeholder="Your Email Address"
            required
          />
        </label>

        <label htmlFor="password">
          Password
          <input
            value={values.password}
            onChange={handleInputChange}
            type="password"
            id="password"
            name="password"
            placeholder="Your Password"
            required
          />
        </label>

        <button type="submit">Sign In</button>
      </fieldset>
    </StyledForm>
  );
}
