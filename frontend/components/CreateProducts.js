import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import useForm from '../lib/useForm';
import DisplayError from './DisplayError';
import StyledForm from './styles/StyledForm';

const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT($name: String!, $description: String!, $price: Int!, $image: Upload) {
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
  const [createProduct, { data, error, loading }] = useMutation(CREATE_PRODUCT_MUTATION, {
    variables: { name: values.name, description: values.description, price: values.price, image: values.image },
  });

  return (
    <StyledForm
      onSubmit={async (e) => {
        e.preventDefault();
        await createProduct();
        clearForm();
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
