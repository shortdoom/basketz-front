import erc20Abi from "./abis/erc20.json";
import basketzAbi from "./abis/basketz.json";
import ercWrapperAbi from "./abis/ercWrapper.json";
interface AbiInterface {
  [index: string]: Array<any>;
}
const abis: AbiInterface = {
  erc20: erc20Abi,
  basketz: basketzAbi,
  ercWrapper: ercWrapperAbi,
};

export default abis;