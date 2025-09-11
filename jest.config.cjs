/** @type {import('jest').Config} */
module.exports = {
  // Современная конфигурация Jest для ES модулей
  preset: 'ts-jest/presets/default-esm',

  // Расширения файлов для тестов
  testMatch: ['**/test/**/*.spec.ts'],

  // Корневая директория для тестов
  rootDir: '.',

  // Директории для поиска модулей
  moduleDirectories: ['node_modules', 'lib'],

  // Настройки для ES модулей
  extensionsToTreatAsEsm: ['.ts'],

  // Настройки трансформации
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          verbatimModuleSyntax: false,
          allowSyntheticDefaultImports: true,
          esModuleInterop: true,
          isolatedModules: true,
          module: 'ESNext',
          moduleResolution: 'bundler',
          target: 'ES2022',
        },
      },
    ],
  },

  // Настройки модулей
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1', '^(\\.{1,2}/.*)$': '$1' },

  // Настройки для тестовой среды
  testEnvironment: 'node',

  // Отключаем автоматическое очищение моков между тестами
  clearMocks: true,

  // Показывать покрытие кода
  collectCoverage: false,

  // Директории для покрытия
  collectCoverageFrom: [
    'lib/**/*.ts',
    '!lib/**/*.d.ts',
    '!lib/interfaces/**/*',
  ],

  // Пороги покрытия (временно отключены)
  // coverageThreshold: {
  //   global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  // },

  // Настройки для отображения результатов
  verbose: true,

  // Таймаут для тестов (в миллисекундах)
  testTimeout: 10000,

  // Современные настройки Jest
  setupFilesAfterEnv: [],
  testEnvironmentOptions: { url: 'http://localhost' },
}
