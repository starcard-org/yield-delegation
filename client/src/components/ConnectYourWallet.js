import React, {useState, useEffect, useCallback} from 'react';
import styled from 'styled-components';
import {Container, Button} from '../components';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {fadeIn, fadeOut} from '../theme/animations';
import WalletProviderModal from './WalletProviderModal';
import useModal from '../hooks/useModal';

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

const Spacer = styled(Row)`
  padding: ${props => (props.space || 1) * 1}em 0;
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

export const ConnectYourWallet = () => {
  const [vText, setVisibleText] = useState(false);
  const [vImage, setVisibleImage] = useState(false);

  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />, 'provider');

  const handleUnlockClick = useCallback(() => {
    onPresentWalletProviderModal();
  }, [onPresentWalletProviderModal]);

  useEffect(() => {
    setTimeout(() => {
      setVisibleImage(true);
    }, 100);

    setTimeout(() => {
      setVisibleText(true);
    }, 250);
  }, []);

  return (
    <Container size="lg">
      <Grid>
        <ImageContainer center={'xs'} visible={vImage}>
          <img src={Forms} width={'100%'} alt={'Geometric Forms'} />
        </ImageContainer>
        <Container size="sm">
          <TextContainer visible={vText}>
            <Row>
              <Title xs={12}>Connect your wallet to continue</Title>
            </Row>
            <Spacer />
            <Row center={'xs'}>
              <Col xs={5}>
                <Button
                  outline={false}
                  text="Connect your wallet"
                  onClick={handleUnlockClick}
                />
              </Col>
            </Row>
          </TextContainer>
        </Container>
      </Grid>
    </Container>
  );
};
