import React from 'react';
import styled from 'styled-components';

import {Container} from '../index';

import AccountButton from './components/AccountButton';
import Nav from './components/Nav';
import {Row, Grid, Col} from 'react-flexbox-grid';

const Footer = () => {
  return (
    <StyledContainer>
      <Container size="lg"></Container>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  width: 100%;
  height: 200px;
  background-image: linear-gradient(97deg, #f1480b, #ffd800 100%);
`;

export default Footer;
