import allahjsConfig from '@allahjs/eslint';

export default [
  ...allahjsConfig,
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      // 要求使用模板字面量而非字符串连接
      'prefer-template': 2,
      // 允许在 useEffect 中调用 setState（关闭警告）
      'react-hooks/set-state-in-effect': 0,
      // 要求 useEffect 中的依赖项是不可变的
      'react-hooks/immutability': 0,
      'react/jsx-max-props-per-line': [2, { maximum: 6, when: 'always' }],
      '@typescript-eslint/no-explicit-any': 0,
      'react/prop-types': 0,
      camelcase: 0,
      // 禁用与 ESLint 9.x 不兼容的规则
      'unused-imports/no-unused-imports': 0,
      'unused-imports/no-unused-vars': 0
    }
  }
];
