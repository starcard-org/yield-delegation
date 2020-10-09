import React from 'react';
import styled from 'styled-components';
import {NavLink, useLocation} from 'react-router-dom';
const Nav = () => {
  const location = useLocation();
  return (
    <StyledNav>
      <StyledLink exact activeClassName="active" to="/">
        Home
      </StyledLink>
    </StyledNav>
  );
};

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
  flex: 1 0 auto;
`;

const StyledLink = styled(NavLink)`
  position: relative;
  color: ${({theme}) => theme.text1};
  padding-left: ${({theme}) => theme.spacing[3]}px;
  padding-right: ${({theme}) => theme.spacing[3]}px;
  font-size: 16px;
  text-decoration: none;
  &:hover {
    color: ${({theme}) => theme.text2};
  }
`;

export default Nav;
