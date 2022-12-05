export const environment = {
  production: false,
  FPPSS_REST_URL: window["env"]["FPPSS_REST_URL"] || "default",
  FPPSS_KEYCLOAK_URL: window["env"]["FPPSS_KEYCLOAK_URL"] || "default",
  FPPSS_KEYCLOAK_REALM: window["env"]["FPPSS_KEYCLOAK_REALM"] || "default",
  FPPSS_KEYCLOAK_CLIENT_ID: window["env"]["FPPSS_KEYCLOAK_CLIENT_ID"] || "default"
};
