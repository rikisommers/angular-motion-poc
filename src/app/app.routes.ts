import { Routes } from '@angular/router';
import { WorkComponent } from './pages/work/work.component';
import { BlogComponent } from './pages/blog/blog.component';
import { AppComponent } from './app.component';
import { TimelineComponent } from './timeline/timeline.component';
import { PunchComponent } from './pages/punch/punch.component';
import { TutorialsComponent } from './pages/tutorials/tutorials.component';
import { ExamplesComponent } from './pages/examples/examples.component';
export const routes: Routes = [
  {
    path: '',
    component: AppComponent
  },
  {
    path: 'work',
    component: WorkComponent
  },
  {
    path: 'examples',
    component: ExamplesComponent
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
