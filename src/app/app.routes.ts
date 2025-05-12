import { Routes } from '@angular/router';
import { WorkComponent } from './work/work.component';
import { BlogComponent } from './blog/blog.component';
import { AppComponent } from './app.component';

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
      path: 'blog',
      component: BlogComponent
    },

    {
      path: 'flashcards',
      component: AppComponent
    },
    
    // Wildcard route to catch all routes
  {
    path: '**',
    redirectTo: ''
  }
];
