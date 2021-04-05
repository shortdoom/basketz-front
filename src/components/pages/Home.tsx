import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
  useLocation
} from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

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

function Test() {
  return <h1>Doesnt exist</h1>
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
  const classes = useStyles();
  const { provider, signIn, signOut } = useWallet();
  return (
  <Router>
    <AppBar position="fixed">
      <Toolbar>
        <Button color="inherit" component={RouterLink} to="/test">Home</Button>
        <Typography variant="h6" component="div" className={classes.title}>
        </Typography>
        {
          provider ? 
          <Button color="inherit" onClick={signOut}>{`Logout ${provider.network.name}`}</Button> :
          <Button color="inherit" onClick={signIn}>Connect wallet</Button>
        }
      </Toolbar>
    </AppBar>
    <Toolbar />
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/test">
        <Test />
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
};