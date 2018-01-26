import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { Nullable } from 'javascriptutilities';
import { ReduxStore } from 'reactiveredux-js';
import { Scrap } from './component';

export interface Action {
  scrapValueStream: Observable<Nullable<string>>;
  scrapValueTrigger: Observer<Nullable<string>>;
}

export interface Provider extends ReduxStore.Provider.Type {
  action: Action;
}

export let createProvider = (): Provider => {
  let scrapValueSubject = new BehaviorSubject<Nullable<string>>(undefined);

  let action: Action = {
    scrapValueStream: scrapValueSubject,
    scrapValueTrigger: scrapValueSubject,
  };

  let reducer = ReduxStore.Rx.createReducer(scrapValueSubject, (state, v) => {
    return state.updatingValue(Scrap.fullValuePath, v.value);
  });

  let store = new ReduxStore.Rx.Self(reducer);
  return { action, store, substateSeparator: '.' };
};