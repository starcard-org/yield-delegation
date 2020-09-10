import React from 'react';
import styled from 'styled-components';

const StyledCard = styled.div`
  background-color: ${({theme}) => theme.primary2};
  border-radius: 12px;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const Card = ({children, className}) => (
  <StyledCard className={className}>{children}</StyledCard>
);
