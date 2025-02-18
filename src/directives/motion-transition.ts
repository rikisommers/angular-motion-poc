import { trigger, transition, style, animate, query, group, animateChild } from '@angular/animations';

export const routeTransition = trigger('routeTransition', [
  transition('* => *', [
    query(':enter, :leave', style({ transform: 'translateX(100%)' }), { optional: true }),
    query(':enter', style({ transform: 'translateX(1%)' }), { optional: true }),
    query(':leave', style({ transform: 'translateX(-1%)' }), { optional: true }),
    group([
      query(':leave', [
        animate('{{maxDelay}} ease-in-out', style({ transform: 'translateX(-10%)' }))
      ], { optional: true }),
      query(':enter', [
        animate('0s {{maxDelay}} ease-in-out', style({ transform: 'translateX(0%)' }))
      ], { optional: true })
    ]),
    query(':enter', animateChild(), { optional: true }),
    query(':leave', animateChild(), { optional: true })
  ],{params: {maxDelay: '1000ms'}})
]);