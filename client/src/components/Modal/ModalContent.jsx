import React from "react";
import styled from "styled-components";

const ModalContent = ({ children }) => {
  return <StyledModalContent>{children}</StyledModalContent>;
};

const StyledModalContent = styled.div`
  padding: ${({ theme }) => theme.spacing[4]}px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex: 1;
    overflow: auto;
  }`}
`;

export default ModalContent;
