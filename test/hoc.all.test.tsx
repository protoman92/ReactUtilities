import { mount, shallow } from 'enzyme';
import { CompleteSetupHOCOptions, withCompleteSetup, withTestCompleteSetup } from 'hoc.all';
import { LifecycleHOCHooks } from 'hoc.lifecycle';
import * as React from 'react';
import { ReactElement } from 'react';
import { anything, instance, mock, spy, verify } from 'ts-mockito-2';
import { Props, State, TestComponent, ViewModel } from './testcomponent';
let deepEqual = require('deep-equal');

describe('Complete HOC should work correctly', () => {
  let lifecycleHooks: LifecycleHOCHooks;
  let completeOptions: CompleteSetupHOCOptions<ViewModel, Props>;
  let component: ReactElement<Props>;
  let viewModel: ViewModel;

  beforeEach(() => {
    viewModel = mock(ViewModel);

    lifecycleHooks = spy({
      onConstruction: () => { },
      componentDidMount: () => { },
      componentWillUnmount: () => { },
    });

    completeOptions = spy<CompleteSetupHOCOptions<ViewModel, Props>>({
      lifecycleHooks: instance(lifecycleHooks),
      filterPropDuplicates: false,
      checkEquality: deepEqual,
      createViewModel: props => (props.viewModelFactory as any)(),
    });

    // tslint:disable-next-line:variable-name
    let HOCTestComponent = withCompleteSetup<ViewModel, Props, State>(TestComponent, {
      ...instance(completeOptions),
      filterPropDuplicates: true,
      checkEquality: deepEqual,
      createViewModel: props => (props.viewModelFactory as any)(),
    });

    component = <HOCTestComponent index={0}
      viewModelFactory={() => instance(viewModel)} />;
  });

  it('Wrapping base component class with complete wrapper - should work', () => {
    /// Setup
    let mounted = mount(component);
    mounted.unmount();

    /// When && Then
    verify(viewModel.initialize()).once();
    verify(viewModel.deinitialize()).once();
    verify(viewModel.setUpStateCallback(anything())).once();
    verify(lifecycleHooks.onConstruction!()).once();
    verify(lifecycleHooks.componentDidMount!()).once();
    verify(lifecycleHooks.componentWillUnmount!()).once();
  });
});

describe('Test complete HOC should work correctly', () => {
  let component: ReactElement<Props>;
  let viewModel: ViewModel;

  beforeEach(() => {
    viewModel = mock(ViewModel);

    // tslint:disable-next-line:variable-name
    let HOCTestComponent = withTestCompleteSetup
      <ViewModel, Props, State>(TestComponent, {} as any);

    component = <HOCTestComponent index={0}
      viewModelFactory={() => instance(viewModel)} />;
  });

  it('Wrapping base component class with complete wrapper - should work', () => {
    /// Setup
    let shallowed = shallow(component);

    /// When && Then
    expect(shallowed.find(TestComponent)).toHaveLength(1);
    shallowed.unmount();
  });
});
