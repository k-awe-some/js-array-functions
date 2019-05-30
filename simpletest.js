/**
 * Very simple in-browser unit-test library, with zero deps.
 *
 * Background turns green if all tests pass, otherwise red.
 * View the JavaScript console to see failure reasons.
 *
 * Example:
 *
 *   adder.js (code under test)
 *
 *     function add(a, b) {
 *       return a + b;
 *     }
 *
 *   adder-test.html (tests - just open a browser to see results)
 *
 *     <script src="tinytest.js"></script>
 *     <script src="adder.js"></script>
 *     <script>
 *
 *     tests({
 *
 *       'adds numbers': function() {
 *         eq(6, add(2, 4));
 *         eq(6.6, add(2.6, 4));
 *       },
 *
 *       'subtracts numbers': function() {
 *         eq(-2, add(2, -4));
 *       },
 *
 *     });
 *     </script>
 *
 * That's it. Stop using over complicated frameworks that get in your way.
 *
 * -Joe Walnes
 * MIT License. See https://github.com/joewalnes/jstinytest/
 */

// DONE: Get successes to be green
// DONE: Make sure only one error per failure goes to the console
// DONE: Make failures red
// DONE: Show stack traces for failures
// DONE: Only showstack traces if you click expand
// DONE: Ouput summary stats to the DOM

var TinyTestHelper = {
  renderStats: function(tests, failures) {
    // Output summary stats
    var numberOfTests = Object.keys(tests).length;
    var successes = numberOfTests - failures;
    var summaryString = `Ran ${numberOfTests} tests:\n${successes} successes,\n${failures} failures`;
    var summaryHeading = document.createElement('h1');
    summaryHeading.textContent = summaryString;
    document.body.appendChild(summaryHeading);
  }
}

var TinyTest = {
  run: function(tests) {
    var failures = 0;

    for (var testName in tests) {
      var testAction = tests[testName];
      try {
        testAction.apply(this); // if there's no error thrown // .apply binds and runs the fn
        console.log('%c' + testName, 'color: green;'); // success msg will print out
      } catch (e) { // if there's error thown in block try
        failures++; // increase failure by 1
        // console.log('%c' + testName, 'color: red; font-weight: bold;',); // console.log this so this won't print an error in the console
        console.groupCollapsed('%c' + testName, 'color: red; font-weight: bold;');
        console.error(e.stack); // e.stack, or stack trace: a series of function calls that led to the error being looked at
        console.groupEnd();
      }
    }

    setTimeout(function() { // setTimeout gives document a chance to finish higher priorities including updating the DOM
      if (window.document && document.body) { // before modifying the DOM (aka when window.document & document.body are ready)
        document.body.style.backgroundColor = (failures == 0 ? '#99ff99' : '#ff9999');
        TinyTestHelper.renderStats(tests, failures);
      }
    }, 0);
    /* HOW THE BROWSER HANDLES TASKS IN PRIORITY (high >>> low)
    1. JavaScript
    2. Update the DOM
    3. Extra tasks (e.g. callbacks passed into setTimeout)
    */
  },

  fail: function(msg) {
    throw new Error('fail(): ' + msg);
  },

  assert: function(value, msg) {
    if (!value) {
      throw new Error('assert(): ' + msg);
    }
  },

  assertEquals: function(expected, actual) {
    if (expected !== actual) { // should always use strictEquals (!==)
      throw new Error('assertEquals() "' + expected + '" != "' + actual + '"');
    }
  },

  // assertStrictEquals: function(expected, actual) {
  //   if (expected !== actual) {
  //     throw new Error('assertStrictEquals() "' + expected + '" !== "' + actual + '"');
  //   }
  // },

};

// .bind does not run the fn; it just returns a fn that'll run whenever it's called
var fail = TinyTest.fail.bind(TinyTest),
  assert = TinyTest.assert.bind(TinyTest),
  assertEquals = TinyTest.assertEquals.bind(TinyTest),
  eq = TinyTest.assertEquals.bind(TinyTest), // alias for assertEquals
  // assertStrictEquals = TinyTest.assertStrictEquals.bind(TinyTest),
  tests = TinyTest.run.bind(TinyTest);
