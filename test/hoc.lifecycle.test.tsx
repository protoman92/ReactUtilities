import { mount } from 'enzyme';
import { LifecycleHOCHooks, LifecycleHooksHOCOptions, withLifecycleHooks } from 'hoc.lifecycle';
import * as React from 'react';
import { ReactElement } from 'react';
import { instance, spy, verify } from 'ts-mockito-2';
import { Props, TestComponent, ViewModel } from './testcomponent';

describe('Lifecycle hooks HOC should work correctly', () => {
  let lifecycleHooks: LifecycleHOCHooks;
  let lifecycleOptions: LifecycleHooksHOCOptions;
  let component: ReactElement<Props>;
  let viewModel: ViewModel;

  beforeEach(() => {
    lifecycleHooks = spy({
      onConstruction: () => { },
      componentDidMount: () => { },
      componentWillUnmount: () => { },
    });

    lifecycleOptions = spy({
      lifecycleHooks: instance(lifecycleHooks),
    });

    // tslint:disable-next-line:variable-name
    let HOCTestComponent = withLifecycleHooks(TestComponent, {
      ...instance(lifecycleOptions),
    });

    viewModel = spy(new ViewModel());

    component = <HOCTestComponent index={0}
      viewModel={instance(viewModel)} />;
  });

  it('Wrapping base component class with lifecycle wrapper - should work', () => {
    /// Setup
    let mounted = mount(component);
    mounted.unmount();

    /// When && Then
    verify(lifecycleHooks.onConstruction!()).once();
    verify(lifecycleHooks.componentDidMount!()).once();
    verify(lifecycleHooks.componentWillUnmount!()).once();
  });
});
