import React, {useState, useCallback} from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import {Card, Accordion, Button} from '../index';
import {Grid, Row, Col} from 'react-flexbox-grid';
import useAllowance from '../../hooks/useAllowance';
import {useDeposit} from '../../hooks/useDeposit';
import useApprove from '../../hooks/useApprove';
import {useCall} from '../../hooks/useCall';
import {bnToDec} from '../../utils/number';
import {useWallet} from 'use-wallet';

const StyledCard = styled(Card)`
  border: solid 1px rgba(255, 255, 255, 0.5);
  background-color: #000000;
  margin-bottom: 1em;
  border-radius: 17px;
`;

const Percentage = styled(Col)`
  font-size: 14px;
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

export default ({tokenName, vaultName, tokenAcronym, vaultAcronym}) => {
  const {account} = useWallet();
  const [tokenBalance] = useCall(tokenName, 'balanceOf', 0, account);
  const [pricePerFullShare] = useCall(vaultName, 'getPricePerFullShare', 0);
  const [vaultTokenBalance] = useCall(vaultName, 'balanceOf', 0, account);
  const [decimals] = useCall(tokenName, 'decimals', 0);
  const [vaultDecimals] = useCall(vaultName, 'decimals', 0);
  const [isApproved, setIsApproved] = useState(false);
  const [amount, setAmount] = useState(0);
  const {allowance} = useAllowance(tokenName, vaultName);
  const {onApprove} = useApprove(tokenName, vaultName);
  const deposit = useDeposit(vaultName);

  const getFormatedBalance = useCallback(balance =>
    bnToDec(new BigNumber(balance), decimals).toFixed(2)
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

  const getPercentageRow = () => (
    <PercentageRow around={'xs'}>
      <Percentage>25%</Percentage>
      <Percentage>50%</Percentage>
      <Percentage>75%</Percentage>
      <Percentage>100%</Percentage>
    </PercentageRow>
  );

  return (
    <StyledCard>
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
                  defaultValue={amount}
                  onBlur={e => {
                    setAmount(e.target.value);
                  }}
                  type="number"
                  required
                />
              </Row>
              {getPercentageRow()}
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
                  defaultValue={amount}
                  disabled={!isApproved}
                  onBlur={e => {
                    setAmount(e.target.value);
                  }}
                  type="number"
                  required
                />
              </Row>
              {getPercentageRow()}
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
                        deposit(amount);
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
