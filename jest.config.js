/** @type {import('jest').Config} */
export default {
  // Используем ts-jest для поддержки TypeScript
  preset: 'ts-jest/presets/default-esm',

  // Расширения файлов для тестов
  testMatch: ['**/test/**/*.spec.js', '**/test/**/*.spec.ts'],

  // Корневая директория для тестов
  rootDir: '.',

  // Директории для поиска модулей
  moduleDirectories: ['node_modules', 'lib'],

  // Настройки для ES модулей
  extensionsToTreatAsEsm: ['.ts'],

  // Глобальные настройки
  globals: { 'ts-jest': { useESM: true } },

  // Настройки модулей
  moduleNameMapping: { '^(\\.{1,2}/.*)\\.js$': '$1' },

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

  // Пороги покрытия
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },

  // Настройки для отображения результатов
  verbose: true,

  // Таймаут для тестов (в миллисекундах)
  testTimeout: 10000,
}
