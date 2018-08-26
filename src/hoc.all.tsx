import * as React from 'react';
import { ComponentType } from 'react';
import { DistinctPropsHOCOptions, withDistinctProps } from './hoc.distinctprop';
import { LifecycleHooksHOCOptions, withLifecycleHooks } from './hoc.lifecycle';
import { FactorifiedViewModelHOCProps, TargetViewModelHOCComponent, ViewModelHOCOptions, ViewModelHOCProps, withViewModel } from './hoc.viewmodel';

export type CompleteSetupHOCOptions<VM, Props extends ViewModelHOCProps<VM>> =
  DistinctPropsHOCOptions<FactorifiedViewModelHOCProps<Props>> &
  LifecycleHooksHOCOptions &
  ViewModelHOCOptions<VM, Props>;

/**
 * Complete set up for a view model-based component.
 */
export function withCompleteSetup<VM, Props extends ViewModelHOCProps<VM>, State>(
  targetComponent: TargetViewModelHOCComponent<VM, Props, State>,
  options: CompleteSetupHOCOptions<VM, Props>,
): ComponentType<FactorifiedViewModelHOCProps<Props>> {
  // tslint:disable-next-line:variable-name
  let LifecycleWrapped = withLifecycleHooks(targetComponent, options);

  // tslint:disable-next-line:variable-name
  let ViewModelWrapped = withViewModel(LifecycleWrapped, options);

  let ignorePropsKey: keyof DistinctPropsHOCOptions<any> = 'propKeysToIgnore';
  let ignoreKeys: (keyof FactorifiedViewModelHOCProps<Props>)[] = ['viewModelFactory'];
  let distinctOps = Object.assign({}, options, { [ignorePropsKey]: ignoreKeys });

  // tslint:disable-next-line:variable-name
  let DistinctPropWrapped = withDistinctProps(ViewModelWrapped, distinctOps);
  return DistinctPropWrapped;
}

/**
 * Replace complete setup HOC with this function.
 */
export function withTestCompleteSetup<VM, Props extends ViewModelHOCProps<VM>, State>(
  targetComponent: TargetViewModelHOCComponent<VM, Props, State>,
  _options: CompleteSetupHOCOptions<VM, Props>,
): ComponentType<FactorifiedViewModelHOCProps<Props>> {
  return function Wrapper(_props: FactorifiedViewModelHOCProps<Props>) {
    return React.createElement(targetComponent);
  };
}
