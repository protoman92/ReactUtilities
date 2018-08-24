import { Objects, Omit, Types, NullableKV } from 'javascriptutilities';
import * as React from 'react';
import { Component, ComponentClass } from 'react';
import { ReduxType, RootType } from './viewmodel';
export type ViewModelHOCProps<VM> = { readonly viewModel: VM; };
export type ViewModelFactoryHOCProps = { readonly viewModelFactory: unknown; };

export type ViewModelHOCOptions<VM, Props extends ViewModelHOCProps<VM>> = {
  readonly checkEqualProps?: (p1: Omit<Props, 'viewModel'>, p2: Omit<Props, 'viewModel'>) => boolean;
  readonly createViewModel: (props: Omit<Props, 'viewModel'> & ViewModelFactoryHOCProps) => VM;
};

/**
 * This HOC method takes away most of the boilerplate for setting up a component
 * with view model.
 * @template VM View model generics.
 * @template Props Props generics.
 * @template State State generics.
 * @param {(ComponentClass<Props & NullableKV<State>, never>)} targetComponent
 * The pure component class that will have its view model injected. Notice that
 * we do not accept any state here; state will be injected as props.
 * @param {ViewModelHOCOptions<VM, Props>} options Set up options.
 * @returns {ComponentClass<Omit<Props, 'viewModel'> & ViewModelFactoryHOCProps, State>}
 * Wrapped component class that accepts a view model factory.
 */
export function withViewModel<VM, Props extends ViewModelHOCProps<VM>, State>(
  targetComponent: ComponentClass<Props & NullableKV<State>, never>,
  options: ViewModelHOCOptions<VM, Props>,
): ComponentClass<Omit<Props, 'viewModel'> & ViewModelFactoryHOCProps, State> {
  type PureProps = Omit<Props, 'viewModel'>;
  type WrapperProps = PureProps & ViewModelFactoryHOCProps;

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

    public shouldComponentUpdate(nextProps: WrapperProps) {
      if (options.checkEqualProps) {
        let currentProps = Objects.deleteKeys(this.props, 'children', 'viewModelFactory');
        let nextProps2 = Objects.deleteKeys(nextProps, 'viewModelFactory');
        return !options.checkEqualProps(currentProps as any, nextProps2 as any);
      } else {
        return true;
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
