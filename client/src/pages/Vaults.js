import React from 'react';
import styled from 'styled-components';
import {useWallet} from 'use-wallet';
import {Container, ConnectYourWallet} from '../components';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Vault from '../components/Vault';

const StyledContainer = styled(Container)`
  padding-top: 2em;
`;

const Spacer = styled(Row)`
  padding: ${props => (props.space || 1) * 1}em 0;
`;

const VAULTS = [
  'USDC',
  'YCRV',
  'TUSD',
  'DAI',
  'USDT',
  'YFI',
  'crvBUSD',
  'crvBTC',
  'WETH',
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
                <Vault name={v} fadeTime={i * 100} />
              </Col>
            ))}
          </Row>
        </Col>
      </Grid>
    </StyledContainer>
  );
};
