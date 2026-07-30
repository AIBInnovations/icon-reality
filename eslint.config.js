import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // these run in Node, not the browser (process, console, Buffer…)
    files: ['vite.config.js', 'eslint.config.js', 'api/**/*.js', 'plugins/**/*.js'],
    languageOptions: { globals: globals.node },
  },
  {
    // src/seo/site.js resolves the canonical origin from import.meta.env in the
    // browser and process.env in build-time tooling, so it needs both.
    files: ['src/seo/site.js'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
])
