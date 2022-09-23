import { Address, BigInt } from "@graphprotocol/graph-ts"
import { MakerTokenVolume, TakerTokenVolume } from "../../generated/schema";
import { loadToken } from "./token";
import { loadUser } from "./user";

export function loadMakerVolume(user: Address, token: Address): MakerTokenVolume {
    let id = user.toHexString().concat("-").concat(token.toHexString())
    let volume = MakerTokenVolume.load(id)
    if(volume) {
        return volume as MakerTokenVolume;
    } else {
       volume = new MakerTokenVolume(id)
       volume.token = loadToken(token, BigInt.fromI32(0)).id
       volume.maker = loadUser(user).id
       volume.amount = BigInt.fromI32(0)
       volume.save()
       return volume as MakerTokenVolume
    }
}

export function loadTakerVolume(user: Address, token: Address): TakerTokenVolume {
    let id = user.toHexString().concat("-").concat(token.toHexString())
    let volume = TakerTokenVolume.load(id)
    if(volume) {
        return volume as TakerTokenVolume;
    } else {
       volume = new TakerTokenVolume(id)
       volume.token = loadToken(token, BigInt.fromI32(0)).id
       volume.taker = loadUser(user).id
       volume.amount = BigInt.fromI32(0)
       volume.save()
       return volume as TakerTokenVolume
    }
}