import { Objects, Omit, Types, NullableKV } from 'javascriptutilities';
import * as React from 'react';
import { Component, ComponentClass, ReactNode } from 'react';
import { ReduxType, RootType } from './viewmodel';
export type ViewModelHOCProps<VM> = { readonly viewModel: VM; };
export type ViewModelFactoryHOCProps = { readonly viewModelFactory: unknown; };

export type ViewModelHOCOptions<VM, Props extends ViewModelHOCProps<VM>> = {
  readonly checkEqualProps?:
  ((p1: Omit<Props, 'viewModel'>, p2: Omit<Props, 'viewModel'>) => boolean) |
  (keyof Omit<Props, 'viewModel'>)[];
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
  type StoredWrapperProps = Readonly<WrapperProps> & Readonly<{ children?: ReactNode }>;
  type PropsEqualFunc = (p1: Readonly<PureProps>, p2: Readonly<PureProps>) => boolean;

  return class Wrapped extends Component<WrapperProps, State> {
    private readonly viewModel: VM;
    private readonly shouldUpdate: (p1: StoredWrapperProps, p2: WrapperProps) => boolean;

    public constructor(props: WrapperProps) {
      super(props);
      this.viewModel = options.createViewModel(props);

      if (options.checkEqualProps instanceof Function) {
        let checkEqual: PropsEqualFunc = options.checkEqualProps;

        this.shouldUpdate = (p1, p2) => {
          let currentProps = Objects.deleteKeys(p1, 'children', 'viewModelFactory');
          let nextProps2 = Objects.deleteKeys(p2, 'viewModelFactory');
          return !checkEqual(currentProps as any, nextProps2 as any);
        };
      } else if (options.checkEqualProps instanceof Array) {
        let keys: (keyof PureProps)[] = options.checkEqualProps;

        this.shouldUpdate = (p1, p2) => {
          for (let key of keys) {
            if (p1[key] !== p2[key]) {
              return true;
            }
          }

          return false;
        };
      } else {
        this.shouldUpdate = () => true;
      }
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
      return this.shouldUpdate(this.props, nextProps);
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
