import { createContext, useMemo, useEffect, useContext, useReducer } from 'react';
import { ethers } from "ethers";
import { constant, storage } from '../utils';

interface ProviderInformation {
  provider: ethers.providers.JsonRpcProvider | null
  signer: ethers.providers.JsonRpcSigner | null
}
interface WalletState extends ProviderInformation {
  status: 'idle' | 'signOut' | 'signIn'
}
//type WalletAction = { type: 'SIGN_IN'; token: string } | { type: 'SIGN_OUT' }
type WalletAction = { type: 'SIGN_IN' } | { type: 'SIGN_OUT' };
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

  const WalletActions: WalletContextActions = useMemo(
    () => ({
      signIn: async () => {
        dispatch({ type: 'SIGN_IN' /* , token */});
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
      console.log('signing in');
      const walletProvider : ProviderInformation = {
        provider: null,
        signer: null,
      };
      if ((window as any).ethereum) {
        console.log('metamask was found');
        walletProvider.provider = new ethers.providers.Web3Provider((window as any).ethereum);
        walletProvider.signer = walletProvider.provider.getSigner();
      } else {
        console.log('metamask was NOT found');
        walletProvider.provider = new ethers.providers.Web3Provider((window as any).ethereum);
        walletProvider.signer = walletProvider.provider.getSigner();
      }
      walletProvider.provider.on("network", (newNetwork: string, oldNetwork: string) => {
        console.log(`new network: ${newNetwork ? JSON.stringify(newNetwork) : ''}, old network: ${oldNetwork ? JSON.stringify(oldNetwork) : ''}`);
          // When a Provider makes its initial connection, it emits a "network"
          // event with a null oldNetwork along with the newNetwork. So, if the
          // oldNetwork exists, it represents a changing network
          if (oldNetwork) {
              window.location.reload();
          }
      });
      return {
        ...prevState,
        status: 'signIn',
        provider: walletProvider.provider,
        signer: walletProvider.signer,
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
