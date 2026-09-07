import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

// Vendored BoardUI files carry `eslint-disable @next/next/no-img-element`
// directives from their Next.js origin. Register a no-op rule under that name so
// the directives resolve without installing Next's eslint plugin.
const nextShimPlugin = {
  rules: {
    'no-img-element': { meta: { schema: [] }, create: () => ({}) },
  },
}

export default tseslint.config([
  globalIgnores(['dist', 'screenshots', '**/.nfs*']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: { '@next/next': nextShimPlugin },
    rules: {
      // Native pickers are unstyled, off-brand, and inconsistent across
      // browsers — BoardUI has styled equivalents for all of them.
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "JSXOpeningElement[name.name='input'] JSXAttribute[name.name='type'][value.value=/^(date|datetime-local|month|week|time|color)$/]",
          message:
            'Native browser pickers are banned. Use DatePicker/DateRangePicker from @/components/base/date-picker.',
        },
        {
          selector: "JSXOpeningElement[name.name='select']",
          message:
            'Native <select> is banned. Use Select from @/components/base/select.',
        },
      ],
    },
  },
  // BoardUI source exports helpers, data and style objects alongside components;
  // the Timbal seam exports slot maps and hooks the same way.
  {
    files: [
      'src/components/base/**/*.{ts,tsx}',
      'src/components/application/**/*.{ts,tsx}',
      'src/components/foundations/**/*.{ts,tsx}',
      'src/components/timbal/**/*.{ts,tsx}',
      'src/shims/**/*.{ts,tsx}',
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  // Vendored BoardUI is upstream-verbatim (synced, never hand-edited): do not
  // fail the gate on its internal lint style.
  {
    files: [
      'src/components/base/**/*.{ts,tsx}',
      'src/components/application/**/*.{ts,tsx}',
      'src/components/foundations/**/*.{ts,tsx}',
    ],
    linterOptions: { reportUnusedDisableDirectives: 'off' },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'no-restricted-syntax': 'off',
    },
  },
])
