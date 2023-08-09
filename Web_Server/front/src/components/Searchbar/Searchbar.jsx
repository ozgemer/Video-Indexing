import React, { useState } from 'react';
import { Bar, SearchInput } from './Searchbar.styled';
import Search from '../../assets/icons/search.png';
import Cancel from '../../assets/icons/cancel.png';
import { SearchVideoByName } from '../../services/SearchService';

function Searchbar({ setResults }) {
  const [search, setSearch] = useState();
  const clear = () => {
    document.getElementById('search').value = '';
    setSearch(null);
  };
  const query = async (e) => {
    e.preventDefault();
    const searchQuery = document.getElementById('search').value;
    await SearchVideoByName(searchQuery).then((d) => setResults(d));
  };
  return (
    <form onSubmit={query}>
      <Bar>
        <img className='action' src={Search} height={18} onClick={query} />
        <SearchInput
          id='search'
          type='text'
          placeholder='Search'
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <img className='action' src={Cancel} height={20} onClick={clear} />
        )}
      </Bar>
    </form>
  );
}

export default Searchbar;
