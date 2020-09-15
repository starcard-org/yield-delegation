import React from 'react';
import {TopBar} from './components';
import ThemeProvider from './theme';
import styled from 'styled-components';
import ModalsProvider from './context/Modals';
import {DrizzleProvider} from './context/DrizzleContext';
import {DarkModeProvider} from './context/DarkModeContext';
import {UseWalletProvider} from 'use-wallet';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './pages/Home';

const Container = styled.div`
  background-color: ${({theme}) => theme.primary1};
  height: 100%;
  width: 100%;
`;

const Providers = ({children}) => (
  <DarkModeProvider>
    <ThemeProvider>
      <UseWalletProvider
        chainId={1337}
        connectors={{
          walletconnect: {
            rpcUrl: 'https://mainnet.eth.aragon.network/',
          },
        }}
      >
        <DrizzleProvider>
          <ModalsProvider>{children}</ModalsProvider>
        </DrizzleProvider>
      </UseWalletProvider>
    </ThemeProvider>
  </DarkModeProvider>
);

function App() {
  return (
    <Providers>
      <Container>
        <Router>
          <TopBar />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/farms"></Route>
            <Route path="/faq"> </Route>
          </Switch>
        </Router>
      </Container>
    </Providers>
  );
}

export default App;
