import { AppUser } from "./models/app-user";
import { UserService } from "./user.service";
import { AuthService } from "./auth.service";
import { CanActivate } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import "rxjs/add/operator/switchMap";

@Injectable({
  providedIn: "root"
})
export class AmdinAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private userService: UserService) {}

  canActivate(): Observable<boolean> {
    return this.auth.appUser$.map((appUser: any) => appUser.isAdmin);
  }
}
