import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {Container} from '../components';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {fadeIn, fadeOut} from '../theme/animations';

const Forms = require('../assets/img/forms.png');

const Title = styled(Col)`
  font-size: 56px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
`;

const ImageContainer = styled(Row)`
  visibility: ${({visible}) => (!visible ? 'hidden' : 'visible')};
  animation: ${({visible}) => (!visible ? fadeOut : fadeIn)} 1s linear;
  transition: visibility 1s linear;
`;

const TextContainer = styled.div`
  visibility: ${({visible}) => (!visible ? 'hidden' : 'visible')};
  animation: ${({visible}) => (!visible ? fadeOut : fadeIn)} 1s linear;
  transition: visibility 1s linear;
`;

const CommingSoon = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
}`;

export const ComingSoon = () => {
  const [vText, setVisibleText] = useState(false);
  const [vImage, setVisibleImage] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setVisibleImage(true);
    }, 100);

    setTimeout(() => {
      setVisibleText(true);
    }, 250);
  }, []);

  return (
    <CommingSoon>
      <div id="stars"></div>
      <div id="stars2"></div>
      <Container size="lg">
        <Grid>
          <ImageContainer center={'xs'} visible={vImage}>
            <img src={Forms} width={'100%'} alt={'Geometric Forms'} />
          </ImageContainer>
          <Container size="sm">
            <TextContainer visible={vText}>
              <Row>
                <Title xs={12}>Coming Soon</Title>
              </Row>
            </TextContainer>
          </Container>
        </Grid>
      </Container>
    </CommingSoon>
  );
};
