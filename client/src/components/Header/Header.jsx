import React from 'react';
import styled from 'styled-components';

import {Container} from '../index';

import AccountButton from './components/AccountButton';
import Nav from './components/Nav';
import {Row, Grid, Col} from 'react-flexbox-grid';

const logo = require('../../assets/img/Rally Logo.svg');

const Header = () => {
  return (
    <Container size="lg">
      <TopBarWrapper>
        <Grid>
          <Row center={'xs'}>
            <Col xs={2}>
              <img src={logo} className="logo" />
            </Col>
            <Col xs={10}>&nbsp;</Col>
          </Row>
        </Grid>
      </TopBarWrapper>
    </Container>
  );
};

const TopBarWrapper = styled.div`
  padding: 1em 0;
  width: 100%;
`;

const StyledAccountButtonWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  @media (max-width: 400px) {
    justify-content: center;
    width: auto;
  }
`;

export default Header;
