//---------------------------------------------------------------------------------------
// Copyright ⓒ 2024 Drew Harding
// All rights reserved.
//---------------------------------------------------------------------------------------
/**
 * Unit Test Support functions
 */
function isEqual(a, b, msg) {
  aString = JSON.stringify(a);
  bString = JSON.stringify(b);
  msg = msg ? `${msg} - e` : "E";
  msg = `${msg}xpected ${bString} but was ${aString}`;
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
    if (errMsg && e.message !== errMsg) {
      msg = msg ? `${msg} - e` : "E";
      msg = `${msg}xpected error message ${errMsg} but was "${e.message}".`;
      throw new Error(msg);
    }
  }
  if (error) {
    msg = msg ? `${msg} - e` : "E";
    msg = `${msg}xpected error to be thrown but wasn't.`;
    throw new Error(msg);
  }
  return true;
}

function isLessThan(a, b, msg) {
  if (a < b) {
    return true;
  } else {
    msg = msg ? `${msg} - v` : "V";
    msg = `${msg}alue ${a} is not less than value ${b}`;
    throw new Error(msg);
  };
}

function isLessThanOrEqualTo(a, b, msg) {
  if (a <= b) {
    return true;
  } else {
    msg = msg ? `${msg} - v` : "V";
    msg = `${msg}alue ${a} is not less than or equal to value ${b}`;
    throw new Error(msg);
  };
}

function isGreaterThan(a, b, msg) {
  if (a > b) {
    return true;
  } else {
    msg = msg ? `${msg} - v` : "V";
    msg = `${msg}alue ${a} is not greater than value ${b}`;
    throw new Error(msg);
  };
}

function isGreaterThanOrEqualTo(a, b, msg) {
  if (a >= b) {
    return true;
  } else {
    msg = msg ? `${msg} - v` : "V";
    msg = `${msg}alue ${a} is not greater than or equal to value ${b}`;
    throw new Error(msg);
  };
}

function isTruthy(a, msg) {
  if (a) {
    return true;
  } else {
    msg = msg ? `${msg} - v` : "V";
    msg = `${msg}alue ${JSON.stringify(a)} is not truthy`;
    throw new Error(msg);
  };
}

function isFalsy(a, msg) {
  if (a) {
    throw new Error(msg);
  } else {
    msg = msg ? `${msg} - v` : "V";
    msg = `${msg}alue ${JSON.stringify(a)} is not falsy`;
    return true;
  };
}

function isTrue(a, msg) {
  if (a === true) {
    return true;
  } else {
    msg = msg ? `${msg} - v` : "V";
    msg = `${msg}alue ${JSON.stringify(a)} is not true`;
    throw new Error(msg);
  };
}

function isFalse(a, msg) {
  if (a === false) {
    return true;
  } else {
    msg = msg ? `${msg} - v` : "V";
    msg = `${msg}alue ${JSON.stringify(a)} is not false`;
    throw new Error(msg);
  };
}

function isEmpty(a, msg) {
  if (a === null || a === undefined || a === "" || (typeof a === 'object' && Object.keys(a).length === 0)) {
    return true;
  } else {
    msg = msg ? `${msg} - v` : "V";
    msg = `${msg}alue ${JSON.stringify(a)} is not empty`;
    throw new Error(msg);
  };
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