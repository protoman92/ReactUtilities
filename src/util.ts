import { ComponentType } from 'react';

/**
 * Get the name of a React component.
 * @param {ComponentType<any>} component A component instance.
 * @returns A string value.
 */
export function getComponentName(component: ComponentType<any>) {
  if (component.displayName) {
    return component.displayName;
  } else {
    return component.name;
  }
}
