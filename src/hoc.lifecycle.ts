import * as React from 'react';
import { Component, ComponentClass, StatelessComponent } from 'react';

export type LifecycleHooks = {
  readonly componentDidMount?: () => void;
  readonly componentWillUnmount?: () => void;
};

export type LifecycleHooksHOCOptions = {
  readonly lifecycleHooks: LifecycleHooks;
};

/**
 * Set up hooks for component lifecycle.
 * @template Props Props generics.
 * @template State State generics.
 * @param {(StatelessComponent<Props> | ComponentClass<Props, State>)} targetComponent
 * The base component to receive the hooks.
 * @param {LifecycleHooksHOCOptions} options Setup options.
 * @returns {ComponentClass<Props, State>} Wrapper component.
 */
export function withLifecycleHooks<Props, State = never>(
  targetComponent: StatelessComponent<Props> | ComponentClass<Props, State>,
  options: LifecycleHooksHOCOptions,
): ComponentClass<Props, State> {
  let { lifecycleHooks } = options;

  return class Wrapper extends Component<Props, State> {
    public componentDidMount() {
      if (lifecycleHooks && lifecycleHooks.componentDidMount) {
        lifecycleHooks.componentDidMount();
      }
    }

    public componentWillUnmount() {
      if (lifecycleHooks && lifecycleHooks.componentWillUnmount) {
        lifecycleHooks.componentWillUnmount();
      }
    }

    public render() {
      return React.createElement(targetComponent, this.props);
    }
  };
}
