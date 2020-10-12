import React, {useState, useCallback, useEffect} from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import {Card, Accordion} from '../index';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {useCall} from '../../hooks/useCall';
import {bnToDec} from '../../utils/number';
import {fadeIn, fadeOut} from '../../theme/animations';
import {useWallet} from 'use-wallet';
import {useTranslation} from 'react-i18next';

const StyledCard = styled(Card)`
  width: 100%;
  background-color: #4d4d4d;
  margin-bottom: 1em;
  border-radius: 17px;
  z-index: 1;
  font-size: 16px;

  .accordion-top {
    height: 120px;
    border-radius: 16px;
    box-shadow: 0 6px 6px 0 rgba(0, 0, 0, 0.23);
    background-image: linear-gradient(93deg, #f1480b 21%, #ffd800 103%);
  }

  visibility: ${({visible}) => (!visible ? 'hidden' : 'visible')};
  animation: ${({visible}) => (!visible ? fadeOut : fadeIn)} 1s linear;
  transition: visibility 1s linear;
`;

const AccordionContent = styled(Grid)`
  padding: 20px;
`;

const Title = styled(Row)`
  font-size: 32px;
  font-weight: 500;
`;

const usePoolToken = index => {
  const pool = `Pool_${index}`;
  const {account} = useWallet();
  const [symbol] = useCall(pool, 'symbol', '');
  const [balance, fetchBalance] = useCall(pool, 'balanceOf', 0, account);
  const [decimals] = useCall(pool, 'decimals', 0);

  const getFormatedBalance = useCallback(
    () => bnToDec(new BigNumber(balance), decimals).toFixed(8),
    [balance, decimals]
  );

  return {
    name: pool,
    symbol,
    balance,
    decimals,
    getFormatedBalance,
    fetchBalance,
  };
};

const usePool = index => {
  const {account} = useWallet();
  const [earned] = useCall('NoMintLiquidityRewardPools', 'pendingRally', 0, [
    index,
    account,
  ]);
  const [staked] = useCall('NoMintLiquidityRewardPools', 'userInfo', 0, [index, account]);

  return {
    name: `Pool_${index}`,
    earned,
    staked,
  };
};

export default ({index, fadeTime = 250}) => {
  const {t} = useTranslation();
  const [visible, setVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [sAmount, setSAmount] = useState(0); // Deposit
  const [usAmount, setUSAmount] = useState(0); // Withdrawal

  const poolToken = usePoolToken(index);
  const pool = usePool(index);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, fadeTime);
  }, [fadeTime]);

  const getTopSection = useCallback(
    () => (
      <Grid>
        <Row>
          <Col xs={3}>
            <Title>{pool.name}</Title>
          </Col>
          <Col xs={3}>
            <Row>{pool.earned.toFixed(3)}</Row>
            <Row>{t('pool-earned')}</Row>
          </Col>
          <Col xs={3}>
            <Row>{poolToken.getFormatedBalance()}</Row>
            <Row>{t('pool-balance')}</Row>
          </Col>
          <Col xs={3}>
            <Row>{pool.staked.toFixed(8)}</Row>
            <Row>{t('pool-staked')}</Row>
          </Col>
        </Row>
      </Grid>
    ),
    [pool.earned, pool.name, pool.staked, poolToken, t]
  );

  return (
    <StyledCard visible={visible}>
      <Accordion top={getTopSection()} isLoading={isLoading}>
        <AccordionContent>{JSON.stringify(pool, null, 2)}</AccordionContent>
      </Accordion>
    </StyledCard>
  );
};
