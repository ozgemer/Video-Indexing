import styled from 'styled-components';
const SubjectsDivider = styled.div`
  position: relative;
  border-top: 2px solid rgba(102, 171, 255, 0.8);
  margin: 1.5rem 0;
  width:100%
`;
const SubjectDisplay = styled.div`
  position:absolute;
  cursor: help;
  padding: 0.2rem;
  font-size: 0.8rem;
  border: 1px grey solid;
  border-radius: 5px;
  background: rgba(102, 171, 255, 0.8);
  color: white;
  margin-left: 50%;
  transform: translate(-50%, -50%);  
  z-index: 10;
`;
export {SubjectDisplay, SubjectsDivider}