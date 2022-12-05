// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  FPPSS_REST_URL: window["env"]["FPPSS_REST_URL"] || "default",
  FPPSS_KEYCLOAK_URL: window["env"]["FPPSS_KEYCLOAK_URL"] || "default",
  FPPSS_KEYCLOAK_REALM: window["env"]["FPPSS_KEYCLOAK_REALM"] || "default",
  FPPSS_KEYCLOAK_CLIENT_ID: window["env"]["FPPSS_KEYCLOAK_CLIENT_ID"] || "default"
};
