import { NullableKV, Omit } from 'javascriptutilities';
import * as React from 'react';
import { Component, ComponentClass, StatelessComponent } from 'react';
import { ViewModelFactoryHOCProps, ViewModelHOCOptions, ViewModelHOCProps, withViewModel } from './hoc.viewmodel';

export type LifecycleHooks = {
  readonly componentDidMount?: () => void;
  readonly componentWillUnmount?: () => void;
};

export type CompleteSetupHOCOptions = {
  /**
   *
   *
   * @type {LifecycleHooks}
   */
  lifecycleHooks?: LifecycleHooks,

  /**
   * Take this opportunity to load styles (e.g. css files).
   */
  loadExtensions: () => void,
};

/**
 * Complete set up for a view model-based component.
 */
export function withCompleteSetup<VM, Props extends ViewModelHOCProps<VM>, State>(
  targetComponent:
    StatelessComponent<Props & NullableKV<State>> |
    ComponentClass<Props & NullableKV<State>, never>,
  options: CompleteSetupHOCOptions & ViewModelHOCOptions<VM, Props>,
): ComponentClass<Omit<Props, 'viewModel'> & ViewModelFactoryHOCProps, State> {
  type PureProps = Omit<Props, 'viewModel'>;
  type WrapperProps = PureProps & ViewModelFactoryHOCProps;
  let { loadExtensions, lifecycleHooks } = options;

  // tslint:disable-next-line:variable-name
  let ViewModelHOC = withViewModel<VM, Props, State>(targetComponent, options);

  return class Wrapper extends Component<WrapperProps, State> {
    public componentDidMount() {
      loadExtensions();

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
      return <ViewModelHOC {...this.props} />;
    }
  };
}
