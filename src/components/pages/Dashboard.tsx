/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import * as CSS from 'csstype';
import ethers from 'ethers';

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
  const { provider, account, contracts } = useWallet();
  const [etherPrice, setEtherPrice] = useState<ethers.BigNumber|undefined>();
  useEffect(() => {
    const initState = async () => {
      try {
        for (const contract of contracts) {
          const price = await provider?.getBalance(contract.cabi.address);
          // const code = await provider?.getCode(contract.cabi.address)
          const balanceOf = await contract.cabi.balanceOf(account)
          console.log(`${account}:${contract.name} price ${price} balanceOf ${balanceOf}`)
        }
      } catch (e) {
        console.log(e);
      }
    }
    initState();
  }, [contracts]);

  return (
    <Box sx={{ flexGrow: 1, pt: 1 }}>
      <Grid container spacing={1}>
        <Grid container item spacing={3}>
          <Grid item xs={6}>
            <Item>{etherPrice}</Item>
          </Grid>
          <Grid item xs={6}>
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