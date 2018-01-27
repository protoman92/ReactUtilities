import { Observable } from 'rxjs'; 
import { Numbers } from 'javascriptutilities';
import { Strings } from 'javascriptutilities/dist/src/string';
import { ReduxStore } from 'reactiveredux-js';
import { ErrorDisplay } from './../../../src/component';

let timeout = 1000;

describe('Error view model should be implemented correctly', () => {
  let constants: ErrorDisplay.Base.Constants.Type = { displayDuration: 0 };

  let testErrorViewModel = (viewModel: ErrorDisplay.Base.ViewModel.DisplayType, done: Function) => {
    /// Setup
    let waitTime = 0.1;
    let times = 100;
    
    let errors = Numbers.range(0, times)
      .map(() => new Error(Strings.randomString(10)));

    var nullables: undefined[] = [];
    var errorResults: Error[] = [];
    let trigger = viewModel.operationErrorTrigger();

    viewModel.operationErrorStream()
      .doOnNext(v => v.value === undefined ? nullables.push(undefined) : {})
      .mapNonNilOrEmpty(v => v)
      .doOnNext(v => errorResults.push(v))
      .subscribe();

    // Also need to test that the view model automatically deletes the error
    // from global stream.
    viewModel.initialize();

    /// When
    Observable.from(errors)
      .flatMap((v, i) => Observable.of(v)
        .delay(i * waitTime)
        .doOnNext(v1 => trigger.next(v1)))
      .toArray().delay(waitTime)
      .doOnNext(() => {
        expect(errorResults).toEqual(errors);
        expect(nullables.length).toBe(times + 1);
      })
      .doOnCompleted(() => done())
      .subscribe();
  };

  it('Dispatch error view model should work correctly', done => {
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
    testErrorViewModel(viewModel, done);
  }, timeout);

  it('Rx error view model should work correctly', done => {
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
    testErrorViewModel(viewModel, done);
  }, timeout);
});