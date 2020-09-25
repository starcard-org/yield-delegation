import React, {useMemo} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

const Button = ({className, children, href, onClick, text, to, outline = true}) => {
  const ButtonChild = useMemo(() => {
    if (to) {
      return <StyledLink to={to}>{text}</StyledLink>;
    } else if (href) {
      return (
        <StyledExternalLink href={href} target="__blank">
          {text}
        </StyledExternalLink>
      );
    } else {
      return text;
    }
  }, [href, text, to]);

  return (
    <StyledButton className={className} onClick={onClick} outline={outline}>
      {ButtonChild}
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  position: relative;
  width: 100%;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;

  ${props =>
    props.outline
      ? `
      border-radius: 20px;
      height: 40px;
      border: solid 1px #ffd800;
      background-color: rgba(0, 0, 0, 0);
    `
      : `
      height: 48px;
      border-radius: 24px;
      background-image: linear-gradient(103deg, #f1480b, #ffd800);
      font-weight: bold;
      border: 0px;
    `}
`;

const StyledLink = styled(Link)`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  margin: 0 ${props => -props.theme.spacing[4]}px;
  padding: 0 ${({theme}) => theme.spacing[4]}px;
  text-decoration: none;
`;

const StyledExternalLink = styled.a`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  margin: 0 ${props => -props.theme.spacing[4]}px;
  padding: 0 ${({theme}) => theme.spacing[4]}px;
  text-decoration: none;
`;

export default Button;
