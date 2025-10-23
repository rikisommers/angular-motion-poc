# @hilux/ngx-motion

Angular directive for Motion One animations with Framer Motion-like API.

## Installation

```bash
npm install @hilux/ngx-motion motion
```

## Usage

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
      [transition]="{ duration: 0.5 }"
    >
      Animated content
    </div>
  `
})
export class ExampleComponent {}
```

## Features

- ✅ **Motion One Integration**: Built on top of the performant Motion One animation library
- ✅ **Framer Motion API**: Familiar API for React developers
- ✅ **TypeScript Support**: Full type safety with TypeScript
- ✅ **Server-Side Rendering**: Compatible with Angular Universal
- ✅ **Stagger Animations**: Built-in support for staggered animations
- ✅ **Timeline Support**: Create complex sequential animations
- ✅ **Conditional Rendering**: `motionIf` directive for animated presence
- ✅ **Gesture Support**: whileHover, whileTap, whileFocus animations

## API Reference

### Animation State Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `initial` | `VariantWithTransition \| string` | `{}` | Initial animation state when element mounts |
| `animate` | `VariantWithTransition \| string` | `{}` | Target animation state to animate to |
| `exit` | `VariantWithTransition \| string` | `{}` | Animation state when element unmounts |
| `inView` | `VariantWithTransition` | `{}` | Animation state when element enters viewport |
| `whileHover` | `VariantWithTransition` | `{}` | Animation state while hovering over element |
| `whileTap` | `VariantWithTransition` | `{}` | Animation state while pressing/tapping element |
| `whileFocus` | `VariantWithTransition` | `{}` | Animation state while element is focused |
| `whileInView` | `VariantWithTransition` | `{}` | Animation state while element is in viewport |

### Timing & Easing Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `duration` | `number` | `0.3` | Default animation duration in seconds |
| `delay` | `number` | `0` | Default delay before animation starts in seconds |
| `exitDelay` | `number` | `0` | Delay before exit animation starts in seconds |
| `easing` | `string \| number[] \| SpringConfig` | `'ease'` | Default easing function for animations |

### Children Animation Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `delayChildren` | `number` | `0` | Delay before children animations start in seconds |
| `staggerChildren` | `number` | `1` | Time between each child animation start in seconds |
| `staggerDirection` | `number` | `1` | Direction of stagger (1 = forward, -1 = reverse) |

### Advanced Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `variants` | `Record<string, VariantWithTransition>` | `{}` | Named animation variants for reusable states |
| `transition` | `TransitionOptions \| Record<string, TransitionOptions>` | `{}` | Transition configuration (overrides individual timing inputs) |
| `timeline` | `TimelineStep[]` | `undefined` | Sequential animation timeline for complex animations |
| `repeat` | `boolean` | `false` | Whether to repeat the animation infinitely |
| `offset` | `string` | `'0px'` | Intersection observer margin for inView detection |

### Output Events

| Output | Type | Description |
|--------|------|-------------|
| `animationComplete` | `EventEmitter<void>` | Emitted when animation completes |

## Type Definitions

### VariantWithTransition
```typescript
interface VariantWithTransition {
  [key: string]: any;
  transition?: TransitionOptions;
  at?: number; // Delay in seconds before this variant triggers
}
```

### TransitionOptions
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
  times?: number[]; // Keyframe timing array (0-1)
}
```

### TimelineStep
```typescript
interface TimelineStep {
  prop: string; // CSS property to animate
  keyframes?: any[] | any; // Keyframe values
  to?: any; // End value
  duration: number; // Duration in seconds
  delay?: number; // Delay in seconds
  ease?: string | number[] | SpringConfig;
  atTime?: number; // Absolute start time relative to element start
  times?: number[]; // Keyframe timing array (0-1)
  repeat?: number | boolean;
  repeatType?: 'loop' | 'mirror' | 'reverse' | 'forwards' | 'pingPong';
  repeatDelay?: number;
}
```

## Examples

### Basic Animation
```html
<div
  motionone
  [initial]="{ opacity: 0, scale: 0.8 }"
  [animate]="{ opacity: 1, scale: 1 }"
  [duration]="0.5"
  [easing]="'ease-out'"
>
  Fade and scale in
</div>
```

### Hover Interactions
```html
<button
  motionone
  [initial]="{ scale: 1 }"
  [whileHover]="{ scale: 1.05 }"
  [whileTap]="{ scale: 0.95 }"
  [transition]="{ type: 'spring', stiffness: 400, damping: 17 }"
>
  Interactive Button
</button>
```

### Stagger Children
```html
<div
  motionone
  [initial]="{ opacity: 0 }"
  [animate]="{ opacity: 1 }"
  [staggerChildren]="0.1"
  [delayChildren]="0.3"
>
  <div motionone [initial]="{ x: -50, opacity: 0 }" [animate]="{ x: 0, opacity: 1 }">Item 1</div>
  <div motionone [initial]="{ x: -50, opacity: 0 }" [animate]="{ x: 0, opacity: 1 }">Item 2</div>
  <div motionone [initial]="{ x: -50, opacity: 0 }" [animate]="{ x: 0, opacity: 1 }">Item 3</div>
</div>
```

### Using Variants
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
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.33, 1, 0.68, 1]
      }
    }
  };
}
```

### Timeline Animation

Timeline animations allow you to orchestrate multiple properties with precise timing control. Each timeline step can have different durations, delays, and easing functions.

```typescript
@Component({
  template: `
    <div
      motionone
      [timeline]="complexTimeline"
      [animate]="{ opacity: 1 }"
      (animationComplete)="onAnimationComplete()"
    >
      Complex sequenced animation
    </div>
  `
})
export class TimelineExample {
  complexTimeline: TimelineStep[] = [
    { prop: 'x', to: 100, duration: 1, atTime: 0 },
    { prop: 'rotate', to: 180, duration: 0.5, atTime: 0.5 },
    { prop: 'scale', to: 1.2, duration: 0.3, atTime: 1.2 },
    { prop: 'opacity', keyframes: [0, 1, 0.5, 1], duration: 2, atTime: 0.8 }
  ];

  onAnimationComplete() {
    console.log('Timeline animation completed!');
  }
}
```

### Advanced Timeline Example (From Demo)

This example demonstrates a complex multi-property timeline animation with overlapping animations:

```html
<div class="h-12 bg-blue-600" style="width:40px"
     motionone
     [timeline]="[
       {
         prop: 'width',
         keyframes: ['40px','160px','80px'],
         duration: 1.2,
         atTime: 0.0,
         ease: 'ease-out',
         times: [0, 0.7, 1]
       },
       {
         prop: 'backgroundColor',
         keyframes: ['#f00','#0f0','#00f'],
         duration: 5.0,
         atTime: 0.5,
         ease: 'ease-in',
         times: [0, 0.4, 1]
       },
       {
         prop: 'transform',
         keyframes: ['scaleY(0.5)','scaleY(1)','scaleY(10)'],
         duration: 6.0,
         atTime: 0,
         ease: { type:'spring', stiffness:100, damping:10 },
         times: [0, 4, 5]
       }
     ]">
</div>
```

**This timeline creates:**
1. **Width Animation** (0.0s → 1.2s): Element width morphs from 40px → 160px → 80px with ease-out timing
2. **Color Transition** (0.5s → 5.5s): Background color cycles through red → green → blue starting 0.5s later
3. **Scale Transform** (0.0s → 6.0s): Vertical scaling from 0.5 → 1 → 10 with spring physics

**Key Timeline Features:**
- **Overlapping Animations**: Multiple properties animate simultaneously with different timings
- **Custom Keyframe Timing**: `times` array controls when each keyframe occurs (0-1 normalized)
- **Mixed Easing**: Different easing functions per property (ease-out, ease-in, spring)
- **Absolute Timing**: `atTime` sets when each animation begins relative to timeline start
- **Duration Independence**: Each property can have completely different durations

### Conditional Rendering with motionIf
```html
<div *motionIf="isVisible">
  <div
    motionone
    [initial]="{ scale: 0, opacity: 0 }"
    [animate]="{ scale: 1, opacity: 1 }"
    [exit]="{ scale: 0, opacity: 0, transition: { duration: 0.2 } }"
    [transition]="{ duration: 0.3, ease: 'backOut' }"
  >
    This will animate in and out smoothly!
  </div>
</div>
```

### Spring Physics
```html
<div
  motionone
  [initial]="{ y: -100 }"
  [animate]="{ y: 0 }"
  [easing]="{ type: 'spring', stiffness: 300, damping: 20 }"
>
  Bouncy spring animation
</div>
```

### Scroll-triggered Animation
```html
<div
  motionone
  [initial]="{ opacity: 0, y: 50 }"
  [whileInView]="{ opacity: 1, y: 0 }"
  [transition]="{ duration: 0.6 }"
  [offset]="'-100px'"
>
  Animates when scrolled into view
</div>
```

## Directives

### motionone
Main animation directive for creating smooth, performant animations.

### motionIf
Structural directive for conditional rendering with enter/exit animations:

```html
<div *motionIf="condition">
  Content with enter/exit animations
</div>
```

## Easing Options

### Built-in Easings
- `'ease'` - Default CSS ease
- `'ease-in'` - CSS ease-in
- `'ease-out'` - CSS ease-out
- `'ease-in-out'` - CSS ease-in-out
- `'linear'` - Linear timing

### Custom Cubic Bezier
```typescript
[0.4, 0, 0.2, 1] // Custom cubic bezier curve
```

### Spring Physics
```typescript
{
  type: 'spring',
  stiffness: 400, // Spring stiffness (higher = snappier)
  damping: 17     // Spring damping (higher = less bouncy)
}
```

## Transform Properties

The directive supports convenient transform shortcuts:
- `x`, `y` - Translate in pixels
- `scale`, `scaleX`, `scaleY` - Scale transforms
- `rotate` - Rotation in degrees
- `transform` - Raw transform string (for advanced use)

## Color Animation

Supports smooth color transitions:
```typescript
{
  backgroundColor: ['#ff0000', '#00ff00', '#0000ff'], // Keyframe colors
  color: '#ffffff' // Single color value
}
```

## Performance Notes

- Uses Motion One's optimized animation engine
- Automatically promotes animations to the GPU when beneficial
- Minimal bundle size impact
- Tree-shakeable exports

## Browser Support

- Chrome 80+
- Firefox 76+
- Safari 13+
- Edge 80+

## License

MIT