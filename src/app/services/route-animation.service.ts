// src/app/services/route-animation.service.ts
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { AnimationBuilder, AnimationPlayer, style, animate } from '@angular/animations';
import { Router, NavigationStart, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { filter, timeout } from 'rxjs/operators';
import { MotionService } from './motion.service';
@Injectable({
  providedIn: 'root'
})
export class RouteAnimationService {
  private renderer: Renderer2;
  private player!: AnimationPlayer;
  exitDelay = 0;

  constructor(
    private builder: AnimationBuilder,
    private router: Router,
    private motionService: MotionService,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.exitDelay = this.motionService.getLongestExitDuration();
    this.listenToRouterEvents();
  }

  private listenToRouterEvents() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => this.animateExit());

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.animateEnter());
  }

  private animateExit() {
   console.log('animateExit')
   this.motionService.runAllExitAnimations();

    // const element = document.querySelector('.route-container');
    // if (element) {
    //   const factory = this.builder.build([
    //     style({ opacity: 1 }),
    //     animate('300ms 1000ms ease-out', style({ opacity: 0 }))
    //   ]);
    //   this.player = factory.create(element);
    //   this.player.play();
    // }
  }

  private animateEnter() {
    console.log('animateEnter')
    console.log('exitDelay', this.exitDelay)

      this.motionService.runAllEnterAnimations();

    // const element = document.querySelector('.route-container');
    // if (element) {
    //   const factory = this.builder.build([
    //     style({ opacity: 0 }),
    //     animate('300ms ease-in', style({ opacity: 1 }))
    //   ]);
    //   this.player = factory.create(element);
    //   this.player.play();
    // }
  }
}