import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.model.ts'],
    coveragePathIgnorePatterns: [
        '.layout.tsx',
        '.loading.tsx',
        '<rootDir>/src/models',
        '<rootDir>/src/stores',
        '<rootDir>/src/constants',
        '<rootDir>/src/fonts',
        '<rootDir>/src/utils/http'
    ],
    coverageProvider: 'v8',
    coverageReporters: ['html', 'text', 'text-summary', 'cobertura'],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 0,
            lines: 80,
            statements: 80,
        },
    },
    // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
    moduleDirectories: ['node_modules', '<rootDir>/'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    reporters: ['default'],
    resetMocks: true,
    testEnvironment: 'jest-environment-jsdom',
    testTimeout: 30000,
};

// // createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
// export default  createJestConfig(customJestConfig);

// Workaround for issue described here: https://github.com/vercel/next.js/issues/35634
const jestConfig = async () => {
    const nextJestConfig = await createJestConfig(customJestConfig)();
    return {
        ...nextJestConfig,
        moduleNameMapper: {
            '\\.svg$': '<rootDir>/__mocks__/svg.js',
            '\\.(jpg|jpeg|png|gif|webp)$': '<rootDir>/__mocks__/image.js',
            ...nextJestConfig.moduleNameMapper,
        },
    };
};

export default jestConfig;