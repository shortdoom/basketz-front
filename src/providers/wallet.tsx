import { createContext, useMemo, useEffect, useContext, useReducer } from 'react';
import { ethers } from "ethers";
import { constant, storage } from '../utils';

interface ProviderInformation {
  provider: ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider | null
  signer: ethers.providers.JsonRpcSigner | null
}
interface WalletState extends ProviderInformation {
  status: 'idle' | 'signOut' | 'signIn'
}
//type WalletAction = { type: 'SIGN_IN'; token: string } | { type: 'SIGN_OUT' }
type WalletAction = 
  { type: 'SIGN_IN', provider: ethers.providers.JsonRpcProvider, signer: ethers.providers.JsonRpcSigner | null } |
  { type: 'SIGN_OUT' };

interface WalletContextActions {
  signIn: () => void
  signOut: () => void
}
interface WalletContextType extends WalletState, WalletContextActions {}
const WalletContext = createContext<WalletContextType>({
  provider: null,
  signer: null,
  status: 'idle',
  signIn: () => {},
  signOut: () => {},
})
export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(WalletReducer, {
    provider: null,
    signer: null,
    status: 'idle',
  });

  useEffect(() => {
    const initState = async () => {
      try {
        // Initial state when the website is first loaded
        // If some verification needs to be done it has to be here
        // might use it to change network type?
        /*const userToken = localStorage.getItem(TOKEN);
        if (userToken !== null) {
          // verify token validity? or other stuff
          dispatch({ type: 'SIGN_IN', token: userToken })
        } else {
          dispatch({ type: 'SIGN_OUT' })
        }*/
      } catch (e) {
        // catch error here
        // Maybe sign_out user!
      }
    }
    initState()
  }, []);

  const getNetwork = (newProvider: ethers.providers.JsonRpcProvider) => new Promise((resolve, reject) => {
    const timeOut = setTimeout(reject, 2000, 'request timed out');
    newProvider.on("network", (newNetwork: ethers.providers.Network, oldNetwork: ethers.providers.Network | null ) => {
      console.log(`new network: ${newNetwork ? JSON.stringify(newNetwork) : ''}, old network: ${oldNetwork ? JSON.stringify(oldNetwork) : ''}`);
      if (oldNetwork) {
          window.location.reload();
      }
      clearTimeout(timeOut);
      resolve(newNetwork);
    });
  });

  const loadContracts = async (provider: ethers.providers.JsonRpcProvider) => {

  }

  const WalletActions: WalletContextActions = useMemo(
    () => ({
      signIn: async () => {
        console.log('signing in');
        const walletProvider : ProviderInformation = {
          provider: null,
          signer: null,
        };
        if ((window as any).web3) {
          console.log('metamask was found');
          //const provider = await (window as any).ethereum.send('eth_requestAccounts');
          walletProvider.provider = new ethers.providers.Web3Provider((window as any).web3.currentProvider);
          walletProvider.signer = walletProvider.provider.getSigner();
        } else {
          console.log('metamask was NOT found');
          walletProvider.provider = new ethers.providers.JsonRpcProvider();
          walletProvider.signer = walletProvider.provider.getSigner();
        }
        await getNetwork(walletProvider.provider);
        const accounts = await walletProvider.provider.listAccounts();
        console.log(`Check price here ${accounts}`);
        dispatch({ type: 'SIGN_IN' , provider: walletProvider.provider, signer: walletProvider.signer });
        storage.setItem(constant.KEY_INFO, 'test');
      },
      signOut: async () => {
        storage.removeItem(constant.KEY_INFO);
        dispatch({ type: 'SIGN_OUT' })
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
        provider: action.provider,
        signer: action.signer,
      }
    case 'SIGN_OUT':
      console.log('signing out');
      prevState.provider?.removeAllListeners();
      return {
        ...prevState,
        status: 'signOut',
        provider: null,
        signer: null,
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
