import styled, { css } from 'styled-components';

const Bar = styled.div`
  display: flex;
  background-color: white;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  width: 300px;
  border-radius: 5px;
  border: 1px solid grey;
  padding: 0.5rem;
  & .action {
    cursor: pointer;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0 0.5rem;
  height: 100%;
  border: none;
  background-color: inherit;
  &:focus {
    border: none;
  }
`;

export { Bar, SearchInput };
