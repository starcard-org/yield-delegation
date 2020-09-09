import React, { useCallback } from "react";
import styled from "styled-components";
import { useWallet } from "use-wallet";

import useModal from "../../../hooks/useModal";

import { Button } from "../../Button";
import WalletProviderModal from "../../WalletProviderModal";

import AccountModal from "./AccountModal";

const AccountButton = (props) => {
  const { account } = useWallet();
  const [onPresentAccountModal] = useModal(<AccountModal />);
  const [onPresentWalletProviderModal] = useModal(
    <WalletProviderModal />,
    "provider"
  );

  const handleUnlockClick = useCallback(() => {
    onPresentWalletProviderModal();
  }, [onPresentWalletProviderModal]);

  return (
    <StyledAccountButton>
      {!account ? (
        <Button onClick={handleUnlockClick} size="sm" text="Unlock Wallet" />
      ) : (
        <Button onClick={onPresentAccountModal} size="sm" text="My Wallet" />
      )}
    </StyledAccountButton>
  );
};

const StyledAccountButton = styled.div``;

export default AccountButton;
