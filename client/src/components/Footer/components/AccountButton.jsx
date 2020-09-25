import React, {useCallback} from 'react';
import styled from 'styled-components';
import {useWallet} from 'use-wallet';

import useModal from '../../../hooks/useModal';

import {Button} from '../../Button';
import WalletProviderModal from '../../WalletProviderModal';

import AccountModal from './AccountModal';

const AccountButton = props => {
  const {account} = useWallet();
  const [onPresentAccountModal] = useModal(<AccountModal />);
  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />, 'provider');

  const handleUnlockClick = useCallback(() => {
    onPresentWalletProviderModal();
  }, [onPresentWalletProviderModal]);

  return (
    <>
      {!account ? (
        <Button onClick={handleUnlockClick} text="Connect your wallet" />
      ) : (
        <Button
          onClick={onPresentAccountModal}
          text={
            <>
              {account.substring(0, 10)}
              <ConnectedBullet />
            </>
          }
        />
      )}
    </>
  );
};

const ConnectedBullet = styled.div`
  width: 6px;
  display: block;
  position: absolute;
  border-radius: 6px;
  height: 6px;
  background-color: #ffd800;
  right: 12px;
  top: calc(50% - 3px);

  &:after {
    content: '';
    display: block;
    position: absolute;
    top: -3px;
    left: -3px;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    border: 1px solid #ffd800;
  }
`;

export default AccountButton;
