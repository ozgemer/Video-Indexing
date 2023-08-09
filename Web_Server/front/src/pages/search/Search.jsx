import React, { useState } from 'react';
import {
  FormContainer,
  FormTitle,
  FormSubTitle,
  FormDivider,
  FormLabel,
  FormInput,
  FormSubmit,
} from '../../utils/Form.styled';
import Searchbar from '../../components/Searchbar/Searchbar';
import SearchResultsList from './SearchResultsList';
import Thumbnail from '../../assets/images/thumbnailex.jpeg';

function Search() {
  const [results, setResults] = useState();
  const searchResults = (r) => {
    console.log(r);
    setResults(r);
  };
  return (
    <FormContainer>
      <Searchbar setResults={searchResults} />
      <FormDivider />
      {results && <SearchResultsList results={results} />}
    </FormContainer>
  );
}

export default Search;
