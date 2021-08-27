import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Image from 'next/image';
import Head from 'next/head';
import styled from 'styled-components';
import DisplayError from './DisplayError';

export const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      id
      name
      price
      description
      photo {
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

const StyledSingleProduct = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  max-width: var(--maxWidth);
  align-items: top;
  gap: 2rem;

  img {
    width: 600px;
    object-fit: contain;
  }
`;

export default function SingleProduct({ id }) {
  const { data, loading, error } = useQuery(SINGLE_PRODUCT_QUERY, { variables: { id } });

  if (loading) return <div>Loading...</div>;
  if (error) return <DisplayError error={error} />;

  const {
    name,
    price,
    description,
    photo: { image, altText },
  } = data.Product;

  return (
    <StyledSingleProduct>
      <Head>
        <title>Sick Fits | {name}</title>
      </Head>
      <Image src={image.publicUrlTransformed} alt={altText} width={600} height={600} />
      <div className="details">
        <h2>{name}</h2>
        <p>{description}</p>
      </div>
    </StyledSingleProduct>
  );
}
