import {NeverProp, Objects, Omit} from 'javascriptutilities';
import * as React from 'react';
import {Component, ComponentType, StatelessComponent} from 'react';
import {Observable, Subscription} from 'rxjs';
import {getComponentDisplayName} from './util';
export type DependencyHOCProps<Depn> = Readonly<{dependency: Depn}>;
export type DependencyFactoryHOCProps = Readonly<{dependencyFactory: unknown}>;

export type FactorifiedDependencyHOCProps<
  Props extends DependencyHOCProps<any>
> = Omit<Props, 'dependency'> & DependencyFactoryHOCProps;

export type DependencyHOCHooks = Readonly<{
  beforeDependencyCreated?: () => void;
}>;

export type DependencyHOCOptions<
  Depn,
  Props extends DependencyHOCProps<Depn>
> = Readonly<{
  dependencyHooks?: DependencyHOCHooks;
  createDependency: (
    props: Omit<Props, 'dependency'> & DependencyFactoryHOCProps
  ) => Depn;
}>;

export type TargetDependencyHOCComponent<
  Depn,
  Props extends DependencyHOCProps<Depn>,
  State
> =
  | StatelessComponent<Props & Partial<NeverProp<State>>>
  | ComponentType<Props & Partial<NeverProp<State>>>;

/**
 * This HOC method takes away most of the boilerplate for setting up a component
 * with dependency. A dependency handles interactions and state mapping for a
 * component.
 * @template State State generics.
 * @template Dependency Dependency generics.
 * @template Props Props generics.
 */
export function withDependency<
  State,
  Dependency extends Readonly<{
    performCleanUp: () => void;
    stateStream: Observable<State>;
  }>,
  Props extends DependencyHOCProps<Dependency>
>(
  options: DependencyHOCOptions<Dependency, Props>
): (
  targetComponent: TargetDependencyHOCComponent<Dependency, Props, State>
) => ComponentType<FactorifiedDependencyHOCProps<Props>> {
  return targetComponent => {
    type PureProps = Omit<Props, 'dependency'>;
    type WrapperProps = PureProps & DependencyFactoryHOCProps;
    let {createDependency, dependencyHooks} = options;
    let displayName = getComponentDisplayName(targetComponent);

    return class DependencyWrapper extends Component<WrapperProps, State> {
      public static displayName = `${displayName}_DependencyWrapper`;

      private readonly dependency: Dependency;
      private readonly subscription?: Subscription;

      public constructor(props: WrapperProps) {
        super(props);

        if (dependencyHooks && dependencyHooks.beforeDependencyCreated) {
          dependencyHooks.beforeDependencyCreated();
        }

        let dependency = createDependency(props);
        this.dependency = dependency;

        /* istanbul ignore else  */
        if (dependency.stateStream) {
          this.subscription = new Subscription();
        }
      }

      public componentDidMount() {
        let {dependency, subscription} = this;

        /* istanbul ignore else  */
        if (dependency.stateStream && subscription) {
          subscription.add(
            dependency.stateStream.subscribe(s => this.setState(s))
          );
        }
      }

      public componentWillUnmount() {
        /* istanbul ignore else  */
        if (this.dependency.performCleanUp) {
          this.dependency.performCleanUp();
        }

        /* istanbul ignore else  */
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
      }

      public render() {
        let actualProps = Object.assign(
          Objects.deleteKeys(this.props, 'dependencyFactory'),
          {dependency: this.dependency},
          this.state
        );

        return React.createElement(targetComponent, actualProps as any);
      }
    };
  };
}
