import React, {useState, useCallback, useEffect, useContext} from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import {Card, Accordion, Button} from '../index';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {useCall} from '../../hooks/useCall';
import useAllowance from '../../hooks/useAllowance';
import useApprove from '../../hooks/useApprove';
import {DrizzleContext} from '../../context/DrizzleContext';
import {decToBn} from '../../utils/number';

import {bnToDec} from '../../utils/number';
import {fadeIn, fadeOut} from '../../theme/animations';
import {useWallet} from 'use-wallet';
import {useTranslation} from 'react-i18next';

const RLY = require('../../assets/img/RLY-logo.png');

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

const StyledInput = styled.input`
  font-family: 'Roboto Mono', monospace;
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

const Title = styled(Row)`
  font-size: 32px;
  font-weight: 500;
`;

const WalletBalance = styled(Col)`
  font-family: 'Roboto Mono', monospace;
  padding-left: 10px;
`;

const BalanceRow = styled(Row)`
  justify-content: space-between;
`;

const ContainerCol = styled(Col)`
  margin-top: 1em;
  margin-bottom: 1em;
  padding-right: 1em;
  padding-left: 1em;
`;

const Earnings = styled(Col)`
  font-family: 'Roboto Mono', monospace;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const RLYLogo = styled.img`
  height: 25px;
  width: 25px;
  padding-left: 5px;
`;

const Maximum = styled(Col)`
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: #ffd800;
  }
`;

const usePoolToken = (index, pool) => {
  const {drizzle, initialized} = useContext(DrizzleContext);
  const name = `Pool_${index}`;
  const {account} = useWallet();
  const [isApproved, setIsApproved] = useState(false);

  const [symbol] = useCall(name, 'symbol', '');
  const [balance, fetchBalance] = useCall(name, 'balanceOf', 0, account);
  const [decimals] = useCall(name, 'decimals', 0);

  const {getAllowance, allowance, setAllowance} = useAllowance(name, pool);
  const {onApprove} = useApprove(name, pool);

  useEffect(() => {
    if (!allowance || allowance <= 0) {
      return;
    }

    setIsApproved(true);
  }, [allowance]);

  const callApprove = useCallback(async () => {
    const tx = await onApprove();
    setIsApproved(tx);
  }, [onApprove, setIsApproved]);

  const callDeposit = useCallback(
    async amount => {
      if (!drizzle || !initialized) {
        return;
      }

      const value = decToBn(amount, decimals).toFixed(0, 1);
      console.log(value);
      await drizzle.contracts.NoMintLiquidityRewardPools.methods
        .deposit(index, value > balance ? balance : value)
        .send({
          from: account,
        });
    },
    [drizzle, account, initialized, decimals, balance, index]
  );

  const callWithdraw = useCallback(
    async amount => {
      if (!drizzle || !initialized) {
        return;
      }

      const value = decToBn(amount, decimals).toFixed(0, 1);
      console.log(value);
      await drizzle.contracts.NoMintLiquidityRewardPools.methods
        .withdraw(index, value)
        .send({
          from: account,
        });
    },
    [drizzle, account, initialized, index, decimals]
  );

  const getFormatedBalance = useCallback(
    () => bnToDec(new BigNumber(balance), decimals).toFixed(8),
    [balance, decimals]
  );

  return {
    name,
    symbol,
    balance,
    decimals,
    getFormatedBalance,
    getAllowance,
    setAllowance,
    isApproved,
    fetchBalance,
    callApprove,
    callDeposit,
    callWithdraw,
  };
};

const usePool = index => {
  const {account} = useWallet();
  const {drizzle, initialized} = useContext(DrizzleContext);
  const [staked, setStaked] = useState(0);

  const [earned] = useCall('NoMintLiquidityRewardPools', 'pendingRally', 0, [
    index,
    account,
  ]);

  const fetchStaked = useCallback(async () => {
    const userInfo = await drizzle.contracts.NoMintLiquidityRewardPools.methods
      .userInfo(index, account)
      .call();

    setStaked(userInfo.amount);
  }, [drizzle.contracts.NoMintLiquidityRewardPools.methods, index, account]);

  useEffect(() => {
    if (!drizzle || !initialized) {
      return;
    }

    fetchStaked();
  }, [account, drizzle, fetchStaked, index, initialized]);

  return {
    name: `Pool_${index}`,
    earned,
    staked,
    fetchStaked,
  };
};

export default ({index, fadeTime = 250}) => {
  const {t} = useTranslation();
  const [visible, setVisible] = useState(false);
  const [sAmount, setSAmount] = useState(0); // Deposit
  const [usAmount, setUSAmount] = useState(0); // Withdrawal

  const pool = usePool(index);
  const pToken = usePoolToken(index, 'NoMintLiquidityRewardPools');

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, fadeTime);
  }, [fadeTime]);

  const getFormatedEarned = useCallback(
    () => bnToDec(new BigNumber(pool.earned)).toFixed(3),
    [pool]
  );
  const getFormatedStaked = useCallback(
    () => bnToDec(new BigNumber(pool.staked), pToken.decimals).toFixed(8),
    [pool, pToken]
  );

  const getTopSection = useCallback(
    () => (
      <Grid>
        <Row>
          <Col xs={3}>
            <Title>{pool.name}</Title>
          </Col>
          <Col xs={3}>
            <Row>{getFormatedEarned()}</Row>
            <Row>{t('pool-earned')}</Row>
          </Col>
          <Col xs={3}>
            <Row>{pToken.getFormatedBalance()}</Row>
            <Row>{t('pool-balance')}</Row>
          </Col>
          <Col xs={3}>
            <Row>{getFormatedStaked()}</Row>
            <Row>{t('pool-staked')}</Row>
          </Col>
        </Row>
      </Grid>
    ),
    [pool.name, getFormatedEarned, t, pToken, getFormatedStaked]
  );

  const onApprove = useCallback(async () => {
    await pToken.callApprove();
  }, [pToken]);

  const onStakeValueChange = useCallback(
    e => {
      setSAmount(e.target.value);
    },
    [setSAmount]
  );

  const onUnstakeValueChange = useCallback(
    e => {
      setUSAmount(e.target.value);
    },
    [setUSAmount]
  );

  const onUnstake = useCallback(async () => {
    await pToken.callWithdraw(usAmount);
    pToken.fetchBalance();
    pool.fetchStaked();
    setUSAmount(0);
  }, [pToken, usAmount, pool]);

  const onMaxStakeClick = useCallback(async () => {
    setSAmount(bnToDec(new BigNumber(pToken.balance), pToken.decimals));
  }, [pToken]);

  const onMaxUnstakeClick = useCallback(async () => {
    setUSAmount(bnToDec(new BigNumber(pool.staked), pToken.decimals));
  }, [pool, pToken]);

  const onStake = useCallback(async () => {
    await pToken.callDeposit(sAmount);
    pToken.fetchBalance();
    pool.fetchStaked();
    setSAmount(0);
  }, [pToken, sAmount, pool]);

  const onHarvest = useCallback(() => {
    pToken.callWithdraw(0);
  }, [pToken]);

  return (
    <StyledCard visible={visible}>
      <Accordion top={getTopSection()}>
        <AccordionContent>
          <Row center={'xs'}>
            <Earnings xs={6}>
              <div>{getFormatedEarned()} RLY</div>
              <RLYLogo src={RLY} />
            </Earnings>
            <Col xs={6}>
              <Button text={t('pool-harvest')} onClick={onHarvest} />
            </Col>
          </Row>
          <Row>
            <ContainerCol xs={6}>
              <BalanceRow>
                <Col xs={10}>
                  <Row>
                    <Col>{t('pool-balance')}:</Col>
                    <WalletBalance>{pToken.getFormatedBalance()}</WalletBalance>
                  </Row>
                </Col>
                <Maximum onClick={onMaxStakeClick} xs={2}>
                  Max
                </Maximum>
              </BalanceRow>
              <Row>
                <StyledInput
                  value={sAmount}
                  disabled={!pToken.isApproved}
                  defaultValue={0}
                  onChange={onStakeValueChange}
                  onBlur={onStakeValueChange}
                  type="number"
                  required
                  min={0}
                  max={pToken.balance}
                />
              </Row>
            </ContainerCol>
            <ContainerCol xs={6}>
              <BalanceRow>
                <Col xs={10}>
                  <Row>
                    <Col>{t('pool-staked')}:</Col>
                    <WalletBalance>{getFormatedStaked()}</WalletBalance>
                  </Row>
                </Col>
                <Maximum onClick={onMaxUnstakeClick} xs={2}>
                  Max
                </Maximum>
              </BalanceRow>
              <Row>
                <StyledInput
                  value={usAmount}
                  defaultValue={0}
                  onChange={onUnstakeValueChange}
                  onBlur={onUnstakeValueChange}
                  type="number"
                  required
                  min={0}
                  max={pool.staked}
                />
              </Row>
            </ContainerCol>
          </Row>
          <Row center={'xs'}>
            <ContainerCol xs={6}>
              <Row>
                {!pToken.isApproved && (
                  <Button text={t('pool-approve')} onClick={onApprove} />
                )}
                {pToken.isApproved && <Button text={t('pool-stake')} onClick={onStake} />}
              </Row>
            </ContainerCol>
            <ContainerCol xs={6}>
              <Row>
                <Button text={t('pool-unstake')} onClick={onUnstake} />
              </Row>
            </ContainerCol>
          </Row>
        </AccordionContent>
      </Accordion>
    </StyledCard>
  );
};
