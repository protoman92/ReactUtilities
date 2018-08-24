import { Objects, Omit, Types } from 'javascriptutilities';
import * as React from 'react';
import { Component, ComponentClass } from 'react';
import { ReduxType, RootType } from './viewmodel';
type ViewModelProps<VM> = { readonly viewModel: VM; };
type FactoryProps = { readonly viewModelFactory: unknown; };

/**
 * This HOC method takes away most of the boilerplate for setting up a component
 * with view model.
 * @template VM View model generics.
 * @template Props Props generics.
 * @template State State generics.
 * @param {(ComponentClass<Props & State, never>)} targetComponent The pure
 * component class that will have its view model injected. Notice that we do
 * not accept any state here; state will be injected as props.
 * @param {{
 *     readonly createViewModel: (options: WrapperProps<VM, Props>) => VM;
 *   }} options Set up options.
 * @returns {ComponentClass<Omit<Props, 'viewModel'> & FactoryProps, State>}
 * Wrapped component class that accepts a view model factory.
 */
export function withViewModel<VM, Props extends ViewModelProps<VM>, State>(
  targetComponent: ComponentClass<Props & State, never>,
  options: {
    readonly createViewModel: (props: Omit<Props, 'viewModel'> & FactoryProps) => VM;
  },
): ComponentClass<Omit<Props, 'viewModel'> & FactoryProps, State> {
  type WrapperProps = Omit<Props, 'viewModel'> & FactoryProps;

  return class Wrapped extends Component<WrapperProps, State> {
    private readonly viewModel: VM;

    public constructor(props: WrapperProps) {
      super(props);
      this.viewModel = options.createViewModel(props);
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
