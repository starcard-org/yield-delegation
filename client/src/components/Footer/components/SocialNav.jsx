import React from 'react';
import styled from 'styled-components';

const SocialNav = () => {
  return (
    <StyledNav>
      <StyledLink href={'https://discord.com/invite/PVMdQBq'}>Discord</StyledLink>
      <StyledLink href={'https://twitter.com/rally_io'}>Twitter</StyledLink>
      <StyledLink href={'https://medium.com/rallynetwork'}>Medium</StyledLink>
      <StyledLink href={'https://rally.io'}>Rally.io</StyledLink>
    </StyledNav>
  );
};

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
  flex: 1 0 auto;
`;

const StyledLink = styled.a`
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

export default SocialNav;
