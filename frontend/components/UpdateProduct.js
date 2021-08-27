import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/client';
import Router from 'next/router';
import { useEffect } from 'react';
import DisplayError from './DisplayError';
import { SINGLE_PRODUCT_QUERY } from './SingleProduct';
import StyledForm from './styles/StyledForm';
import useForm from '../lib/useForm';

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION($id: ID!, $name: String, $description: String, $price: Int) {
    updateProduct(id: $id, data: { name: $name, description: $description, price: $price }) {
      id
      description
    }
  }
`;

export default function UpdateProduct({ id }) {
  const { loading, error, data } = useQuery(SINGLE_PRODUCT_QUERY, { variables: { id } });
  const { values, handleInputChange, clearForm, setValues } = useForm({ name: '', price: '', description: '' });
  const [updateProduct, { loading: uLoading, error: uError }] = useMutation(UPDATE_PRODUCT_MUTATION, {
    variables: { id, name: values.name, description: values.description, price: values.price },
  });

  const { name, price, description } = Object(data?.Product);

  useEffect(() => {
    setValues({ name, price, description });
  }, [name, price, description, setValues]);

  if (loading) return <div>Loading...</div>;
  if (error) return <DisplayError error={error} />;

  return (
    <StyledForm
      onSubmit={async (e) => {
        e.preventDefault();
        await updateProduct();
        clearForm();
        // Go to products page
        Router.push({ pathname: `/product/${id}` });
      }}
    >
      <DisplayError error={error || uError} />

      <fieldset disabled={uLoading} aria-busy={uLoading}>
        <label htmlFor="name">
          Name
          <input
            value={values.name}
            onChange={handleInputChange}
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            required
          />
        </label>

        <label htmlFor="price">
          Price
          <input
            value={values.price}
            onChange={handleInputChange}
            type="number"
            min="0"
            id="price"
            name="price"
            placeholder="Price"
            required
          />
        </label>

        <label htmlFor="description">
          Description
          <textarea
            value={values.description}
            onChange={handleInputChange}
            id="description"
            name="description"
            placeholder="Description"
            required
          />
        </label>

        <button type="submit">Update Product</button>
      </fieldset>
    </StyledForm>
  );
}
