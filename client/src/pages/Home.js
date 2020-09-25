import React from 'react';
import styled from 'styled-components';
import {Container, Button, Card} from '../components';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {useCall} from '../hooks/useCall';
import {useWallet} from 'use-wallet';
import {bnToDec} from '../utils/number';
import BigNumber from 'bignumber.js';

const homeForms = require('../assets/img/home_forms.png');

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

export default () => {
  // const {account} = useWallet();
  // const [balance] = useCall('SampleToken', 'balanceOf', 0, account);
  // const [totalSupply] = useCall('SampleToken', 'totalSupply', 0);
  // const [decimals] = useCall('SampleToken', 'decimals', 0);

  return (
    <Container size="lg">
      <Grid>
        <Row center={'xs'}>
          <img src={homeForms} width={'100%'} alt={'Geometric Forms'} />
        </Row>
        <Container size="sm">
          <Row>
            <Title xs={12}>Connect your wallet to continue</Title>
          </Row>
          <Spacer />
          <Row center={'xs'}>
            <Col xs={5}>
              <Button outline={false} text="Connect your wallet" />
            </Col>
          </Row>
        </Container>
      </Grid>
    </Container>
  );
};
