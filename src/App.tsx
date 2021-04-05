import { WalletProvider } from './providers';

import { ThemeProvider, CssBaseline, theme } from './styles';
import HomePage from './components/pages/Home';

function App() {
  return (
    <WalletProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HomePage />
      </ThemeProvider>
    </WalletProvider>
  );
}

export default App;
