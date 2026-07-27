// Minimal typings for the two auth SDKs the dashboard loads from a <Script> tag:
// Google Identity Services and MSAL. Only the surface we actually call.

declare global {
  type GoogleTokenResponse = { access_token?: string; error?: string };

  type GoogleTokenClient = {
    callback: (response: GoogleTokenResponse) => void;
    requestAccessToken: (options?: { prompt?: string }) => void;
  };

  type MsalAccount = { username?: string; name?: string };

  type MsalPublicClientApplication = {
    initialize?: () => Promise<void>;
    loginPopup: (request: { scopes: string[] }) => Promise<{ account: MsalAccount }>;
    getAllAccounts: () => MsalAccount[];
    setActiveAccount: (account: MsalAccount) => void;
    acquireTokenSilent: (request: {
      scopes: string[];
      account: MsalAccount;
    }) => Promise<{ accessToken: string }>;
    acquireTokenPopup: (request: {
      scopes: string[];
    }) => Promise<{ accessToken: string }>;
  };

  const google: {
    accounts: {
      oauth2: {
        initTokenClient: (config: {
          client_id: string;
          scope: string;
          callback: (response: GoogleTokenResponse) => void;
        }) => GoogleTokenClient;
      };
    };
  };

  const msal: {
    PublicClientApplication: new (config: {
      auth: { clientId: string; authority: string; redirectUri: string };
      cache: { cacheLocation: string };
    }) => MsalPublicClientApplication;
  };
}

export {};
