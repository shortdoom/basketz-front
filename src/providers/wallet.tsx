/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useMemo, useEffect, useContext, useReducer } from 'react';
import { ethers } from "ethers";
import { tokensList, abis } from '../contracts';
/*interface ProviderInformation {
  provider: ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider | null
  signer: ethers.providers.JsonRpcSigner | null
}*/

export interface ContractInfo {
  name: string;
  cabi: ethers.Contract;
}

export interface ContractList {
  isLoaded: boolean,
  updatedAt: Date,
  MockA: ContractInfo | null,
  MockB: ContractInfo | null,
  Wrapper: ContractInfo | null,
  SupportedToken: ContractInfo[],
}

const initContractList: ContractList = {
  isLoaded: false,
  updatedAt: new Date(),
  MockA: null,
  MockB: null,
  Wrapper: null,
  SupportedToken: [],
};

interface WalletState /*extends ProviderInformation*/ {
  provider: ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider | null
  signer: ethers.providers.JsonRpcSigner | null
  listAccount: string[]
  account: string
  status: 'idle' | 'signOut' | 'signIn'
  contracts: ContractList
}
//type WalletAction = { type: 'SIGN_IN'; token: string } | { type: 'SIGN_OUT' }
type WalletAction = 
  { 
    type: 'SIGN_IN',
    provider: ethers.providers.JsonRpcProvider,
    signer: ethers.providers.JsonRpcSigner | null,
    listAccount: string[],
  } |
  { type: 'SIGN_OUT' } |
  { type: 'LOAD_ACCOUNT', contracts: ContractList };

interface WalletContextActions {
  signIn: () => void
  signOut: () => void
}
interface WalletContextType extends WalletState, WalletContextActions {};

const WalletContext = createContext<WalletContextType>({
  provider: null,
  signer: null,
  account: '',
  listAccount: [],
  contracts: initContractList,
  status: 'idle',
  signIn: () => {},
  signOut: () => {},
})
export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(WalletReducer, {
    provider: null,
    signer: null,
    listAccount: [],
    contracts: initContractList,
    account: '',
    status: 'idle',
  });

  useEffect(() => {
    const initContracts = async () => {
      try {
        const contracts: ContractList = initContractList;
        if (state.account && state.provider) {
          // maybe make the difference from the start between mock tokens
          const networkTokens = tokensList[state.provider.network.chainId]
          if (networkTokens) {
            for (const token of networkTokens) {
              // Create contract info
              const contract: ContractInfo = {
                name: token.name,
                cabi: new ethers.Contract(token.address, abis[token.abi], state.signer || state.provider),
              }
              if (token.name === 'MockA') {
                contracts.MockA = contract;
              } else if (token.name === 'MockB') {
                contracts.MockB = contract;
              } else if (token.name === 'ercWrapper') {
                contracts.Wrapper = contract;
              } else {//supported token
                //verify balance before adding?
                contracts.SupportedToken.push(contract);
              }
            }
          }
        }
        contracts.isLoaded = true;
        contracts.updatedAt = new Date();
        dispatch({ type: 'LOAD_ACCOUNT', contracts });
      } catch (err) {
        console.log(err);
        // catch error here
        // Maybe sign_out user!
      }
    }
    initContracts()
  }, [state.account]);

  const getNetwork = (newProvider: ethers.providers.JsonRpcProvider) => new Promise((resolve, reject) => {
    const timeOut = setTimeout(reject, 2000, 'request timed out');
    newProvider.on("network", (newNetwork: ethers.providers.Network, oldNetwork: ethers.providers.Network | null ) => {
      if (oldNetwork) {
          window.location.reload();
      }
      clearTimeout(timeOut);
      resolve(newNetwork);
    });
  });

  // Todo catch error and dispatch error on login
  const WalletActions: WalletContextActions = useMemo(
    () => ({
      signIn: async () => {
        const provider = new ethers.providers.Web3Provider((window as any).web3.currentProvider);
        const signer = provider.getSigner();
        await getNetwork(provider);
        const listAccount = await provider.listAccounts();
        dispatch({ type: 'SIGN_IN' , provider, signer, listAccount });
      },
      signOut: async () => {
        dispatch({ type: 'SIGN_OUT' });
      },
    }),
    []
  )
  return (
    <WalletContext.Provider value={{ ...state, ...WalletActions }}>
      {children}
    </WalletContext.Provider>
  )
}
const WalletReducer = (prevState: WalletState, action: WalletAction): WalletState => {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...prevState,
        status: 'signIn',
        listAccount: action.listAccount,
        account: action.listAccount[0],
        provider: action.provider,
        signer: action.signer,
      }
    case 'SIGN_OUT':
      prevState.provider?.removeAllListeners();
      return {
        ...prevState,
        status: 'signOut',
        listAccount: [],
        contracts: initContractList,
        account: '',
        provider: null,
        signer: null,
      }
    case 'LOAD_ACCOUNT':
      return {
        ...prevState,
        contracts: action.contracts
      }
  }
}

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be inside an WalletProvider with a value')
  }
  /*
    you can add more drived state here
    const isLoggedIn  = context.status ==== 'signIn'
    return ({ ...context, isloggedIn})
  */
  return context
}
