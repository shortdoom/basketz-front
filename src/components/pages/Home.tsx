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

function LoggedAppBar() {
  const classes = useStyles();
  const { provider, signOut } = useWallet();
  return (
    <Router>
      <AppBar position="fixed">
        <Toolbar>
          <Button color="inherit" component={RouterLink} to="/">Home</Button>
          <Typography variant="h6" component="div" className={classes.title}>
          </Typography>
            <Button color="inherit" onClick={signOut}>{`Logout ${provider?.network.name}`}</Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
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

  const signWallet = async () => {
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
        {((window as any).ethereum) ? 
          <LoadingButton pending={isPending} color="inherit" onClick={signWallet}>Connect wallet</LoadingButton> :
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