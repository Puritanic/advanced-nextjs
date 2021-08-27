/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */

import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import { ALL_PRODUCTS_QUERY } from './Products';

const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;

function updateCache(cache, payload) {
  const { deleteProduct } = payload.data;
  cache.evict(cache.identify(deleteProduct));
}

export default function DeleteProduct({ id, children }) {
  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT_MUTATION);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => {
        if (confirm('Are you sure you want to delete this product?')) {
          deleteProduct({ variables: { id }, update: updateCache });
        }
      }}
    >
      {children}
    </button>
  );
}
