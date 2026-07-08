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
            'Native browser pickers are banned. Use ui/date-picker (DatePicker + DatePickerButton + DatePickerCalendar) for dates, ui/select for choices.',
        },
        {
          selector: "JSXOpeningElement[name.name='select']",
          message:
            'Native <select> is banned. Use the styled Select from @/components/ui/select (or Combobox for searchable lists).',
        },
      ],
    },
  },
  // shadcn/ui re-exports CVA configs and helpers alongside components; fast-refresh warns on that pattern.
  {
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
