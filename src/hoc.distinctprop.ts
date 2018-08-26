import * as React from 'react';
import { Component, ComponentType } from 'react';
import { getComponentName } from './util';

export type DistinctPropsHOCOptions<Props> = {
  readonly propKeysForComparison: (keyof Props)[];
  readonly checkEquality: (obj1: unknown, obj2: unknown) => boolean;
};

/**
 * Filter out duplicate props for some keys.
 * @template Props Props generics.
 * @param {ComponentType<Props>} targetComponent Target component to be wrapped.
 * @param {DistinctPropsHOCOptions<Props>} options Setup options.
 * @returns {ComponentType<Props>} Wrapper component.
 */
export function withDistinctProps<Props>(
  targetComponent: ComponentType<Props>,
  options: DistinctPropsHOCOptions<Props>,
): ComponentType<Props> {
  let { checkEquality, propKeysForComparison } = options;

  return class DistinctPropWrapper extends Component<Props, never> {
    public static displayName = getComponentName(targetComponent);

    public shouldComponentUpdate(nextProps: Props) {
      for (let key of propKeysForComparison) {
        if (!checkEquality(this.props[key], nextProps[key])) {
          return true;
        }
      }

      return false;
    }

    public render() {
      return React.createElement(targetComponent, this.props);
    }
  };
}
