import React, { useContext, useMemo } from "react";
import styled, { ThemeContext } from "styled-components";
import { Link } from "react-router-dom";

const Button = ({
  className,
  children,
  disabled,
  href,
  onClick,
  size,
  text,
  to,
}) => {
  const { spacing } = useContext(ThemeContext);
  let boxShadow;
  let buttonSize;
  let buttonPadding;
  let fontSize;
  switch (size) {
    case "sm":
      buttonPadding = spacing[3];
      buttonSize = 36;
      fontSize = 14;
      break;
    case "lg":
      buttonPadding = spacing[4];
      buttonSize = 72;
      fontSize = 16;
      break;
    case "md":
    default:
      buttonPadding = spacing[4];
      buttonSize = 56;
      fontSize = 16;
  }

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
    <StyledButton
      className={className}
      disabled={disabled}
      fontSize={fontSize}
      onClick={onClick}
      padding={buttonPadding}
      size={buttonSize}
    >
      {ButtonChild}
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  align-items: center;
  background-color: ${({ theme }) => theme.red2};
  border: 0;
  border-radius: 24px;
  color: ${(props) =>
    !props.disabled ? props.theme.white : `${props.theme.white}55`};
  cursor: pointer;
  display: flex;
  font-size: ${(props) => props.fontSize}px;
  font-weight: 700;
  height: ${(props) => props.size}px;
  justify-content: center;
  outline: none;
  padding-left: ${(props) => props.padding}px;
  padding-right: ${(props) => props.padding}px;
  pointer-events: ${(props) => (!props.disabled ? undefined : "none")};
  width: 100%;
  &:hover {
    background-color: ${({ theme }) => theme.bg5};
  }
`;

const StyledLink = styled(Link)`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  margin: 0 ${(props) => -props.theme.spacing[4]}px;
  padding: 0 ${({ theme }) => theme.spacing[4]}px;
  text-decoration: none;
`;

const StyledExternalLink = styled.a`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  margin: 0 ${(props) => -props.theme.spacing[4]}px;
  padding: 0 ${({ theme }) => theme.spacing[4]}px;
  text-decoration: none;
`;

export default Button;
