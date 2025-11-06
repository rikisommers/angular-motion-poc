# Quick Start: Exit Animations

## Basic Usage

### Step 1: Import the Directive
```typescript
import { MotionOneDirective, MotionIfDirective } from '@hilux/ngx-motion';

@Component({
  imports: [MotionOneDirective, MotionIfDirective],
  // ...
})
```

### Step 2: Use in Template
```html
<button (click)="show = !show">Toggle</button>

<div *motionIf="show">
  <div motionone
       [initial]="{ opacity: 0 }"
       [animate]="{ opacity: 1 }"
       [exit]="{ opacity: 0 }">
    Hello World!
  </div>
</div>
```

## Common Patterns

### Fade In/Out
```html
<div *motionIf="isVisible">
  <div motionone
       [initial]="{ opacity: 0 }"
       [animate]="{ opacity: 1 }"
       [exit]="{ opacity: 0 }"
       [transition]="{ duration: 0.3 }">
    Content
  </div>
</div>
```

### Slide In/Out
```html
<div *motionIf="isVisible">
  <div motionone
       [initial]="{ x: -100, opacity: 0 }"
       [animate]="{ x: 0, opacity: 1 }"
       [exit]="{ x: 100, opacity: 0 }"
       [transition]="{ duration: 0.4 }">
    Content
  </div>
</div>
```

### Scale & Fade
```html
<div *motionIf="isVisible">
  <div motionone
       [initial]="{ scale: 0.8, opacity: 0 }"
       [animate]="{ scale: 1, opacity: 1 }"
       [exit]="{ scale: 0.8, opacity: 0 }"
       [transition]="{ duration: 0.3, ease: 'easeOut' }">
    Content
  </div>
</div>
```

### Rotate & Slide
```html
<div *motionIf="isVisible">
  <div motionone
       [initial]="{ rotate: -180, x: -50, opacity: 0 }"
       [animate]="{ rotate: 0, x: 0, opacity: 1 }"
       [exit]="{ rotate: 180, x: 50, opacity: 0 }"
       [transition]="{ duration: 0.5, ease: 'easeInOut' }">
    Content
  </div>
</div>
```

### Spring Animation
```html
<div *motionIf="isVisible">
  <div motionone
       [initial]="{ y: -50, opacity: 0 }"
       [animate]="{ y: 0, opacity: 1 }"
       [exit]="{ y: 50, opacity: 0 }"
       [transition]="{ 
         duration: 0.4, 
         ease: { type: 'spring', stiffness: 300, damping: 20 }
       }">
    Content
  </div>
</div>
```

## Alternative: motionPresence

Use `*motionPresence` if you prefer that naming:

```html
<div *motionPresence="show">
  <div motionone
       [initial]="{ opacity: 0 }"
       [animate]="{ opacity: 1 }"
       [exit]="{ opacity: 0 }">
    Content
  </div>
</div>
```

## Multiple Elements

Both directives support multiple animated elements:

```html
<div *motionIf="show">
  <div motionone [initial]="..." [animate]="..." [exit]="...">Item 1</div>
  <div motionone [initial]="..." [animate]="..." [exit]="...">Item 2</div>
  <div motionone [initial]="..." [animate]="..." [exit]="...">Item 3</div>
</div>
```

The directive will wait for all exit animations to complete before removing from DOM.

## Important Notes

⚠️ **Must use `*motionIf` or `*motionPresence`** - Exit animations only work with these structural directives, NOT with regular `*ngIf`

✅ **Works with:**
```html
<div *motionIf="show">...</div>
<div *motionPresence="show">...</div>
```

❌ **Does NOT work with:**
```html
<div *ngIf="show">...</div>  <!-- Exit animation will not play -->
```

## Transition Options

You can customize the timing for each animation:

```html
<div *motionIf="show">
  <div motionone
       [initial]="{ opacity: 0 }"
       [animate]="{ opacity: 1 }"
       [exit]="{ opacity: 0 }"
       [transition]="{
         duration: 0.5,
         delay: 0.1,
         ease: 'easeInOut'
       }">
    Content
  </div>
</div>
```

## Available Easing Functions

- `'ease'` - Default CSS ease
- `'ease-in'` - CSS ease-in
- `'ease-out'` - CSS ease-out  
- `'ease-in-out'` - CSS ease-in-out
- `'linear'` - Linear timing
- `[0.4, 0, 0.2, 1]` - Custom cubic bezier
- `{ type: 'spring', stiffness: 400, damping: 17 }` - Spring physics

## Complete Example

```typescript
import { Component } from '@angular/core';
import { MotionOneDirective, MotionIfDirective } from '@hilux/ngx-motion';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [MotionOneDirective, MotionIfDirective],
  template: `
    <button (click)="toggle()">
      {{ isVisible ? 'Hide' : 'Show' }}
    </button>

    <div *motionIf="isVisible">
      <div
        motionone
        [initial]="{ opacity: 0, y: 20, scale: 0.95 }"
        [animate]="{ opacity: 1, y: 0, scale: 1 }"
        [exit]="{ opacity: 0, y: -20, scale: 0.95 }"
        [transition]="{ 
          duration: 0.4,
          ease: { type: 'spring', stiffness: 300, damping: 25 }
        }"
        class="card"
      >
        <h2>Animated Card</h2>
        <p>This card animates in and out smoothly!</p>
      </div>
    </div>
  `
})
export class DemoComponent {
  isVisible = true;

  toggle() {
    this.isVisible = !this.isVisible;
  }
}
```
