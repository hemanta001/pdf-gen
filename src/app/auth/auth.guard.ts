import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
   private route: ActivatedRoute
  ) {
  }

  canActivate() {
    if(localStorage.getItem("token")){
      return true;
    }
    this.router.navigate(["/login"]);
    return false;
  }


}
