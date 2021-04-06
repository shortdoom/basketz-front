import { useEffect, useState } from 'react';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import * as CSS from 'csstype';

import { useWallet } from '../../providers';

const Item = styled(Paper)(({ theme }) => ({
  // TODO withStyles removal
  ...(theme.typography.body2 as CSS.Properties),
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function FormRow() {
  return (
    <>
      <Grid item xs={4}>
        <Item>Item</Item>
      </Grid>
      <Grid item xs={4}>
        <Item>Item</Item>
      </Grid>
      <Grid item xs={4}>
        <Item>Item</Item>
      </Grid>
    </>
  );
}

export default function DashboardPage() {
  const { provider, status } = useWallet();
  const [etherPrice, setEtherPrice] = useState<number>(0);
  useEffect(() => {
    const initState = async () => {
      try {
        if (provider) {
          const price = await provider.getEtherPrice();
          setEtherPrice(price);

          console.log(`final price: ${price}`);
        }
      } catch (e) {
        // catch error here
        // Maybe sign_out user!
      }
    }
    initState();
  }, [status]);

  return (
    <Box sx={{ flexGrow: 1, pt: 1 }}>
      <Grid container spacing={1}>
        <Grid container item spacing={3}>
          <Grid item xs={4}>
            <Item>{etherPrice}</Item>
          </Grid>
          <Grid item xs={4}>
            <Item>Item</Item>
          </Grid>
          <Grid item xs={4}>
            <Item>Item</Item>
          </Grid>
        </Grid>
        <Grid container item spacing={3}>
          <FormRow />
        </Grid>
        <Grid container item spacing={3}>
          <FormRow />
        </Grid>
      </Grid>
    </Box>
  );
}