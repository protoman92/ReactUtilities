import { Observable, Observer, Subject } from 'rxjs';
import { Nullable } from 'javascriptutilities';
import * as Navigation from './navigation';
import { Type as ViewModelType } from './viewmodel';

export namespace ViewModel {
  export interface Type {
    confirmTrigger(): Observer<void>;
    confirmStream(): Observable<void>;
  }

  /**
   * Use this view model to handle confirm events, such as when the user clicks
   * a button to perform login.
   */
  export class Self implements Type, ViewModelType {
    private readonly confirmSubject: Subject<void>;

    public get screen(): Readonly<Nullable<Navigation.Screen.BaseType>> {
      return undefined;
    }

    public constructor() {
      this.confirmSubject = new Subject();
    }

    public initialize = (): void => {};
    public deinitialize = (): void => {};
    public confirmTrigger = (): Observer<void> => this.confirmSubject;
    public confirmStream = (): Observable<void> => this.confirmSubject;
  }
}