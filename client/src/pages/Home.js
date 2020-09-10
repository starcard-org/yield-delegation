import React from 'react';
import styled from 'styled-components';
import {Container, Button, Card} from '../components';
import {Grid, Row, Col} from 'react-flexbox-grid';
const mrRally = require('../assets/img/mr-rally.png');

const Title = styled(Col)`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
`;

const SubTitle = styled(Col)`
  text-align: center;
`;

const CenterContainer = styled(Col)`
  padding: 1rem 0rem;
`;

const CenterContainerWithSub = styled(Col)`
  padding-top: 1rem;
`;

const CountDown = styled(Col)`
  font-size: 48px;
  padding-top: 1rem;
  font-weight: bold;
`;

const Description = styled(Col)`
  padding-bottom: 1rem;
  font-size: 12px;
`;

const StyledCard = styled(Card)`
  padding: 1rem;
`;

const CardTitle = styled.div`
  font-size: 48px;
  padding: 8px 30px;
  padding-bottom: 0px;
  text-align: left;
`;
const CardSubtitle = styled.div`
  font-size: 12px;
  padding: 8px 30px;
  padding-top: 0px;
  text-align: left;
`;

export default () => {
  return (
    <Container>
      <Grid fluid>
        <Col xs={12}>
          <Row center={'xs'}>
            <Col xs={8} sm={4}>
              <img src={mrRally} width={'100%'} alt={'Mr. Rally Logo'} />
            </Col>
          </Row>
        </Col>
        <Row>
          <Title xs={12}>Mr. Rally is Ready</Title>
        </Row>
        <Row>
          <SubTitle xs={12}>
            Stake Uniswap LP tokens to claim your very own yummy SUSHI!
          </SubTitle>
        </Row>
        <Row center={'xs'}>
          <CenterContainer xs={8} sm={6} md={4}>
            <Button size="sm" text="view migration checklist" />
          </CenterContainer>
        </Row>
        <Row>
          <Col xs={12}>
            <Row center={'xs'}>
              <Col xs={12} sm={5}>
                <StyledCard>
                  <CardTitle>0.00000</CardTitle>
                  <CardSubtitle>Balance</CardSubtitle>
                </StyledCard>
              </Col>
              <Col xs={12} sm={5}>
                <StyledCard>
                  <CardTitle>0.00000</CardTitle>
                  <CardSubtitle>Total supply</CardSubtitle>
                </StyledCard>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row center={'xs'}>
          <CountDown xs={12}>00:00:00:00</CountDown>
          <Description xs={12}>type something here</Description>
        </Row>
        <Row center={'xs'}>
          <CenterContainerWithSub xs={8} sm={6} md={4}>
            <Button size="sm" text="Approve V2 Migration" />
          </CenterContainerWithSub>
          <Description xs={12}>type something here</Description>
        </Row>
      </Grid>
    </Container>
  );
};
