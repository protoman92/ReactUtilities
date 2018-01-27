import { Observable } from 'rxjs'; 
import { Numbers } from 'javascriptutilities';
import { Strings } from 'javascriptutilities/dist/src/string';
import { ReduxStore } from 'reactiveredux-js';
import { Progress } from './../../../src/data';
import { ProgressDisplay } from './../../../src/component';

let timeout = 1000;

describe('Progress view model should be implemented correctly', () => {
  let testProgressViewModel = (viewModel: ProgressDisplay.Base.ViewModel.DisplayType, done: Function) => {
    /// Setup
    let waitTime = 0.1;
    let times = 100;
    
    let progressItems: Progress.Type[] = Numbers.range(0, times)
      .map(() => ({ description: Strings.randomString(10) }));

    var progressResults: Progress.Type[] = [];
    let trigger = viewModel.progressDisplayTrigger();

    viewModel.progressDisplayStream()
      .mapNonNilOrEmpty(v => v)
      .map(v => v as Progress.Type)
      .doOnNext(v => progressResults.push(v))
      .subscribe();

    /// When
    Observable.from(progressItems)
      .flatMap((v, i) => Observable.of(v)
        .delay(i * waitTime)
        .doOnNext(v1 => trigger.next(v1)))
      .toArray().delay(waitTime)
      .doOnNext(() => expect(progressResults).toEqual(progressItems))
      .doOnCompleted(() => done())
      .subscribe();
  };

  it('Dispatch progress view model should work correctly', done => {
    /// Setup
    let action = ProgressDisplay.Dispatch.Action.createDefault();
    let reducer = ProgressDisplay.Dispatch.Reducer.createDefault();
    let store = new ReduxStore.Dispatch.Self();

    let provider: ProgressDisplay.Dispatch.Provider.Type = {
      action: { progress: action },
      store,
      substateSeparator: '.',
    };

    let viewModel = new ProgressDisplay.Dispatch.ViewModel.Self(provider);
    
    /// When
    store.initialize(reducer);

    /// Then
    testProgressViewModel(viewModel, done);
  }, timeout);

  it('Rx error view model should work correctly', done => {
    /// Setup
    let action = ProgressDisplay.Rx.Action.createDefault();
    let actionProvider: ProgressDisplay.Rx.Action.ProviderType = { progress: action };
    let reducer = ProgressDisplay.Rx.Reducer.createDefault(actionProvider);
    let store = new ReduxStore.Rx.Self(reducer);

    let provider: ProgressDisplay.Rx.Provider.Type = {
      action: actionProvider,
      store,
      substateSeparator: '.',
    };

    let viewModel = new ProgressDisplay.Rx.ViewModel.Self(provider);

    /// When & Then
    testProgressViewModel(viewModel, done);
  }, timeout);
});