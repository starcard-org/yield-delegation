import React from 'react';
import styled from 'styled-components';
import {useWallet} from 'use-wallet';
import {Container, ConnectYourWallet} from '../components';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Vault from '../components/Vault';

const DAI = require('../assets/img/DAI-logo.png');
const WETH = require('../assets/img/WETH-logo.png');
const TUSD = require('../assets/img/TUSD-logo.png');
const USDC = require('../assets/img/USDC-logo.png');
const USDT = require('../assets/img/USDT-logo.png');
const YCRV = require('../assets/img/yCRV-logo.png');
const YFI = require('../assets/img/YFI-logo.png');
const crvBTC = require('../assets/img/crvBTC-logo.png');
const Forms = require('../assets/img/forms.png');

const StyledContainer = styled(Container)`
  padding-top: 2em;
  position: relative;
  z-index: 0;
`;

const ImageContainer = styled(Row)`
  position: relative;
`;

const Image = styled.img`
  z-index: 0;
  position: absolute;
`;

const VaultContainer = styled(Col)`
  z-index: 1;
`;

const VAULTS = [
  {name: 'USDC', logo: USDC},
  {name: 'TUSD', logo: TUSD},
  {name: 'DAI', logo: DAI},
  {name: 'USDT', logo: USDT},
  {name: 'YFI', logo: YFI},
  {name: 'WETH', logo: WETH},
  {name: 'YCRV', logo: YCRV},
  {name: 'crvBUSD', logo: YCRV},
  {name: 'crvBTC', logo: crvBTC},
];

export default () => {
  const {account} = useWallet();

  if (!account) {
    return <ConnectYourWallet />;
  }

  return (
    <Container size={'lg'}>
      <ImageContainer center={'xs'}>
        <Image src={Forms} width={'100%'} alt={'Geometric Forms'} />
      </ImageContainer>
      <StyledContainer size={'md'}>
        <Grid fluid>
          <Col xs={12}>
            <Row center={'xs'}>
              {VAULTS.map((v, i) => (
                <VaultContainer xs={12} key={`vault-${i}-${v}`}>
                  <Vault name={v.name} fadeTime={i * 100} logo={v.logo} />
                </VaultContainer>
              ))}
            </Row>
          </Col>
        </Grid>
      </StyledContainer>
    </Container>
  );
};
