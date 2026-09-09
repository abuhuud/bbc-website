/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Node.js CLI Automated Test Runner
 * Run via: node tests/run-tests.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('\x1b[36m%s\x1b[0m', '🏸 BAZNAS BADMINTON CLUB — AUTOMATED QA TEST RUNNER');
console.log('='.repeat(60));

// Setup Minimal Browser Simulation in Node.js
const mockStorage = new Map();
const windowMock = {
    location: {
        pathname: '/index.php',
        search: ''
    },
    localStorage: {
        getItem: (k) => (mockStorage.has(k) ? mockStorage.get(k) : null),
        setItem: (k, v) => mockStorage.set(k, String(v)),
        removeItem: (k) => mockStorage.delete(k),
        clear: () => mockStorage.clear()
    },
    document: {
        addEventListener: () => {}
    }
};

const sandbox = {
    window: windowMock,
    document: windowMock.document,
    localStorage: windowMock.localStorage,
    console: console,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    Date: Date,
    Math: Math,
    JSON: JSON,
    Array: Array,
    Object: Object,
    String: String,
    Number: Number,
    parseInt: parseInt,
    parseFloat: parseFloat,
    RegExp: RegExp,
    Error: Error
};

vm.createContext(sandbox);

function loadScript(relPath) {
    const fullPath = path.resolve(__dirname, '..', relPath);
    const code = fs.readFileSync(fullPath, 'utf8');
    vm.runInContext(code, sandbox, { filename: relPath });
}

// 1. Load Application Scripts
try {
    loadScript('js/data/players.js');
    loadScript('js/data/events.js');
    loadScript('js/data/news.js');
    loadScript('js/data/gallery.js');
    loadScript('js/data/officials.js');
    loadScript('js/data/store.js');
    loadScript('js/components/player-card.js');
    loadScript('js/components/news-card.js');
    loadScript('js/pages/home.js');

    // 2. Load Testing Framework & Specs
    loadScript('tests/test-framework.js');
    loadScript('tests/specs/store.spec.js');
    loadScript('tests/specs/components.spec.js');
} catch (err) {
    console.error('\x1b[31mError loading scripts into test environment:\x1b[0m', err);
    process.exit(1);
}

// 3. Run Suites with ANSI Console Reporter
const BBCTest = sandbox.BBCTest;

const reporter = {
    onSuiteStart(suite) {
        console.log(`\n\x1b[1m\x1b[33m▶ ${suite.name}\x1b[0m`);
    },
    onTestEnd(test) {
        if (test.status === 'passed') {
            console.log(`  \x1b[32m✔ PASS\x1b[0m ${test.testName} \x1b[90m(${test.duration}ms)\x1b[0m`);
        } else {
            console.log(`  \x1b[31m✖ FAIL\x1b[0m ${test.testName}`);
            if (test.error) {
                console.log(`    \x1b[31m${test.error.message || test.error}\x1b[0m`);
            }
        }
    },
    onSuiteEnd(result) {
        // suite completed
    },
    onAllEnd(summary) {
        console.log('\n' + '='.repeat(60));
        console.log(`\x1b[1mHASIL TEST:\x1b[0m`);
        console.log(`Total:   ${summary.totalTests}`);
        console.log(`\x1b[32mPassed:  ${summary.totalPassed}\x1b[0m`);
        if (summary.totalFailed > 0) {
            console.log(`\x1b[31mFailed:  ${summary.totalFailed}\x1b[0m`);
        } else {
            console.log(`Failed:  0`);
        }
        console.log(`Waktu:   ${summary.totalDuration} ms`);

        if (summary.success) {
            console.log('\n\x1b[42m\x1b[30m\x1b[1m STATUS: ALL UNIT TESTS PASSED (100%) \x1b[0m\n');
        } else {
            console.log('\n\x1b[41m\x1b[37m\x1b[1m STATUS: SOME TESTS FAILED \x1b[0m\n');
            process.exit(1);
        }
    }
};

BBCTest.runSuites(reporter);
