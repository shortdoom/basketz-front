export interface IChainsNetwork {
  [chainID: number]: string,
}

export const ChainsID: IChainsNetwork = {
  0: "Olympic, Ethereum public pre-release PoW testnet",
  1: "Frontier, Homestead, Metropolis, the Ethereum public PoW main network",
  2: "Morden Classic, the public Ethereum Classic PoW testnet, now retired",
  3: "Ropsten, the public proof-of-work Ethereum testnet",
  4: "Rinkeby, the public Geth-only PoA testnet",
  5: "Goerli, the public cross-client PoA testnet",
  42: "Kovan, the public Parity-only PoA testnet",
  56: "Binance, the public Binance mainnet",
};
