import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // This is required to make 'process.env.API_KEY' work in the browser
      // as per the Gemini SDK requirements in the provided code.
      'process.env': {
        API_KEY: JSON.stringify(env.API_KEY)
      }
    }
  };
});