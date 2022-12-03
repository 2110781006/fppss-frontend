(function(window) {
    window["env"] = window["env"] || {};
  
    // Environment variables
    window["env"]["FPPSS_REST_URL"] = "${FPPSS_REST_URL}";
    window["env"]["FPPSS_KEYCLOAK_URL"] = "${FPPSS_KEYCLOAK_URL}";
    window["env"]["FPPSS_KEYCLOAK_REALM"] = "${FPPSS_KEYCLOAK_REALM}";
    window["env"]["FPPSS_KEYCLOAK_CLIENT_ID"] = "${FPPSS_KEYCLOAK_CLIENT_ID}";
  })(this);