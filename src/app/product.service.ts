import { AngularFireDatabase } from "@angular/fire/database";
import { Injectable } from "@angular/core";
import { map, take } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class ProductService {
  constructor(private db: AngularFireDatabase) {}

  create(product) {
    this.db.list("/products").push(product);
  }

  getAll() {
    return this.db
      .list("/products")
      .snapshotChanges()
      .pipe(
        map(products => {
          return products.map(p => ({
            key: p.payload.key,
            ...p.payload.val()
          }));
        })
      );
  }

  get(productId) {
    return this.db.object("/products/" + productId).valueChanges();
  }

  update(productId, product) {
    return this.db.object("/products/" + productId).update(product);
  }

  delete(productId) {
    return this.db.object("/products/" + productId).remove();
  }
}
