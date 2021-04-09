/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import Avatar from '@material-ui/core/Avatar';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { blueGrey, red } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';

import LoadingButton from '@material-ui/lab/LoadingButton';
import { ethers } from 'ethers';

import { IContractInfo, useWallet } from '../../providers';
/*
<InputBase
              sx={{ flex: 1 }}
              placeholder="Amount"
              inputProps={{ 'aria-label': 'Add amount' }}
            />
*/
/*
 sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
*/
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selectControl: {
      minWidth: 100,
    },
    buttonControl: {
      marginTop: theme.spacing(2),
    },
  }),
);

// key is contract address
interface BasketList {
  [index: string]: TokenInBasket;
}

interface TokenInBasket {
  contract: IContractInfo,
  amount: ethers.BigNumber,
  displayAmount: string,
  isApproved: boolean,
}

interface TokenContractList {
  name: string,
  balance: string,
  contract?: IContractInfo,
}

const isNumber = /^[0-9]+(\.)?[0-9]*$/;
export default function WrapperCard() {
  const classes = useStyles();
  const { account, contracts, checkTx } = useWallet();
  const [errorText, setErrorText] = useState<string | null>(null);
  const [tokens, setTokens] = useState<TokenContractList[]>([]);
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [isPending, setIsPending] = useState<boolean>(false);
  const [tokenIdx, setTokenIdx] = useState<string>('');
  const [basket, setBasket] = useState<BasketList | null>(null);

  useEffect(() => {
    console.log('reload the contracts balance');
    const loadContracts = async () => {
      const tokenList: TokenContractList[] = []
      let i = contracts.SupportedToken.length;
      for (let x = 0; x < i; x++) {
        const balance = await contracts.SupportedToken[x].cabi.balanceOf(account);
        if (balance) {
          // Change to accept any kind of token with different decimal
          tokenList.push({
            name: contracts.SupportedToken[x].name,
            balance: ethers.utils.formatEther(balance),
            contract: contracts.SupportedToken[x],
          });
        }
      }
      setBasket(null);
      setTokens(tokenList);
    }
    loadContracts();
  }, [account, contracts.updatedAt])

  const handleDelete = (contractAddress: string) => {
    let newBasket = {...basket};
    delete newBasket[contractAddress];
    setBasket(newBasket);
  };

  const handleToken = (event: React.ChangeEvent<{ value: string }>) => {
    setTokenIdx(event.target.value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumber.test(event.target.value)) {
      setTokenAmount(event.target.value);
    }
  };

  const addToken = async () => {
    setIsPending(true);
    setErrorText(null);
    try {
      const contract = tokens[parseInt(tokenIdx, 10)].contract;
      if (contract) {
        if (basket === null) {
          setBasket({
            [contract.cabi.address]: { 
              contract,
              amount: ethers.utils.parseEther(tokenAmount),
              displayAmount: tokenAmount,
              isApproved: false,
            }
          });
        } else {
          const newAmount: ethers.BigNumber | undefined = basket[contract.cabi.address]?.amount
          let amount: ethers.BigNumber = ethers.utils.parseEther(tokenAmount);
          if (newAmount) {
            amount = amount.add(newAmount);
          }
          setBasket((prevValues) => ({
            ...prevValues,
            [contract.cabi.address]: { 
              contract,
              amount,
              displayAmount: ethers.utils.formatEther(amount),
              isApproved: false,
            }
          }));
        }
      } else {
        // make toaster alert
        console.log('error')
      }  
    } catch (err) {
      console.log(err);
    }
    setIsPending(false);
  }

  // Make a transaction watcher to update the full account lists
  const createBasket = async () => {
    setIsPending(true);
    setErrorText(null);
    if (basket) {
      // List token to approve
      const tokenApproved: string[] = [];
      const amountApproved: ethers.BigNumber[] = [];
      const addresses = Object.keys(basket);
      
      for (let i = 0; i < addresses.length; i++) {
        if (!basket[addresses[i]].amount.isZero()) {
          try {
            await basket[addresses[i]].contract.cabi.approve(contracts.Wrapper?.cabi.address, basket[addresses[i]].amount);
            tokenApproved.push(addresses[i]);
            amountApproved.push(basket[addresses[i]].amount);
          } catch (err) {
            console.log('this token is not approved, discarding');
          }
        }
      }
      // Perfom wrapper creation at least two token is approved
      try {
        if (tokenApproved.length > 1) {
          const tx = await contracts.Wrapper?.cabi.wrapper(tokenApproved, amountApproved);
          checkTx(tx);
        } else {
          setErrorText('Not enough token to create a basket');
        }
      } catch (err) {
        setErrorText('wrapper error');
        console.log(err);
      }
    }
    setIsPending(false);
  }

  return (
    <Card>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: blueGrey[500] }} aria-label="recipe">
                E
              </Avatar>
            }
            title="Wrapper creation"
            subheader="Choose a token to add to your basket"
          />
          <CardContent>
            <FormGroup row={true}>
              <FormControl className={classes.selectControl}>
                <InputLabel id="select-token-label">Token</InputLabel>
                <Select
                  labelId="select-token"
                  id="select-token"
                  value={tokenIdx}
                  onChange={handleToken}
                >
                  {tokens.map((supportedToken, idx) => 
                    <MenuItem key={`menu-${idx}`} value={idx}>{supportedToken.name}</MenuItem>
                  )}
                </Select>
              </FormControl>
              <FormControl>
                <TextField
                  id="filled-name"
                  label="Deposit"
                  value={tokenAmount}
                  onChange={handleChange}
                  variant="standard"
                  helperText={`Balance: ${(tokenIdx !== '') ? tokens[parseInt(tokenIdx, 10)].balance : 'N/A'}`}
                  fullWidth
                />
              </FormControl>
              <FormControl className={classes.buttonControl}>
                <LoadingButton 
                  pending={isPending}
                  color="inherit"
                  onClick={addToken}
                  disabled={(tokenIdx === '')}
                >Add</LoadingButton>
              </FormControl>
            </FormGroup>
          </CardContent>
        </Grid>
        <Grid item xs={4}>
          <CardHeader
            subheader="Token to add"
          />
          {errorText ?
            <CardContent>
              <Typography color={red[500]}>{errorText}</Typography>
            </CardContent>
           : null}
          <CardContent>
          {basket ? Object.keys(basket).map((contractAddress) => (
            <Chip
              key={contractAddress}
              avatar={<Avatar>{basket[contractAddress]?.contract.name.split('').pop()}</Avatar>}
              label={basket[contractAddress]?.displayAmount}
              clickable
              color="primary"
              onDelete={() => handleDelete(contractAddress)}
            />
          )) : 
          <Typography>No token selected</Typography>}
          </CardContent>
          <CardActions>
            <LoadingButton variant="contained" pending={isPending} onClick={createBasket} fullWidth>Create</LoadingButton>
          </CardActions>
        </Grid>
      </Grid>
    </Card>
  )
}