import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Router from 'next/router';
import useForm from '../lib/useForm';
import DisplayError from './DisplayError';
import { ALL_PRODUCTS_QUERY } from './Products';
import StyledForm from './styles/StyledForm';

const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION($name: String!, $description: String!, $price: Int!, $image: Upload) {
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        photo: { create: { image: $image, altText: $name } }
        status: "AVAILABLE"
      }
    ) {
      id
      price
      name
      description
    }
  }
`;

export default function CreateProducts() {
  const { values, handleInputChange, clearForm } = useForm({ name: '', price: '', image: '', description: '' });
  const [createProduct, { error, loading }] = useMutation(CREATE_PRODUCT_MUTATION, {
    variables: { name: values.name, description: values.description, price: values.price, image: values.image },
    // once the mutation was successfully finished, we're refetching the products query so that it's up to date
    refetchQueries: [{ query: ALL_PRODUCTS_QUERY }],
  });

  return (
    <StyledForm
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await createProduct();
        clearForm();
        // Go to products page
        Router.push({
          pathname: `/product/${res.data.createProduct.id}`,
        });
      }}
    >
      <DisplayError error={error} />

      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="image">
          Image
          <input onChange={handleInputChange} type="file" id="image" name="image" required />
        </label>

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

        <button type="submit">+ Add Product</button>
      </fieldset>
    </StyledForm>
  );
}
