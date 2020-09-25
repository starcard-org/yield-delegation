import React, {useCallback} from 'react';
import {Button} from '../../Button';
import {useWallet} from 'use-wallet';
import {Modal, ModalActions, ModalTitle, ModalContent} from '../../Modal';

const AccountModal = ({onDismiss}) => {
  const {reset} = useWallet();

  const handleSignOutClick = useCallback(() => {
    onDismiss && onDismiss();
    reset();
  }, [onDismiss, reset]);

  return (
    <Modal>
      <ModalTitle text="My Account" />
      <ModalContent>
        <Button onClick={handleSignOutClick} text="Sign out" variant="secondary" />
      </ModalContent>
      <ModalActions>
        <Button onClick={onDismiss} text="Cancel" outline={false} />
      </ModalActions>
    </Modal>
  );
};

export default AccountModal;
