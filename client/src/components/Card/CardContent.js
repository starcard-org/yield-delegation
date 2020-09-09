import React from 'react'
import styled from 'styled-components'

const StyledCardContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  color: #fff;
`

export const CardContent = ({ children }) => (
  <StyledCardContent>
    {children}
  </StyledCardContent>
)