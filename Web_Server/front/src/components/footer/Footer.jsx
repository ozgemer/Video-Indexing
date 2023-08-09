import React from 'react';
import styled from 'styled-components';
import College from '../../assets/images/college.png';
import Logo from '../../assets/images/logo.png';

const FooterStyled = styled.div`
  width: 100%;
  height: 75px;
  border-top: 5px solid #d0dae8;
  background-color: #deeafa;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

function Footer() {
  return (
    <FooterStyled>
      <div style={{ margin: '1rem' }}>
        <img src={Logo} width={50} height={50} />
      </div>
      <div style={{ fontSize: '0.8rem', fontFamily: 'Roboto Slab' }}>
        Project by Inon Angel, Or Ben Nun, Shahar Kozenyuk, Ofir Gur Cohen, Oz
        Gemer
      </div>
      <div style={{ margin: '1rem' }}>
        <img src={College} width={60} height={60} />
      </div>
    </FooterStyled>
  );
}

export default Footer;
