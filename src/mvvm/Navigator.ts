import * as Navigation from './navigation';
import * as ViewModel from './viewmodel';

/**
 * We should have a dedicated navigator that view models have access to, in
 * order to handle app navigations. The main benefit of this approach is that
 * we can run the app entirely using its view models, independently of the views.
 */
export interface Type {
  /**
   * Navigate to a screen that owns a particular view model.
   * @param {ViewModel.Type} vm A ViewModel instance.
   * @param {Navigation.Info.Type} intent The navigation information.
   */
  navigate(vm: ViewModel.Type, info: Navigation.Info.Type): void;

  /**
   * Navigate back to the previous screen.
   * @param {Navigation.Info.Type} info  The navigation information.
   */
  back(info: Navigation.Info.Type): void;
}