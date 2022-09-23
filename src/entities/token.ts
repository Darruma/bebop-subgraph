import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Token } from '../../generated/schema';
import { ERC20 } from '../../generated/Bebop/ERC20'
import { readValue } from '../contracts';

export function loadToken(address: Address, index: BigInt): Token {
  let id = index.toString().concat("-").concat(address.toHexString())
  let token = Token.load(id)

  if (token) {
    return token as Token;
  }

  let contract = ERC20.bind(address);
  token = new Token(id);
  token.name = readValue<string>(contract.try_name(), '');
  token.symbol = readValue<string>(contract.try_symbol(), '');
  token.decimals = BigInt.fromI32(readValue<i32>(contract.try_decimals(), 18));
  token.totalSupply = readValue<BigInt>(contract.try_totalSupply(), BigInt.fromI32(0));

  token.save();
  return token as Token;
}