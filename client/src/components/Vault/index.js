import React, {useState, useCallback, useEffect} from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import {Card, Accordion, Button} from '../index';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {useDeposit} from '../../hooks/useDeposit';
import useApprove from '../../hooks/useApprove';
import {useCall} from '../../hooks/useCall';
import {bnToDec, decToBn} from '../../utils/number';
import {fadeIn, fadeOut} from '../../theme/animations';
import {useWallet} from 'use-wallet';

const StyledCard = styled(Card)`
  border: solid 1px rgba(255, 255, 255, 0.5);
  background-color: #000000;
  margin-bottom: 1em;
  border-radius: 17px;

  visibility: ${({visible}) => (!visible ? 'hidden' : 'visible')};
  animation: ${({visible}) => (!visible ? fadeOut : fadeIn)} 1s linear;
  transition: visibility 1s linear;
`;

const Percentage = styled(Col)`
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: #ffd800;
  }
`;

const PercentageRow = styled(Row)`
  margin-top: 1em;
  margin-bottom: 1em;
`;

const ContainerCol = styled(Col)`
  margin-top: 1em;
  margin-bottom: 1em;
  padding-right: 1em;
  padding-left: 1em;
`;

const Title = styled.div`
  font-size: 24px;
  padding-bottom: 0px;
  text-align: left;
`;

const Subtitle = styled.div`
  font-size: 16px;
  padding-top: 0px;
  text-align: left;
`;

const StyledInput = styled.input`
  font-size: 16px;
  padding-left: 1em;
  text-align: left;
  height: 40px;
  color: #4d4d4d;
  width: 100%;
`;

const AccordionContent = styled(Grid)`
  padding: 20px;
`;

export default ({tokenName, vaultName, tokenAcronym, vaultAcronym, fadeTime = 250}) => {
  const {account} = useWallet();
  const [visible, setVisible] = useState(false);

  const [tokenBalance] = useCall(tokenName, 'balanceOf', 0, account);
  const [pricePerFullShare] = useCall(vaultName, 'getPricePerFullShare', 0);
  const [vaultTokenBalance] = useCall(vaultName, 'balanceOf', 0, account);
  const [decimals] = useCall(tokenName, 'decimals', 0);
  const [vaultDecimals] = useCall(vaultName, 'decimals', 0);
  const [isApproved, setIsApproved] = useState(false);
  const [dAmount, setDAmount] = useState(0); // Deposit
  const [wAmount, setWAmount] = useState(0); // Withdrawal
  const {onApprove} = useApprove(tokenName, vaultName);
  const deposit = useDeposit(vaultName);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, fadeTime);
  }, []);

  const getFormatedBalance = useCallback(
    balance => bnToDec(new BigNumber(balance), decimals).toFixed(2),
    [decimals]
  );

  const getTopSection = useCallback(
    () => (
      <Grid>
        <Row center={'xs'}>
          <Col xs={8}>
            <Title>{vaultName}</Title>
            <Subtitle>{tokenName}</Subtitle>
          </Col>
          <Col xs={4}>
            <Subtitle>Available to deposit</Subtitle>
            <Title>
              {getFormatedBalance(tokenBalance)} {tokenAcronym}
            </Title>
          </Col>
        </Row>
      </Grid>
    ),
    [vaultName, tokenName, getFormatedBalance, tokenBalance, tokenAcronym]
  );

  const onPercentageClick = (s, b, p) => () => {
    s(b * p);
  };

  const getPercentageRow = (setter, balance) => (
    <PercentageRow around={'xs'}>
      <Percentage onClick={onPercentageClick(setter, balance, 0.25)}>25%</Percentage>
      <Percentage onClick={onPercentageClick(setter, balance, 0.5)}>50%</Percentage>
      <Percentage onClick={onPercentageClick(setter, balance, 0.75)}>75%</Percentage>
      <Percentage onClick={onPercentageClick(setter, balance, 1)}>100%</Percentage>
    </PercentageRow>
  );

  return (
    <StyledCard visible={visible}>
      <Accordion top={getTopSection()}>
        <AccordionContent>
          <Row>
            <ContainerCol xs={6}>
              <Row>
                Your Wallet: {getFormatedBalance(tokenBalance)} {tokenAcronym}
              </Row>
              <Row>
                <StyledInput
                  disabled={!isApproved}
                  defaultValue={dAmount}
                  onBlur={e => {
                    setDAmount(e.target.value);
                  }}
                  type="number"
                  required
                />
              </Row>
              {getPercentageRow(setDAmount)}
            </ContainerCol>
            <ContainerCol xs={6}>
              <Row>
                {bnToDec(new BigNumber(pricePerFullShare), decimals) *
                  bnToDec(new BigNumber(vaultTokenBalance), vaultDecimals).toFixed(
                    2
                  )}{' '}
                {tokenAcronym} ({getFormatedBalance(vaultTokenBalance)} {vaultAcronym})
              </Row>
              <Row>
                <StyledInput
                  defaultValue={wAmount}
                  disabled={!isApproved}
                  onBlur={e => {
                    setWAmount(e.target.value);
                  }}
                  type="number"
                  required
                />
              </Row>
              {getPercentageRow(setWAmount)}
            </ContainerCol>
          </Row>
          <Row center={'xs'}>
            {!isApproved && (
              <Col xs={12}>
                <Button
                  onClick={async () => {
                    const approved = await onApprove();
                    setIsApproved(approved);
                  }}
                  text={'Approve'}
                />
              </Col>
            )}
            {isApproved && (
              <>
                <Col xs={6}>
                  <Row>
                    <Button
                      onClick={() => {
                        deposit(decToBn(dAmount));
                      }}
                      text={'Deposit'}
                    />
                  </Row>
                </Col>
                <Col xs={6}>
                  <Row center={'xs'}>
                    <Col xs={6}>
                      <Button text={'Withdraw'} />
                    </Col>
                    <Col xs={6}>
                      <Button text={'Withdraw All'} />
                    </Col>
                  </Row>
                </Col>
              </>
            )}
          </Row>
        </AccordionContent>
      </Accordion>
    </StyledCard>
  );
};
