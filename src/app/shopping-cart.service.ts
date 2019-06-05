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

  async getCart(): Promise<Observable<ShoppingCart>> {
    let cartId = await this.getOrCreateCartId();

    return this.db
      .object("/shopping-carts/" + cartId)
      .snapshotChanges()
      .pipe(map(x => new ShoppingCart(x.payload.exportVal().items)));
  }

  async addToCart(product: Product) {
    this.updateItem(product, 1);
  }

  async removeFromCart(product: Product) {
    this.updateItem(product, -1);
  }

  async clearCart() {
    let cartId = await this.getOrCreateCartId();
    this.db.object("/shopping-carts/" + cartId + "/items").remove();
  }

  private create() {
    return this.db.list("/shopping-carts").push({
      dateCreated: new Date().getTime()
    });
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

  private async updateItem(product: Product, change: number) {
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId, product.key);

    item$
      .snapshotChanges()
      .pipe(take(1))
      .subscribe(item => {
        if (item.payload.exists()) {
          let quantity = item.payload.exportVal().quantity + change;
          if (quantity === 0) item$.remove();
          else
            item$.update({
              title: product.title,
              imageUrl: product.imageUrl,
              price: product.price,
              quantity: quantity
            });
        } else {
          item$.update({
            title: product.title,
            imageUrl: product.imageUrl,
            price: product.price,
            quantity: 1
          });
        }
      });
  }
}
