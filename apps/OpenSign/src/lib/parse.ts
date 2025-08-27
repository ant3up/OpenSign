import Parse from 'parse/dist/parse.min.js';
import { AUTH_CONFIG } from '@/config/auth';

// Initialize Parse for browser usage (do NOT use master key in the client)
if (!(Parse as any)._applicationId) {
  Parse.initialize(
    AUTH_CONFIG.PARSE_APP_ID,
    // Optionally support a JS key if later provided via env
    (import.meta as any).env?.VITE_PARSE_JS_KEY
  );
  Parse.serverURL = AUTH_CONFIG.PARSE_SERVER_URL;
}

export default Parse;
