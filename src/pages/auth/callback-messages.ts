export interface AuthCallbackMessages {
  loading?: string;
  errorTitle?: string;
  missingState?: string;
  returnHome?: string;
  tryAgain?: string;
}

/** Pass a preset to `<AuthCallback messages={authCallbackMessages.de} />`. */
export const authCallbackMessages = {
  en: {
    loading: "Loading...",
    errorTitle: "Something went wrong",
    missingState:
      "We couldn't find this sign-in request in this browser. Please reopen the original link in your browser (for example, Safari or Chrome), not inside another app, and sign in again.",
    returnHome: "Return home",
    tryAgain: "Try again",
  },
} satisfies Record<string, AuthCallbackMessages>;
