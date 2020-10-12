import React, {createContext, useCallback, useState} from 'react';
import styled from 'styled-components';

export const Context = createContext({
  onPresent: () => {},
  onDismiss: () => {},
});

const Modals = ({children}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState();

  const handlePresent = useCallback(
    modalContent => {
      setContent(modalContent);
      setIsOpen(true);
    },
    [setContent, setIsOpen]
  );

  const handleDismiss = useCallback(() => {
    setContent(undefined);
    setIsOpen(false);
  }, [setContent, setIsOpen]);

  return (
    <Context.Provider
      value={{
        content,
        isOpen,
        onPresent: handlePresent,
        onDismiss: handleDismiss,
      }}
    >
      {children}
      {isOpen && (
        <StyledModalWrapper>
          <StyledModalBackdrop onClick={handleDismiss} />
          {React.isValidElement(content) &&
            React.cloneElement(content, {
              onDismiss: handleDismiss,
            })}
        </StyledModalWrapper>
      )}
    </Context.Provider>
  );
};

const StyledModalWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const StyledModalBackdrop = styled.div`
  background-color: ${({theme}) => theme.bg1}aa;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export default Modals;
