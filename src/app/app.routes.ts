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
    redirectTo: 'examples', // Redirects to the 'home' path
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
    children: [
      {
        path: '',
        component: ExamplesComponent
      },
      {
        path: 'basic',
        loadComponent: () => import('./examples/basic-animation/basic-animation-example.component').then(m => m.BasicAnimationExampleComponent)
      },
      {
        path: 'hover',
        loadComponent: () => import('./examples/hover/hover-example.component').then(m => m.HoverExampleComponent)
      },
      {
        path: 'text-animation',
        loadComponent: () => import('./examples/text-animation/text-animation-example.component').then(m => m.TextAnimationExampleComponent)
      }
    ]
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
