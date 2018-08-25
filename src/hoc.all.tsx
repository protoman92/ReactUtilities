import { NullableKV, Omit } from 'javascriptutilities';
import { ComponentClass, StatelessComponent } from 'react';
import { LifecycleHooksHOCOptions, withLifecycleHooks } from './hoc.lifecycle';
import { ViewModelFactoryHOCProps, ViewModelHOCOptions, ViewModelHOCProps, withViewModel } from './hoc.viewmodel';

export type CompleteSetupHOCOptions<VM, Props extends ViewModelHOCProps<VM>> =
  LifecycleHooksHOCOptions &
  ViewModelHOCOptions<VM, Props>;

/**
 * Complete set up for a view model-based component.
 */
export function withCompleteSetup<VM, Props extends ViewModelHOCProps<VM>, State>(
  targetComponent:
    StatelessComponent<Props & NullableKV<State>> |
    ComponentClass<Props & NullableKV<State>, never>,
  options: CompleteSetupHOCOptions<VM, Props>,
): ComponentClass<Omit<Props, 'viewModel'> & ViewModelFactoryHOCProps, State> {
  // tslint:disable-next-line:variable-name
  let ViewModelHOC = withViewModel<VM, Props, State>(targetComponent, options);
  return withLifecycleHooks(ViewModelHOC, options);
}
