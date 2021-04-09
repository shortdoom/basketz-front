type ABI = 'erc20' | 'mockTokenA' | 'ercWrapper' | 'mockTokenB';

export interface TokenInfo {
  name: string;
  address: string;
  abi: ABI;
}

export interface Addresses {
  [chainID: number]: TokenInfo[];
}

// Change to uniswap list of addresses?
export const tokensList: Addresses = {
  4: [//Rinkeby
    { name: 'ercW', address: '0x5582E24970e186B28c51F6D0c1F2Bd8a4B281962', abi: 'ercWrapper' },
    { name: 'MockA', address: '0x220b45711340265481ACfF4302b5F0e17011503f', abi: 'mockTokenA' }
  ],
  42: [//Kovan
    { name: 'ercW', address: '0xac92c3eCEF51276f8F9154e94A55103D2341dE0A', abi: 'ercWrapper' },
    { name: 'MockA', address: '0x468C26d86c614cC3d8Eb8cFd89D5607f79D46289', abi: 'mockTokenA' },
    { name: 'MockB', address: '0x9C35eb2Ddf340AD3ac051455ea26D44e1ed87DC9', abi: 'mockTokenB' },
  ],
}
