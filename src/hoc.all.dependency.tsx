import {ComponentType} from 'react';
import {
  BasicDependency,
  DependencyHOCOptions,
  DependencyHOCProps,
  FactorifiedDependencyHOCProps,
  TargetDependencyHOCComponent,
  withDependency,
} from './hoc.dependency';
import {DistinctPropsHOCOptions, withDistinctProps} from './hoc.distinctprop';
import {LifecycleHooksHOCOptions, withLifecycleHooks} from './hoc.lifecycle';

export type CompleteDependencySetupHOCOptions<
  Dependency,
  Props extends DependencyHOCProps<Dependency>
> = DistinctPropsHOCOptions<FactorifiedDependencyHOCProps<Props>> &
  LifecycleHooksHOCOptions &
  DependencyHOCOptions<Dependency, Props>;

/**
 * Complete set up for a dependency-based component.
 */
export function withCompleteDependencySetup<
  State,
  Dependency extends BasicDependency<State>,
  Props extends DependencyHOCProps<Dependency>
>(
  targetComponent: TargetDependencyHOCComponent<Dependency, Props, State>,
  options: CompleteDependencySetupHOCOptions<Dependency, Props>
): ComponentType<FactorifiedDependencyHOCProps<Props>> {
  // tslint:disable-next-line:variable-name
  let LifecycleWrapped = withLifecycleHooks(targetComponent, options);

  // tslint:disable-next-line:variable-name
  let DependencyWrapped = withDependency<State, Dependency, Props>(
    LifecycleWrapped,
    options
  );

  let ignorePropsKey: keyof DistinctPropsHOCOptions<any> = 'propKeysToIgnore';
  let ignoreKeys: (keyof FactorifiedDependencyHOCProps<Props>)[] = [
    'dependencyFactory',
  ];
  let distinctOps = Object.assign({}, options, {[ignorePropsKey]: ignoreKeys});

  // tslint:disable-next-line:variable-name
  let DistinctPropWrapped = withDistinctProps(DependencyWrapped, distinctOps);
  return DistinctPropWrapped;
}
