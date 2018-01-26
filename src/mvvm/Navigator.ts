import * as Navigation from './navigation';

/**
 * We should have a dedicated navigator that view models have access to, in
 * order to handle app navigations. The main benefit of this approach is that
 * we can run the app entirely using its view models, independently of the views.
 */
export interface Type {
  /**
   * Navigate to a screen that owns a particular view model.
   * @param {Navigation.Screen.Type} screen The screen to navigate to.
   * @param {Navigation.Info.Type} intent The navigation information.
   */
  navigate(screen: Navigation.Screen.Type, info: Navigation.Info.Type): void;

  /**
   * Navigate back to the previous screen.
   * @param {Navigation.Info.Type} info  The navigation information.
   */
  back(info: Navigation.Info.Type): void;
}