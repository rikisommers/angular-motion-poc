import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { MotionService } from './services/motion.service';

export const motionExitGuard: CanActivateFn = async (route, state) => {
  const motionService = inject(MotionService);  // Inject the service
  
  try {
    // Ensure we return a boolean, never undefined
    const result = await motionService.runAllExitAnimations().toPromise();
    
    return result ?? false;  // Ensure that undefined is treated as false
  } catch (error) {
    console.error('Error running exit animations', error);
    return false;  // If there's an error, deny navigation
  }
};


// // admin-auth.guard.ts
// import { Injectable } from '@angular/core';
// import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// import { MotionService } from './services/motion.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class MotionExitGuard implements CanActivate {

//   constructor(private motionService: MotionService) {}

//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): boolean {
//     if (this.motionService.runAllExitAnimations()) {
//       return true;
//     }
//     return false;
//   }
// }
