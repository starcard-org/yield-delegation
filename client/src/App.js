import React from 'react';
import {Header, Footer} from './components';
import ThemeProvider from './theme';
import styled from 'styled-components';
import ModalsProvider from './context/Modals';
import {DrizzleProvider} from './context/DrizzleContext';
import {DarkModeProvider} from './context/DarkModeContext';
import {UseWalletProvider} from 'use-wallet';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import Vaults from './pages/Vaults';
import Pools from './pages/Pools';
import Faq from './pages/Faq';

import './i18n';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({theme}) => theme.bg1};
  height: 100%;
  width: 100%;
  color: ${({theme}) => theme.text1};
`;

const Grow = styled.div`
  display: flex;
  flex: 1;
  flex: 1 0 auto;
  min-height: 100vh;
  background-color: #000000;
`;

const Shrink = styled.div`
  display: flex;
  flex: 1;
  flex: 0 1 auto;
`;

const Providers = ({children}) => (
  <DarkModeProvider>
    <ThemeProvider>
      <UseWalletProvider
        chainId={1001}
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
          <Shrink>
            <Header />
          </Shrink>
          <Grow>
            <Switch>
              <Route path="/vaults" exact component={Vaults} />
              <Route path="/liquidity" exact component={Pools} />
              <Route path="/faq" exact component={Faq} />
              <Redirect from="/" to="/vaults" />
            </Switch>
          </Grow>
          <Shrink>
            <Footer />
          </Shrink>
        </Router>
      </Container>
    </Providers>
  );
}

export default App;
