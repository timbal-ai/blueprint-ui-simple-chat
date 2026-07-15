import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist', '**/.nfs*']),
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
    rules: {
      // Native pickers are unstyled, off-brand, and inconsistent across
      // browsers — the kit has styled equivalents for all of them.
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "JSXOpeningElement[name.name='input'] JSXAttribute[name.name='type'][value.value=/^(date|datetime-local|month|week|time|color)$/]",
          message:
            'Native browser pickers are banned. Use the BoardUI DatePicker/DateRangePicker from @/components/base/date-picker for dates.',
        },
        {
          selector: "JSXOpeningElement[name.name='select']",
          message:
            'Native <select> is banned. Use the styled Select from @/components/base/select (or ui/combobox for searchable lists).',
        },
      ],
    },
  },
  // shadcn/ui re-exports CVA configs and helpers alongside components; fast-refresh warns on that pattern.
  // Page templates also export demo data + helpers alongside the page component.
  {
    files: [
      'src/components/ui/**/*.{ts,tsx}',
      'src/components/pages/**/*.{ts,tsx}',
      // BoardUI source (copied in via `npx boardui add`) exports helpers and
      // style objects alongside components, same as shadcn.
      'src/components/base/**/*.{ts,tsx}',
      'src/components/application/**/*.{ts,tsx}',
      'src/components/foundations/**/*.{ts,tsx}',
      // These blocks export a hook / column helpers alongside their
      // components (same pattern the old ui/sidebar + ui/data-table used).
      'src/components/blocks/app-shell.tsx',
      'src/components/blocks/filtered-table.tsx',
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
