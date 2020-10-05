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
import Select from 'react-select';
import useAllowance from '../../hooks/useAllowance';

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
  const [balance] = useCall(token, 'balanceOf', 0, account);
  const [decimals] = useCall(token, 'decimals', 0);
  const {onApprove} = useApprove(token, vault);
  const {getAllowance, allowance, setAllowance} = useAllowance(token, vault);
  const deposit = useDeposit(vault);

  useEffect(() => {
    getAllowance();
  }, [getAllowance]);

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
      deposit(
        amount,
        decimals,
        type === TOKEN_TYPES.UNDERLYING ? 'deposit' : 'deposityToken'
      );
    },
    [deposit, type, decimals]
  );

  return {
    name: token,
    symbol,
    balance,
    allowance,
    getAllowance,
    setAllowance,
    isApproved,
    getFormatedBalance,
    callApprove,
    callDeposit,
  };
};

const useVault = name => {
  const vault = `yVault${name}`;
  const {account} = useWallet();
  const [symbol] = useCall(vault, 'symbol', '');
  const [balance] = useCall(vault, 'balanceOf', 0, account);
  const [pricePerFullShare] = useCall(vault, 'getPricePerFullShare', 0);
  const [decimals] = useCall(vault, 'decimals', 0);

  const getFormatedBalance = useCallback(
    () => bnToDec(new BigNumber(balance), decimals).toFixed(2),
    [balance, decimals]
  );

  return {
    name: vault,
    symbol,
    balance,
    pricePerFullShare,
    decimals,
    getFormatedBalance,
  };
};

export default ({name, fadeTime = 250}) => {
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
        <Row center={'xs'}>
          <Col xs={8}>
            <Title>{yToken.symbol}</Title>
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
      </Grid>
    ),
    [token, yToken]
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
                  disabled={!getActiveToken().isApproved}
                  defaultValue={dAmount}
                  onBlur={e => {
                    setDAmount(e.target.value);
                  }}
                  type="number"
                  required
                />
              </Row>
              {getPercentageRow(setDAmount, token.balance)}
            </ContainerCol>
            <ContainerCol xs={6}>
              <Row>
                {bnToDec(new BigNumber(vault.pricePerFullShare), vault.decimals) *
                  bnToDec(new BigNumber(vault.balance), vault.decimals).toFixed(2)}{' '}
                {token.symbol} ({vault.getFormatedBalance()} {vault.symbol})
              </Row>
              <Row>
                <StyledInput
                  defaultValue={wAmount}
                  disabled={!getActiveToken().isApproved}
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
                      onClick={() => {
                        getActiveToken().callDeposit(decToBn(dAmount));
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
