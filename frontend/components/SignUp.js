import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import StyledForm from './styles/StyledForm';
import useForm from '../lib/useForm';
import DisplayError from './DisplayError';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
    createUser(data: { email: $email, name: $name, password: $password }) {
      id
      email
      name
    }
  }
`;

export default function SignUp() {
  const { values, handleInputChange, resetForm } = useForm({
    email: '',
    name: '',
    password: '',
  });
  const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION, {
    variables: values,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    // eslint-disable-next-line no-console
    await signup().catch(console.error);
    resetForm();
  }

  return (
    <StyledForm method="POST" onSubmit={handleSubmit}>
      <h2>Sign Up For an Account</h2>

      <DisplayError error={error} />

      <fieldset disabled={loading}>
        {data?.createUser && <p>Signed up with {data.createUser.email} - Please Go Head and Sign in!</p>}

        <label htmlFor="email">
          Your Name
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            autoComplete="name"
            value={values.name}
            onChange={handleInputChange}
          />
        </label>

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
