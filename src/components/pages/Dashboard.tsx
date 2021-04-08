/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import * as CSS from 'csstype';
import { ethers } from 'ethers';

import { useWallet } from '../../providers';
import { DepositCard } from '../organisms';

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
const Loading = () => {
  return <h1>Loading...</h1>
}

const NotAvailable = () => {
  return <h1>Not Available on this network :O</h1>
}

export default function DashboardPage() {
  const { provider, account, contracts } = useWallet();
  const [etherBalance, setEtherBalance] = useState<string>();
  useEffect(() => {
    const initState = async () => {
      try {
        const balance = await provider?.getBalance(account);
        if (balance) setEtherBalance(ethers.utils.formatEther(balance));
        if (contracts.isLoaded) {
          for (const contract of contracts.SupportedToken) {
            const price = await provider?.getBalance(contract.cabi.address);
            // const code = await provider?.getCode(contract.cabi.address)
            const balanceOf = await contract.cabi.balanceOf(account)
            console.log(`${account}:${contract.name} price ${price} balanceOf ${balanceOf}`)
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    initState();
  }, [contracts.updatedAt]);

  if (!contracts.isLoaded) {
    return <Loading />
  }
  return (
    <Box sx={{ flexGrow: 1, pt: 1 }}>
      <Grid container spacing={1}>
      <Grid container item spacing={3}>
          <Grid item xs={4}>
            <Item>Eth blance: {etherBalance}</Item>
          </Grid>
          <Grid item xs={4}>
            <Item>Eth price</Item>
          </Grid>
          <Grid item xs={4}>
            <Item>Average Gas Usage</Item>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" item spacing={3}>
          <Grid item xs={6}>
            {(contracts.MockA) ? <DepositCard 
              contract={contracts.MockA}
              ethBalance={etherBalance} 
              setEthBalance={setEtherBalance} /> : <NotAvailable />}
          </Grid>
          <Grid item xs={6}>
            {(contracts.MockB) ? <DepositCard
              contract={contracts.MockB}
              ethBalance={etherBalance} 
              setEthBalance={setEtherBalance} /> : <NotAvailable />}
          </Grid>
        </Grid>
        <Grid container item spacing={3}>
          <FormRow />
        </Grid>
      </Grid>
    </Box>
  );
}