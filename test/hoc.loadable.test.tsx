import { mount } from 'enzyme';
import { LoadableHOCOptions, LoadableHooks, withLoadable } from 'hoc.loadable';
import * as React from 'react';
import { ReactElement } from 'react';
import { anything, instance, spy, verify } from 'ts-mockito-2';
import { Props, ViewModel } from './testcomponent';

describe('Lifecycle hooks HOC should work correctly', () => {
  let loadableHooks: LoadableHooks;
  let loadableOptions: LoadableHOCOptions<Props, {}>;
  let component: ReactElement<Props>;
  let viewModel: ViewModel;

  beforeEach(() => {
    loadableHooks = spy({
      beforeComponentLoaded: () => { },
    });

    loadableOptions = spy({
      hooks: instance(loadableHooks),
      loader: () => import('./testcomponent').then(comp => comp.TestComponent),
      // tslint:disable-next-line:no-null-keyword
      loading: () => null,
    });

    // tslint:disable-next-line:variable-name
    let HOCTestComponent = withLoadable({
      ...instance(loadableOptions),
    });

    viewModel = spy(new ViewModel());

    component = <HOCTestComponent index={0}
      viewModel={instance(viewModel)} />;
  });

  it('Wrapping base component class with lifecycle wrapper - should work', done => {
    /// Setup
    let mounted = mount(component);

    /// When && Then
    setTimeout(() => {
      verify(loadableHooks.beforeComponentLoaded!()).once();
      mounted.unmount();
      done();
    }, 500);
  }, 1000);
});
