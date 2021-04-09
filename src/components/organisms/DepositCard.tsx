/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import LoadingButton from '@material-ui/lab/LoadingButton';
import RefreshIcon from '@material-ui/icons/Refresh';
//import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ethers } from 'ethers';

import { IContractInfo, useWallet } from '../../providers';
//import { ContactSupportTwoTone } from '@material-ui/icons';

/**
 
  const SwitchMode = () => {
    setIsDeposit(!isDepoist);
  }
 * 
 * Line 102
   <CardContent sx={{
      display: 'flex',
      justifyContent: 'center',
    }}>
      <Button variant="outlined" onClick={SwitchMode} disabled={isPending}>
        {(isDepoist) ? switchWithdraw : switchDeposit}
      </Button>
    </CardContent>
 */

/**
 * Show your eth amount
 * Show the balance for this token
 * Icon to withdraw / deposit
 * Input to depoist a number of token
 * Button to perform the deposit / withdraw
 * @returns 
 */
/*const switchDeposit = 'Switch to deposit';
const switchWithdraw = 'Switch to withdraw';*/
const Deposit = 'Deposit';
//const Withdraw = 'Withdraw';
interface IProps {
  contract: IContractInfo
  ethBalance: string | undefined
  setEthBalance: Dispatch<SetStateAction<string | undefined>>
}

/*function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}*/
//<TextField inputProps={{ inputMode: 'numeric', pattern: '^[0-9]+(\.)?[0-9]*$' }} />
const isNumber = /^[0-9]+(\.)?[0-9]*$/;
const DepositCard = ({ contract, ethBalance, setEthBalance } : IProps) =>  {
  //const [isDepoist, setIsDeposit] = useState<boolean>(true);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [exchanged, setExchanged] = useState<string>('0');
  const { account, checkTx, contracts } = useWallet();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumber.test(event.target.value)) {
      setExchanged(event.target.value);
    }
  };

  const queryContract = async () => {
    const balance: ethers.BigNumberish = await contract.cabi.balanceOf(account);
    setTokenBalance(ethers.utils.formatEther(balance));
  };

  useEffect(() => {
    queryContract();
    return () => {
      console.log('unmounting mocked contract');
    }
  }, [contract.cabi.address, contracts.updatedAt])

  const SubmitForm = async () => {
    setIsPending(true);
    try {
      const value = ethers.utils.parseEther(exchanged);
      const tx = await contract.cabi.deposit({ value });
      checkTx(tx);
      /*const balance = await provider?.getBalance(account);
      if (balance) setEthBalance(ethers.utils.formatEther(balance));*/
    } catch (err) {
      console.log(err);
    }
    setIsPending(false);
  }

  return (
    <Card sx={{ maxWidth: 400 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {contract.name.split('').pop()}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings" onClick={queryContract}>
            <RefreshIcon />
          </IconButton>
        }
        title={contract.name}
      />
      
      <CardContent>
        <Typography variant="body2" paragraph>
          You can use this contract in order to exchange {contract.name} Tokens.
        </Typography>
        <Typography variant="body2" style={{ fontWeight: 600, display: 'inline-block' }}>
          {contract.name} balance:
        </Typography>
        <Typography style={{ display: 'inline-block' }}>
          {tokenBalance}
        </Typography>
        
        <TextField
          label="Deposit"
          value={exchanged}
          onChange={handleChange}
          variant="standard"
          helperText="ETH amount, min 0.01"
          fullWidth
        />
      </CardContent>
      <CardActions sx={{
        display: 'flex',
        justifyContent: 'center',
      }}>
        <LoadingButton variant="contained" pending={isPending} onClick={SubmitForm} fullWidth>
          {/*(isDepoist) ? Deposit : Withdraw*/Deposit}
        </LoadingButton>
      </CardActions>
    </Card>
  );
}
export default DepositCard;