import React from 'react';
import styled from 'styled-components';

const Social = ({src, alt}) => {
  return <StyledButton src={src} alt={alt} />;
};

const StyledButton = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 40px;
  background-color: rgba(0, 0, 0, 0.2);
  object-fit: scale-down;
`;

export default Social;
