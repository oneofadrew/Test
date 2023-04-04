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
    return true;
  }
  if (a === b) {
    return true;
  } else {
    throw new Error(msg);
  };
}

function willFail(test, errMsg) {
  try {
    test();
    throw new Error(`Expected error to be thrown but wasn't.`);
  } catch (e) {
    if (errMsg && e.message != errMsg) {
      throw new Error(`Expected error message ${errMsg} but was ${e.message}.`);
    }
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
  this.addTest = (test) => {
    this.tests[this.tests.length] = test;
  }
  this.run = () => {
    for (i in this.suites) this.suites[i].run();
    console.log("-".repeat(this.suiteId.length+6));
    console.log(`Suite ${this.suiteId}`)
    console.log("-".repeat(this.suiteId.length+6))
    for (i in this.tests) {
      this.tests[i]();
      console.log(`Test ${i} passed.`);
    }
  }
  this.addSuite = (suite) => {
    this.suites[this.suites.length] = suite;
    return this;
  }
}

/**
 * Test Unit Test Support functions
 */
function runTests_() {
  suite = getSuiteIsEqual_()
    .addSuite(getSuiteIsTrue_())
    .addSuite(getSuiteIsFalse_())
    .addSuite(getSuiteIsTruthy_())
    .addSuite(getSuiteIsFalsy_())
    .addSuite(getSuiteWillFail_());
  suite.run();
}

function getSuiteIsEqual_() {
  let arr1a = [0,1,2,3];
  let arr1b = [0,1,2,3];
  let arr2 = [3,2,1,0];
  let obj1a = {
    "key1" : "val1",
    "key2" : {
      "subkey1" : "subval1"
    }
  }
  let obj1b = {
    "key2" : {
      "subkey1" : "subval1"
    },
    "key1" : "val1"
  }
  let obj2 = {
    "key1" : "val1",
    "key2" : {
      "subkey1" : "subval1"
    },
    "key3" : "val3",
  }
  let suite = newTestSuite("isEqual()");
  suite.addTest(()=>{isEqual("value", "value")});
  suite.addTest(()=>{isEqual("", "")});
  suite.addTest(()=>{isEqual(0, 0)});
  suite.addTest(()=>{isEqual(1234, 1234)});
  suite.addTest(()=>{isEqual(1234.1234, 1234.1234)});
  suite.addTest(()=>{isEqual(null, null)});
  suite.addTest(()=>{isEqual(arr1a, arr1a)});
  suite.addTest(()=>{isEqual(arr1a, arr1b)});
  suite.addTest(()=>{isEqual(obj1a, obj1a)});
  suite.addTest(()=>{isEqual(obj1a, obj1b)});
  suite.addTest(()=>{
    try {
      isEqual("value", "eulav")
      throw new Error("isEqual() should throw on mismatching strings")
    } catch {
      //do nothing
    }
  });
  suite.addTest(()=>{
    try {
      isEqual("value", null)
      throw new Error("isEqual() should throw on comparison to null")
    } catch {
      //do nothing
    }
  });
  suite.addTest(()=>{
    try {
      isEqual(null, "value")
      throw new Error("isEqual() should throw on null comparison")
    } catch {
      //do nothing
    }
  });
  suite.addTest(()=>{
    try {
      isEqual(1234, 4321)
      throw new Error("isEqual() should throw on mismatching integers")
    } catch {
      //do nothing
    }
  });
  suite.addTest(()=>{
    try {
      isEqual(1234.56, 6543.21)
      throw new Error("isEqual() should throw on mismatching decimals")
    } catch {
      //do nothing
    }
  });
  suite.addTest(()=>{
    try {
      isEqual(true, false)
      throw new Error("isEqual() should throw on mismatching booleans")
    } catch {
      //do nothing
    }
  });
  suite.addTest(()=>{
    try {
      isEqual(arr1a, arr2)
      throw new Error("isEqual() should throw on mismatching arrays")
    } catch {
      //do nothing
    }
  });
  suite.addTest(()=>{
    try {
      isEqual(obj1a, obj2)
      throw new Error("isEqual() should throw on mismatching objects")
    } catch {
      //do nothing
    }
  });
  return suite;
}

function getSuiteIsTrue_() {
  let suite = newTestSuite("isTrue()");
  suite.addTest(()=>{isTrue(true)});
  suite.addTest(()=>{
    try {
      isTrue(false)
      throw new Error("isTrue() should throw an error on true")
    } catch {
      //do nothing
    }
  });
  return suite;
}

function getSuiteIsFalse_() {
  let suite = newTestSuite("isFalse()");
  suite.addTest(()=>{isFalse(false)});
  suite.addTest(()=>{
    try {
      isFalse(true)
      throw new Error("isFalse() should throw an error on true")
    } catch {
      //do nothing
    }
  });
  return suite;
}

function getSuiteIsTruthy_() {
  let suite = newTestSuite("isTruthy()");
  suite.addTest(()=>{isTruthy(-1)});
  suite.addTest(()=>{isTruthy(1)});
  suite.addTest(()=>{isTruthy("0")});
  suite.addTest(()=>{
    try {
      isTruthy(null)
      throw new Error("isTruthy() should throw an error on null")
    } catch {
      //do nothing
    }
  });
  suite.addTest(()=>{
    try {
      isTruthy(0)
      throw new Error("isTruthy() should throw an error on zero")
    } catch {
      //do nothing
    }
  });
  suite.addTest(()=>{
    try {
      isTruthy("")
      throw new Error("isTruthy() should throw an error on empty string")
    } catch {
      //do nothing
    }
  });
  return suite;
}

function getSuiteIsFalsy_() {
  let suite = newTestSuite("isFalsy()");
  suite.addTest(()=>{isFalsy(null)});
  suite.addTest(()=>{isFalsy(0)});
  suite.addTest(()=>{isFalsy("")});
  suite.addTest(()=>{
    try {
      isFalsy("0")
      throw new Error("isFalsy() should throw an error on non-empty string")
    } catch {
      //do nothing
    }
  });
  suite.addTest(()=>{
    try {
      isFalsy(1)
      throw new Error("isFalsy() should throw an error on positive number")
    } catch {
      //do nothing
    }
  });
  suite.addTest(()=>{
    try {
      isFalsy(-1)
      throw new Error("isFalsy() should throw an error on negative number")
    } catch {
      //do nothing
    }
  });
  return suite;
}

function getSuiteWillFail_() {
  let suite = newTestSuite("willFail()");
  customMsg = "My error message.";
  suite.addTest(()=>{willFail(() => {throw new Error()})});
  suite.addTest(()=>{willFail(() => {throw new Error(customMsg)}, customMsg)});
  suite.addTest(()=>{
    try {
      willFail(() => {});
      throw new Error("willFail() did not validate error not thrown.")
    } catch {
      //do nothing
    }
  });
  suite.addTest(()=>{
    try {
      willFail(() => {throw new Error(customMsg)}, "");
      throw new Error("willFail() did not validate error message.")
    } catch {
      //do nothing
    }
  });
  return suite;
}