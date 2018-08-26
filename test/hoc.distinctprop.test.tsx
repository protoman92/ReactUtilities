import { mount } from 'enzyme';
import { withDistinctProps } from 'hoc.distinctprop';
import { NullableKV, Numbers } from 'javascriptutilities';
import * as React from 'react';
import { ReactElement } from 'react';
import { anything, instance, spy, verify } from 'ts-mockito-2';
import { Props, State, TestComponent, ViewModel } from './testcomponent';

describe('Distinct props HOC should work correctly', () => {
  let component: ReactElement<Props & Partial<NullableKV<State>>>;
  let viewModel: ViewModel;

  beforeEach(() => {
    // tslint:disable-next-line:variable-name
    let HOCTestComponent = withDistinctProps(TestComponent, {
      propKeysForComparison: ['index', 'a'],
      checkEquality: require('deep-equal'),
    });

    viewModel = spy(new ViewModel());
    component = <HOCTestComponent index={0} viewModel={instance(viewModel)} />;
  });

  it('Wrapping base component class with distinct prop wrapper - should work', () => {
    /// Setup
    let times = 1000;
    let mounted = mount(component);

    /// When
    Numbers.range(0, times).forEach(iter => {
      mounted.setProps({ index: iter });
    });

    Numbers.range(0, times).forEach(iter => {
      mounted.setProps({ a: iter });
    });

    Numbers.range(0, times).forEach(iter => {
      mounted.setProps({ b: iter });
    });

    /// Then
    verify(viewModel.transformState(anything())).times(times * 2);
  });
});
