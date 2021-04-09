import erc20Abi from "./abis/erc20.json";
import basketzAbi from "./abis/basketz.json";
import ercWrapperAbi from "./abis/ercWrapper.json";
import mockTokenA from "./abis/MockTokenA.json";
import mockTokenB from "./abis/MockTokenB.json";
import mockTokenC from "./abis/MockTokenC.json";
import mockTokenD from "./abis/MockTokenD.json";
interface AbiInterface {
  [index: string]: Array<any>;
}
const abis: AbiInterface = {
  erc20: erc20Abi,
  basketz: basketzAbi,
  ercWrapper: ercWrapperAbi.abi,
  mockTokenA: mockTokenA.abi,
  mockTokenB: mockTokenB.abi,
  mockTokenC: mockTokenC.abi,
  mockTokenD: mockTokenD.abi,
};

export default abis;