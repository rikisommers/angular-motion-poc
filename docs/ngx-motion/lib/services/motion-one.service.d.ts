import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as i0 from "@angular/core";
export interface MotionElement {
    elementId: string;
    getDuration(): number;
    runInitAnimation(): void;
    runExitAnimation(): void;
    cancel(): void;
    route?: string;
}
export declare class MotionOneService {
    private router;
    private document;
    private platformId;
    private scrollSubscription;
    private motionElements;
    scrollYProgress: import("@angular/core").WritableSignal<number>;
    totalExitDuration: number;
    private exitAnimationsComplete;
    private enterAnimationsComplete;
    private activeExitAnimations;
    private activeEnterAnimations;
    constructor(router: Router, document: Document, platformId: Object);
    ngOnDestroy(): void;
    private updateTotalExitDuration;
    private setupScrollListener;
    private updateScrollProgress;
    registerMotionElement(element: MotionElement): void;
    unregisterMotionElement(element: MotionElement): void;
    getMotionElements(): MotionElement[];
    getAllElementsByRoute(route: string): MotionElement[];
    cancelAllAnimations(): void;
    runAllEnterAnimations(): void;
    runAllExitAnimations(): void;
    /**
     * Get an observable that emits true when all exit animations for a route are complete
     * @param route The route to check for animation completion
     * @returns Observable that emits true when animations are complete
     */
    getExitAnimationsComplete(route: string): Observable<boolean>;
    /**
     * Get an observable that emits true when all enter animations for a route are complete
     * @param route The route to check for animation completion
     * @returns Observable that emits true when animations are complete
     */
    getEnterAnimationsComplete(route: string): Observable<boolean>;
    /**
     * Start tracking exit animations for a route
     * @param route The route to track
     */
    startExitAnimationsForRoute(route: string): void;
    /**
     * Start tracking enter animations for a route
     * @param route The route to track
     */
    startEnterAnimationsForRoute(route: string): void;
    /**
     * Mark exit animations for a route as complete
     * @param route The route to mark as complete
     */
    private completeExitAnimationsForRoute;
    /**
     * Mark enter animations for a route as complete
     * @param route The route to mark as complete
     */
    private completeEnterAnimationsForRoute;
    /**
     * Check if exit animations for a route are complete
     * @param route The route to check
     * @returns True if animations are complete or not running
     */
    areExitAnimationsComplete(route: string): boolean;
    /**
     * Check if enter animations for a route are complete
     * @param route The route to check
     * @returns True if animations are complete or not running
     */
    areEnterAnimationsComplete(route: string): boolean;
    runAllExitAnimationsForRoute(route: string): MotionElement[];
    runAllEnterAnimationsForRoute(route: string): MotionElement[];
    getLongestExitDurationForRoute(route: string): number;
    getLongestEnterDurationForRoute(route: string): number;
    getLongestEnterDuration(): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<MotionOneService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MotionOneService>;
}
