import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Adjust the path as necessary
import { WorkComponent } from './work/work.component'; // Adjust the path as necessary
import { BioComponent } from './bio/bio.component'; // Adjust the path as necessary
import { BlogComponent } from './blog/blog.component'; // Adjust the path as necessary
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
  // Wildcard route to catch all routes
  {
    path: '**',
    redirectTo: ''
  }
];
