  // const motionChildren = this.getMotionChildren();
  // console.log('motionChildren: ',motionChildren);

  // const motionInstance = this.getMotionInstance(this.el.nativeElement);
  // console.log('motionInstance: ',motionInstance?.elementId);

  // const isElementIdInMotionChildren = motionChildren.some(child => child.elementId === motionInstance?.elementId);
  // console.log('isElementIdInMotionChildren: ', isElementIdInMotionChildren);

  // const parentElement = this.el.nativeElement.parentElement.querySelector('[motion]');
  // const parentMotionInstance = this.getMotionInstance(parentElement);

  
  // private getMotionChildren(): MotionDirective[] {
  //   return Array.from<Element>(
  //     this.el.nativeElement.querySelectorAll('[motion]'),
  //   )
  //     .map((child: Element) => this.getMotionInstance(child))
  //     .filter(
  //       (instance): instance is MotionDirective =>
  //         instance !== null && instance.staggerChildren !== undefined,
  //     );
  // }

  // private getMotionInstance(element: Element): MotionDirective | null {
  //   const injector = this.injector.get(Injector);
  //   return injector.get(MotionDirective, null, InjectFlags.Optional);
  // }