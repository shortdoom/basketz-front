type ABI = 'erc20' | 'basketz' | 'ercWrapper';

export interface TokenInfo {
  name: string;
  address: string;
  abi: ABI;
}

export interface Addresses {
  [chainID: number]: TokenInfo[];
}

export const tokens: Addresses = {
  4: [//Rinkeby
    { name: 'ercWrapper', address: '0x5582E24970e186B28c51F6D0c1F2Bd8a4B281962', abi: 'ercWrapper' },
    { name: 'MockA', address: '0x220b45711340265481ACfF4302b5F0e17011503f', abi: 'basketz' }
  ],
  42: [//Kovan

  ],
}