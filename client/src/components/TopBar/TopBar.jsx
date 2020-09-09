import React from "react";
import styled from "styled-components";

import { Container } from "../index";

import AccountButton from "./components/AccountButton";
import Nav from "./components/Nav";

const TopBar = ({ onPresentMobileMenu }) => {
  return (
    <StyledTopBar>
      <Container size="lg">
        <StyledTopBarInner>
          <StyledLogoWrapper>Mr. Rally</StyledLogoWrapper>
          <Nav />
          <StyledAccountButtonWrapper>
            <AccountButton />
          </StyledAccountButtonWrapper>
        </StyledTopBarInner>
      </Container>
    </StyledTopBar>
  );
};

const StyledLogoWrapper = styled.div`
  width: 156px;
  font-weight: bold;
  font-size: 1.5rem;
  @media (max-width: 400px) {
    width: auto;
  }
`;

const StyledTopBar = styled.div``;

const StyledTopBarInner = styled.div`
  align-items: center;
  display: flex;
  height: ${({ theme }) => theme.topBarSize}px;
  justify-content: space-between;
  max-width: ${({ theme }) => theme.siteWidth}px;
  width: 100%;
`;
const StyledNavWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  @media (max-width: 400px) {
    display: none;
  }
`;

const StyledAccountButtonWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  width: 156px;
  @media (max-width: 400px) {
    justify-content: center;
    width: auto;
  }
`;

const StyledMenuButton = styled.button`
  background: none;
  border: 0;
  margin: 0;
  outline: 0;
  padding: 0;
  display: none;
  @media (max-width: 400px) {
    align-items: center;
    display: flex;
    height: 44px;
    justify-content: center;
    width: 44px;
  }
`;

export default TopBar;
