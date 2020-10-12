import React from 'react';
import styled from 'styled-components';

import Nav from './components/Nav';
import {Row, Grid, Col} from 'react-flexbox-grid';
import SocialNav from './components/SocialNav';

const rallyLogoWhite = require('../../assets/img/RallyIconW.svg');

const Footer = () => {
  return (
    <StyledContainer>
      <FooterWrapper>
        <Grid>
          <Row>
            <Col xs={2}>
              <img src={rallyLogoWhite} alt="Rally White Logo" />
            </Col>
            <Col xs={7}>
              <Nav />
            </Col>
            <Col xs={3}>
              <SocialNav />
            </Col>
          </Row>
        </Grid>
      </FooterWrapper>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  width: 100%;
  height: 200px;
  background-image: linear-gradient(97deg, #f1480b, #ffd800 100%);
`;

const FooterWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export default Footer;
