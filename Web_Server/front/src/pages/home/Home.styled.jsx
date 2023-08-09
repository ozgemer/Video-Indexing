import styled, { css } from 'styled-components';

const SectionsContainer = styled.div``;

const Section = styled.section`
  width: 100%;
  height: 500px;
  background-color: ${(props) => props.bg};
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  & .text {
    margin: 2rem;
    padding: 1rem;
    height: calc(100% - 4rem);
    z-index: 1;
    color: white;
  }
  & h1 {
    font-family: 'Poppins';
    font-size: 3.5rem;
  }
  & .image-section {
    max-width: 40%;
  }
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Paragraph = styled.p`
  font-family: 'Rubik';
  font-weight: 400;
  letter-spacing: 0.05em;
  line-height: 2rem;
  font-size: 1.75rem;
  font-weight: 700;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  &.black {
    color: black;
  }
`;

const IconContainer = styled.div`
  margin-bottom: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.div`
  border: 2.5px rgba(102, 171, 255, 0.636) solid;
  background-color: #f1f1f194;
  box-shadow: rgba(69, 82, 201, 0.35) 0px 3px 5px;
  padding: 0.5rem;
  margin: 0.25rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    cursor: help;
    transform: scale(1.1);
  }
  transition: 0.5s ease;
`;

export {
  Section,
  SectionsContainer,
  Paragraph,
  TextContainer,
  IconContainer,
  Icon,
};
