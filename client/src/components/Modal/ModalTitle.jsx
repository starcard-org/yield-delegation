import React from "react";
import styled from "styled-components";

const ModalTitle = ({ text }) => <StyledModalTitle>{text}</StyledModalTitle>;

const StyledModalTitle = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.secondary6};
  display: flex;
  font-size: 18px;
  font-weight: 700;
  height: ${({ theme }) => theme.topBarSize}px;
  justify-content: center;
`;

export default ModalTitle;
