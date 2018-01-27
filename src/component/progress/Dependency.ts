import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { ReduxStore, RxReducer } from 'reactiveredux-js';
import { IncompletableSubject, Nullable, Try } from 'javascriptutilities';
import { State as S } from 'typesafereduxstate-js';
import * as Web from './../web';
import * as MVVM from './../../mvvm';
import * as Presets from './presets';

export namespace Action {
  /**
   * Provide an action that includes the progress trigger.
   */
  export interface Type {
    fullProgressValuePath: string;
    progressDisplayStream: Observable<boolean>;
    progressDisplayTrigger: Observer<boolean>;
  }

  /**
   * Provide action for progress display view model.
   */
  export interface ProviderType {
    progress: Type;
  }

  /**
   * Create default progress display action. The top action should provide this 
   * action with 'progress' namespace. We need a IncompletableSubject wrapper 
   * because this is a global subject - otherwise, it may be prematurely 
   * terminated.
   */
  export let createDefault = (): Type => {
    let subject = new BehaviorSubject<boolean>(false);
    let wrapper = new IncompletableSubject(subject);
    
    return {
      fullProgressValuePath: 'progress.value',
      progressDisplayStream: wrapper.asObservable(),
      progressDisplayTrigger: wrapper,
    };
  };
}

export namespace Identity {
  /**
   * Identity for progress display component.
   * @extends {Web.Identity.Type} Common identity extension.
   */
  export interface Type extends Web.Identity.Type {}

  /**
   * Identity for progress display background.   
   * @extends {Web.Identity.Type} Common identity extension.
   */
  export interface BackgroundType extends Web.Identity.Type {}

  /**
   * Identity for progress display container.
   * @extends {Web.Identity.Type} Common identity extension.
   */
  export interface ContainerType extends Web.Identity.Type {}

  /**
   * Selector for progress display container.
   */
  export interface SelectorType {
    identity(enabled: boolean): Try<Type>;
    backgroundIdentity(enabled: boolean): Try<BackgroundType>;
    containerIdentity(enabled: boolean): Try<ContainerType>;
  }

  /**
   * Provide identity for progress display component.
   */
  export interface ProviderType {
    progress?: SelectorType;
  }

  /**
   * Create a default identity selector.
   * @returns {SelectorType} A SelectorType instance.
   */
  export let createDefaultSelector = (): SelectorType => {
    return {
      identity: (enabled: boolean): Try<Type> => {
        let common = 'progress-display';

        if (enabled) {
          return Try.success({ id: undefined, className: common });
        } else {
          return Try.success({
            id: undefined,
            className: `progress-display-hidden ${common}`,
          });
        }
      },

      backgroundIdentity: (enabled: boolean): Try<BackgroundType> => {
        let common = 'progress-display-background';

        if (enabled) {
          return Try.success({ id: undefined, className: common });
        } else {
          return Try.success({
            id: undefined,
            className: `progress-display-background-hidden ${common}`,
          });
        }
      },

      containerIdentity: (enabled: boolean): Try<ContainerType> => {
        let common = 'progress-display-container display-container';

        if (enabled) {
          return Try.success({ id: undefined, className: common });
        } else {
          return Try.success({
            id: undefined,
            className: `progress-display-container-hidden ${common}`,
          });
        }
      }
    };
  };
}

export namespace Provider {
  /**
   * Provide the relevant dependencies for this view model.
   * @extends {ReduxStore.Provider.Type} Store provider extension.
   * @extends {Presets.Provider.Type} Presets provider extension.
   */
  export interface Type extends ReduxStore.Provider.Type, Presets.Provider.Type {
    action: Action.ProviderType;
    identity: Identity.ProviderType;
  }
}

export namespace Reducer {
  /**
   * Create default reducer for progress display.
   * @param {Action.ProviderType} action Action provider.
   * @returns {Observable<RxReducer<boolean>>} An Observable instance.
   */
  export let createDefault = (action: Action.ProviderType): Observable<RxReducer<boolean>> => {
    let pAction = action.progress;
    let path = pAction.fullProgressValuePath;
    let pgStream = pAction.progressDisplayStream;

    return ReduxStore.Rx.createReducer(pgStream, (state, v) => {
      return state.updatingValue(path, v.value);
    });
  };
}

export namespace ViewModel {
  /**
   * View model for progress display.
   */
  export interface Type {
    progressDisplayTrigger(): Observer<boolean>;
    progressDisplayStream(): Observable<boolean>;
  }

  /**
   * Provide view model for progress display component.
   */
  export interface ProviderType {
    progressDisplay_viewModel(): ViewModel.Self;
  }

  /**
   * Use this class to handle app-wide progress display. We can push a boolean
   * flag to global state that the top app component listens to.
   * @implements {Type} Type implementation.
   * @implements {MVVM.ViewModel.ReduxType} View model implementation.
   * @implements {Presets.ViewModel.ProviderTyp} Presets VM provider extension.
   */
  export class Self implements Type, MVVM.ViewModel.ReduxType, Presets.ViewModel.ProviderType {
    private readonly provider: Provider.Type;

    public get screen(): Nullable<MVVM.Navigation.Screen.Type> {
      return undefined;
    }

    private get fullProgressValuePath(): string {
      return this.provider.action.progress.fullProgressValuePath;
    }

    private get substatePath(): string {
      let path = this.fullProgressValuePath;
      let separator = this.provider.substateSeparator;
      return S.separateSubstateAndValuePaths(path, separator)[0];
    }

    private get progressValuePath(): string {
      let path = this.fullProgressValuePath;
      let separator = this.provider.substateSeparator;
      return S.separateSubstateAndValuePaths(path, separator)[1];
    }

    public constructor(provider: Provider.Type) {
      this.provider = provider;
    }

    public initialize = (): void => {};
    public deinitialize = (): void => {};

    public stateStream = (): Observable<Try<S.Self<any>>> => {
      let path = this.substatePath;
      return this.provider.store.stateStream().map(v => v.substateAtNode(path));
    }

    public progressDisplayTrigger = (): Observer<boolean> => {
      return this.provider.action.progress.progressDisplayTrigger;
    }

    public progressDisplayStream = (): Observable<boolean> => {
      let provider = this.provider;
      let store = provider.store;
      let path = provider.action.progress.fullProgressValuePath;
      return store.booleanAtNode(path).mapNonNilOrElse(v => v, false);
    }

    public identitySelector = (): Identity.SelectorType => {
      let selector = this.provider.identity.progress;
      return Try.unwrap(selector).getOrElse(Identity.createDefaultSelector());
    }

    public progressDisplayPreset_viewModel(): Presets.ViewModel.Type {
      return new Presets.ViewModel.Self(this.provider);
    }

    public progressForState = (state: Nullable<Readonly<S.Self<any>>>): Try<boolean> => {
      let path = this.progressValuePath;
      return Try.unwrap(state).flatMap(v => v.booleanAtNode(path));
    }
  }
}