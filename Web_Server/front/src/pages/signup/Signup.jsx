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

function Signup() {
  const [userName, setUserName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  function onSubmit() {
    console.log(
      `username: ${userName}\npassword: ${password}\nemail: ${email}`
    );
  }
  return (
    <>
      <FormContainer>
        <FormTitle>Sign Up</FormTitle>
        <FormSubTitle>become a member today!</FormSubTitle>
        <FormDivider />
        <FormLabel>User Name</FormLabel>
        <FormInput onBlur={(e) => setUserName(e.target.value)} />
        <FormLabel>Email</FormLabel>
        <FormInput className='large' onBlur={(e) => setEmail(e.target.value)} />
        <FormLabel>Password</FormLabel>
        <FormInput onBlur={(e) => setPassword(e.target.value)} />
        <FormSubmit onClick={onSubmit}>Submit</FormSubmit>
      </FormContainer>
    </>
  );
}
export default Signup;
