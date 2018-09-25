import {mount} from 'enzyme';
import {
  LoadableHOCHooks,
  LoadableHOCOptions,
  withLoadable,
  withTestLoadable,
} from 'hoc.loadable';
import * as React from 'react';
import {ReactElement} from 'react';
import {instance, spy, verify} from 'ts-mockito-2';
import {ViewModel, ViewModelProps} from './testcomponent';

describe('Lifecycle hooks HOC should work correctly', () => {
  let loadableHooks: LoadableHOCHooks;
  let loadableOptions: LoadableHOCOptions<ViewModelProps, {}>;
  let component: ReactElement<ViewModelProps>;
  let viewModel: ViewModel;

  beforeEach(() => {
    loadableHooks = spy<LoadableHOCHooks>({
      beforeComponentLoaded: () => {},
    });

    loadableOptions = spy<LoadableHOCOptions<ViewModelProps, {}>>({
      hooks: instance(loadableHooks),
      loader: () =>
        import('./testcomponent').then(comp => comp.ViewModelTestComponent),
      // tslint:disable-next-line:no-null-keyword
      loading: () => null,
    });

    // tslint:disable-next-line:variable-name
    let HOCTestComponent = withLoadable({
      ...instance(loadableOptions),
    });

    viewModel = spy<ViewModel>(new ViewModel());
    component = <HOCTestComponent index={0} viewModel={instance(viewModel)} />;
  });

  it(
    'Wrapping base component class with lifecycle wrapper - should work',
    done => {
      /// Setup
      let mounted = mount(component);

      /// When && Then
      setTimeout(() => {
        verify(loadableHooks.beforeComponentLoaded!()).once();
        mounted.unmount();
        done();
      }, 500);
    },
    1000
  );
});

describe('Test lifecycle hooks HOC should work correctly', () => {
  let loadableHooks: LoadableHOCHooks;
  let loadableOptions: LoadableHOCOptions<ViewModelProps, {}>;
  let component: ReactElement<ViewModelProps>;
  let viewModel: ViewModel;

  beforeEach(() => {
    loadableHooks = spy<LoadableHOCHooks>({
      beforeComponentLoaded: () => {},
    });

    loadableOptions = spy<LoadableHOCOptions<ViewModelProps, {}>>({
      hooks: instance(loadableHooks),
      loader: () =>
        import('./testcomponent').then(comp => comp.ViewModelTestComponent),
      // tslint:disable-next-line:no-null-keyword
      loading: () => null,
    });

    // tslint:disable-next-line:variable-name
    let HOCTestComponent = withTestLoadable({
      ...instance(loadableOptions),
    });

    viewModel = spy<ViewModel>(new ViewModel());
    component = <HOCTestComponent index={0} viewModel={instance(viewModel)} />;
  });

  it('Wrapping base component class with lifecycle wrapper - should work', () => {
    /// Setup
    let mounted = mount(component);

    /// When && Then
    expect(mounted.find('div')).toHaveLength(1);
    verify(loadableHooks.beforeComponentLoaded!()).once();
    mounted.unmount();
  });
});
