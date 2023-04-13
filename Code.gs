/**
 * Unit Test Support functions
 */
function isEqual(a, b, msg) {
  aString = JSON.stringify(a);
  bString = JSON.stringify(b);
  msg = msg ? msg : `Expected ${bString} but was ${aString}`;
  return deepEqual_(a, b, msg);
}

function deepEqual_(a, b, msg) {
  if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
    for (key in a) deepEqual_(a[key], b[key], msg);
    for (key in b) deepEqual_(b[key], a[key], msg);
    return true;
  }
  if (a === b) {
    return true;
  } else {
    throw new Error(msg);
  };
}

function willFail(test, errMsg, msg) {
  let error = false;
  try {
    test();
    error = true;
  } catch (e) {
    if (errMsg && e.message != errMsg) {
      msg = msg ? msg : `Expected error message ${errMsg} but was ${e.message}.`;
      throw new Error(msg);
    }
  }
  if (error) {
    msg = msg ? msg : `Expected error to be thrown but wasn't.`;
    throw new Error(msg);
  }
  return true;
}

function isTruthy(a, msg) {
  msg = msg ? msg : `Value ${JSON.stringify(a)} is not truthy`;
  if (a) {
    return true;
  } else {
    throw new Error(msg);
  };
}

function isFalsy(a, msg) {
  msg = msg ? msg : `Value ${JSON.stringify(a)} is not falsy`;
  if (a) {
    throw new Error(msg);
  } else {
    return true;
  };
}

function isTrue(a, msg) {
  msg = msg ? msg : `Value ${JSON.stringify(a)} is not true`;
  return isEqual(a, true, msg);
}

function isFalse(a, msg) {
  msg = msg ? msg : `Value ${JSON.stringify(a)} is not false`;
  return isEqual(a, false, msg);
}

function newTestSuite(id) {
  return new TestSuite_(id);
}

function TestSuite_(id) {
  this.suiteId = id;
  this.suites = [];
  this.tests = [];
  this.setUp;
  this.tearDown;
  this.addTest = (test) => {
    this.tests[this.tests.length] = test;
    return this;
  }
  this.addSetUp = (setUp) => {
    this.setUp = setUp;
    return this;
  }
  this.addTearDown = (tearDown) => {
    this.tearDown = tearDown;
    return this;
  }
  this.run = () => {
    console.log("-".repeat(this.suiteId.length+6));
    console.log(`Suite ${this.suiteId}`)
    for (i in this.tests) {
      this.setUp ? this.setUp() : null;
      console.log(`Running test ${this.tests[i].name} ...`);
      this.tests[i]();
      this.tearDown ? this.tearDown() : null;
    }
    for (i in this.suites) this.suites[i].run();
  }
  this.addSuite = (suite) => {
    this.suites[this.suites.length] = suite;
    return this;
  }
}