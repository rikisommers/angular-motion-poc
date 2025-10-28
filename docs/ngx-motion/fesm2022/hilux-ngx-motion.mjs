import * as i0 from '@angular/core';
import { signal, PLATFORM_ID, Inject, Injectable, EventEmitter, HostListener, ContentChildren, Output, Input, Directive } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Subject, Subscription, fromEvent, timer } from 'rxjs';
import { throttleTime, debounceTime, take, map } from 'rxjs/operators';
import * as i1 from '@angular/router';
import * as motion from 'motion';

/**
 * Browser-safe wrapper for Motion One
 * Prevents "window is not defined" errors during SSR
 */
// Create mock implementations for server environment
const mockAnimate = () => ({ stop: () => { } });
const mockEasing = { ease: [0, 0, 1, 1] };
const mockStagger = () => 0;
const mockInView = () => ({ stop: () => { } });
// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';
// Define the exports
let motionExports = {
    animate: mockAnimate,
    easeIn: mockEasing,
    easeOut: mockEasing,
    easeInOut: mockEasing,
    stagger: mockStagger,
    inView: mockInView
};
// Only try to load motion in browser environment
if (isBrowser) {
    try {
        // Use dynamic import syntax
        import('motion').then(motion => {
            motionExports.animate = motion.animate;
            motionExports.easeIn = motion.easeIn;
            motionExports.easeOut = motion.easeOut;
            motionExports.easeInOut = motion.easeInOut;
            motionExports.stagger = motion.stagger;
            motionExports.inView = motion.inView;
        }).catch(e => {
            console.warn('Failed to import motion library, using mock implementations', e);
        });
    }
    catch (e) {
        console.warn('Failed to import motion library, using mock implementations', e);
    }
}
// Export the implementations (real or mock)
const animate = (...args) => {
    return motionExports.animate(...args);
};
const easeIn = motionExports.easeIn;
const easeOut = motionExports.easeOut;
const easeInOut = motionExports.easeInOut;
const stagger = (...args) => {
    return motionExports.stagger(...args);
};
const inView = (...args) => {
    return motionExports.inView(...args);
};

class MotionOneService {
    router;
    document;
    platformId;
    scrollSubscription;
    motionElements = [];
    scrollYProgress = signal(0);
    totalExitDuration = 0;
    // Subject that emits when all exit animations for a route are complete
    exitAnimationsComplete = new Subject();
    // Subject that emits when all enter animations for a route are complete
    enterAnimationsComplete = new Subject();
    // Track active exit animations by route
    activeExitAnimations = new Map();
    // Track active enter animations by route
    activeEnterAnimations = new Map();
    constructor(router, document, platformId) {
        this.router = router;
        this.document = document;
        this.platformId = platformId;
        this.setupScrollListener();
        this.scrollSubscription = new Subscription();
    }
    ngOnDestroy() {
        if (this.scrollSubscription) {
            this.scrollSubscription.unsubscribe();
        }
        this.exitAnimationsComplete.complete();
        this.enterAnimationsComplete.complete();
    }
    updateTotalExitDuration() {
        if (!isPlatformBrowser(this.platformId))
            return;
        this.totalExitDuration = this.motionElements.reduce((total, element) => {
            return total + element.getDuration();
        }, 0);
    }
    setupScrollListener() {
        if (!isPlatformBrowser(this.platformId))
            return;
        this.scrollSubscription = fromEvent(window, 'scroll')
            .pipe(throttleTime(16), // Limit to about 60fps
        debounceTime(1))
            .subscribe(() => {
            this.updateScrollProgress();
        });
        this.updateScrollProgress();
    }
    updateScrollProgress() {
        if (!isPlatformBrowser(this.platformId))
            return;
        const doc = this.document.documentElement;
        const scrollTop = window.scrollY || doc.scrollTop;
        const scrollHeight = doc.scrollHeight - doc.clientHeight;
        const progress = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
        this.scrollYProgress.set(progress);
    }
    registerMotionElement(element) {
        this.motionElements.push(element);
        this.updateTotalExitDuration();
    }
    unregisterMotionElement(element) {
        this.motionElements = this.motionElements.filter((e) => e !== element);
        this.updateTotalExitDuration();
    }
    getMotionElements() {
        return this.motionElements;
    }
    getAllElementsByRoute(route) {
        const elements = this.motionElements.filter(element => element.route === route);
        //console.log(`[MotionOneService] Found ${elements.length} elements for route ${route} (out of ${this.motionElements.length} total)`);
        return elements;
    }
    cancelAllAnimations() {
        if (!isPlatformBrowser(this.platformId))
            return;
        this.motionElements.forEach((motion) => {
            motion.cancel();
        });
    }
    runAllEnterAnimations() {
        if (!isPlatformBrowser(this.platformId))
            return;
        this.motionElements.forEach((motion) => {
            motion.runInitAnimation();
        });
    }
    runAllExitAnimations() {
        if (!isPlatformBrowser(this.platformId))
            return;
        this.motionElements.forEach((motion) => {
            console.log(motion);
            motion.runExitAnimation();
        });
    }
    /**
     * Get an observable that emits true when all exit animations for a route are complete
     * @param route The route to check for animation completion
     * @returns Observable that emits true when animations are complete
     */
    getExitAnimationsComplete(route) {
        if (!isPlatformBrowser(this.platformId)) {
            // If not in browser, immediately emit true
            return timer(0).pipe(take(1), map(() => true));
        }
        // Get the exit duration for the route
        const exitDuration = this.getLongestExitDurationForRoute(route);
        // console.log(`[MotionOneService] Setting up exit animations complete for route ${route} with duration ${exitDuration}s`);
        // If no animations or duration is 0, immediately emit true
        if (exitDuration === 0 || this.getAllElementsByRoute(route).length === 0) {
            //  console.log(`[MotionOneService] No exit animations for route ${route}, emitting complete immediately`);
            return timer(0).pipe(take(1), map(() => true));
        }
        // Otherwise, wait for the exit duration and then emit true
        return timer(exitDuration * 1000).pipe(take(1), map(() => true));
    }
    /**
     * Get an observable that emits true when all enter animations for a route are complete
     * @param route The route to check for animation completion
     * @returns Observable that emits true when animations are complete
     */
    getEnterAnimationsComplete(route) {
        if (!isPlatformBrowser(this.platformId)) {
            // If not in browser, immediately emit true
            return timer(0).pipe(take(1), map(() => true));
        }
        // Get the enter duration for the route
        const enterDuration = this.getLongestEnterDurationForRoute(route);
        // console.log(`[MotionOneService] Setting up enter animations complete for route ${route} with duration ${enterDuration}s`);
        // If no animations or duration is 0, immediately emit true
        if (enterDuration === 0 || this.getAllElementsByRoute(route).length === 0) {
            //   console.log(`[MotionOneService] No enter animations for route ${route}, emitting complete immediately`);
            return timer(0).pipe(take(1), map(() => true));
        }
        // Otherwise, wait for the enter duration and then emit true
        return timer(enterDuration * 1000).pipe(take(1), map(() => true));
    }
    /**
     * Start tracking exit animations for a route
     * @param route The route to track
     */
    startExitAnimationsForRoute(route) {
        if (!isPlatformBrowser(this.platformId))
            return;
        const elements = this.getAllElementsByRoute(route);
        this.activeExitAnimations.set(route, elements.length);
        //console.log(`[MotionOneService] Starting exit animations for route ${route} with ${elements.length} elements`);
        // If no elements, immediately mark as complete
        if (elements.length === 0) {
            this.completeExitAnimationsForRoute(route);
            return;
        }
        // Run exit animations for all elements in this route
        elements.forEach(element => {
            element.runExitAnimation();
        });
        // Get the longest duration and set a timer to mark animations as complete
        const exitDuration = this.getLongestExitDurationForRoute(route);
        setTimeout(() => {
            this.completeExitAnimationsForRoute(route);
        }, exitDuration * 1000);
    }
    /**
     * Start tracking enter animations for a route
     * @param route The route to track
     */
    startEnterAnimationsForRoute(route) {
        if (!isPlatformBrowser(this.platformId))
            return;
        const elements = this.getAllElementsByRoute(route);
        this.activeEnterAnimations.set(route, elements.length);
        // console.log(`[MotionOneService] Starting enter animations for route ${route} with ${elements.length} elements`);
        // If no elements, immediately mark as complete
        if (elements.length === 0) {
            this.completeEnterAnimationsForRoute(route);
            return;
        }
        // Run enter animations for all elements in this route
        elements.forEach(element => {
            element.runInitAnimation();
        });
        // Get the longest duration and set a timer to mark animations as complete
        const enterDuration = this.getLongestEnterDurationForRoute(route);
        setTimeout(() => {
            this.completeEnterAnimationsForRoute(route);
        }, enterDuration * 1000);
    }
    /**
     * Mark exit animations for a route as complete
     * @param route The route to mark as complete
     */
    completeExitAnimationsForRoute(route) {
        console.log(`[MotionOneService] Exit animations complete for route ${route}`);
        this.activeExitAnimations.delete(route);
        this.exitAnimationsComplete.next(route);
    }
    /**
     * Mark enter animations for a route as complete
     * @param route The route to mark as complete
     */
    completeEnterAnimationsForRoute(route) {
        console.log(`[MotionOneService] Enter animations complete for route ${route}`);
        this.activeEnterAnimations.delete(route);
        this.enterAnimationsComplete.next(route);
    }
    /**
     * Check if exit animations for a route are complete
     * @param route The route to check
     * @returns True if animations are complete or not running
     */
    areExitAnimationsComplete(route) {
        return !this.activeExitAnimations.has(route);
    }
    /**
     * Check if enter animations for a route are complete
     * @param route The route to check
     * @returns True if animations are complete or not running
     */
    areEnterAnimationsComplete(route) {
        return !this.activeEnterAnimations.has(route);
    }
    runAllExitAnimationsForRoute(route) {
        if (!isPlatformBrowser(this.platformId))
            return [];
        // Start tracking animations for this route
        this.startExitAnimationsForRoute(route);
        return this.getAllElementsByRoute(route);
    }
    runAllEnterAnimationsForRoute(route) {
        if (!isPlatformBrowser(this.platformId))
            return [];
        // Start tracking animations for this route
        this.startEnterAnimationsForRoute(route);
        return this.getAllElementsByRoute(route);
    }
    getLongestExitDurationForRoute(route) {
        if (!isPlatformBrowser(this.platformId))
            return 0;
        // console.log(`[MotionOneService] Getting longest exit duration for route ${route}`);
        if (this.motionElements.length === 0) {
            //  console.log('[MotionOneService] No motion elements registered');
            return 0;
        }
        const elements = this.getAllElementsByRoute(route);
        if (elements.length === 0) {
            //  console.log(`[MotionOneService] No elements found for route ${route}`);
            return 0;
        }
        const durations = elements.map((motion) => {
            const duration = motion.getDuration();
            //   console.log(`[MotionOneService] Element ${motion.elementId} has exit duration: ${duration}s`);
            return duration;
        });
        const maxDuration = durations.length > 0 ? Math.max(...durations) : 0;
        console.log(`[MotionOneService] Longest exit duration for route ${route}: ${maxDuration}s`);
        return maxDuration;
    }
    getLongestEnterDurationForRoute(route) {
        if (!isPlatformBrowser(this.platformId))
            return 0;
        //  console.log(`[MotionOneService] Getting longest enter duration for route ${route}`);
        if (this.motionElements.length === 0) {
            //    console.log('[MotionOneService] No motion elements registered');
            return 0;
        }
        const elements = this.getAllElementsByRoute(route);
        if (elements.length === 0) {
            //    console.log(`[MotionOneService] No elements found for route ${route}`);
            return 0;
        }
        const durations = elements.map((motion) => {
            const duration = motion.getDuration();
            //    console.log(`[MotionOneService] Element ${motion.elementId} has enter duration: ${duration}s`);
            return duration;
        });
        const maxDuration = durations.length > 0 ? Math.max(...durations) : 0;
        console.log(`[MotionOneService] Longest enter duration for route ${route}: ${maxDuration}s`);
        return maxDuration;
    }
    getLongestEnterDuration() {
        if (!isPlatformBrowser(this.platformId))
            return 0;
        //  console.log(`[MotionOneService] Getting longest enter duration from ${this.motionElements.length} elements`);
        if (this.motionElements.length === 0) {
            //   console.log('[MotionOneService] No motion elements registered');
            return 0;
        }
        const durations = this.motionElements.map((motion) => {
            const duration = motion.getDuration();
            //   console.log(`[MotionOneService] Element ${motion.elementId} has duration: ${duration}s`);
            return duration;
        });
        const maxDuration = durations.length > 0 ? Math.max(...durations) : 0;
        console.log(`[MotionOneService] Longest enter duration: ${maxDuration}s`);
        return maxDuration;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: MotionOneService, deps: [{ token: i1.Router }, { token: DOCUMENT }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: MotionOneService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: MotionOneService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [{ type: i1.Router }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }] });

class MotionAnimationService {
    platformId;
    constructor(platformId) {
        this.platformId = platformId;
    }
    // Mock implementations for server environment
    mockAnimate = () => ({ stop: () => { } });
    mockEasing = (t) => t;
    mockStagger = () => 0;
    mockSpring = () => motion.easeInOut;
    // Wrapper for animate function
    animate(target, keyframes, options) {
        if (!isPlatformBrowser(this.platformId)) {
            return this.mockAnimate();
        }
        try {
            return motion.animate(target, keyframes, options);
        }
        catch (e) {
            console.error('Error in animate:', e);
            return this.mockAnimate();
        }
    }
    // Wrapper for easing functions
    get easeIn() {
        return isPlatformBrowser(this.platformId) ? motion.easeIn : this.mockEasing;
    }
    get easeOut() {
        return isPlatformBrowser(this.platformId) ? motion.easeOut : this.mockEasing;
    }
    get easeInOut() {
        return isPlatformBrowser(this.platformId) ? motion.easeInOut : this.mockEasing;
    }
    // Wrapper for stagger function
    stagger(duration, options) {
        if (!isPlatformBrowser(this.platformId)) {
            return this.mockStagger();
        }
        try {
            return motion.stagger(duration, options);
        }
        catch (e) {
            console.error('Error in stagger:', e);
            return this.mockStagger();
        }
    }
    get spring() {
        if (!isPlatformBrowser(this.platformId)) {
            return this.mockSpring;
        }
        return (options) => {
            const m = motion;
            try {
                // Prefer Motion One spring factory if available
                if (typeof m.spring === 'function') {
                    return m.spring({
                        stiffness: options?.stiffness ?? 100,
                        damping: options?.damping ?? 10
                    });
                }
                // Motion 10 shim: use m.createGenerator?.spring
                if (m?.createGenerator?.spring) {
                    return m.createGenerator.spring({
                        stiffness: options?.stiffness ?? 100,
                        damping: options?.damping ?? 10
                    });
                }
            }
            catch { }
            // Fallback to an ease function if no spring present
            return m?.easeInOut ?? ((t) => t);
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: MotionAnimationService, deps: [{ token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: MotionAnimationService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: MotionAnimationService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }] });

let uniqueIdCounter = 0;
class MotionOneDirective {
    el;
    motionService;
    motionAnimation;
    router;
    platformId;
    initial = {};
    animate = {};
    exit = {};
    inView = {};
    duration = 0.3; // Changed to number for Motion One
    delay = 0; // Changed to number for Motion One
    delayChildren = 0; // Add new input for delaying children
    repeat = false;
    exitDelay = 0; // Changed to number for Motion One
    easing = 'ease';
    offset = '0px';
    whileHover = {};
    staggerChildren = 1; // Changed to number for Motion One
    staggerDirection = 1; // Changed to number for Motion One
    whileTap = {};
    whileFocus = {};
    whileInView = {};
    runInView; // Controls if animation waits for inView ('never'/undefined = immediate, 'once' = single trigger, 'always' = repeats on scroll)
    variants = {};
    transition = {};
    timeline;
    animationComplete = new EventEmitter();
    // Add a public method to restart animations
    restartAnimation() {
        // Stop any current animations
        if (this.controls) {
            this.controls.stop();
        }
        // Force reset to initial state immediately without animation
        const initialVariant = this.getVariant(this.initial);
        const initialStyles = this.extractStyleProperties(initialVariant);
        // Apply initial styles directly with no transition
        const element = this.el.nativeElement;
        element.style.transition = 'none';
        Object.assign(element.style, initialStyles);
        // Force a reflow to ensure the reset is applied
        element.offsetHeight;
        // Remove the transition override and start the animation fresh
        setTimeout(() => {
            element.style.transition = '';
            // Check if this element uses runInView
            if (this.isRunInViewEnabled) {
                // For runInView elements, just reset to initial and let inView handle the animation
                // Element is already reset to initial, inView will trigger when appropriate
            }
            else {
                // For non-runInView elements, play the animation directly
                this.playAnimation(this.initial, this.animate);
            }
        }, 10);
    }
    // Query for child motionone directives
    childMotionDirectives;
    controls = null;
    childrenControls = [];
    elementId;
    hoverTimeout;
    observer;
    routeDelay = 0;
    inViewInstance;
    isChild = false;
    parentDirective = null;
    initialAnimationPlayed = false;
    _skipStartStylesApplication = false;
    staggerDelay = undefined;
    childrenCount = 0;
    childIndex = 0;
    isStaggeredChild = false; // Flag to indicate if this child is part of a stagger group
    get scrollProgress() {
        return this.motionService.scrollYProgress();
    }
    // Helper methods for runInView configuration
    get isRunInViewEnabled() {
        return this.runInView === 'once' || this.runInView === 'always';
    }
    get runInViewRepeat() {
        return this.runInView === 'always' ? 'always' : 'once'; // Default to 'once' if undefined or 'never'
    }
    constructor(el, motionService, motionAnimation, router, platformId) {
        this.el = el;
        this.motionService = motionService;
        this.motionAnimation = motionAnimation;
        this.router = router;
        this.platformId = platformId;
        this.elementId = `motion-${uniqueIdCounter++}`;
        // Only run browser-specific code in browser environment
        if (isPlatformBrowser(this.platformId)) {
            this.el.nativeElement.setAttribute('id', this.elementId);
            // Store a reference to this directive on the element for easier access
            this.el.nativeElement._motionDirective = this;
            this.motionService.registerMotionElement(this);
            this.applyInitialStyles();
            this.routeDelay = this.motionService.getLongestExitDurationForRoute(this.router.url);
        }
    }
    ngOnInit() {
        this.applyInitialStyles(); // Ensure initial styles are applied
        // Only run animations in browser environment
        if (isPlatformBrowser(this.platformId)) {
            // Check if this is a child of another motionone directive
            let parent = this.el.nativeElement.parentElement;
            while (parent) {
                if (parent.hasAttribute('motionone')) {
                    this.isChild = true;
                    break;
                }
                parent = parent.parentElement;
            }
            // Set up runInView logic based on parent-child relationship
            if (this.isRunInViewEnabled) {
                if (!this.isChild) {
                    // Host elements (non-child) with runInView set up their own observer immediately
                    this.setupInViewAnimation();
                }
                else {
                    // Child elements with runInView only set up observer if parent doesn't have stagger
                    // We'll check this later in ngAfterContentInit when we know about parent stagger settings
                }
            }
            else if (!this.isChild) {
                // Only auto-play animation if not a child AND no runInView
                this.playAnimation(this.initial, this.animate);
            }
            // Setup inView/whileInView animations - these work independently of runInView
            // Only set up if this element is not managed by a parent with runInView
            if (!this.isStaggeredChild &&
                ((this.inView && Object.keys(this.inView).length > 0) ||
                    (this.whileInView && Object.keys(this.whileInView).length > 0))) {
                this.setupInViewAnimation();
            }
        }
    }
    ngAfterContentInit() {
        // Register child directives if we have staggerChildren
        if (this.childMotionDirectives && this.childMotionDirectives.length > 0) {
            // Set this directive as the parent for all children
            setTimeout(() => {
                // Filter out self from children
                const childDirectives = this.childMotionDirectives.filter(child => child !== this);
                this.childrenCount = childDirectives.length;
                // Set parent and index for each child
                childDirectives.forEach((child, index) => {
                    child.setParent(this, index, this.childrenCount);
                });
                // Check if we need to stagger children
                const staggerValue = this.getStaggerValue();
                // Handle child runInView setup based on parent runInView and stagger
                if (this.runInView === 'always') {
                    // Mark ALL children as managed by parent (regardless of stagger)
                    childDirectives.forEach(child => {
                        if (child.isRunInViewEnabled) {
                            child.isStaggeredChild = true; // Mark so child knows parent manages it
                            // DO NOT set up intersection observer - parent handles everything
                        }
                    });
                    // CRITICAL: Set up intersection observer for the parent
                    this.setupRunInViewObserver();
                    // Check if we have stagger
                    if (staggerValue > 0 && this.childrenCount > 0) {
                    }
                    else {
                    }
                }
                else if (staggerValue > 0 && this.childrenCount > 0) {
                    // For staggered children, mark them as staggered but DON'T set up intersection observers
                    childDirectives.forEach(child => {
                        if (child.isRunInViewEnabled) {
                            child.isStaggeredChild = true;
                        }
                    });
                    // Trigger staggered animations for children (only if parent not using runInView)
                    if (!this.isRunInViewEnabled) {
                        this.applyStaggerToChildren();
                    }
                    else {
                    }
                }
                else {
                    // If no stagger and parent doesn't have runInView="always", children can set up their own observers
                    childDirectives.forEach(child => {
                        if (child.isRunInViewEnabled) {
                            child.setupInViewAnimation();
                        }
                    });
                }
            });
        }
        else {
        }
    }
    setParent(parent, index, totalChildren) {
        this.parentDirective = parent;
        this.isChild = true;
        this.childIndex = index;
        this.childrenCount = totalChildren;
    }
    // COMPLETE RESET METHOD: Reset parent and all children to initial state (like Framer Motion)
    completeResetToInitial() {
        // 1. Reset self to initial
        this.forceResetToInitial();
        // 2. Reset all children to their individual initial states
        if (this.childMotionDirectives && this.childMotionDirectives.length > 0) {
            const childDirectives = this.childMotionDirectives.filter(child => child !== this);
            childDirectives.forEach((child, index) => {
                child.forceResetToInitial();
            });
        }
    }
    // FORCE RESET: Reset this element to its initial state immediately
    forceResetToInitial() {
        // Stop any current animation immediately
        if (this.controls) {
            this.controls.stop();
            this.controls = null;
        }
        // Get this element's initial state
        const initialVariant = this.getVariant(this.initial);
        const initialStyles = this.extractStyleProperties(initialVariant);
        // Apply initial styles immediately with no transition
        this.el.nativeElement.style.transition = 'none';
        // Clear any existing styles first
        this.el.nativeElement.style.opacity = '';
        this.el.nativeElement.style.transform = '';
        // Apply initial styles
        Object.assign(this.el.nativeElement.style, initialStyles);
        this.el.nativeElement.offsetHeight; // Force reflow
        this.el.nativeElement.style.transition = '';
        // Reset animation flags
        this.initialAnimationPlayed = false;
    }
    // Simple method to reset child to initial if parent has runInView
    resetToInitialIfParentHasRunInView() {
        this.forceResetToInitial();
    }
    // Method to call complete reset when parent exits viewport
    parentExitViewportReset() {
        this.completeResetToInitial();
    }
    // Set up intersection observer for runInView functionality
    setupRunInViewObserver() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        // Create intersection observer with proper threshold
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.handleViewportEntry();
                }
                else {
                    this.handleViewportExit();
                }
            });
        }, {
            root: null, // Use viewport as root
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of element is visible
        });
        // Start observing the element
        this.observer.observe(this.el.nativeElement);
    }
    // Handle when element enters viewport
    handleViewportEntry() {
        // Check if we have stagger children
        const staggerValue = this.getStaggerValue();
        if (staggerValue > 0 && this.childMotionDirectives?.length > 0) {
            this.applyStaggerToChildren();
        }
        else {
            this.playAnimation(this.initial, this.animate);
        }
    }
    // Handle when element exits viewport
    handleViewportExit() {
        if (this.runInView === 'always') {
            // Force children to their initial variant state
            if (this.childMotionDirectives && this.childMotionDirectives.length > 0) {
                const childDirectives = this.childMotionDirectives.filter(child => child !== this);
                childDirectives.forEach((child) => {
                    // Stop any animation and immediately set to initial variant
                    if (child.controls) {
                        child.controls.stop();
                        child.controls = null;
                    }
                    // Use playAnimation to go to initial variant (instant)
                    child.playAnimation(child.animate, child.initial);
                    child.initialAnimationPlayed = false;
                });
            }
        }
    }
    // Method to stagger children animations
    applyStaggerToChildren() {
        // Get stagger configuration
        const staggerValue = this.getStaggerValue();
        const staggerDirection = this.getStaggerDirection();
        const delayChildren = this.delayChildren; // number
        const parentDelay = ((this.transition?.delay) ?? 0);
        // Get all child directives (excluding self)
        const childDirectives = this.childMotionDirectives.filter(child => child !== this);
        // Determine when to animate parent relative to children
        const when = this.getWhen();
        // Animate parent if needed
        if (when !== 'afterChildren') {
            this.runSelfAnimation();
        }
        // Animate each child with appropriate stagger delay
        childDirectives.forEach((childDirective, index) => {
            // Calculate the stagger delay based on index and direction
            let staggerIndex;
            if (staggerDirection >= 0) {
                staggerIndex = index;
            }
            else {
                staggerIndex = this.childrenCount - 1 - index;
            }
            // Combine parent delay, delayChildren, and stagger delay
            const totalDelay = parentDelay + delayChildren + (staggerIndex * staggerValue);
            // CRITICAL: Override child's transition delay to prevent conflicts
            // Clear any user-defined delays that would interfere with stagger timing
            if (childDirective.transition && typeof childDirective.transition === 'object') {
                const childTransition = childDirective.transition;
                if (childTransition.delay !== undefined) {
                    // Temporarily clear the child's delay
                    childTransition.delay = undefined;
                }
            }
            // Force override the child's delay with calculated stagger delay
            childDirective.overrideDelay(totalDelay);
            // CRITICAL: Use child's own variants directly (parent has no initial/animate)
            setTimeout(() => {
                childDirective.playAnimation(childDirective.initial, childDirective.animate);
            }, totalDelay * 1000);
        });
        // Animate parent after children if specified
        if (when === 'afterChildren') {
            const totalChildrenDuration = parentDelay + delayChildren + (this.childrenCount * staggerValue);
            this.overrideDelay(totalChildrenDuration);
            this.runSelfAnimation();
        }
    }
    // Method to override the delay for this directive
    overrideDelay(delay) {
        this.staggerDelay = delay;
    }
    // Run animation only for this element (not children)
    runSelfAnimation() {
        // Get animation options
        const options = this.getAnimationOptions();
        // Extract only style properties for animation
        const targetStyles = this.extractStyleProperties(this.getVariant(this.animate));
        const startStyles = this.extractStyleProperties(this.getVariant(this.initial));
        // Add DOM style logging before applying start styles
        const beforeStartComputedStyles = window.getComputedStyle(this.el.nativeElement);
        // Only apply start state immediately if not part of stagger coordination
        // For stagger children, the parent coordination handles initial state setup
        if (!this.isStaggeredChild) {
            Object.assign(this.el.nativeElement.style, startStyles);
        }
        else {
        }
        // Add logging after applying start styles
        const afterStartComputedStyles = window.getComputedStyle(this.el.nativeElement);
        // Create animation
        this.controls = this.motionAnimation.animate(this.el.nativeElement, targetStyles, options);
        this.initialAnimationPlayed = true;
    }
    ngOnDestroy() {
        if (this.exit && Object.keys(this.exit).length > 0) {
            this.runExitAnimation();
        }
        if (this.inViewInstance) {
            this.inViewInstance.stop();
        }
        if (this.observer) {
            this.observer.disconnect();
        }
        // Clean up any ongoing animations
        if (this.controls) {
            this.controls.stop();
        }
        // Clean up any children animations
        this.childrenControls.forEach(control => {
            if (control)
                control.stop();
        });
        // this.motionService.unregisterMotionElement(this);
        //console.log(`[${this.elementId}] Unregistered motionone directive`);
    }
    ngOnChanges(changes) {
        if (changes['animate'] && changes['animate'].previousValue !== undefined) {
            const oldState = changes['animate'].previousValue;
            let newState = changes['animate'].currentValue;
            if (typeof newState === 'object') {
                this.playAnimation(oldState, newState);
            }
            else if (typeof newState === 'string' && this.variants?.[newState]) {
                newState = this.variants[newState];
                this.playAnimation(oldState, newState);
            }
        }
        // Handle transition changes
        if (changes['transition'] && !changes['transition'].firstChange) {
            // Re-apply animation with new transition settings
            this.playAnimation(this.initial, this.animate);
        }
    }
    onMouseEnter() {
        if (Object.keys(this.whileHover).length > 0) {
            clearTimeout(this.hoverTimeout);
            if (Object.keys(this.animate).length > 0) {
                this.playAnimation(this.animate, this.whileHover);
            }
            else {
                this.playAnimation(this.initial, this.whileHover);
            }
        }
    }
    onMouseLeave() {
        if (Object.keys(this.whileHover).length > 0) {
            this.hoverTimeout = setTimeout(() => {
                if (Object.keys(this.animate).length > 0) {
                    this.playAnimation(this.whileHover, this.animate);
                }
                else {
                    this.playAnimation(this.whileHover, this.initial);
                }
            }, 100);
        }
    }
    onPress(event) {
        if (Object.keys(this.whileTap).length > 0) {
            if (Object.keys(this.animate).length > 0) {
                this.playAnimation(this.animate, this.whileTap);
            }
            else {
                this.playAnimation(this.initial, this.whileTap);
            }
            // Only add event listeners in browser environment
            if (isPlatformBrowser(this.platformId)) {
                const endEvent = event.type === 'mousedown' ? 'mouseup' : 'touchend';
                const endListener = () => {
                    if (Object.keys(this.animate).length > 0) {
                        this.playAnimation(this.whileTap, this.animate);
                    }
                    else {
                        this.playAnimation(this.whileTap, this.initial);
                    }
                    window.removeEventListener(endEvent, endListener);
                };
                window.addEventListener(endEvent, endListener);
            }
        }
    }
    onFocus() {
        if (Object.keys(this.whileFocus).length > 0) {
            if (Object.keys(this.animate).length > 0) {
                this.playAnimation(this.animate, this.whileFocus);
            }
            else {
                this.playAnimation(this.initial, this.whileFocus);
            }
        }
    }
    onBlur() {
        if (Object.keys(this.whileFocus).length > 0) {
            if (Object.keys(this.animate).length > 0) {
                this.playAnimation(this.whileFocus, this.animate);
            }
            else {
                this.playAnimation(this.whileFocus, this.initial);
            }
        }
    }
    applyInitialValues() {
        // Extract only style properties (exclude transition)
        const styles = this.extractStyleProperties(this.getVariant(this.initial));
        Object.assign(this.el.nativeElement.style, styles);
    }
    applyInitialStyles() {
        // Extract only style properties (exclude transition)
        const styles = this.extractStyleProperties(this.getVariant(this.initial));
        // Apply initial styles immediately to prevent flash
        if (styles && Object.keys(styles).length > 0) {
            // For runInView elements, ensure initial styles are applied without any transition
            if (this.isRunInViewEnabled) {
                this.el.nativeElement.style.transition = 'none';
                Object.assign(this.el.nativeElement.style, styles);
                this.el.nativeElement.offsetHeight; // Force reflow
                this.el.nativeElement.style.transition = '';
            }
            else {
                Object.assign(this.el.nativeElement.style, styles);
            }
        }
    }
    applyAnimateStyles() {
        // Extract only style properties (exclude transition)
        const styles = this.extractStyleProperties(this.getVariant(this.animate));
        Object.assign(this.el.nativeElement.style, styles);
    }
    // Helper to extract only style properties from a variant (excluding transition)
    extractStyleProperties(variant) {
        if (!variant)
            return {};
        const result = {};
        for (const key in variant) {
            // skip meta keys
            if (key === 'transition' || key === 'at')
                continue;
            // Allow raw transform strings or keyframe arrays to pass through untouched
            if (key === 'transform') {
                result['transform'] = variant[key];
                continue;
            }
            if (this.isTransformProperty(key)) {
                this.applyTransformProperty(result, key, variant[key]);
            }
            else {
                this.applyStyleProperty(result, key, variant[key]);
            }
        }
        this.normalizeTransformProperty(result);
        return result;
    }
    // Check if a property should be handled as a transform
    isTransformProperty(key) {
        return ['x', 'y', 'rotate', 'scale', 'scaleX', 'scaleY'].includes(key);
    }
    // Apply transform properties to the result object
    applyTransformProperty(result, key, value) {
        // If keyframe array is provided, let Motion One handle it directly
        if (Array.isArray(value)) {
            result[key] = value;
            return;
        }
        // Initialize transform matrix if it doesn't exist
        if (!result['transform']) {
            result['transform'] = 'matrix(1, 0, 0, 1, 0, 0)';
        }
        // Parse current matrix
        const currentMatrix = result['transform'].match(/matrix\((.*)\)/)[1].split(',').map(Number);
        // Create new matrix based on the transform type
        let newMatrix;
        switch (key) {
            case 'x':
                newMatrix = [1, 0, 0, 1, value, 0];
                break;
            case 'y':
                newMatrix = [1, 0, 0, 1, 0, value];
                break;
            case 'rotate':
                const rad = (value * Math.PI) / 180;
                const cos = Math.cos(rad);
                const sin = Math.sin(rad);
                newMatrix = [cos, -sin, sin, cos, 0, 0];
                break;
            case 'scale':
                newMatrix = [value, 0, 0, value, 0, 0];
                break;
            case 'scaleX':
                newMatrix = [value, 0, 0, 1, 0, 0];
                break;
            case 'scaleY':
                newMatrix = [1, 0, 0, value, 0, 0];
                break;
            default:
                return;
        }
        // Multiply matrices
        const finalMatrix = this.multiplyMatrices(currentMatrix, newMatrix);
        // Apply the new matrix
        result['transform'] = `matrix(${finalMatrix.join(',')})`;
    }
    // Helper function to multiply two 2D matrices
    multiplyMatrices(a, b) {
        return [
            a[0] * b[0] + a[2] * b[1], // a
            a[1] * b[0] + a[3] * b[1], // b
            a[0] * b[2] + a[2] * b[3], // c
            a[1] * b[2] + a[3] * b[3], // d
            a[0] * b[4] + a[2] * b[5] + a[4], // e
            a[1] * b[4] + a[3] * b[5] + a[5] // f
        ];
    }
    // Apply regular style properties to the result object
    applyStyleProperty(result, key, value) {
        if (this.isColorProperty(key)) {
            if (Array.isArray(value)) {
                result[key] = value.map(v => this.normalizeColor(v));
            }
            else {
                result[key] = this.normalizeColor(value);
            }
        }
        else {
            result[key] = value;
        }
    }
    // Check if a property is a color property
    isColorProperty(key) {
        return ['backgroundColor', 'color', 'borderColor'].includes(key);
    }
    // Normalize the transform property by trimming extra spaces
    normalizeTransformProperty(result) {
        if (result['transform']) {
            result['transform'] = result['transform'].trim();
        }
    }
    getEasing(easingString) {
        if (!easingString)
            return this.motionAnimation.easeInOut;
        if (Array.isArray(easingString))
            return easingString;
        if (typeof easingString === 'object' && 'type' in easingString && easingString.type === 'spring') {
            return this.motionAnimation.spring({
                stiffness: easingString.stiffness || 100,
                damping: easingString.damping || 10
            });
        }
        if (typeof easingString === 'string') {
            if (easingString === 'ease-in')
                return this.motionAnimation.easeIn;
            if (easingString === 'ease-out')
                return this.motionAnimation.easeOut;
            if (easingString === 'ease-in-out' || easingString === 'ease')
                return this.motionAnimation.easeInOut;
            if (easingString === 'spring')
                return this.motionAnimation.spring();
        }
        return this.motionAnimation.easeInOut;
    }
    getAnimationOptions(targetState) {
        // Priority: 1. Stagger delay, 2. State-specific transition, 3. Global transition, 4. Individual properties
        const stateTransition = targetState?.transition ?? this.getVariant(this.animate)?.transition;
        const globalTransition = this.transition;
        const transitionObj = stateTransition || globalTransition || {};
        // Always prioritize stagger delay over any other delay settings (including 0)
        const delay = this.staggerDelay !== undefined && this.staggerDelay >= 0 ? this.staggerDelay : (transitionObj.delay ?? this.delay);
        const easeInput = transitionObj.ease ?? this.easing;
        // Detect if target contains keyframe arrays (avoid native spring in that case)
        let targetHasKeyframeArrays = false;
        if (targetState) {
            for (const k of Object.keys(targetState)) {
                if (k === 'transition' || k === 'at')
                    continue;
                const v = targetState[k];
                if (Array.isArray(v)) {
                    targetHasKeyframeArrays = true;
                    break;
                }
            }
        }
        // If spring config and no keyframe arrays, prefer native spring options (no fixed duration)
        if (easeInput && typeof easeInput === 'object' && 'type' in easeInput && easeInput.type === 'spring' && !targetHasKeyframeArrays) {
            const springOptions = {
                type: 'spring',
                stiffness: easeInput.stiffness ?? 100,
                damping: easeInput.damping ?? 10,
                delay,
                repeat: this.getRepeatValue(transitionObj),
                repeatDelay: transitionObj.repeatDelay,
                onComplete: () => this.animationComplete.emit()
            };
            const direction = this.mapRepeatTypeToDirection(transitionObj.repeatType);
            if (direction)
                springOptions.direction = direction;
            if (transitionObj.repeatType)
                springOptions.repeatType = transitionObj.repeatType;
            return springOptions;
        }
        const ease = this.getEasing(easeInput);
        const options = {
            duration: transitionObj.duration ?? this.duration,
            delay,
            repeat: this.getRepeatValue(transitionObj),
            repeatDelay: transitionObj.repeatDelay,
            onComplete: () => this.animationComplete.emit()
        };
        const direction = this.mapRepeatTypeToDirection(transitionObj.repeatType);
        if (direction)
            options.direction = direction;
        if (transitionObj.repeatType)
            options.repeatType = transitionObj.repeatType;
        options.easing = ease; // Motion 11+
        options.ease = ease; // Back-compat
        return options;
    }
    getRepeatValue(transitionObj) {
        // Handle repeat value from transition object or fallback to directive input
        if (transitionObj.repeat !== undefined) {
            if (transitionObj.repeat === true) {
                return Infinity;
            }
            else if (typeof transitionObj.repeat === 'number') {
                return transitionObj.repeat;
            }
        }
        return this.repeat ? Infinity : 0;
    }
    mapRepeatTypeToDirection(repeatType) {
        if (!repeatType)
            return undefined;
        // Aliases
        if (repeatType === 'forwards' || repeatType === 'loop')
            return 'normal';
        if (repeatType === 'reverse')
            return 'reverse';
        if (repeatType === 'pingPong' || repeatType === 'mirror')
            return 'alternate';
        // Default
        return 'normal';
    }
    getStaggerValue() {
        // Priority: 1. State-specific transition, 2. Global transition, 3. Individual properties
        const stateTransition = this.getVariant(this.animate)?.transition;
        const globalTransition = this.transition;
        const transitionObj = stateTransition || globalTransition || {};
        // Get stagger value from transition object or fallback to directive input
        return transitionObj.staggerChildren ?? this.staggerChildren;
    }
    getStaggerDirection() {
        // Priority: 1. State-specific transition, 2. Global transition, 3. Input property
        const stateTransition = this.getVariant(this.animate)?.transition;
        const globalTransition = this.transition;
        const transitionObj = stateTransition || globalTransition || {};
        return transitionObj.staggerDirection ?? this.staggerDirection;
    }
    getWhen() {
        // Priority: 1. State-specific transition, 2. Global transition, 3. Default ('together')
        const stateTransition = this.getVariant(this.animate)?.transition;
        const globalTransition = this.transition;
        const transitionObj = stateTransition || globalTransition || {};
        return (transitionObj.when ?? 'together');
    }
    playAnimation(startState, targetState) {
        if (!targetState || !isPlatformBrowser(this.platformId))
            return;
        // Resolve variant strings to objects
        let resolvedStartState = {};
        let resolvedTargetState = {};
        if (startState === undefined) {
            resolvedStartState = this.getVariant(this.initial);
        }
        else if (typeof startState === 'string' && this.variants?.[startState]) {
            resolvedStartState = this.variants[startState];
        }
        else if (typeof startState === 'object') {
            resolvedStartState = startState;
        }
        if (targetState === undefined) {
            resolvedTargetState = this.getVariant(this.animate);
        }
        else if (typeof targetState === 'string' && this.variants?.[targetState]) {
            resolvedTargetState = this.variants[targetState];
        }
        else if (typeof targetState === 'object') {
            resolvedTargetState = targetState;
        }
        // Check if target state has an 'at' property
        if (resolvedTargetState.at !== undefined) {
            // Schedule the animation to start at the specified time
            setTimeout(() => {
                this.continueAnimation(resolvedTargetState, false);
            }, resolvedTargetState.at * 1000); // Convert seconds to milliseconds
            return;
        }
        // Continue with normal animation if no 'at' property
        this.continueAnimation(resolvedTargetState, false);
    }
    continueAnimation(resolvedTargetState, isInitialAnimation) {
        // Timeline takes precedence
        if (this.timeline && this.timeline.length > 0) {
            this.runTimeline(resolvedTargetState);
            return;
        }
        // Detect per-property transition map on the state
        const t = resolvedTargetState.transition;
        const isPerPropMap = t && typeof t === 'object' && t.duration === undefined && t.delay === undefined && t.ease === undefined;
        if (isPerPropMap) {
            this.runPerPropertyAnimations(resolvedTargetState);
            return;
        }
        // Check if this is the initial animation to the animate state
        if (isInitialAnimation && !this.initialAnimationPlayed) {
            const staggerValue = this.getStaggerValue();
            if (staggerValue > 0 && this.childMotionDirectives && this.childMotionDirectives.length > 1) {
                // Stagger will be handled by ngAfterContentInit
                // Just animate self according to 'when' property
                const when = this.getWhen();
                if (when !== 'afterChildren') {
                    this.runSelfAnimation();
                }
                return;
            }
        }
        // For non-staggered animations or non-initial animations
        // Get animation options with priority to target state's transition
        const options = this.getAnimationOptions(resolvedTargetState);
        // Extract only style properties for animation (excluding transition)
        const targetStyles = this.extractStyleProperties(resolvedTargetState);
        // Create animation with Motion One for the element itself
        this.controls = this.motionAnimation.animate(this.el.nativeElement, targetStyles, options);
        if (isInitialAnimation) {
            this.initialAnimationPlayed = true;
        }
        // Handle regular DOM children (without motionone directives) for non-initial animations
        if (!isInitialAnimation && this.el.nativeElement.children.length > 0) {
            // Get children elements
            const children = Array.from(this.el.nativeElement.children);
            // Animate each child with the same animation
            children.forEach((child, index) => {
                // Skip children that have their own motionone directive
                if (child.hasAttribute('motionone')) {
                    return;
                }
                // Create child animation
                const childControl = this.motionAnimation.animate(child, targetStyles, options);
                // Store the control for cleanup
                this.childrenControls.push(childControl);
            });
        }
        else if (!isInitialAnimation) {
        }
    }
    runPerPropertyAnimations(resolvedTargetState) {
        const baseDelay = this.staggerDelay !== undefined && this.staggerDelay >= 0 ? this.staggerDelay : ((resolvedTargetState.transition?.delay) ?? this.delay);
        const transitionMap = resolvedTargetState.transition;
        const props = Object.keys(resolvedTargetState).filter(k => k !== 'transition' && k !== 'at');
        let maxEnd = 0;
        props.forEach((prop) => {
            const value = resolvedTargetState[prop];
            const conf = (transitionMap?.[prop] || {});
            const delay = baseDelay + (conf.delay ?? 0);
            const ease = this.getEasing(conf.ease ?? this.easing);
            const duration = conf.duration ?? this.duration;
            const options = { duration, delay, easing: ease, repeat: this.getRepeatValue(conf), repeatDelay: conf.repeatDelay };
            options.ease = ease;
            const dir = this.mapRepeatTypeToDirection(conf.repeatType);
            if (dir)
                options.direction = dir;
            if (conf.repeatType)
                options.repeatType = conf.repeatType;
            const times = conf.times;
            if (times && Array.isArray(times))
                options.offset = this.normalizeTimes(times, duration);
            const end = delay + duration;
            if (end > maxEnd)
                maxEnd = end;
            let finalValue = value;
            if (this.isColorProperty(prop)) {
                if (Array.isArray(value))
                    finalValue = value.map(v => this.normalizeColor(v));
                else
                    finalValue = this.normalizeColor(value);
            }
            const target = { [prop]: finalValue };
            const control = this.motionAnimation.animate(this.el.nativeElement, target, options);
            this.childrenControls.push(control);
        });
        setTimeout(() => this.animationComplete.emit(), maxEnd * 1000);
    }
    runTimeline(resolvedTargetState) {
        const baseDelay = this.staggerDelay !== undefined && this.staggerDelay >= 0 ? this.staggerDelay : ((resolvedTargetState.transition?.delay) ?? this.delay);
        let maxEnd = 0;
        // Also animate any non-timeline props from the target state (e.g., opacity)
        const timelinePropsSet = new Set((this.timeline || []).map(s => s.prop));
        const nonTimelineTarget = {};
        Object.keys(resolvedTargetState).forEach(k => {
            if (k === 'transition' || k === 'at')
                return;
            if (!timelinePropsSet.has(k))
                nonTimelineTarget[k] = resolvedTargetState[k];
        });
        if (Object.keys(nonTimelineTarget).length > 0) {
            const opt = this.getAnimationOptions(resolvedTargetState);
            const ctl = this.motionAnimation.animate(this.el.nativeElement, nonTimelineTarget, opt);
            this.childrenControls.push(ctl);
            const nonEnd = (opt.delay ?? 0) + (opt.duration ?? this.duration);
            if (nonEnd > maxEnd)
                maxEnd = nonEnd;
        }
        this.timeline.forEach(step => {
            const start = baseDelay + (step.atTime ?? 0) + (step.delay ?? 0);
            const duration = step.duration;
            const value = step.keyframes !== undefined ? step.keyframes : step.to;
            const easeInput = step.ease ?? this.easing;
            // Build options with repeat and direction
            // Prefer function easing always in timeline to preserve keyframe interpolation
            const ease = this.getEasing(easeInput);
            const options = { duration, delay: start, easing: ease };
            options.ease = ease; // Back-compat
            // Apply repeat controls if provided
            if (step.repeat !== undefined) {
                options.repeat = step.repeat === true ? Infinity : step.repeat;
            }
            if (step.repeatDelay !== undefined) {
                options.repeatDelay = step.repeatDelay;
            }
            const dir = this.mapRepeatTypeToDirection(step.repeatType);
            if (dir)
                options.direction = dir;
            if (step.repeatType)
                options.repeatType = step.repeatType;
            if (step.times)
                options.offset = this.normalizeTimes(step.times, duration);
            const end = start + duration;
            if (end > maxEnd)
                maxEnd = end;
            let v = value;
            if (this.isColorProperty(step.prop)) {
                if (Array.isArray(v))
                    v = v.map((c) => this.normalizeColor(c));
                else
                    v = this.normalizeColor(v);
            }
            const target = { [step.prop]: v };
            const control = this.motionAnimation.animate(this.el.nativeElement, target, options);
            this.childrenControls.push(control);
        });
        setTimeout(() => this.animationComplete.emit(), maxEnd * 1000);
    }
    setupInViewAnimation() {
        if (isPlatformBrowser(this.platformId)) {
            try {
                // Use Motion One's inView API - it handles state management automatically
                if (this.isRunInViewEnabled) {
                    // Set up Motion One's inView with automatic state management
                    this.setupMotionOneInView();
                }
                else {
                    // For inView and whileInView functionality
                    const hasWhileInView = this.whileInView && Object.keys(this.whileInView).length > 0;
                    const hasInView = this.inView && Object.keys(this.inView).length > 0;
                    if (hasWhileInView) {
                        // whileInView needs enter/exit behavior
                        this.setupWhileInViewAnimation();
                    }
                    else if (hasInView) {
                        // inView is a one-time trigger on enter
                        this.inViewInstance = inView(this.el.nativeElement, (info) => {
                            this.runInViewAnimation();
                        }, {
                            margin: this.offset,
                            amount: 'some'
                        });
                    }
                }
            }
            catch (error) {
                console.error('[MotionOne] ❌ Error setting up inView observer:', error);
            }
        }
    }
    runInViewAnimation() {
        // Handle both inView and whileInView properties
        if (this.inView && Object.keys(this.inView).length > 0) {
            this.playAnimation(this.initial, this.inView);
        }
        else if (this.whileInView && Object.keys(this.whileInView).length > 0) {
            this.playAnimation(this.initial, this.whileInView);
        }
    }
    // New method to handle whileInView enter behavior (no exit reset)
    setupWhileInViewAnimation() {
        // whileInView should only animate once when entering viewport
        // It should NOT reset when exiting (that's only for runInView="always")
        this.inViewInstance = inView(this.el.nativeElement, 
        // Enter callback - when element comes into view
        (info) => {
            // Element entered viewport - animate to whileInView state
            // This will only trigger once, and element stays in whileInView state
            this.playAnimation(this.initial, this.whileInView);
        }, {
            margin: this.offset,
            amount: 'some'
        });
        // No exit behavior for whileInView - elements should stay in their animated state
        // Only runInView="always" should reset on exit
    }
    // New method using Motion One's inView API following Framer Motion pattern
    setupMotionOneInView() {
        // Get margin from offset
        const margin = this.offset || '0px';
        // Determine if this is a parent with stagger children
        const hasStaggerChildren = this.getStaggerValue() > 0 && this.childMotionDirectives?.length > 1;
        if (hasStaggerChildren && !this.isChild) {
            // Parent with stagger children - handle stagger animation
            this.setupStaggerParentInView(margin);
        }
        else if (!this.isStaggeredChild) {
            // Individual element or non-staggered child
            this.setupIndividualElementInView(margin);
        }
        else {
        }
    }
    setupStaggerParentInView(margin) {
        // For parent elements with stagger, use inView with enter/exit callbacks
        this.inViewInstance = inView(this.el.nativeElement, (info) => {
            if (info.isIntersecting) {
                // Stop any existing animations
                if (this.controls)
                    this.controls.stop();
                // Reset parent to initial
                const parentInitialStyles = this.extractStyleProperties(this.getVariant(this.initial));
                if (Object.keys(parentInitialStyles).length > 0) {
                    this.el.nativeElement.style.transition = 'none';
                    Object.assign(this.el.nativeElement.style, parentInitialStyles);
                    this.el.nativeElement.offsetHeight;
                    this.el.nativeElement.style.transition = '';
                }
                // Get all child elements
                const childDirectives = this.childMotionDirectives?.filter(child => child !== this) || [];
                if (childDirectives.length > 0) {
                    // Stop and reset all children to initial state first
                    childDirectives.forEach(child => {
                        if (child.controls)
                            child.controls.stop();
                        const childInitialStyles = child.extractStyleProperties(child.getVariant(child.initial));
                        child.el.nativeElement.style.transition = 'none';
                        Object.assign(child.el.nativeElement.style, childInitialStyles);
                        child.el.nativeElement.offsetHeight;
                        child.el.nativeElement.style.transition = '';
                    });
                    // Small delay to ensure resets are applied
                    setTimeout(() => {
                        const staggerValue = this.getStaggerValue();
                        // Animate children with stagger
                        childDirectives.forEach((child, index) => {
                            const childAnimateStyles = child.extractStyleProperties(child.getVariant(child.animate));
                            const options = child.getAnimationOptions();
                            // Override delay with stagger delay
                            const staggerDelay = index * staggerValue;
                            options.delay = staggerDelay;
                            // Create animation for this child
                            child.controls = animate(child.el.nativeElement, childAnimateStyles, options);
                        });
                        // Animate parent if it has its own animation
                        const parentAnimateStyles = this.extractStyleProperties(this.getVariant(this.animate));
                        if (Object.keys(parentAnimateStyles).length > 0) {
                            const parentOptions = this.getAnimationOptions();
                            this.controls = animate(this.el.nativeElement, parentAnimateStyles, parentOptions);
                        }
                    }, 50);
                }
            }
            else if (this.runInViewRepeat === 'always') {
                // Exit viewport - reset to initial for "always" behavior
                // Stop all animations
                if (this.controls)
                    this.controls.stop();
                // Reset parent to initial
                const parentInitialStyles = this.extractStyleProperties(this.getVariant(this.initial));
                if (Object.keys(parentInitialStyles).length > 0) {
                    this.el.nativeElement.style.transition = 'none';
                    Object.assign(this.el.nativeElement.style, parentInitialStyles);
                    this.el.nativeElement.offsetHeight;
                    this.el.nativeElement.style.transition = '';
                }
                // Reset all children to initial
                const childDirectives = this.childMotionDirectives?.filter(child => child !== this) || [];
                childDirectives.forEach(child => {
                    if (child.controls)
                        child.controls.stop();
                    const childInitialStyles = child.extractStyleProperties(child.getVariant(child.initial));
                    child.el.nativeElement.style.transition = 'none';
                    Object.assign(child.el.nativeElement.style, childInitialStyles);
                    child.el.nativeElement.offsetHeight;
                    child.el.nativeElement.style.transition = '';
                });
            }
        }, {
            margin,
            amount: 0.1
        });
    }
    setupIndividualElementInView(margin) {
        // For individual elements, simple initial -> animate transition
        this.inViewInstance = inView(this.el.nativeElement, (info) => {
            if (info.isIntersecting) {
                // Stop any existing animation
                if (this.controls)
                    this.controls.stop();
                // Reset to initial state first with a small delay to ensure proper reset
                const initialStyles = this.extractStyleProperties(this.getVariant(this.initial));
                this.el.nativeElement.style.transition = 'none';
                Object.assign(this.el.nativeElement.style, initialStyles);
                this.el.nativeElement.offsetHeight; // Force reflow
                this.el.nativeElement.style.transition = '';
                // Use a small timeout to ensure the reset is applied before starting animation
                setTimeout(() => {
                    // Animate from initial to animate state using the directive's playAnimation method
                    this.playAnimation(this.initial, this.animate);
                }, 50);
            }
            else if (this.runInViewRepeat === 'always') {
                // Exit viewport - reset to initial for "always" behavior
                // Stop animation and reset to initial
                if (this.controls)
                    this.controls.stop();
                const initialStyles = this.extractStyleProperties(this.getVariant(this.initial));
                this.el.nativeElement.style.transition = 'none';
                Object.assign(this.el.nativeElement.style, initialStyles);
                this.el.nativeElement.offsetHeight;
                this.el.nativeElement.style.transition = '';
            }
        }, {
            margin,
            amount: 0.1
        });
    }
    runInitAnimation() {
        if (!isPlatformBrowser(this.platformId) || !this.initial || !this.animate)
            return;
        // For child elements with stagger, make sure we use the stagger delay
        if (this.isChild && this.staggerDelay !== undefined && this.staggerDelay >= 0) {
            // Apply start state immediately (unless we're in a reset stagger flow)
            if (!this._skipStartStylesApplication) {
                const startStyles = this.extractStyleProperties(this.getVariant(this.initial));
                // Force reset without transition
                const element = this.el.nativeElement;
                element.style.transition = 'none';
                Object.assign(element.style, startStyles);
            }
            else {
                // Clear the flag after use
                this._skipStartStylesApplication = false;
            }
            this.el.nativeElement.offsetHeight; // Force reflow
            // Get animation options with stagger delay
            const options = this.getAnimationOptions();
            // VARIANT CONTROL: Use variants to ensure correct animation direction
            // Force use the child's specific animate variant (not parent's)
            const childAnimateVariant = this.getVariant(this.animate || {});
            // Ensure we're animating from initial → animate (not the reverse)
            const targetStyles = this.extractStyleProperties(childAnimateVariant);
            // Double-check: log what the current element state is
            const currentStyles = window.getComputedStyle(this.el.nativeElement);
            // Use playAnimation to ensure proper initial→animate direction
            setTimeout(() => {
                this.el.nativeElement.style.transition = '';
                // CRITICAL: Use playAnimation with variants to force correct direction
                this.playAnimation(this.initial, this.animate);
            }, 5);
            this.initialAnimationPlayed = true;
        }
        else {
            // Normal animation without stagger
            this.playAnimation(this.initial, this.animate);
        }
    }
    runExitAnimation() {
        if (!isPlatformBrowser(this.platformId)) {
            return Promise.resolve();
        }
        // If no exit animation defined, resolve immediately
        if (!this.exit || Object.keys(this.exit).length === 0) {
            // console.log(`[${this.elementId}] No exit animation defined, resolving immediately`);
            return Promise.resolve();
        }
        // Use exit-specific transition if available, otherwise use global transition
        const exitTransition = this.getVariant(this.exit).transition || this.transition || {};
        // Create a promise that resolves when the exit animation completes
        return new Promise((resolve) => {
            const exitOptions = {
                duration: (exitTransition.duration ?? this.duration),
                delay: (exitTransition.delay ?? this.exitDelay),
                onComplete: () => {
                    //     console.log(`[${this.elementId}] Exit animation completed`);
                    this.animationComplete.emit();
                    resolve();
                }
            };
            const ease = this.getEasing(exitTransition.ease ?? this.easing);
            exitOptions.easing = ease;
            exitOptions.ease = ease;
            // Stop any existing animation
            if (this.controls) {
                this.controls.stop();
            }
            // Stop any existing children animations
            this.childrenControls.forEach(control => {
                if (control)
                    control.stop();
            });
            // Extract only style properties for animation (excluding transition)
            const exitStyles = this.extractStyleProperties(this.getVariant(this.exit));
            //    console.log(`[${this.elementId}] Starting exit animation with styles:`, exitStyles);
            // Create exit animation
            // console.log('animatiing exit')
            this.controls = this.motionAnimation.animate(this.el.nativeElement, exitStyles, exitOptions);
            // If no duration is set, resolve immediately
            if (!exitOptions.duration) {
                // console.log(`[${this.elementId}] No duration set, resolving immediately`);
                resolve();
            }
        });
    }
    cancel() {
        if (this.controls) {
            this.controls.stop();
        }
        // Cancel any children animations
        this.childrenControls.forEach(control => {
            if (control)
                control.stop();
        });
        this.applyAnimateStyles();
    }
    getDuration() {
        if (!isPlatformBrowser(this.platformId))
            return 0;
        try {
            // Consider state-specific transition if available
            // Check transitions in order of priority: exit, animate, then default transition
            const animateTransition = this.getVariant(this.exit)?.transition || this.transition || {};
            const duration = (animateTransition.duration ?? this.duration);
            const delay = (animateTransition.delay ?? this.delay);
            return (Number(duration) + Number(delay)) * 1000;
        }
        catch (error) {
            console.error('Error calculating duration:', error);
            return 0;
        }
    }
    getKeyByValue(object, key) {
        return Object.keys(object).find((k) => object[k] === key);
    }
    // Helper method for consistent logging
    logDebug(message) {
        // Log to console
        //console.log(`[${this.elementId}] ${message}`);
        // Only add DOM elements in browser environment
        if (isPlatformBrowser(this.platformId)) {
            // Add a visible element to the DOM for debugging (if needed)
            // Uncomment this section if you need visual debugging
            /*
            const debugEl = document.createElement('div');
            debugEl.style.position = 'fixed';
            debugEl.style.top = '10px';
            debugEl.style.right = '10px';
            debugEl.style.backgroundColor = 'rgba(0,0,0,0.8)';
            debugEl.style.color = 'white';
            debugEl.style.padding = '5px';
            debugEl.style.zIndex = '9999';
            debugEl.style.maxWidth = '80%';
            debugEl.style.maxHeight = '80%';
            debugEl.style.overflow = 'auto';
            debugEl.textContent = `[${this.elementId}] ${message}`;
            document.body.appendChild(debugEl);
            
            // Remove after 5 seconds
            setTimeout(() => {
              document.body.removeChild(debugEl);
            }, 5000);
            */
        }
    }
    // Helper to normalize color values to a consistent format
    normalizeColor(color) {
        if (color == null)
            return '';
        if (typeof color !== 'string') {
            try {
                return String(color);
            }
            catch {
                return '';
            }
        }
        if (color.startsWith('rgb') || color.startsWith('#'))
            return color;
        if (color === 'aqua')
            return '#00ffff';
        if (color === 'red')
            return '#ff0000';
        if (color === 'blue')
            return '#0000ff';
        if (color === 'green')
            return '#008000';
        if (color === 'yellow')
            return '#ffff00';
        if (color === 'purple')
            return '#800080';
        if (color === 'orange')
            return '#ffa500';
        if (color === 'black')
            return '#000000';
        if (color === 'white')
            return '#ffffff';
        return color;
    }
    normalizeTimes(times, duration) {
        if (!times || times.length === 0)
            return undefined;
        const hasValuesAboveOne = times.some(t => t > 1);
        if (!hasValuesAboveOne)
            return times;
        const maxT = Math.max(...times);
        const safeDuration = Math.max(duration, 0.000001);
        const divisor = maxT > safeDuration * 1.001 ? maxT : safeDuration;
        return times.map(t => {
            const v = t / divisor;
            return v < 0 ? 0 : v > 1 ? 1 : v;
        });
    }
    // Add a method to manually trigger exit animation from outside
    triggerExitAnimation() {
        // console.log(`[${this.elementId}] Manually triggering exit animation`);
        return this.runExitAnimation();
    }
    // Add a listener for the custom exit event
    onMotionExit() {
        //  console.log(`[${this.elementId}] Received motionExit event`);
        this.runExitAnimation();
    }
    getVariant(variant) {
        if (typeof variant === 'string') {
            return this.variants[variant] || {};
        }
        else if (typeof variant === 'object') {
            return variant;
        }
        else {
            throw new Error('Invalid variant format');
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: MotionOneDirective, deps: [{ token: i0.ElementRef }, { token: MotionOneService }, { token: MotionAnimationService }, { token: i1.Router }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "19.2.15", type: MotionOneDirective, isStandalone: true, selector: "[motionone]", inputs: { initial: "initial", animate: "animate", exit: "exit", inView: "inView", duration: "duration", delay: "delay", delayChildren: "delayChildren", repeat: "repeat", exitDelay: "exitDelay", easing: "easing", offset: "offset", whileHover: "whileHover", staggerChildren: "staggerChildren", staggerDirection: "staggerDirection", whileTap: "whileTap", whileFocus: "whileFocus", whileInView: "whileInView", runInView: "runInView", variants: "variants", transition: "transition", timeline: "timeline" }, outputs: { animationComplete: "animationComplete" }, host: { listeners: { "mouseenter": "onMouseEnter()", "mouseleave": "onMouseLeave()", "mousedown": "onPress($event)", "touchstart": "onPress($event)", "focus": "onFocus()", "blur": "onBlur()", "motionExit": "onMotionExit()" } }, queries: [{ propertyName: "childMotionDirectives", predicate: MotionOneDirective, descendants: true }], exportAs: ["motionone"], usesOnChanges: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: MotionOneDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[motionone]',
                    standalone: true,
                    exportAs: 'motionone'
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: MotionOneService }, { type: MotionAnimationService }, { type: i1.Router }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }], propDecorators: { initial: [{
                type: Input
            }], animate: [{
                type: Input
            }], exit: [{
                type: Input
            }], inView: [{
                type: Input
            }], duration: [{
                type: Input
            }], delay: [{
                type: Input
            }], delayChildren: [{
                type: Input
            }], repeat: [{
                type: Input
            }], exitDelay: [{
                type: Input
            }], easing: [{
                type: Input
            }], offset: [{
                type: Input
            }], whileHover: [{
                type: Input
            }], staggerChildren: [{
                type: Input
            }], staggerDirection: [{
                type: Input
            }], whileTap: [{
                type: Input
            }], whileFocus: [{
                type: Input
            }], whileInView: [{
                type: Input
            }], runInView: [{
                type: Input
            }], variants: [{
                type: Input
            }], transition: [{
                type: Input
            }], timeline: [{
                type: Input
            }], animationComplete: [{
                type: Output
            }], childMotionDirectives: [{
                type: ContentChildren,
                args: [MotionOneDirective, { descendants: true }]
            }], onMouseEnter: [{
                type: HostListener,
                args: ['mouseenter']
            }], onMouseLeave: [{
                type: HostListener,
                args: ['mouseleave']
            }], onPress: [{
                type: HostListener,
                args: ['mousedown', ['$event']]
            }, {
                type: HostListener,
                args: ['touchstart', ['$event']]
            }], onFocus: [{
                type: HostListener,
                args: ['focus']
            }], onBlur: [{
                type: HostListener,
                args: ['blur']
            }], onMotionExit: [{
                type: HostListener,
                args: ['motionExit']
            }] } });

class MotionIfDirective {
    templateRef;
    viewContainer;
    hasView = false;
    motionElement = null;
    exitTimeout;
    constructor(templateRef, viewContainer) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
    }
    set motionIf(condition) {
        // When condition becomes true and view doesn't exist
        if (condition && !this.hasView) {
            // Create the view
            const view = this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView = true;
            // Find the motion directive in the created view
            setTimeout(() => {
                const element = view.rootNodes[0];
                if (element) {
                    this.motionElement = element._motionDirective || null;
                }
            });
        }
        // When condition becomes false and view exists
        else if (!condition && this.hasView) {
            // If we have a motion element with exit animation
            if (this.motionElement && this.motionElement.exit &&
                Object.keys(this.motionElement.exit).length > 0) {
                // Run exit animation
                this.motionElement.runExitAnimation();
                // Clear any existing timeout
                if (this.exitTimeout) {
                    clearTimeout(this.exitTimeout);
                }
                // Get duration from the motion element
                const duration = this.motionElement.getDuration() || 1000;
                // Remove the view after animation completes
                this.exitTimeout = setTimeout(() => {
                    if (this.hasView) {
                        this.viewContainer.clear();
                        this.hasView = false;
                        this.motionElement = null;
                    }
                }, duration);
            }
            else {
                // No exit animation, remove immediately
                this.viewContainer.clear();
                this.hasView = false;
                this.motionElement = null;
            }
        }
    }
    ngOnDestroy() {
        if (this.exitTimeout) {
            clearTimeout(this.exitTimeout);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: MotionIfDirective, deps: [{ token: i0.TemplateRef }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "19.2.15", type: MotionIfDirective, isStandalone: true, selector: "[motionIf]", inputs: { motionIf: "motionIf" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: MotionIfDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[motionIf]',
                    standalone: true
                }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }, { type: i0.ViewContainerRef }], propDecorators: { motionIf: [{
                type: Input
            }] } });

/*
 * Public API Surface of ngx-motion
 */
// Motion One specific exports

/**
 * Generated bundle index. Do not edit.
 */

export { MotionAnimationService, MotionIfDirective, MotionOneDirective, MotionOneService };
//# sourceMappingURL=hilux-ngx-motion.mjs.map
