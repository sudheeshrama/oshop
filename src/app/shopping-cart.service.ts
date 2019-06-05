import { Product } from "./models/product";
import { AngularFireDatabase, AngularFireObject } from "@angular/fire/database";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ShoppingCart } from "./models/shopping-cart";
import { take, map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class ShoppingCartService {
  constructor(private db: AngularFireDatabase) {}

  private create() {
    return this.db.list("/shopping-carts").push({
      dateCreated: new Date().getTime()
    });
  }

  async getCart(): Promise<Observable<ShoppingCart>> {
    let cartId = await this.getOrCreateCartId();
    // return this.db
    //   .object("/shopping-carts/" + cartId).valueChanges()
    //   .map(x => new ShoppingCart(x.items));

    return this.db
      .object("/shopping-carts/" + cartId)
      .snapshotChanges()
      .pipe(map(x => new ShoppingCart(x.payload.exportVal().items)));
  }

  private getItem(cartId: string, productId: string) {
    return this.db.object("/shopping-carts/" + cartId + "/items/" + productId);
  }

  private async getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem("cardId");
    if (cartId) return cartId;

    let result = await this.create();
    localStorage.setItem("cardId", result.key);
    return result.key;
  }

  async addToCart(product: Product) {
    this.updateItemQuantity(product, 1);
  }

  async removeFromCart(product: Product) {
    this.updateItemQuantity(product, -1);
  }

  private async updateItemQuantity(product: Product, change: number) {
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId, product.key);

    item$
      .snapshotChanges()
      .pipe(take(1))
      .subscribe(item => {
        if (item.payload.exists()) {
          item$.update({
            quantity: item.payload.exportVal().quantity + change
          });
        } else {
          item$.update({ product: product, quantity: 1 });
        }
      });
  }
}
