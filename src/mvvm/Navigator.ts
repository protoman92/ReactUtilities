import * as Navigation from './navigation';

/**
 * We should have a dedicated navigator that view models have access to, in
 * order to handle app navigations. The main benefit of this approach is that
 * we can run the app entirely using its view models, independently of the views.
 *
 * We need to specify Params generics because we leave it to the application
 * implementing the navigator to decide what should be passed from one screen
 * to another. For e.g., in a React web app we generally pass only the screen
 * object because of storage limitations, and also other necessary dependencies
 * would already have been passed when we define routes (if using react-router).
 *
 * On the other hand, in a native app, we need to pass more dependencies if
 * using react-navigation, because the navigation object has to pass the props
 * to the incoming component.
 * @template Params Generics parameter.
 */
export interface Type<Params> {
  /**
   * Navigate to a screen that owns a particular view model.
   * @param {Params} params A Params instance.
   * @param {Navigation.Info.Type} intent The navigation information.
   */
  navigate(params: Params, info: Navigation.Info.Type): void;

  /**
   * Navigate back to the previous screen.
   * @param {Navigation.Info.Type} info  The navigation information.
   */
  back(info: Navigation.Info.Type): void;
}