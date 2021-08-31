import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

export const GET_USER_QUERY = gql`
  query {
    authenticatedItem {
      ... on User {
        id
        email
        name
        # TODO: cart
      }
    }
  }
`;

export function useUser() {
  const { data } = useQuery(GET_USER_QUERY);

  return data?.authenticatedItem;
}
