import React, {useMemo} from 'react';

import {useDarkMode} from '../hooks/useDarkMode';
import {ThemeProvider as StyledComponentsThemeProvider, css} from 'styled-components';

const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 600,
  upToMedium: 960,
  upToLarge: 1280,
};

const mediaWidthTemplates = Object.keys(MEDIA_WIDTHS).reduce((accumulator, size) => {
  accumulator[size] = (a, b, c) => css`
    @media (max-width: ${MEDIA_WIDTHS[size]}px) {
      ${css(a, b, c)}
    }
  `;
  return accumulator;
}, {});

const white = '#FFFFFF';
const black = '#000000';
export function colors(darkMode) {
  return {
    // base
    white,
    black,

    // text
    text1: '#FFFFFF',
    text2: '#fbd903',

    // backgrounds / greys
    bg1: '#000000',
    bg2: '#2C2F36',
    bg3: '#40444F',
    bg4: '#565A69',
    bg5: '#6C7284',

    //specialty colors
    modalBG: 'rgba(0,0,0,.425)',
    advancedBG: 'rgba(0,0,0,0.1)',

    //primary colors
    primary1: '#2172E5',
    primary2: '#3680E7',
    primary3: '#4D8FEA',
    primary4: '#376bad70',
    primary5: '#153d6f70',

    // color text
    link1: '#3b99fc',

    // secondary colors
    secondary1: '#2172E5',
    secondary2: '#17000b26',
    secondary3: '#17000b26',

    // other
    red1: '#FF6871',
    red2: '#F82D3A',
    green1: '#27AE60',
    yellow1: '#FFE270',
    yellow2: '#F3841E',
  };
}

export function theme(darkMode) {
  return {
    siteWidth: 1280,
    topBarSize: 72,

    ...colors(darkMode),

    spacing: {
      1: 4,
      2: 8,
      3: 16,
      4: 24,
      5: 32,
      6: 48,
      7: 64,
    },

    grids: {
      sm: 8,
      md: 12,
      lg: 24,
    },

    //shadows
    shadow1: '#2F80ED',

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,
  };
}

export default function ThemeProvider({children}) {
  const [darkMode] = useDarkMode();
  const themeObject = useMemo(() => theme(darkMode), [darkMode]);

  return (
    <StyledComponentsThemeProvider theme={themeObject}>
      {children}
    </StyledComponentsThemeProvider>
  );
}
