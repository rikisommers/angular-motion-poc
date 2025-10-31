import { Injectable } from '@angular/core';

export interface GestureAnimationState {
  isAnimating: boolean;
  gestureType: 'hover' | 'tap' | 'focus' | null;
  targetState: string | null;
  controls: any;
  startTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class MotionGestureService {
  private gestureStates = new Map<string, GestureAnimationState>();
  private readonly MIN_GESTURE_INTERVAL = 50; // Minimum ms between gesture triggers

  /**
   * Check if a gesture should be allowed based on timing
   * Prevents rapid-fire gesture triggers that cause aggressive spring behavior
   */
  shouldAllowGesture(elementId: string, gestureType: 'hover' | 'tap' | 'focus'): boolean {
    const state = this.gestureStates.get(elementId);

    if (!state) {
      return true;
    }

    // Allow gestures of different types immediately
    if (state.gestureType !== gestureType) {
      return true;
    }

    // Check if enough time has passed since last gesture of same type
    const timeSinceLastGesture = Date.now() - state.startTime;
    return timeSinceLastGesture >= this.MIN_GESTURE_INTERVAL;
  }

  /**
   * Register that a gesture animation is starting
   */
  startGesture(
    elementId: string,
    gestureType: 'hover' | 'tap' | 'focus',
    targetState: string,
    controls: any
  ): void {
    const existingState = this.gestureStates.get(elementId);

    // Stop any existing animation for this element
    if (existingState?.controls) {
      try {
        existingState.controls.stop();
      } catch (e) {
        // Animation may have already finished
      }
    }

    this.gestureStates.set(elementId, {
      isAnimating: true,
      gestureType,
      targetState,
      controls,
      startTime: Date.now()
    });
  }

  /**
   * Register that a gesture animation has ended
   */
  endGesture(elementId: string): void {
    const state = this.gestureStates.get(elementId);
    if (state) {
      state.isAnimating = false;
      state.gestureType = null;
      state.targetState = null;
    }
  }

  /**
   * Get the current gesture state for an element
   */
  getGestureState(elementId: string): GestureAnimationState | undefined {
    return this.gestureStates.get(elementId);
  }

  /**
   * Cancel any ongoing gesture animation for an element
   * Returns true if an animation was cancelled
   */
  cancelGesture(elementId: string): boolean {
    const state = this.gestureStates.get(elementId);

    if (state?.controls && state.isAnimating) {
      try {
        state.controls.stop();
        this.endGesture(elementId);
        return true;
      } catch (e) {
        // Animation may have already finished
      }
    }

    return false;
  }

  /**
   * Check if an element currently has an active gesture animation
   */
  isGestureActive(elementId: string, gestureType?: 'hover' | 'tap' | 'focus'): boolean {
    const state = this.gestureStates.get(elementId);

    if (!state || !state.isAnimating) {
      return false;
    }

    if (gestureType) {
      return state.gestureType === gestureType;
    }

    return true;
  }

  /**
   * Clear all gesture state (useful for cleanup)
   */
  clearElement(elementId: string): void {
    this.cancelGesture(elementId);
    this.gestureStates.delete(elementId);
  }

  /**
   * Clear all gesture states
   */
  clearAll(): void {
    this.gestureStates.forEach((_, elementId) => {
      this.cancelGesture(elementId);
    });
    this.gestureStates.clear();
  }
}
