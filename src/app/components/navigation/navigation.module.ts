import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { NavbarAwwwardsComponent } from './navbar-awwwards.component';
import { NavbarApplauseComponent } from './navbar-applause.component';

const COMPONENTS = [
  NavbarComponent,
  NavbarAwwwardsComponent,
  NavbarApplauseComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ...COMPONENTS
  ],
  exports: COMPONENTS
})
export class NavigationModule { } 