import React from 'react'
import styled from 'styled-components'

const StyledCardTitle = styled.div`
  color: #fafafa;
  font-size: 18px;
  font-weight: 700;
  padding: 8px;
  text-align: center;
`

export const CardTitle = ({ text }) => (
  <StyledCardTitle>{text}</StyledCardTitle>
)
