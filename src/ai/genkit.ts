import {genkit, GenkitPlugin} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const activePlugins: GenkitPlugin[] = [];
let defaultModel: string | undefined = undefined;

// Check for GOOGLE_API_KEY. Note: In Next.js, client-side process.env needs to be prefixed with NEXT_PUBLIC_
// However, this file is server-side logic primarily, and for build time, process.env should work.
// For robust client/server env var handling, consider Next.js runtime environment variables.
const apiKey = typeof process !== 'undefined' ? process.env?.GOOGLE_API_KEY : undefined;

if (apiKey) {
  activePlugins.push(googleAI());
  defaultModel = 'googleai/gemini-2.0-flash';
} else {
  // Log a warning during server-side build if the key is missing
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production' && typeof window === 'undefined') {
    console.warn(
      'WARNING: GOOGLE_API_KEY is not set. Google AI features will not be available. ' +
      'The Genkit googleAI plugin has not been initialized.'
    );
  }
}

export const ai = genkit({
  plugins: activePlugins,
  // Conditionally set the model only if the plugin providing it is active
  ...(defaultModel && { model: defaultModel }),
});
