import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold mb-4">Welcome</h1>
      <p class="text-lg">This is the home page of your application.</p>
    </div>
  `
})
export class HomeComponent {} 