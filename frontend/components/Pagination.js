/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-underscore-dangle */
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import DisplayError from './DisplayError';
import StyledPagination from './styles/StyledPagination';

import { perPage } from '../config';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    _allProductsMeta {
      count
    }
  }
`;

export default function Pagination({ pageNumber }) {
  const { error, loading, data } = useQuery(PAGINATION_QUERY);

  if (loading) return null;
  if (error) return <DisplayError error={error} />;

  const { count } = Object(data?._allProductsMeta);
  const pageCount = Math.ceil(count / perPage);

  return (
    <StyledPagination>
      <Head>
        <title>
          Sick Fits - Page {pageNumber} of {pageCount}
        </title>
      </Head>
      <Link href={`/products/${pageNumber - 1}`}>
        <a aria-disabled={pageNumber <= 1}>&larr; Prev</a>
      </Link>
      <p>
        Page {pageNumber} of {pageCount}
      </p>
      <p>{count} Items Total</p>
      <Link href={`/products/${pageNumber + 1}`}>
        <a aria-disabled={pageNumber >= pageCount}>Next &rarr;</a>
      </Link>
    </StyledPagination>
  );
}
