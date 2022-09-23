import { Address, BigInt } from '@graphprotocol/graph-ts';
import { OrderExecuted, OrderExecuted2, OrderExecuted3 } from '../../generated/Bebop/Bebop';
import { Order } from '../../generated/schema';
import { loadToken } from './token';
import { loadUser } from './user';
import { loadMakerVolume, loadTakerVolume } from './volume';

function getTokenID(address: Address, index: i32, arr: Address[]): string {
    return loadToken(address, BigInt.fromI32(index)).id
}

function updateVolumes(
    maker: string,
    taker: string,
    baseAmounts: BigInt[] | null,
    quoteAmounts: BigInt[] | null,
    baseTokens: string[] | null,
    quoteTokens: string[] | null
): void {
    if (baseTokens && baseAmounts) {
        for (let i = 0; i < baseTokens.length; i++) {
            let addr = baseTokens[i].split("-")[1]
            let makerVolume = loadMakerVolume(
                Address.fromString(maker), Address.fromString(addr)
            )
            makerVolume.amount = makerVolume.amount.plus(baseAmounts[i])
            makerVolume.save()
        }
    }

    if (quoteTokens && quoteAmounts) {
        for (let i = 0; i < quoteTokens.length; i++) {
            let addr = quoteTokens[i].split("-")[1]

            let takerVolume = loadTakerVolume(
                Address.fromString(taker), Address.fromString(addr)
            )
            takerVolume.amount = takerVolume.amount.plus(quoteAmounts[i])
            takerVolume.save()
        }
    }

}

export function loadOrder(order: OrderExecuted): Order {
    let id = order.transaction.hash.toHexString();
    let o = new Order(id);
    o.maker = loadUser(order.params.maker_address).id
    o.taker = loadUser(order.params.taker_address).id
    o.receiver = loadUser(order.params.receiver).id;
    o.baseAmounts = [order.params.base_quantity]
    o.quoteAmounts = [order.params.quote_quantity]
    o.baseTokens = [loadToken(order.params.base_token, BigInt.fromI32(0)).id]
    o.quoteTokens = [loadToken(order.params.quote_token, BigInt.fromI32(0)).id]
    o.timestamp = order.block.timestamp;
    o.blockNumber = order.block.number;

    o.save()
    updateVolumes(
        o.maker,
        o.taker,
        o.baseAmounts,
        o.quoteAmounts,
        o.baseTokens,
        o.quoteTokens
    )
    return o
}

export function loadOrder2(order: OrderExecuted2): Order {
    let id = order.transaction.hash.toHexString();
    let o = new Order(id);
    o.maker = loadUser(order.params.maker_address).id
    o.taker = loadUser(order.params.taker_address).id
    o.receiver = loadUser(order.params.receiver).id;
    o.baseAmounts = order.params.base_quantities
    o.quoteAmounts = [order.params.quote_quantity]
    o.baseTokens = order.params.base_tokens.map(getTokenID)
    o.quoteTokens = [loadToken(order.params.quote_token, BigInt.fromI32(0)).id]
    o.timestamp = order.block.timestamp;
    o.blockNumber = order.block.number;
    o.save()
    updateVolumes(
        o.maker,
        o.taker,
        o.baseAmounts,
        o.quoteAmounts,
        o.baseTokens,
        o.quoteTokens
    )
    return o

}

export function loadOrder3(order: OrderExecuted3): Order {
    let id = order.transaction.hash.toHexString();
    let o = new Order(id);
    o.maker = loadUser(order.params.maker_address).id
    o.taker = loadUser(order.params.taker_address).id
    o.receiver = loadUser(order.params.receiver).id
    o.baseAmounts = [order.params.base_quantity]
    o.quoteAmounts = order.params.quote_quantities
    o.quoteTokens = order.params.quote_tokens.map(getTokenID)
    o.baseTokens = [loadToken(order.params.base_token, BigInt.fromI32(0)).id]
    o.timestamp = order.block.timestamp;
    o.blockNumber = order.block.number;
    o.save()

    updateVolumes(
        o.maker,
        o.taker,
        o.baseAmounts,
        o.quoteAmounts,
        o.baseTokens,
        o.quoteTokens
    )
    return o
}