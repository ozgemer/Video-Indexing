import React from 'react';
import { Searchul, Searchli } from './SearchResults.styled';
import { FormSubTitle } from '../../utils/Form.styled';
import VideoItem from './components/VideoItem';

function SearchResultsList({ results, ignore, focusTopic }) {
  console.log(ignore);
  return (
    <>
      <FormSubTitle>{`${ignore ? '' : 'search results:'}`}</FormSubTitle>
      <Searchul>
        {results?.map((r, i) =>
          r.id !== ignore ? (
            <VideoItem key={i} video={r} focusTopic={focusTopic} />
          ) : null
        )}
      </Searchul>
    </>
  );
}

export default SearchResultsList;
