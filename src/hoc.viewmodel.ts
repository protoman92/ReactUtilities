import { Nullable, NullableKV, Objects, Omit, Types } from 'javascriptutilities';
import * as React from 'react';
import { Component, ComponentType, ReactNode, StatelessComponent } from 'react';
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
  readonly filterPropDuplicates: boolean;
  readonly propKeysForComparison?: (keyof Omit<Props, 'viewModel'>)[];
  readonly checkEquality?: (obj1: unknown, obj2: unknown) => boolean;
  readonly createViewModel: (props: Omit<Props, 'viewModel'> & ViewModelFactoryHOCProps) => VM;
};

export type TargetViewModelHOCComponent<VM, Props extends ViewModelHOCProps<VM>, State> =
  StatelessComponent<Props & Partial<NullableKV<State>>> |
  ComponentType<Props & Partial<NullableKV<State>>>;

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
  type StoredWrapperProps = Readonly<WrapperProps> & Readonly<{ children?: ReactNode }>;
  let {
    createViewModel,
    viewModelHooks,
    filterPropDuplicates,
    propKeysForComparison,
    checkEquality,
  } = options;

  return class Wrapper extends Component<WrapperProps, State> {
    private readonly viewModel: VM;
    private readonly shouldUpdate: (
      currentProps: StoredWrapperProps,
      nextProps: WrapperProps,
      currentState: Nullable<State>,
      nextState: Nullable<State>,
    ) => boolean;

    public constructor(props: WrapperProps) {
      super(props);

      if (viewModelHooks && viewModelHooks.beforeViewModelCreated) {
        viewModelHooks.beforeViewModelCreated();
      }

      this.viewModel = createViewModel(props);
      let equalityFunction = checkEquality || ((o1, o2) => o1 === o2);

      if (filterPropDuplicates) {
        let keys: (keyof PureProps)[];

        if (propKeysForComparison instanceof Array) {
          keys = propKeysForComparison;
        } else {
          let pureProps = Objects.deleteKeys(props, 'viewModelFactory');
          keys = Object.keys(pureProps) as (keyof PureProps)[];
        }

        this.shouldUpdate = (p1, p2, s1, s2) => {
          for (let key of keys) {
            if (!equalityFunction(p1[key], p2[key])) {
              return true;
            }
          }

          return !equalityFunction(s1, s2);
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

    public shouldComponentUpdate(nextProps: WrapperProps, nextState: State) {
      return this.shouldUpdate(this.props, nextProps, this.state, nextState);
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
