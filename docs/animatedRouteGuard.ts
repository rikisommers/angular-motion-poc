import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { AnimatedRouterOutletDirective } from '../directives/animated-router-outlet.directive';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateGuard implements CanDeactivate<AnimatedRouterOutletDirective> {
  canDeactivate(component: AnimatedRouterOutletDirective): Observable<boolean> {
    return component.runDeactivation();
  }
}