import React, { createContext, useContext } from "react";
import { OptionsObject, SnackbarKey, SnackbarMessage, useSnackbar, VariantType } from "notistack";
import { merge } from "lodash";

/**
 * Snack provider prop types.
 * @typedef {Object} SnackProviderProps
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @property {(JSX.Element|JSX.Element[])} children the children of this component
 */
type SnackProviderProps = {
  children: JSX.Element | JSX.Element[];
};

export type ManySnackbarConfig = {
  message?: SnackbarMessage;
  variant?: VariantType;
  configs?: OptionsObject;
};

/**
 * Snack context types.
 * @interface SnackContextType
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 */
interface SnackContextType {
  /**
   * Show a new snackbar with the given configs.
   * @callback showSnackbar
   * @since 1.0.0
   * @version 1.0.0
   * @author Joshua Lauwrich Nandy
   * @param {SnackbarMessage} message the message that shown on the snackbar
   * @param {VariantType} variant the snackbar variant (will change the snackbar color)
   * @returns Snackbar key that can be used to programatically close the snackbar
   */
  showSnackbar(
    message: SnackbarMessage | undefined,
    variant: VariantType | undefined,
    configs?: OptionsObject
  ): SnackbarKey;

  /**
   * Show multiple new snackbar with the given configs.
   * @callback showSnackbar
   * @since 1.0.0
   * @version 1.0.0
   * @author Joshua Lauwrich Nandy
   * @param {ManySnackbarConfig} config the config for the snackbar
   * @returns Arrays of snackbar key that can be used to programatically close the snackbar
   */
  showSnackbarMany(config?: Array<ManySnackbarConfig>): Array<SnackbarKey>;

  /**
   * Programmatically close a snackbar.
   * @callback showSnackbar
   * @since 1.0.0
   * @version 1.0.0
   * @author Joshua Lauwrich Nandy
   * @param {SnackbarMessage} key the message that shown on the snackbar
   * @param {VariantType} variant the snackbar variant (will change the snackbar color)
   * @returns Snackbar key that can be used to programatically close the snackbar
   */
  closeSnackbar(key: SnackbarKey): void;
}

// Snack context initial value
const contextInitial = {
  showSnackbar: () => {
    throw new Error("Unimplemented!");
  },
  showSnackbarMany: () => {
    throw new Error("Unimplemented!");
  },
  closeSnackbar: () => {
    throw new Error("Unimplemented!");
  }
};

const SnackContext = createContext<SnackContextType>(contextInitial);

/**
 * Provide global snackbar component that taken from notistack (https://github.com/iamhosseindhv/notistack).
 * Snackbar provide brief messages about app processes for example
 * notification about logging process either successful or failed, etc.
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @props SnackProviderProps
 */
const SnackProvider = ({ children }: SnackProviderProps): JSX.Element => {
  const { enqueueSnackbar, closeSnackbar: close } = useSnackbar();
  const defaultSnackbarConfig: OptionsObject = {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "right"
    },
    autoHideDuration: 3000
  };

  const showSnackbar = (
    message: SnackbarMessage | undefined,
    variant: VariantType | undefined,
    config: OptionsObject | undefined = {}
  ): SnackbarKey => {
    return enqueueSnackbar(
      message,
      merge({ ...defaultSnackbarConfig, variant, "data-testid": `Snackbar-${variant}` }, config)
    );
  };

  const showSnackbarMany = (configs: Array<ManySnackbarConfig>) => {
    return configs.map((config) =>
      enqueueSnackbar(
        config.message,
        merge({ ...defaultSnackbarConfig, variant: config.variant }, config.configs)
      )
    );
  };

  const closeSnackbar = (key: SnackbarKey): void => {
    close(key);
  };

  return (
    <SnackContext.Provider value={{ showSnackbar, showSnackbarMany, closeSnackbar }}>
      {children}
    </SnackContext.Provider>
  );
};

/**
 * Hooks to get the snackbar context value.
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @throws Error - if this method used outside SnackProvider component
 * @returns snackbar context value
 * @example <caption>Example how to use useSnack() hooks</caption>
 * import { useSnack } from "../../Providers/SnackProvider";
 *
 * // get snackbar context value
 * const { showSnackbar, closeSnackbar } = useSnack();
 *
 * // show snackbar message with variant success
 * const key = showSnackbar("This is the message", "success")
 *
 * // dismiss the snackbar programmatically
 * closeSnackbar(key);
 */
export const useSnack = (): SnackContextType => {
  const context = useContext(SnackContext);
  if (context === undefined) {
    throw new Error("useSnack must be used within an SnackProvider component!");
  }
  return context;
};

export default SnackProvider;
