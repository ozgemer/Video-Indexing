import styled, { css } from 'styled-components';

const FormContainer = styled.div`
  background: #f9f9f9;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 3px 10px;
  width: 80%;
  margin: 1rem auto;
  border-radius: 5px;
  padding: 1rem;
`;

const FormTitle = styled.div`
  margin: 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 500;
`;

const FormSubTitle = styled.div`
  margin: 0.5rem 0;
  font-size: 1rem;
  font-weight: 400;
  color: #5b5b5b;
`;

const FormDivider = styled.hr`
  width: calc(100% + 2rem);
  transform: translateX(-1rem);
  background: #d9d9d9;
  height: 2px;
  border: none;
  margin: 1rem 0;
`;

const FormLabel = styled.label`
  color: #1f1f1f;
  font-size: 0.9rem;
  display: block;
  margin: 0.75rem 0 0.25rem 0;
`;

const FormInput = styled.input`
  border-radius: 5px;
  height: 1.5rem;
  padding: 0.25rem;
  border: 0.5px solid #cccccc;
  width: 150px;
  max-width: 100%;
  &.large {
    width: 300px;
  }
`;

const FormSelect = styled.select`
  border-radius: 5px;
  height: 1.5rem;
  border: 0.5px solid #cccccc;
  width: 150px;
  max-width: 100%;
`;

const FormSubmit = styled.button`
  border-radius: 5px;
  border: 0.5px solid #cccccc;
  display: block;
  margin: 1rem auto 0.25rem auto;
  width: 100px;
  height: 25px;
  cursor: pointer;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  transition: 0.2s ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
`;

export {
  FormContainer,
  FormTitle,
  FormSubTitle,
  FormDivider,
  FormLabel,
  FormInput,
  FormSubmit,
  FormSelect,
};
