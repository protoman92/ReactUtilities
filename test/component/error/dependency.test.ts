import { ErrorDisplay } from './../../../src/component';
import { Numbers } from 'javascriptutilities';
import { Strings } from 'javascriptutilities/dist/src/string';
import { ReduxStore } from 'reactiveredux-js';

describe('Error view model should be implemented correctly', () => {
  let constants: ErrorDisplay.Dependency.Constants.Type = { displayDuration: 0 };

  let testErrorViewModel = (viewModel: ErrorDisplay.Dependency.ViewModel.Type) => {
    /// Setup
    let times = 1000;
    
    let errors = Numbers.range(0, times)
      .map(() => new Error(Strings.randomString(10)));

    var errorResults: Error[] = [];

    viewModel.operationErrorStream()
      .mapNonNilOrEmpty(v => v)
      .doOnNext(v => errorResults.push(v))
      .subscribe();

    /// When
    for (let error of errors) {
      viewModel.operationErrorTrigger().next(error);
    }

    /// Then
    expect(errorResults).toEqual(errors);
  };

  it('Dispatch error view model should work correctly', () => {
    /// Setup
    let action = ErrorDisplay.Dispatch.Action.createDefault();
    let reducer = ErrorDisplay.Dispatch.Reducer.createDefault();
    let store = new ReduxStore.Dispatch.Self();

    let provider: ErrorDisplay.Dispatch.Provider.Type = {
      action: { error: action },
      constants: { error: constants },
      store,
      substateSeparator: '.',
    };

    let viewModel = new ErrorDisplay.Dispatch.ViewModel.Self(provider);
    
    /// When
    store.initialize(reducer);

    /// Then
    testErrorViewModel(viewModel);
  });

  it('Rx error view model should work correctly', () => {
    /// Setup
    let action = ErrorDisplay.Rx.Action.createDefault();
    let actionProvider: ErrorDisplay.Rx.Action.ProviderType = { error: action };
    let reducer = ErrorDisplay.Rx.Reducer.createDefault(actionProvider);
    let store = new ReduxStore.Rx.Self(reducer);

    let provider: ErrorDisplay.Rx.Provider.Type = {
      action: actionProvider,
      constants: { error: constants },
      store,
      substateSeparator: '.',
    };

    let viewModel = new ErrorDisplay.Rx.ViewModel.Self(provider);

    /// When & Then
    testErrorViewModel(viewModel);
  });
});