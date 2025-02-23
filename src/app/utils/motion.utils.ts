import { ElementRef } from '@angular/core';

export function getChildIndex(element: ElementRef): number | null {
    const parent = element.nativeElement.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children); 
      return siblings.indexOf(element.nativeElement); 
    }
    return null; 
  }

export function parseAsNumber(value: any): number {
    const parsedValue =
      typeof value === 'string' ? parseFloat(value) * 1000 : value;
    return isNaN(parsedValue) ? 0 : parsedValue;
  }


  export function getDuration(duration: string, delay: string): number {
    const durationSeconds = parseFloat(duration);
    const delaySeconds = parseFloat(delay);
    return (durationSeconds + delaySeconds) * 1000;
  }

  export function getKeyByValue(object: any, key: any) {
    return Object.keys(object).find((key) => object[key] === key);
  }
