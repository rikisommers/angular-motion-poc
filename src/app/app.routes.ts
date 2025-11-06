import { Routes } from '@angular/router';
import { WorkComponent } from './pages/work/work.component';
import { BlogComponent } from './pages/blog/blog.component';
import { AppComponent } from './app.component';
import { TimelineComponent } from './pages/timeline/timeline.component';
import { PunchComponent } from './pages/punch/punch.component';
import { TutorialsComponent } from './pages/tutorials/tutorials.component';
import { ExamplesComponent } from './pages/examples/examples.component';
import { DocsComponent } from './pages/docs/docs.component';
import { FeaturesComponent } from './pages/features/features.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'docs', // Redirects to the 'home' path
    pathMatch: 'full'
  },
  {
    path: 'work',
    component: WorkComponent
  },
  {
    path: 'docs',
    component: DocsComponent
  },
  {
    path: 'features',
    component: FeaturesComponent
  },
  {
    path: 'examples',
    component: ExamplesComponent
  },
  {
    path: 'examples/basic',
    loadComponent: () => import('./examples/basic-animation/basic-animation-example.component').then(m => m.BasicAnimationExampleComponent)
  },
  {
    path: 'examples/hover',
    loadComponent: () => import('./examples/hover/hover-example.component').then(m => m.HoverExampleComponent)
  },
  {
    path: 'examples/text-animation',
    loadComponent: () => import('./examples/text-animation/text-animation-example.component').then(m => m.TextAnimationExampleComponent)
  },
  {
    path: 'examples/variants',
    loadComponent: () => import('./examples/variants/variants-example.component').then(m => m.VariantsExampleComponent)
  },
  {
    path: 'examples/easings',
    loadComponent: () => import('./examples/easings/easings-example.component').then(m => m.EasingsExampleComponent)
  },
  {
    path: 'examples/timeline',
    loadComponent: () => import('./examples/timeline/timeline-example.component').then(m => m.TimelineExampleComponent)
  },
  {
    path: 'examples/whileinview',
    loadComponent: () => import('./examples/whileinview/whileinview-example.component').then(m => m.WhileinviewExampleComponent)
  },
  {
    path: 'examples/stagger',
    loadComponent: () => import('./examples/stagger/stagger-example.component').then(m => m.StaggerExampleComponent)
  },
  {
    path: 'examples/repeat',
    loadComponent: () => import('./examples/repeat/repeat-example.component').then(m => m.RepeatExampleComponent)
  },
  {
    path: 'examples/focus-tap',
    loadComponent: () => import('./examples/focus-tap/focus-tap-example.component').then(m => m.FocusTapExampleComponent)
  },
  {
    path: 'examples/delay',
    loadComponent: () => import('./examples/delay/delay-example.component').then(m => m.DelayExampleComponent)
  },
  {
    path: 'tutorials',
    component: TutorialsComponent
  },
  {
    path: 'work',
    component: WorkComponent
  },
    {
      path: 'blog',
      component: BlogComponent
    },

    {
      path: 'flashcards',
      component: AppComponent
    },
    {
      path: 'timeline',
      component: TimelineComponent
    },
    {
      path: 'punch',
      component: PunchComponent
    },
    // Wildcard route to catch all routes
  {
    path: '**',
    redirectTo: ''
  }
];
