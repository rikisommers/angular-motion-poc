import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MotionService } from './services/motion.service';

@Injectable({
  providedIn: 'root',
})
export class MotionGuard2 implements CanDeactivate<any> {
  constructor(private motionService: MotionService) {}

  async canDeactivate() {

    // Check if the exit animations are complete
    const result = await this.motionService.runAllExitAnimations().toPromise();
    if (!result) {
      console.log('Exit animations are not complete, denying navigation');
      return false;
    }

    // The exit animations are complete, so allow navigation
    return true;
  }
}
