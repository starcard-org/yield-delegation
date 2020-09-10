import React, { useMemo } from "react";

import { useDarkMode } from "../hooks/useDarkMode";
import {
  ThemeProvider as StyledComponentsThemeProvider,
  css,
} from "styled-components";

const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 600,
  upToMedium: 960,
  upToLarge: 1280,
};

const mediaWidthTemplates = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    accumulator[size] = (a, b, c) => css`
      @media (max-width: ${MEDIA_WIDTHS[size]}px) {
        ${css(a, b, c)}
      }
    `;
    return accumulator;
  },
  {}
);

const white = "#FFFFFF";
const black = "#000000";
export function colors(darkMode) {
  return {
    // base
    white,
    black,

    // text
    text1: darkMode ? "#FFFFFF" : "#000000",
    text2: darkMode ? "#C3C5CB" : "#565A69",
    text3: darkMode ? "#6C7284" : "#9a7c64",
    text4: darkMode ? "#565A69" : "#C3C5CB",
    text5: darkMode ? "#2C2F36" : "#e6ddd6",

    // backgrounds / greys
    bg1: darkMode ? "#212429" : "#FFFFFF",
    bg2: darkMode ? "#2C2F36" : "#fff7f2",
    bg3: darkMode ? "#40444F" : "#e6ddd6",
    bg4: darkMode ? "#565A69" : "#CED0D9",
    bg5: darkMode ? "#6C7284" : "#9a7c64",

    //specialty colors
    modalBG: darkMode ? "rgba(0,0,0,.425)" : "rgba(0,0,0,0.3)",
    advancedBG: darkMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.6)",

    //primary colors
    primary1: darkMode ? "#2172E5" : "#ffce03",
    primary2: darkMode ? "#3680E7" : "#ffd62a",
    primary3: darkMode ? "#4D8FEA" : "#ffdd51",
    primary4: darkMode ? "#376bad70" : "#ffe579",
    primary5: darkMode ? "#153d6f70" : "#ffeda0",

    // color text
    primaryText1: darkMode ? "#6da8ff" : "#805e49",

    // secondary colors
    secondary1: darkMode ? "#2172E5" : "#805e49",
    secondary2: darkMode ? "#17000b26" : "#e2d6cf",
    secondary3: darkMode ? "#17000b26" : "#f0e9e7",

    // other
    red1: "#FF6871",
    red2: "#F82D3A",
    green1: "#27AE60",
    yellow1: "#FFE270",
    yellow2: "#F3841E",

    // dont wanna forget these blue yet
    // blue4: darkMode ? '#153d6f70' : '#C4D9F8',
    // blue5: darkMode ? '#153d6f70' : '#EBF4FF',
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
    shadow1: darkMode ? "#000" : "#2F80ED",

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

export default function ThemeProvider({ children }) {
  const [darkMode] = useDarkMode();
  const themeObject = useMemo(() => theme(darkMode), [darkMode]);

  return (
    <StyledComponentsThemeProvider theme={themeObject}>
      {children}
    </StyledComponentsThemeProvider>
  );
}
