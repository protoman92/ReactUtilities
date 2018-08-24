import { Objects, Omit, Types } from 'javascriptutilities';
import * as React from 'react';
import { Component, ComponentClass } from 'react';
import { ReduxType, RootType } from './viewmodel';
type ViewModelProps<Props, VM> = Props & { readonly viewModel: VM; };
type VMFactoryProps = { readonly viewModelFactory: unknown; };
type WrapperProps<VM, Props> = Omit<ViewModelProps<Props, VM>, 'viewModel'> & VMFactoryProps;

/**
 * This HOC method takes away most of the boilerplate for setting up a component
 * with view model.
 * @template VM View model generics.
 * @template Props Props generics.
 * @template State State generics.
 * @param {(ComponentClass<ViewModelProps<Props, VM> & State, never>)} type
 * The pure component class that will have its view model injected. Notice that
 * we do not accept any state here; state will be injected as props.
 * @param {{
 *     readonly createViewModel: (options: WrapperProps<VM, Props>) => VM;
 *   }} options Set up options.
 * @returns {ComponentClass<WrapperProps<VM, Props>, State>} Wrapped component
 * class that accepts a view model factory.
 */
export function withViewModel<VM, Props, State>(
  type: ComponentClass<ViewModelProps<Props, VM> & State, never>,
  options: {
    readonly createViewModel: (options: WrapperProps<VM, Props>) => VM;
  },
): ComponentClass<WrapperProps<VM, Props>, State> {
  return class Wrapped extends Component<WrapperProps<VM, Props>, State> {
    private readonly viewModel: VM;

    public constructor(props: WrapperProps<VM, Props>) {
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
      let actualProps: Props = Object.assign(
        Objects.deleteKeys(this.props, 'viewModelFactory'),
        { viewModel: this.viewModel }, this.state,
      ) as any;

      return React.createElement(type, actualProps);
    }
  };
}
