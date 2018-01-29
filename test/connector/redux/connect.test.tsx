import * as React from 'react';
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { ReactWrapper, HTMLAttributes } from 'enzyme';
import { Numbers, Strings } from 'javascriptutilities';
import { State } from 'type-safe-state-js';
import { App, Scrap } from './component';
import * as Dependency from './dependency';

describe('Connect component with state - should work', () => {
  let provider: Dependency.Provider;
  let appProps: App.PropType;
  let appViewModel: App.ViewModel;
  let renderedApp: ReactWrapper<App.PropType, State.Self<any>>;
  let renderedScrap: ReactWrapper<HTMLAttributes, State.Self<string>>;

  let getScrapText = (): string => {
    return renderedScrap.text();
  };

  beforeEach(() => {
    enzyme.configure({ adapter: new Adapter() });
    provider = Dependency.createProvider();
    appViewModel = new App.ViewModel(provider);
    appProps = { viewModel: appViewModel, wrappedState: State.empty() };
    renderedApp = enzyme.mount(<App.Component {...appProps}/>);
    renderedScrap = renderedApp.find(Scrap.classNameD);
  });

  it('Update state value - should update connected component value', () => {
    /// Setup
    let times = 1000;

    /// When
    for (let _i of Numbers.range(0, times)) {
      let randomValue = Strings.randomString(5);
      provider.action.scrapValueTrigger.next(randomValue);
      let componentValue = getScrapText();

      /// Then
      expect(randomValue).toBe(componentValue);
    }

    /// Then
    // Does not matter how many times Scrap is re-rendered, the main component
    // should only render once. This shows that the wrapping is done correctly.
    expect(appViewModel.renderCount).toBe(1);
  });
});