import React from 'react';
import styled from 'styled-components';
import {useWallet} from 'use-wallet';
import {Container, ConnectYourWallet} from '../components';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {useCall} from '../hooks/useCall';
import Pool from '../components/Pool';

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

export default () => {
  const {account} = useWallet();
  const [poolLength] = useCall('NoMintLiquidityRewardPools', 'poolLength', 0);

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
              {Array.from({length: poolLength}).map((_v, i) => (
                <Pool index={i} />
              ))}
            </Row>
          </Col>
        </Grid>
      </StyledContainer>
    </Container>
  );
};
