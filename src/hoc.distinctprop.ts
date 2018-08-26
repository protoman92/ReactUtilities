import * as React from 'react';
import { Component, ComponentType } from 'react';
import { getComponentName } from './util';

export type DistinctPropsHOCOptions<Props> = {
  /**
   * If this is not specified, use all keys of the component's props, but
   * beware that some keys may be optional.
   */
  readonly propKeysForComparison?: (keyof Props)[];
  readonly propKeysToIgnore?: (keyof Props)[];
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
  let { checkEquality, propKeysForComparison, propKeysToIgnore } = options;

  return class DistinctPropWrapper extends Component<Props, never> {
    public static displayName = getComponentName(targetComponent);
    private readonly shouldUpdate: (props: Props, next: Props) => boolean;

    public constructor(props: Props) {
      super(props);
      let keys: (keyof Props)[];

      if (propKeysForComparison instanceof Array) {
        keys = propKeysForComparison;
      } else {
        keys = Object.keys(props) as (keyof Props)[];
      }

      let ignoreKeys = propKeysToIgnore || [];
      keys = keys.filter(key => !(ignoreKeys.indexOf(key) > -1));

      this.shouldUpdate = (p1, p2) => {
        for (let key of keys) {
          if (p1[key] instanceof Function) {
            continue;
          } else if (!checkEquality(p1[key], p2[key])) {
            return true;
          }
        }

        return false;
      };
    }

    public shouldComponentUpdate(nextProps: Props) {
      return this.shouldUpdate(this.props, nextProps);
    }

    public render() {
      return React.createElement(targetComponent, this.props);
    }
  };
}
