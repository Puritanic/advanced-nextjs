import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import StyledForm from './styles/StyledForm';
import useForm from '../lib/useForm';
import DisplayError from './DisplayError';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`;

export default function RequestReset() {
  const { values, handleInputChange, resetForm } = useForm({ email: '' });
  const [resetPassword, { data, loading, error }] = useMutation(REQUEST_RESET_MUTATION, {
    variables: values,
  });
  async function handleSubmit(e) {
    e.preventDefault();
    // eslint-disable-next-line no-console
    await resetPassword().catch(console.error);
    resetForm();
  }

  return (
    <StyledForm method="POST" onSubmit={handleSubmit}>
      <h2>Request a Password Reset</h2>
      <DisplayError error={error} />
      <fieldset disabled={loading}>
        {data?.sendUserPasswordResetLink === null && <p>Success! Check your email for a link!</p>}

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
        <button type="submit">Request Reset!</button>
      </fieldset>
    </StyledForm>
  );
}
