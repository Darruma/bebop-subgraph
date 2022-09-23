import { BigInt } from "@graphprotocol/graph-ts"
import {
  Bebop,
  OrderExecuted,
  OrderExecuted2,
  OrderExecuted3
} from "../generated/Bebop/Bebop"
import { loadOrder, loadOrder2, loadOrder3 } from "./entities/order"

export function handleOrderExecuted(event: OrderExecuted): void {
  loadOrder(event)
}

export function handleOrderExecuted2(event: OrderExecuted2): void {
  loadOrder2(event)
}

export function handleOrderExecuted3(event: OrderExecuted3): void {
  loadOrder3(event)
}
