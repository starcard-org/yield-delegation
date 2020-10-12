import React from 'react';
import styled from 'styled-components';

import {Container} from '../index';

import Nav from './components/Nav';
import SocialNav from './components/SocialNav';
import {Row, Grid, Col} from 'react-flexbox-grid';
import Social from './components/Social';

const rallyLogoWhite = require('../../assets/img/RallyIconW.svg');
const twitch = require('../../assets/img/TwitchB.svg');
const twitter = require('../../assets/img/iconTwitter.svg');
const youtube = require('../../assets/img/IconFacebook.svg');
const instagram = require('../../assets/img/IconInstar.svg');

const Footer = () => {
  return (
    <StyledContainer>
      <FooterWrapper>
        <Grid>
          <Row>
            <Col xs={2}>
              <img src={rallyLogoWhite} className="Rally White Logo" />
            </Col>
            <Col xs={7}>
              <Nav />
              {/* <Row>
                <Copyright xs={12}>© 2020 Rally.io</Copyright>
              </Row> */}
            </Col>
            <Col xs={3}>
              <Row>
                <SocialNav />
                {/* <Col xs={6} sm={3}>
                  <a href={""}>
                    <Social src={twitch} alt={'Logo'} />
                  </a>
                </Col>
                <Col xs={6} sm={3}>
                  <Social src={instagram} alt={'Logo'} />
                </Col> */}
                {/* <a href={'https://twitter.com/rally_io'}>
                  <Col xs={6} sm={3}>
                    <Social src={twitter} alt={'Logo'} />
                  </Col>
                </a> */}
                {/* <Col xs={6} sm={3}>
                  <Social src={youtube} alt={'Logo'} />
                </Col> */}
              </Row>
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
  padding: 3em 0;
  width: 100%;
`;

const Copyright = styled(Col)`
  padding-left: 24px;
  padding-top: 2em;
`;

export default Footer;
