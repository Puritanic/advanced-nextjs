/* eslint-disable react/jsx-props-no-spreading */
import { useLazyQuery } from '@apollo/client';
import { resetIdCounter, useCombobox } from 'downshift';
import debounce from 'lodash.debounce';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { StyledDropDown, StyledDropDownItem, StyledSearch } from './styles/StyledDropDown';

const SEARCH_PRODUCTS_QUERY = gql`
  query SEARCH_PRODUCTS_QUERY($searchTerm: String!) {
    searchTerms: allProducts(
      where: { OR: [{ name_contains_i: $searchTerm }, { description_contains_i: $searchTerm }] }
    ) {
      id
      name
      photo {
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export default function Search() {
  const router = useRouter();
  const [findItems, { loading, data }] = useLazyQuery(SEARCH_PRODUCTS_QUERY, {
    fetchPolicy: 'no-cache', // always go to the network - don't cache search results
  });
  const items = data?.searchTerms || [];
  const debouncedFindItems = debounce(findItems, 350);

  resetIdCounter(); // Takes care of any SSR issues we might have with Downshift
  const { isOpen, inputValue, getItemProps, getMenuProps, getInputProps, getComboboxProps, highlightedIndex } =
    useCombobox({
      items,
      onInputValueChange() {
        debouncedFindItems({
          variables: { searchTerm: inputValue },
        });
      },
      onSelectedItemChange({ selectedItem }) {
        router.push({
          pathname: `/product/${selectedItem.id}`,
        });
      },
      itemToString: (item) => item?.name || '',
    });

  return (
    <StyledSearch>
      <div {...getComboboxProps()}>
        <input
          type="search"
          {...getInputProps({
            type: 'search',
            placeholder: 'Search for an item',
            id: 'search',
            className: loading ? 'loading' : null,
          })}
        />
      </div>
      <StyledDropDown {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <StyledDropDownItem
              {...getItemProps({ item, index })}
              key={item.id}
              highlighted={index === highlightedIndex}
            >
              <Image src={item.photo.image.publicUrlTransformed} alt={item.name} width={50} height={50} />
              {item.name}
            </StyledDropDownItem>
          ))}
        {isOpen && !items.length && !loading && (
          <StyledDropDownItem>Sorry, No items found for {inputValue}</StyledDropDownItem>
        )}
      </StyledDropDown>
    </StyledSearch>
  );
}
