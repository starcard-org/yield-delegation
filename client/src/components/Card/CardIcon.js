import React from "react";
import styled from "styled-components";

export const CardIcon = ({ children }) => (
  <StyledCardIcon>{children}</StyledCardIcon>
);

const StyledCardIcon = styled.div`
  background-color: ${({ theme }) => theme.bg3};
  font-size: 36px;
  height: 80px;
  width: 80px;
  border-radius: 40px;
  align-items: center;
  display: flex;
  justify-content: center;
  box-shadow: 4px 4px 8px ${({ theme }) => theme.secondary3},
    -6px -6px 12px ${({ theme }) => theme.secondary1};
  margin: 0 auto ${({ theme }) => theme.spacing[3]}px;
`;
