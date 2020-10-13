import React from 'react';
import styled from 'styled-components';
import {NavLink} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

const Nav = () => {
  const {t} = useTranslation();
  return (
    <StyledNav>
      <StyledLink exact activeClassName="active" to="/vaults">
        {t('nav-vaults')}
      </StyledLink>
      <StyledLink exact activeClassName="active" to="/liquidity">
        {t('nav-liquidity')}
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
