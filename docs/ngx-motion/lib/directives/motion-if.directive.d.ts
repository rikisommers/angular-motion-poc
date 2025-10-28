import { TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';
import * as i0 from "@angular/core";
export declare class MotionIfDirective implements OnDestroy {
    private templateRef;
    private viewContainer;
    private hasView;
    private motionElement;
    private exitTimeout;
    constructor(templateRef: TemplateRef<any>, viewContainer: ViewContainerRef);
    set motionIf(condition: boolean);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MotionIfDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MotionIfDirective, "[motionIf]", never, { "motionIf": { "alias": "motionIf"; "required": false; }; }, {}, never, never, true, never>;
}
