import { shallow } from 'enzyme';
import { CompleteSetupHOCOptions, LifecycleHooks, withCompleteSetup } from 'hoc.all';
import * as React from 'react';
import { ReactElement } from 'react';
import { instance, spy, verify } from 'ts-mockito-2';
import { Props, State, TestComponent, ViewModel } from './testcomponent';
let deepEqual = require('deep-equal');

describe('Complete HOC should work correctly', () => {
  let lifecycleHooks: LifecycleHooks;
  let completeOptions: CompleteSetupHOCOptions;

  let component: ReactElement<Props>;
  let viewModel: ViewModel;

  beforeEach(() => {
    lifecycleHooks = spy({
      componentDidMount: () => { },
      componentWillUnmount: () => { },
    });

    completeOptions = spy({
      lifecycleHooks: instance(lifecycleHooks),
      loadExtensions: () => { },
    });

    // tslint:disable-next-line:variable-name
    let HOCTestComponent = withCompleteSetup<ViewModel, Props, State>(TestComponent, {
      ...instance(completeOptions),
      filterPropDuplicates: true,
      checkEquality: deepEqual,
      createViewModel: props => (props.viewModelFactory as any)(),
    });

    viewModel = spy(new ViewModel());

    component = <HOCTestComponent index={0}
      viewModelFactory={() => instance(viewModel)} />;
  });

  it('Wrapping base component class with complete wrapper - should work', () => {
    /// Setup
    let shallowed = shallow(component);
    shallowed.unmount();

    /// When && Then
    verify(lifecycleHooks.componentDidMount!()).once();
    verify(lifecycleHooks.componentWillUnmount!()).once();
    verify(completeOptions.loadExtensions()).once();
  });
});
