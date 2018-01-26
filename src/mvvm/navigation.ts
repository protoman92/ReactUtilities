import { Nullable } from 'javascriptutilities';

export namespace Intent {
  /**
   * Pass the navigation intent to each navigation calls so that we can distinguish
   * the app's intents when it navigates to a screen. This is especially helpful
   * for debugging purposes.
   */
  export interface Type {
    id: string;
  }
}

export namespace Screen {
  /**
   * Pass the screen information to the next view model so that it knows from
   * where the navigation came. This information could be useful for debugging
   * purposes.
   */
  export interface Type {
    id: string;

    /**
     * Get the relative path with which we can push to this screen.
     */
    relativePath: string;
  }
}

export namespace Info {
  /**
   * Provide all relevant navigation information for debugging.
   */
  export interface Type {
    /**
     * The previous screen that is navigating to the current screen.
     */
    prevScreen: Nullable<Screen.Type>;

    /**
     * The navigation intent with which the navigation was carried out.
     */
    intent: Intent.Type;
  }
}