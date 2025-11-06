# Angular Control Flow Animation Integration

This document explains how `@hilux/ngx-motion` integrates with Angular's control flow to support exit animations.

## Overview

Angular's control flow (`@if`, `@for`, etc.) removes elements immediately from the DOM when conditions change. To support exit animations, we need to:
1. Detect when an element is about to be removed
2. Play the exit animation
3. Remove the element after the animation completes

## Solution Approaches

### Approach 1: `*motionIf` Directive (Recommended)

The `*motionIf` structural directive wraps Angular's template logic and manages the animation lifecycle.

**How it works:**
1. Uses `ViewContainerRef` to control when views are created/destroyed
2. Finds all `motionone` directives within the template
3. Triggers `runInitAnimation()` on enter
4. Triggers `runExitAnimation()` on exit
5. Waits for all exit animations to complete before removing from DOM

**Usage:**
```typescript
@Component({
  template: `
    <button (click)="show = !show">Toggle</button>
    
    <div *motionIf="show">
      <div motionone
           [initial]="{ opacity: 0, x: -100 }"
           [animate]="{ opacity: 1, x: 0 }"
           [exit]="{ opacity: 0, x: 100 }"
           [transition]="{ duration: 0.4 }">
        Content with exit animation
      </div>
    </div>
  `
})
```

**Key Benefits:**
- ✅ Works with existing `motionone` directive
- ✅ Supports multiple animated elements in template
- ✅ Calculates longest animation duration automatically
- ✅ Handles cleanup properly

### Approach 2: `*motionPresence` Directive

Alternative structural directive with the same capabilities as `*motionIf`.

**Usage:**
```html
<div *motionPresence="isVisible">
  <div motionone [animate]="..." [exit]="...">
    Content
  </div>
</div>
```

### Approach 3: Angular's Native @animate (Future)

Angular 19+ is introducing native animation triggers for control flow:

```html
@if (show) {
  <div @animate.enter @animate.leave>
    Content
  </div>
}
```

Currently, this is not yet available in stable Angular, but we can integrate when it becomes available.

## Implementation Details

### Finding Motion Directives

The directives use a reference stored on the DOM element:

```typescript
// In MotionOneDirective constructor
(this.el.nativeElement as any)._motionDirective = this;

// In structural directives
private findMotionDirectives(view: EmbeddedViewRef<any>): MotionOneDirective[] {
  const directives: MotionOneDirective[] = [];
  
  view.rootNodes.forEach((node: any) => {
    if (node?._motionDirective) {
      directives.push(node._motionDirective);
    }
    
    // Search children
    if (node?.querySelectorAll) {
      const elements = node.querySelectorAll('[motionone]');
      elements.forEach((el: any) => {
        if (el._motionDirective) {
          directives.push(el._motionDirective);
        }
      });
    }
  });
  
  return directives;
}
```

### Animation Lifecycle

**Enter:**
```typescript
private enter() {
  // 1. Create view
  this.currentView = this.viewContainer.createEmbeddedView(this.templateRef);
  this.hasView = true;
  this.cdr.detectChanges();
  
  // 2. Find directives and trigger enter animations
  setTimeout(() => {
    this.motionDirectives = this.findMotionDirectives(this.currentView);
    this.motionDirectives.forEach(d => d.runInitAnimation());
  }, 0);
}
```

**Exit:**
```typescript
private exit() {
  // 1. Find directives with exit animations
  const directivesWithExit = this.motionDirectives.filter(
    d => d.exit && Object.keys(d.exit).length > 0
  );
  
  // 2. Run exit animations
  if (directivesWithExit.length > 0) {
    const maxDuration = Math.max(...directivesWithExit.map(d => d.getDuration()));
    
    // 3. Remove after animations complete
    setTimeout(() => this.clearView(), maxDuration);
  } else {
    this.clearView();
  }
}
```

## Usage with Different Control Flow

### With @if (New Angular Control Flow)

Use the standard Angular `*ngIf` syntax (which works with `@if` under the hood):

```html
<div *motionIf="condition">
  <div motionone [animate]="..." [exit]="...">Content</div>
</div>
```

### With @for

```html
<div *motionPresence="items.length > 0">
  @for (item of items; track item.id) {
    <div motionone [animate]="..." [exit]="...">
      {{ item.name }}
    </div>
  }
</div>
```

### With Routing

For route transitions, use the existing route animation support in `MotionOneDirective` which hooks into Angular's router events.

## Comparison with Framer Motion

| Framer Motion (React) | ngx-motion (Angular) |
|----------------------|---------------------|
| `<AnimatePresence>` | `*motionIf` or `*motionPresence` |
| `initial` prop | `[initial]` input |
| `animate` prop | `[animate]` input |
| `exit` prop | `[exit]` input |
| `<motion.div>` | `<div motionone>` |

## Best Practices

1. **Always use `*motionIf` or `*motionPresence`** when you have exit animations
2. **Define exit property** - matches your enter animation for symmetry
3. **Consider performance** - exit animations delay DOM removal
4. **Handle multiple elements** - both directives support multiple animated children
5. **Test timing** - ensure animations complete before removal

## Limitations

- Exit animations only work with structural directives (`*motionIf`, `*motionPresence`)
- Cannot use native Angular `@if` directly (must use `*motionIf` wrapper)
- Exit animations add delay to DOM removal (by design)

## Future Enhancements

1. Support for Angular's native `@animate` triggers when stable
2. Integration with `ViewContainerRef` lifecycle hooks
3. Support for custom timing functions
4. Automatic animation cancellation on rapid toggling

