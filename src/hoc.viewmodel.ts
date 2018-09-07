import { NeverProp, Objects, Omit, Types } from 'javascriptutilities';
import * as React from 'react';
import { Component, ComponentType, StatelessComponent } from 'react';
import { getComponentDisplayName } from './util';
import { ReduxType, RootType } from './viewmodel';
export type ViewModelHOCProps<VM> = { readonly viewModel: VM; };
export type ViewModelFactoryHOCProps = { readonly viewModelFactory: unknown; };

export type FactorifiedViewModelHOCProps<Props extends ViewModelHOCProps<any>> =
  Omit<Props, 'viewModel'> & ViewModelFactoryHOCProps;

export type ViewModelHOCHooks = {
  readonly beforeViewModelCreated?: () => void;
};

export type ViewModelHOCOptions<VM, Props extends ViewModelHOCProps<VM>> = {
  readonly viewModelHooks?: ViewModelHOCHooks;
  readonly createViewModel: (props: Omit<Props, 'viewModel'> & ViewModelFactoryHOCProps) => VM;
};

export type TargetViewModelHOCComponent<VM, Props extends ViewModelHOCProps<VM>, State> =
  StatelessComponent<Props & Partial<NeverProp<State>>> |
  ComponentType<Props & Partial<NeverProp<State>>>;

/**
 * This HOC method takes away most of the boilerplate for setting up a component
 * with view model.
 * @template VM View model generics.
 * @template Props Props generics.
 * @template State State generics.
 * @param {TargetViewModelHOCComponent<VM, Props extends ViewModelHOCProps<VM>, State>} targetComponent
 * The base component class that will have its view model injected. This can
 * either be a stateless component, or a class component without state.
 * @param {ViewModelHOCOptions<VM, Props>} options Set up options.
 * @returns {ComponentType<FactorifiedViewModelHOCProps<Props>>}
 * Wrapped component class that accepts a view model factory.
 */
export function withViewModel<VM, Props extends ViewModelHOCProps<VM>, State>(
  targetComponent: TargetViewModelHOCComponent<VM, Props, State>,
  options: ViewModelHOCOptions<VM, Props>,
): ComponentType<FactorifiedViewModelHOCProps<Props>> {
  type PureProps = Omit<Props, 'viewModel'>;
  type WrapperProps = PureProps & ViewModelFactoryHOCProps;
  let { createViewModel, viewModelHooks } = options;
  let displayName = getComponentDisplayName(targetComponent);

  return class ViewModelWrapper extends Component<WrapperProps, State> {
    public static displayName = `${displayName}_ViewModelWrapper`;

    private readonly viewModel: VM;

    public constructor(props: WrapperProps) {
      super(props);

      if (viewModelHooks && viewModelHooks.beforeViewModelCreated) {
        viewModelHooks.beforeViewModelCreated();
      }

      this.viewModel = createViewModel(props);
    }

    public componentDidMount() {
      let { viewModel } = this;

      if (Types.isInstance<RootType>(viewModel, 'initialize')) {
        viewModel.initialize();
      }

      if (Types.isInstance<ReduxType<State>>(viewModel, 'setUpStateCallback')) {
        viewModel.setUpStateCallback(state => this.setState(state));
      }
    }

    public componentWillUnmount() {
      if (Types.isInstance<RootType>(this.viewModel, 'deinitialize')) {
        this.viewModel.deinitialize();
      }
    }

    public render() {
      let actualProps = Object.assign(
        Objects.deleteKeys(this.props, 'viewModelFactory'),
        { viewModel: this.viewModel }, this.state,
      );

      return React.createElement(targetComponent, actualProps as any);
    }
  };
}
