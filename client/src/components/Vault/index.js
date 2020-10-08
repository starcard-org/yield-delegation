import React, {useState, useCallback, useEffect} from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import {Card, Accordion, Button} from '../index';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {useDeposit} from '../../hooks/useDeposit';
import {useWithdraw} from '../../hooks/useWithdraw';
import useApprove from '../../hooks/useApprove';
import {useCall} from '../../hooks/useCall';
import {bnToDec} from '../../utils/number';
import {fadeIn, fadeOut} from '../../theme/animations';
import {useWallet} from 'use-wallet';
import Select from 'react-select';
import useAllowance from '../../hooks/useAllowance';

const TITLE = {
  'yDAI+yUSDC+yUSDT+yTUSD': 'curve.fi/y LP',
  'yyDAI+yUSDC+yUSDT+yTUSD': 'curve.fi/y LP',
  'yDAI+yUSDC+yUSDT+yBUSD': 'curve.fi/busd LP',
  'yyDAI+yUSDC+yUSDT+yBUSD': 'curve.fi/busd LP',
  crvRenWSBTC: 'curve.fi/sbtc LP',
  ycrvRenWSBTC: 'curve.fi/sbtc LP',
};

const SYMBOL = {
  'yDAI+yUSDC+yUSDT+yTUSD': 'yCRV',
  'yyDAI+yUSDC+yUSDT+yTUSD': 'yUSD',
  'rdyDAI+yUSDC+yUSDT+yTUSD': 'yUSD',
  'yDAI+yUSDC+yUSDT+yBUSD': 'crvBUSD',
  'yyDAI+yUSDC+yUSDT+yBUSD': 'ycrvBUSD',
  'rdyDAI+yUSDC+yUSDT+yBUSD': 'ycrvBUSD',
  crvRenWSBTC: 'crvBTC',
  ycrvRenWSBTC: 'ycrvBTC',
  rdcrvRenWSBTC: 'ycrvBTC',
};

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

const TokenSelector = styled(Select)`
  width: 100%;
  color: #000000;
  text-align: left;
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

const VaultImage = styled.img`
  height: 40px;
`;

const VaultTopSection = styled(Row)`
  align-items: center;
`;

const TOKEN_TYPES = {
  UNDERLYING: 0,
  Y_TOKEN: 1,
};

const useToken = (name, type = TOKEN_TYPES.UNDERLYING) => {
  const vault = `yVault${name}`;
  const token = type === TOKEN_TYPES.UNDERLYING ? name : `yToken${name}`;

  const [isApproved, setIsApproved] = useState(false);

  const {account} = useWallet();

  const [symbol] = useCall(token, 'symbol', '');
  const [balance, fetchBalance] = useCall(token, 'balanceOf', 0, account);
  const [decimals] = useCall(token, 'decimals', 0);
  const {onApprove} = useApprove(token, vault);
  const {getAllowance, allowance, setAllowance} = useAllowance(token, vault);
  const deposit = useDeposit(vault);
  const withdraw = useWithdraw(vault);

  useEffect(() => {
    if (!allowance || allowance <= 0) {
      return;
    }

    setIsApproved(true);
  }, [allowance]);

  const getFormatedBalance = useCallback(
    () => bnToDec(new BigNumber(balance), decimals).toFixed(2),
    [balance, decimals]
  );

  const callApprove = useCallback(async () => {
    const tx = await onApprove();
    setIsApproved(tx);
  }, [onApprove, setIsApproved]);

  const callDeposit = useCallback(
    async amount => {
      await deposit(
        amount > balance ? balance : amount,
        decimals,
        type === TOKEN_TYPES.UNDERLYING ? 'deposit' : 'deposityToken'
      );

      fetchBalance();
    },
    [deposit, balance, decimals, type, fetchBalance]
  );

  const callWithdraw = useCallback(
    async amount => {
      await withdraw(amount > balance ? balance : amount, decimals);
      fetchBalance();
    },
    [withdraw, balance, decimals, fetchBalance]
  );

  return {
    name: token,
    title: TITLE[symbol] ? TITLE[symbol] : symbol,
    symbol: SYMBOL[symbol] ? SYMBOL[symbol] : symbol,
    decimals,
    balance,
    allowance,
    getAllowance,
    setAllowance,
    isApproved,
    getFormatedBalance,
    callApprove,
    callDeposit,
    callWithdraw,
  };
};

const useVault = name => {
  const vault = `yVault${name}`;
  const {account} = useWallet();
  const [symbol] = useCall(vault, 'symbol', '');
  const [balance, fetchBalance] = useCall(vault, 'balanceOf', 0, account);
  const [pricePerFullShare] = useCall(vault, 'getPricePerFullShare', 0);
  const [decimals] = useCall(vault, 'decimals', 0);

  const getFormatedBalance = useCallback(
    () => bnToDec(new BigNumber(balance), decimals).toFixed(2),
    [balance, decimals]
  );

  return {
    name: vault,
    symbol: SYMBOL[symbol] ? SYMBOL[symbol] : symbol,
    balance,
    pricePerFullShare,
    decimals,
    getFormatedBalance,
    fetchBalance,
  };
};

export default ({name, logo, fadeTime = 250}) => {
  const [options, setOptions] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const [dAmount, setDAmount] = useState(0); // Deposit
  const [wAmount, setWAmount] = useState(0); // Withdrawal

  const vault = useVault(name);
  const yToken = useToken(name, TOKEN_TYPES.Y_TOKEN);
  const token = useToken(name);

  const [activeTokenName, setActiveTokenName] = useState(name);

  const getActiveToken = useCallback(() => {
    return activeTokenName === token.name ? token : yToken;
  }, [activeTokenName, token, yToken]);

  useEffect(() => {
    if (!token || !yToken || !token.symbol || !yToken.symbol) {
      return;
    }

    if (options.length > 1) {
      isLoading && setLoading(false);
      return;
    }

    setOptions([
      {value: token.name, label: token.symbol},
      {value: yToken.name, label: yToken.symbol},
    ]);
  }, [token, yToken, isLoading, options.length]);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, fadeTime);
  }, [fadeTime]);

  const getTopSection = useCallback(
    () => (
      <Grid>
        <VaultTopSection>
          <Col xs={1}>
            <VaultImage src={logo} />
          </Col>
          <Col xs={11}>
            <Row center={'xs'}>
              <Col xs={8}>
                <Title>{yToken.title}</Title>
                <Subtitle>
                  Delegate earnings on deposist to Yearn {token.symbol} vault
                </Subtitle>
              </Col>
              <Col xs={4}>
                <Subtitle>Available to deposit</Subtitle>
                <Row>
                  <Title>
                    {token.getFormatedBalance()} {token.symbol}
                  </Title>
                </Row>
                <Row>
                  <Title>
                    {yToken.getFormatedBalance()} {yToken.symbol}
                  </Title>
                </Row>
              </Col>
            </Row>
          </Col>
        </VaultTopSection>
      </Grid>
    ),
    [logo, token, yToken]
  );

  const onWithdrawPercentageClick = useCallback(
    percentage => () => {
      setWAmount(bnToDec(new BigNumber(vault.balance * percentage), vault.decimals));
    },
    [vault]
  );

  const onDepositPercentageClick = useCallback(
    percentage => () => {
      setDAmount(
        bnToDec(
          new BigNumber(getActiveToken().balance * percentage),
          getActiveToken().decimals
        )
      );
    },
    [getActiveToken]
  );

  return (
    <StyledCard visible={visible}>
      <Accordion top={getTopSection()} isLoading={isLoading}>
        <AccordionContent>
          <Row>Select Active Token</Row>
          <Row>
            <TokenSelector
              defaultValue={options[0]}
              name="Active Token"
              options={options}
              onChange={o => {
                setActiveTokenName(o.value);
              }}
            />
          </Row>
          <Row>
            <ContainerCol xs={6}>
              <Row>
                Your Wallet: {token.getFormatedBalance()} {token.symbol}
              </Row>
              <Row>
                <StyledInput
                  value={dAmount}
                  disabled={!getActiveToken().isApproved}
                  defaultValue={0}
                  onChange={e => {
                    setDAmount(e.target.value);
                  }}
                  onBlur={e => {
                    setDAmount(e.target.value);
                  }}
                  type="number"
                  required
                  min={0}
                  max={getActiveToken().balance}
                />
              </Row>
              <PercentageRow around={'xs'}>
                <Percentage onClick={onDepositPercentageClick(0.25)}>25%</Percentage>
                <Percentage onClick={onDepositPercentageClick(0.5)}>50%</Percentage>
                <Percentage onClick={onDepositPercentageClick(0.75)}>75%</Percentage>
                <Percentage onClick={onDepositPercentageClick(1)}>100%</Percentage>
              </PercentageRow>
            </ContainerCol>
            <ContainerCol xs={6}>
              <Row>
                {bnToDec(new BigNumber(vault.pricePerFullShare), vault.decimals) *
                  bnToDec(new BigNumber(vault.balance), vault.decimals).toFixed(2)}{' '}
                {token.symbol} ({vault.getFormatedBalance()} {vault.symbol})
              </Row>
              <Row>
                <StyledInput
                  value={wAmount}
                  defaultValue={0}
                  disabled={!getActiveToken().isApproved}
                  onChange={e => {
                    setWAmount(e.target.value);
                  }}
                  onBlur={e => {
                    setWAmount(e.target.value);
                  }}
                  type="number"
                  required
                  min={0}
                  max={vault.balance}
                />
              </Row>
              <PercentageRow around={'xs'}>
                <Percentage onClick={onWithdrawPercentageClick(0.25)}>25%</Percentage>
                <Percentage onClick={onWithdrawPercentageClick(0.5)}>50%</Percentage>
                <Percentage onClick={onWithdrawPercentageClick(0.75)}>75%</Percentage>
                <Percentage onClick={onWithdrawPercentageClick(1)}>100%</Percentage>
              </PercentageRow>
            </ContainerCol>
          </Row>
          <Row center={'xs'}>
            {!getActiveToken().isApproved && (
              <Col xs={12}>
                <Button
                  onClick={async () => {
                    await getActiveToken().callApprove();
                  }}
                  text={'Approve'}
                />
              </Col>
            )}
            {getActiveToken().isApproved && (
              <>
                <Col xs={6}>
                  <Row>
                    <Button
                      onClick={async () => {
                        await getActiveToken().callDeposit(dAmount);
                        vault.fetchBalance();
                        setDAmount(0);
                      }}
                      text={'Deposit'}
                    />
                  </Row>
                </Col>
                <Col xs={6}>
                  <Row center={'xs'}>
                    <Col xs={6}>
                      <Button
                        onClick={async () => {
                          await getActiveToken().callWithdraw(wAmount);
                          vault.fetchBalance();
                          setWAmount(0);
                        }}
                        text={'Withdraw'}
                      />
                    </Col>
                    <Col xs={6}>
                      <Button
                        onClick={async () => {
                          await getActiveToken().callWithdraw(getActiveToken().balance);
                          vault.fetchBalance();
                          setWAmount(0);
                        }}
                        text={'Withdraw All'}
                      />
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
