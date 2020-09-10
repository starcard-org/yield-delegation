import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const Nav = () => {
  return (
    <StyledNav>
      <StyledLink exact activeClassName="active" to="/">
        MENU
      </StyledLink>
      <StyledLink exact activeClassName="active" to="/">
        MENU
      </StyledLink>
      <StyledLink exact activeClassName="active" to="/">
        MENU
      </StyledLink>
    </StyledNav>
  );
};

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  flex: 1 0 auto;
`;

const StyledLink = styled(NavLink)`
  color: ${({ theme }) => theme.text1};
  font-weight: 700;
  padding-left: ${({ theme }) => theme.spacing[3]}px;
  padding-right: ${({ theme }) => theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.text5};
  }
`;

export default Nav;
