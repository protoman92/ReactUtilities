import {mount} from 'enzyme';
import {withDistinctProps} from 'hoc.distinctprop';
import {NeverProp, Numbers} from 'javascriptutilities';
import * as React from 'react';
import {ReactElement} from 'react';
import {anything, instance, spy, verify} from 'ts-mockito-2';
import {
  State,
  ViewModel,
  ViewModelProps,
  ViewModelTestComponent,
} from './testcomponent';

describe('Distinct props HOC should work correctly', () => {
  let component: ReactElement<ViewModelProps & Partial<NeverProp<State>>>;
  let viewModel: ViewModel;

  // tslint:disable-next-line:variable-name
  let HOCTestComponent;

  beforeEach(() => {
    HOCTestComponent = withDistinctProps(ViewModelTestComponent, {
      propKeysForComparison: ['index', 'a', 'callback'],
      checkEquality: require('deep-equal'),
    });

    viewModel = spy(new ViewModel());
    component = (
      <HOCTestComponent
        index={-1}
        callback={() => {}}
        viewModel={instance(viewModel)}
      />
    );
  });

  it('Wrapping base component class with distinct prop wrapper - should work', () => {
    /// Setup
    let times = 1000;
    let mounted = mount(component);

    /// When
    Numbers.range(0, times).forEach(iter => mounted.setProps({index: iter}));
    Numbers.range(0, times).forEach(iter => mounted.setProps({a: iter}));
    Numbers.range(0, times).forEach(iter => mounted.setProps({b: iter}));

    Numbers.range(0, times).forEach(iter => {
      mounted.setProps({callback: () => console.log(iter)});
    });

    /// Then
    verify(viewModel.transformState(anything())).times(times * 2 + 1);
  });

  it('Wrapping base component class with no specified prop keys - should use all keys', () => {
    /// Setup
    let times = 1000;

    HOCTestComponent = withDistinctProps(ViewModelTestComponent, {
      checkEquality: require('deep-equal'),
    });

    component = (
      <HOCTestComponent
        index={-1}
        a={-1}
        b={-1}
        callback={() => {}}
        viewModel={instance(viewModel)}
      />
    );

    let mounted = mount(component);

    /// When
    Numbers.range(0, times).forEach(iter => mounted.setProps({index: iter}));
    Numbers.range(0, times).forEach(iter => mounted.setProps({a: iter}));
    Numbers.range(0, times).forEach(iter => mounted.setProps({b: iter}));

    Numbers.range(0, times).forEach(iter => {
      mounted.setProps({callback: () => console.log(iter)});
    });

    /// Then
    verify(viewModel.transformState(anything())).times(times * 3 + 1);
  });

  it('Ignoring prop keys - should not use said keys for comparison', () => {
    /// Setup
    let times = 1000;

    HOCTestComponent = withDistinctProps(ViewModelTestComponent, {
      propKeysForComparison: ['a', 'b', 'index'],
      propKeysToIgnore: ['b'],
      checkEquality: require('deep-equal'),
    });

    component = (
      <HOCTestComponent
        index={-1}
        a={-1}
        b={-1}
        callback={() => {}}
        viewModel={instance(viewModel)}
      />
    );

    let mounted = mount(component);

    /// When
    Numbers.range(0, times).forEach(iter => mounted.setProps({index: iter}));
    Numbers.range(0, times).forEach(iter => mounted.setProps({a: iter}));
    Numbers.range(0, times).forEach(iter => mounted.setProps({b: iter}));

    /// Then
    verify(viewModel.transformState(anything())).times(times * 2 + 1);
  });
});
