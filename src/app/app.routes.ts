import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Adjust the path as necessary
import { WorkComponent } from './work/work.component'; // Adjust the path as necessary
import { BioComponent } from './bio/bio.component'; // Adjust the path as necessary
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: '', component: HomeComponent}, // Default route for Home
  { path: 'work', component: WorkComponent}, // Route for Work
  { path: 'bio', component: BioComponent}, // Route for Bio
];

// export const routes: Routes = [
//   { path: '', component: AppComponent,canDeactivate: [MotionGuard2], }, // Default route for Home
// { path: 'home', component: HomeComponent,canDeactivate: [MotionGuard2],   }, // Default route for Home
// { path: 'work', component: WorkComponent,canDeactivate: [MotionGuard2], }, // Route for Work
// { path: 'bio', component: BioComponent,canDeactivate: [MotionGuard2], }, // Route for Bio
// ];

