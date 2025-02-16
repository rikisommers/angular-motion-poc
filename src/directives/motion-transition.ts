import { trigger, transition, query, style, animate, sequence, AnimationOptions } from '@angular/animations';

export const routeTransition = trigger('routeTransition', [
  transition('* => *', [
    sequence([
      query(':leave', [
        animate('{{ exitDelay }}ms {{ exitDuration }}ms', style({ opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0 }),
        animate('{{ enterDelay }}ms {{ enterDuration }}ms', style({ opacity: 1 }))
      ], { optional: true })
    ])
  ], {
    params: {
      exitDuration: 1000, // default value
      enterDuration: 1000, // default value
      enterDelay: 1000 // default value
      
    }
  })
]);