import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
  useLocation
} from "react-router-dom";
import { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import LoadingButton from '@material-ui/lab/LoadingButton';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import DashboardPage from './Dashboard';
import { useWallet } from '../../providers';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      flexGrow: 1,
    },
  }),
);

function Home() {
  return <h1>Home stuff</h1>
}

function NoMatch() {
  return <h1>Doesnt exist</h1>
}

// change i18n
const copyTextLabel: string = 'Copy account';
const copiedTextLabel: string = 'Account address copied!';

function LoggedAppBar() {
  const classes = useStyles();
  const { provider, account, signOut } = useWallet();
  const [copyText, setCopyText] = useState<string>(copyTextLabel);

  //TODO: change copy clippboard to a useEffect to clean the timeout if we destroy the component before
  //TODO: Allow switch account triggering WalletProvider change
  return (
    <Router>
      <AppBar position="fixed">
        <Toolbar>
          <Button color="inherit" component={RouterLink} to="/">Home</Button>
          <Typography variant="h6" component="div" className={classes.title} />
          <Button color="inherit" onClick={signOut}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 0.5,
        },
      }}>
        <Tooltip title="Current network">
          <Chip avatar={<Avatar>N</Avatar>} label={provider?.network.name} />
        </Tooltip>
        <Tooltip title={copyText}>
          <Chip avatar={<Avatar>A</Avatar>} label={account} onClick={() => {
            setCopyText(copiedTextLabel)
            setTimeout(() => setCopyText(copyTextLabel), 2000)
            navigator.clipboard.writeText(account);
          }} />
        </Tooltip>
      </Box>
      <Switch>
        <Route exact path="/">
          <DashboardPage />
        </Route>
        <Route path="/error">
          <ErrorDisplay />
        </Route>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </Router>
  );
}

function UnloggedAppBar() {
  const classes = useStyles();
  const { signIn } = useWallet();
  const [isPending, setIsPending] = useState<boolean>(false);

  const signInWallet = async () => {
    try {
      setIsPending(true);
      // Use this function to allow different wallets and ask user permission
      //const accounts = await (window as any).send('eth_requestAccounts');
      await signIn();
      setIsPending(false);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Router>
    <AppBar position="fixed">
      <Toolbar>
        <Button color="inherit" component={RouterLink} to="/">Home</Button>
        <Typography variant="h6" component="div" className={classes.title}>
        </Typography>
        {((window as any).web3) ? 
          <LoadingButton pending={isPending} color="inherit" onClick={signInWallet}>Connect wallet</LoadingButton> :
          <Button color="inherit">Install wallet</Button>
        }  
      </Toolbar>
    </AppBar>
    <Toolbar />
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  </Router>
  );
}

interface routeState {
  message: string;
}

interface locationState {
  state: routeState;
}

function ErrorDisplay() {
  const { state }: locationState = useLocation();
  return <h1>{state.message}</h1>
}

export default function HomePage() {
  const { provider } = useWallet();
  return (
    <Container maxWidth="md">
      {provider ? <LoggedAppBar /> : <UnloggedAppBar />}
    </Container>
  );
};