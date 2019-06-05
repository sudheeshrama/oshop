import { ShoppingCartService } from "./shopping-cart.service";
import { AngularFireDatabase } from "@angular/fire/database";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class OrderService {
  constructor(
    private db: AngularFireDatabase,
    private shoppingCartService: ShoppingCartService
  ) {}

  getOrders() {
    return this.db.list("/orders");
  }

  getOrdersByUser(userId: string) {
    return this.db
      .list("/orders", ref => ref.orderByChild("userId").equalTo(userId))
      .valueChanges();
  }

  async placeOrder(order) {
    let result = await this.db.list("/orders").push(order);
    this.shoppingCartService.clearCart();
    return result;
  }
}
