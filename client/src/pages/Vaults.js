import React from 'react';
import styled from 'styled-components';
import {Container} from '../components';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Vault from '../components/Vault';

const StyledContainer = styled(Container)`
  padding-top: 2em;
`;

const Spacer = styled(Row)`
  padding: ${props => (props.space || 1) * 1}em 0;
`;

export default () => {
  return (
    <StyledContainer size={'md'}>
      <Grid fluid>
        <Col xs={12}>
          <Row center={'xs'}>
            <Col xs={12}>
              <Vault
                vaultName={'STYDV'}
                tokenName={'SampleToken'}
                vaultAcronym={'yST'}
                tokenAcronym={'ST'}
              />
            </Col>
            <Col xs={12}>
              <Vault
                vaultName={'STYDV'}
                tokenName={'SampleToken'}
                vaultAcronym={'yST'}
                tokenAcronym={'ST'}
              />
            </Col>
            <Col xs={12}>
              <Vault
                vaultName={'STYDV'}
                tokenName={'SampleToken'}
                vaultAcronym={'yST'}
                tokenAcronym={'ST'}
              />
            </Col>
            <Col xs={12}>
              <Vault
                vaultName={'STYDV'}
                tokenName={'SampleToken'}
                vaultAcronym={'yST'}
                tokenAcronym={'ST'}
              />
            </Col>
            <Col xs={12}>
              <Vault
                vaultName={'STYDV'}
                tokenName={'SampleToken'}
                vaultAcronym={'yST'}
                tokenAcronym={'ST'}
              />
            </Col>
          </Row>
        </Col>
      </Grid>
    </StyledContainer>
  );
};
