# Angular Motion Demo & Library

This project demonstrates **@hilux/ngx-motion**, a powerful Angular directive library for Motion One animations with a Framer Motion-like API.

## 🚀 Features

### Motion One Integration
- Built on top of the performant Motion One animation library
- Familiar Framer Motion API for React developers transitioning to Angular
- Full TypeScript support with type safety
- Server-Side Rendering (SSR) compatible with Angular Universal

### Animation Capabilities
- **Basic Animations**: `initial`, `animate`, and `exit` states
- **Gesture Animations**: `whileHover`, `whileTap`, `whileFocus`
- **Stagger Animations**: Built-in support for staggered children animations
- **Timeline Support**: Create complex sequential animations with precise timing
- **Conditional Rendering**: `motionIf` directive for animated presence
- **Variants**: Named animation states for clean, reusable animations
- **Spring Physics**: Native spring animations with customizable stiffness and damping

### Advanced Features
- **Transform Shortcuts**: Use `x`, `y`, `scale`, `rotate` instead of transform strings
- **Color Animation**: Smooth color transitions with automatic color format handling
- **Keyframe Arrays**: Support for complex keyframe-based animations
- **Per-Property Transitions**: Different timing for each animated property
- **Responsive Design**: Animation that work across all screen sizes
- **Performance Optimized**: Leverages Motion One's efficient animation engine

## 📦 Library Installation

```bash
npm install @hilux/ngx-motion motion
```

## 🎯 Basic Usage

Import the directive in your component:

```typescript
import { MotionOneDirective } from '@hilux/ngx-motion';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [MotionOneDirective],
  template: `
    <div
      motionone
      [initial]="{ opacity: 0, y: 50 }"
      [animate]="{ opacity: 1, y: 0 }"
      [transition]="{ duration: 0.5, ease: 'easeOut' }"
    >
      Animated content
    </div>
  `
})
export class ExampleComponent {}
```

## 🎨 Animation Examples

### Hover Animations
```html
<button
  motionone
  [initial]="{ scale: 1 }"
  [whileHover]="{ scale: 1.05 }"
  [whileTap]="{ scale: 0.95 }"
  [transition]="{ type: 'spring', stiffness: 400, damping: 17 }"
>
  Hover me!
</button>
```

### Stagger Children
```html
<div
  motionone
  [initial]="{ opacity: 0 }"
  [animate]="{ opacity: 1 }"
  [transition]="{ staggerChildren: 0.1, delayChildren: 0.3 }"
>
  <div motionone [initial]="{ x: -50, opacity: 0 }" [animate]="{ x: 0, opacity: 1 }">Item 1</div>
  <div motionone [initial]="{ x: -50, opacity: 0 }" [animate]="{ x: 0, opacity: 1 }">Item 2</div>
  <div motionone [initial]="{ x: -50, opacity: 0 }" [animate]="{ x: 0, opacity: 1 }">Item 3</div>
</div>
```

### Variants
```typescript
@Component({
  template: `
    <div
      motionone
      [variants]="containerVariants"
      [initial]="'hidden'"
      [animate]="'visible'"
    >
      <div motionone [variants]="itemVariants">Item 1</div>
      <div motionone [variants]="itemVariants">Item 2</div>
    </div>
  `
})
export class VariantsExample {
  containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };
}
```

### Conditional Animation with motionIf
```html
<button (click)="isVisible = !isVisible">Toggle</button>

<div *motionIf="isVisible">
  <div
    motionone
    [initial]="{ scale: 0, opacity: 0 }"
    [animate]="{ scale: 1, opacity: 1 }"
    [exit]="{ scale: 0, opacity: 0 }"
    [transition]="{ duration: 0.3 }"
  >
    This will animate in and out!
  </div>
</div>
```

### Exit Animations with Angular Control Flow
The `exit` property defines animations when elements are removed from the DOM. Works with the `*motionIf` and `*motionPresence` structural directives:

```typescript
@Component({
  selector: 'app-example',
  imports: [MotionOneDirective, MotionIfDirective],
  template: `
    <button (click)="show = !show">
      {{ show ? 'Hide' : 'Show' }}
    </button>
    
    <!-- Using *motionIf directive for exit animations -->
    <div *motionIf="show">
      <div
        motionone
        [initial]="{ x: -100, opacity: 0 }"
        [animate]="{ x: 0, opacity: 1 }"
        [exit]="{ x: 100, opacity: 0 }"
        [transition]="{ duration: 0.4, ease: { type: 'spring', stiffness: 300 } }"
      >
        Slides in from left, slides out to right
      </div>
    </div>
  `
})
export class ExitAnimationExample {
  show = true;
}
```

**How it works:**
- `*motionIf` is a structural directive that manages the element lifecycle
- When condition becomes `true`, it creates the view and triggers enter animation
- When condition becomes `false`, it triggers exit animation then removes from DOM
- Automatically calculates animation duration to ensure smooth exit

**Alternative using `*motionPresence`:**
```html
<div *motionPresence="isVisible">
  <div motionone 
       [initial]="{ opacity: 0, scale: 0.8 }"
       [animate]="{ opacity: 1, scale: 1 }"
       [exit]="{ opacity: 0, scale: 0.8 }">
    Content
  </div>
</div>
```

Both directives work identically - use whichever naming you prefer!

### Timeline Animations
```typescript
@Component({
  template: `
    <div
      motionone
      [timeline]="complexTimeline"
      [animate]="{ opacity: 1 }"
    >
      Complex sequenced animation
    </div>
  `
})
export class TimelineExample {
  complexTimeline = [
    { prop: 'x', to: 100, duration: 1, atTime: 0 },
    { prop: 'rotate', to: 180, duration: 0.5, atTime: 0.5 },
    { prop: 'scale', to: 1.2, duration: 0.3, atTime: 1.2 }
  ];
}
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- Angular 19+
- Motion One library

### Running the Demo
```bash
# Install dependencies
yarn install

# Start development server
yarn start

# Build the library
yarn build:lib

# Test library build
yarn pack:lib
```

### Building for Production
```bash
# Build demo app
yarn build

# Build and publish library
yarn publish:lib
```

## 📚 API Reference

### Inputs

| Input | Type | Description |
|-------|------|-------------|
| `initial` | `VariantWithTransition \| string` | Initial animation state |
| `animate` | `VariantWithTransition \| string` | Target animation state |
| `exit` | `VariantWithTransition \| string` | Exit animation state |
| `transition` | `TransitionOptions \| Record<string, TransitionOptions>` | Animation transition configuration |
| `variants` | `Record<string, VariantWithTransition>` | Named animation variants |
| `whileHover` | `VariantWithTransition` | Animation while hovering |
| `whileTap` | `VariantWithTransition` | Animation while pressing |
| `whileFocus` | `VariantWithTransition` | Animation while focused |
| `timeline` | `TimelineStep[]` | Sequential animation timeline |

### Transition Options

```typescript
interface TransitionOptions {
  duration?: number;
  delay?: number;
  ease?: string | number[] | { type: 'spring'; stiffness?: number; damping?: number };
  repeat?: number | boolean;
  repeatType?: 'loop' | 'mirror' | 'reverse' | 'forwards' | 'pingPong';
  repeatDelay?: number;
  staggerChildren?: number;
  staggerDirection?: number;
  when?: 'beforeChildren' | 'afterChildren' | 'together';
  delayChildren?: number;
}
```

### Available Easing Functions
- `'ease'` - Default CSS ease
- `'ease-in'` - CSS ease-in
- `'ease-out'` - CSS ease-out
- `'ease-in-out'` - CSS ease-in-out
- `[0.4, 0, 0.2, 1]` - Custom cubic bezier
- `{ type: 'spring', stiffness: 400, damping: 17 }` - Spring physics

## 🎯 Project Structure

```
ng-motion-demo/
├── projects/ngx-motion/          # Library source code
│   ├── src/lib/directives/       # Motion directives
│   ├── src/lib/services/         # Animation services
│   └── src/public-api.ts         # Library exports
├── src/app/                      # Demo application
│   ├── components/               # Demo components
│   ├── pages/                    # Demo pages
│   └── directives/               # Original directive sources
└── dist/ngx-motion/              # Built library output
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [Motion One Documentation](https://motion.dev/)
- [Angular Documentation](https://angular.dev/)
- [Framer Motion API Reference](https://www.framer.com/motion/)

---

Built with ❤️ using Angular and Motion One