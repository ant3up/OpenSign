import Parse from 'parse';
import { AUTH_CONFIG } from '@/config/auth';

// Initialize Parse for browser usage (do NOT use master key in the client)
if (!Parse.applicationId) {
  Parse.initialize(
    AUTH_CONFIG.PARSE_APP_ID
  );
  Parse.serverURL = AUTH_CONFIG.PARSE_SERVER_URL;
}

export default Parse;
