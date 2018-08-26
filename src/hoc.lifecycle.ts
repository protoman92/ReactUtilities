import * as React from 'react';
import { Component, ComponentType, StatelessComponent } from 'react';

export type LifecycleHOCHooks = {
  readonly onConstruction?: () => void;
  readonly componentDidMount?: () => void;
  readonly componentWillUnmount?: () => void;
};

export type LifecycleHooksHOCOptions = {
  readonly lifecycleHooks: LifecycleHOCHooks;
};

/**
 * Set up hooks for component lifecycle.
 * @template Props Props generics.
 * @template State State generics.
 * @param {(StatelessComponent<Props> | ComponentType<Props>)} targetComponent
 * The base component to receive the hooks.
 * @param {LifecycleHooksHOCOptions} options Setup options.
 * @returns {ComponentType<Props>} Wrapper component.
 */
export function withLifecycleHooks<Props>(
  targetComponent: StatelessComponent<Props> | ComponentType<Props>,
  options: LifecycleHooksHOCOptions,
): ComponentType<Props> {
  let { lifecycleHooks } = options;

  return class Wrapper extends Component<Props, never> {
    public constructor(props: Props) {
      super(props);

      if (lifecycleHooks.onConstruction) {
        lifecycleHooks.onConstruction();
      }
    }

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
