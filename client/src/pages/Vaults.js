import React from 'react';
import styled from 'styled-components';
import {useWallet} from 'use-wallet';
import {Container, ConnectYourWallet} from '../components';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Vault from '../components/Vault';

const StyledContainer = styled(Container)`
  padding-top: 2em;
`;

const DAI = require('../assets/img/DAI-logo.png');
const WETH = require('../assets/img/WETH-logo.png');
const TUSD = require('../assets/img/TUSD-logo.png');
const USDC = require('../assets/img/USDC-logo.png');
const USDT = require('../assets/img/USDT-logo.png');
const YCRV = require('../assets/img/yCRV-logo.png');
const YFI = require('../assets/img/YFI-logo.png');
const crvBTC = require('../assets/img/crvBTC-logo.png');

const VAULTS = [
  {name: 'USDC', logo: USDC},
  {name: 'TUSD', logo: TUSD},
  {name: 'DAI', logo: DAI},
  {name: 'USDT', logo: USDT},
  {name: 'YFI', logo: YFI},
  {name: 'WETH', logo: WETH},
  {name: 'YCRV', logo: YCRV},
  {name: 'crvBUSD', logo: crvBTC},
  {name: 'crvBTC', logo: crvBTC},
];

export default () => {
  const {account} = useWallet();

  if (!account) {
    return <ConnectYourWallet />;
  }

  return (
    <StyledContainer size={'md'}>
      <Grid fluid>
        <Col xs={12}>
          <Row center={'xs'}>
            {VAULTS.map((v, i) => (
              <Col xs={12} key={`vault-${i}-${v}`}>
                <Vault name={v.name} fadeTime={i * 100} logo={v.logo} />
              </Col>
            ))}
          </Row>
        </Col>
      </Grid>
    </StyledContainer>
  );
};
