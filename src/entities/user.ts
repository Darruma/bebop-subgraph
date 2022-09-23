import { Address, BigInt } from '@graphprotocol/graph-ts';
import { User } from '../../generated/schema';

export function loadUser(address: Address): User {
  let id = address.toHexString();
  let user = User.load(id)
  if(user) {
    return user as User
  } 
  user = new User(id)
  user.save()
  return user
}