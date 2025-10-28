import * as i0 from "@angular/core";
export declare class MotionAnimationService {
    private platformId;
    constructor(platformId: Object);
    private mockAnimate;
    private mockEasing;
    private mockStagger;
    private mockSpring;
    animate(target: any, keyframes: any, options?: any): any;
    get easeIn(): any;
    get easeOut(): any;
    get easeInOut(): any;
    stagger(duration: number, options?: any): any;
    get spring(): (options?: {
        stiffness?: number;
        damping?: number;
    }) => any;
    static ɵfac: i0.ɵɵFactoryDeclaration<MotionAnimationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MotionAnimationService>;
}
