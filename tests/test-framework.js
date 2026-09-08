/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Lightweight Unit Testing Micro-Framework
 * Supports both Browser UI and Node.js CLI environments without external dependencies.
 */
(function (global) {
    'use strict';

    const suites = [];
    let currentSuite = null;

    /**
     * Assertion Error definition
     */
    class AssertionError extends Error {
        constructor(message, actual, expected) {
            super(message);
            this.name = 'AssertionError';
            this.actual = actual;
            this.expected = expected;
        }
    }

    /**
     * Expect matchers
     */
    function expect(actual) {
        return {
            toBe(expected) {
                if (actual !== expected) {
                    throw new AssertionError(
                        `Expected [${formatVal(actual)}] to be [${formatVal(expected)}]`,
                        actual,
                        expected
                    );
                }
            },
            toEqual(expected) {
                const actStr = JSON.stringify(actual);
                const expStr = JSON.stringify(expected);
                if (actStr !== expStr) {
                    throw new AssertionError(
                        `Expected deep equality:\nActual:   ${actStr}\nExpected: ${expStr}`,
                        actual,
                        expected
                    );
                }
            },
            toBeDefined() {
                if (typeof actual === 'undefined') {
                    throw new AssertionError(`Expected value to be defined, got undefined`, actual, 'defined');
                }
            },
            toBeTruthy() {
                if (!actual) {
                    throw new AssertionError(`Expected [${formatVal(actual)}] to be truthy`, actual, true);
                }
            },
            toBeFalsy() {
                if (actual) {
                    throw new AssertionError(`Expected [${formatVal(actual)}] to be falsy`, actual, false);
                }
            },
            toContain(item) {
                if (typeof actual === 'string') {
                    if (!actual.includes(item)) {
                        throw new AssertionError(`Expected string to contain "${item}"`, actual, item);
                    }
                } else if (Array.isArray(actual)) {
                    const found = actual.some(val => JSON.stringify(val) === JSON.stringify(item) || val === item);
                    if (!found) {
                        throw new AssertionError(`Expected array to contain item`, actual, item);
                    }
                } else {
                    throw new AssertionError(`toContain requires string or array`, actual, item);
                }
            },
            toBeGreaterThan(num) {
                if (!(actual > num)) {
                    throw new AssertionError(`Expected ${actual} > ${num}`, actual, num);
                }
            },
            toBeGreaterThanOrEqual(num) {
                if (!(actual >= num)) {
                    throw new AssertionError(`Expected ${actual} >= ${num}`, actual, num);
                }
            },
            toBeLessThan(num) {
                if (!(actual < num)) {
                    throw new AssertionError(`Expected ${actual} < ${num}`, actual, num);
                }
            },
            toThrow() {
                if (typeof actual !== 'function') {
                    throw new AssertionError(`toThrow requires a function`, actual, 'function');
                }
                let threw = false;
                try {
                    actual();
                } catch (e) {
                    threw = true;
                }
                if (!threw) {
                    throw new AssertionError(`Expected function to throw an error, but it did not`, null, 'error');
                }
            }
        };
    }

    function formatVal(v) {
        if (typeof v === 'string') return `"${v}"`;
        if (v === null) return 'null';
        if (typeof v === 'undefined') return 'undefined';
        if (typeof v === 'object') return JSON.stringify(v);
        return String(v);
    }

    /**
     * Define a test suite
     */
    function describe(suiteName, fn) {
        const suite = {
            name: suiteName,
            beforeEachHooks: [],
            tests: []
        };
        suites.push(suite);
        const prevSuite = currentSuite;
        currentSuite = suite;
        try {
            fn();
        } finally {
            currentSuite = prevSuite;
        }
    }

    /**
     * Hook before each test in current suite
     */
    function beforeEach(fn) {
        if (currentSuite) {
            currentSuite.beforeEachHooks.push(fn);
        }
    }

    /**
     * Define a single test spec
     */
    function it(testName, fn) {
        if (!currentSuite) {
            throw new Error(`Test "${testName}" must be inside a describe() suite!`);
        }
        currentSuite.tests.push({
            name: testName,
            fn
        });
    }

    /**
     * Run all registered suites asynchronously
     */
    async function runSuites(reporter) {
        const rep = reporter || {};
        const onSuiteStart = rep.onSuiteStart || (() => {});
        const onSuiteEnd = rep.onSuiteEnd || (() => {});
        const onTestEnd = rep.onTestEnd || (() => {});
        const onAllEnd = rep.onAllEnd || (() => {});

        let totalTests = 0;
        let totalPassed = 0;
        let totalFailed = 0;
        const startTime = Date.now();

        for (const suite of suites) {
            onSuiteStart(suite);
            let suitePassed = 0;
            let suiteFailed = 0;

            for (const test of suite.tests) {
                totalTests++;
                const tStart = Date.now();
                let status = 'passed';
                let error = null;

                try {
                    for (const hook of suite.beforeEachHooks) {
                        await hook();
                    }
                    await test.fn();
                    suitePassed++;
                    totalPassed++;
                } catch (err) {
                    status = 'failed';
                    error = err;
                    suiteFailed++;
                    totalFailed++;
                }

                const duration = Date.now() - tStart;
                onTestEnd({
                    suiteName: suite.name,
                    testName: test.name,
                    status,
                    duration,
                    error
                });
            }

            onSuiteEnd({
                suiteName: suite.name,
                passed: suitePassed,
                failed: suiteFailed,
                total: suite.tests.length
            });
        }

        const totalDuration = Date.now() - startTime;
        const summary = {
            totalTests,
            totalPassed,
            totalFailed,
            totalDuration,
            success: totalFailed === 0
        };

        onAllEnd(summary);
        return summary;
    }

    // Export to global scope
    const BBCTest = {
        describe,
        it,
        beforeEach,
        expect,
        runSuites,
        getSuites: () => suites,
        clearSuites: () => { suites.length = 0; }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = BBCTest;
    }
    if (typeof window !== 'undefined') {
        window.describe = describe;
        window.it = it;
        window.beforeEach = beforeEach;
        window.expect = expect;
        window.BBCTest = BBCTest;
    }
})(typeof window !== 'undefined' ? window : global);
