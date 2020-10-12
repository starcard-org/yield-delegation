import React, {useEffect} from 'react';
import styled from 'styled-components';

import metamaskLogo from '../../assets/img/metamask-fox.svg';
import walletConnectLogo from '../../assets/img/wallet-connect.svg';
import {useWallet} from 'use-wallet';

import {Button} from '../Button';
import {Modal, ModalActions, ModalTitle, ModalContent} from '../Modal';
import {useTranslation} from 'react-i18next';

const IconButton = styled(Button)`
  display: flex;
  margin-top: 1rem;
  align-items: center;
  justify-content: space-between;
  padding: 1em;
`;

const Blurb = styled.div`
  color: #fff;
  ${({theme}) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
  ${({theme}) => theme.mediaWidth.upToMedium`
    margin: 1rem;
    font-size: 12px;
  `};
`;

const StyledLink = styled.a`
  text-decoration: none;
  cursor: pointer;
  color: ${({theme}) => theme.link1};
  font-weight: 500;

  :hover {
    text-decoration: underline;
  }

  :focus {
    outline: none;
    text-decoration: underline;
  }

  :active {
    text-decoration: none;
  }
`;

const StyledWalletsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const WalletProviderModal = ({onDismiss}) => {
  const {t} = useTranslation();
  const {account, connect} = useWallet();

  useEffect(() => {
    if (account) {
      onDismiss();
    }
  }, [account, onDismiss]);

  return (
    <Modal>
      <ModalTitle text={t('select-wallet')} />
      <ModalContent>
        <StyledWalletsWrapper>
          <IconButton onClick={() => connect()} text="MetaMask" outline={false}>
            <img src={metamaskLogo} style={{height: 32, width: 32}} alt="MetaMask Logo" />
          </IconButton>
          <IconButton
            onClick={() => connect('walletconnect')}
            text="WalletConnect"
            outline={false}
          >
            <img
              src={walletConnectLogo}
              style={{height: 32, width: 32}}
              alt="WalletConnect Logo"
            />
          </IconButton>
        </StyledWalletsWrapper>
      </ModalContent>

      <ModalActions>
        <Button text={t('cancel-action')} variant="secondary" onClick={onDismiss} />
      </ModalActions>
      <Blurb>
        <span>{t('wallet-new-eth')}&nbsp;</span>{' '}
        <StyledLink
          target={'_blank'}
          rel={'noopener noreferrer'}
          href={'https://ethereum.org/wallets/'}
        >
          {t('wallet-learn-more')}
        </StyledLink>
      </Blurb>
    </Modal>
  );
};

export default WalletProviderModal;
