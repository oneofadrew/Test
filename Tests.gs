
/**
 * Run all the tests for the Test library
 */
function runTests_() {
  suite = getSuiteIsEqual_()
    .addSuite(getSuiteIsTrue_())
    .addSuite(getSuiteIsFalse_())
    .addSuite(getSuiteIsTruthy_())
    .addSuite(getSuiteIsFalsy_())
    .addSuite(getSuiteWillFail_())
    .addSuite(getSuiteMock_());
  suite.run();
}

function getSuiteIsEqual_() {
  let suite = newTestSuite("isEqual()");
  suite.addTest(testIsEqualHappyPath_);
  suite.addTest(testIsEqualUnhappyPath_);
  return suite;
}

function testIsEqualHappyPath_() {
  let arr1 = [0,1,2,3];
  let arr2 = [0,1,2,3];
  let obj1 = {
    "key1" : "val1",
    "key2" : {
      "subkey1" : "subval1"
    }
  }
  let obj2 = {
    "key2" : {
      "subkey1" : "subval1"
    },
    "key1" : "val1"
  }
  isEqual("value", "value");
  isEqual("", "");
  isEqual(0, 0);
  isEqual(1234, 1234);
  isEqual(1234.1234, 1234.1234);
  isEqual(null, null);
  isEqual(arr1, arr1);
  isEqual(arr1, arr2);
  isEqual(obj1, obj1);
  isEqual(obj1, obj2);
}

function testIsEqualUnhappyPath_() {
  let arr1 = [0,1,2,3];
  let arr2 = [3,2,1,0];
  let arr3 = [0,1,2];
  let obj1 = {
    "key1" : "val1",
    "key2" : {
      "subkey1" : "subval1"
    },
    "key3" : "val3",
  }
  let obj2 = {
    "foo1" : "bar2",
    "foo2" : {
      "subfoo1" : "subbar1"
    },
    "foo3" : "bar3",
  }
  let obj3 = {
    "key1" : "val1",
    "key2" : {
      "subkey1" : "subval1"
    }
  }
  willFail(() => {isEqual("value", "eulav")}, null, "isEqual() should throw on mismatching strings");
  willFail(() => {isEqual("value", null)}, null, "isEqual() should throw on comparison to null");
  willFail(() => {isEqual(null, "value")}, null, "isEqual() should throw on null comparison");
  willFail(() => {isEqual(1234, 4321)}, null, "isEqual() should throw on mismatching integers");
  willFail(() => {isEqual(1234.56, 6543.21)}, null, "isEqual() should throw on mismatching decimals");
  willFail(() => {isEqual(true, false)}, null, "isEqual() should throw on mismatching booleans");
  willFail(() => {isEqual(arr1, arr2)}, null, "isEqual() should throw on mismatching arrays - 1");
  willFail(() => {isEqual(arr2, arr1)}, null, "isEqual() should throw on mismatching arrays - 2");
  willFail(() => {isEqual(arr1, arr3)}, null, "isEqual() should throw on mismatching arrays - 3");
  willFail(() => {isEqual(arr3, arr1)}, null, "isEqual() should throw on mismatching arrays - 4");
  willFail(() => {isEqual(obj1, obj2)}, null, "isEqual() should throw on mismatching objects - 1");
  willFail(() => {isEqual(obj2, obj1)}, null, "isEqual() should throw on mismatching objects - 2");
  willFail(() => {isEqual(obj1, obj3)}, null, "isEqual() should throw on mismatching objects - 3");
  willFail(() => {isEqual(obj3, obj1)}, null, "isEqual() should throw on mismatching objects - 4");
}

function getSuiteIsTrue_() {
  let suite = newTestSuite("isTrue()");
  suite.addTest(testIsTrueHappyPath_);
  suite.addTest(testIsTrueUnhappyPath_);
  return suite;
}

function testIsTrueHappyPath_() {
  isTrue(true)
}

function testIsTrueUnhappyPath_() {
  try {
    isTrue(false);
    throw new Error("isTrue() should throw an error on true");
  } catch {
    //do nothing
  }
}

function getSuiteIsFalse_() {
  let suite = newTestSuite("isFalse()");
  suite.addTest(testIsFalseHappyPath_);
  suite.addTest(testIsFalseUnhappyPath_);
  return suite;
}

function testIsFalseHappyPath_() {
  isFalse(false)
}

function testIsFalseUnhappyPath_() {
  try {
    isFalse(true);
    throw new Error("isFalse() should throw an error on true");
  } catch {
    //do nothing
  }
}

function getSuiteIsTruthy_() {
  let suite = newTestSuite("isTruthy()");
  suite.addTest(testIsTruthyHappyPath_);
  suite.addTest(testIsTruthyUnhappyPath_);
  return suite;
}

function testIsTruthyHappyPath_() {
  isTruthy(-1);
  isTruthy(1);
  isTruthy("0");
}

function testIsTruthyUnhappyPath_() {
  willFail(() => {isTruthy(null)}, null, "isTruthy() should throw an error on null");
  willFail(() => {isTruthy(0)}, null, "isTruthy() should throw an error on zero");
  willFail(() => {isTruthy("")}, null, "isTruthy() should throw an error on empty string");
}

function getSuiteIsFalsy_() {
  let suite = newTestSuite("isFalsy()");
  suite.addTest(testIsFalsyHappyPath_);
  suite.addTest(testIsFalsyUnhappyPath_);
  return suite;
}

function testIsFalsyHappyPath_() {
  isFalsy(null);
  isFalsy(0);
  isFalsy("");
}

function testIsFalsyUnhappyPath_() {
  willFail(() => {isFalsy("0")}, null, "isFalsy() should throw an error on non-empty string");
  willFail(() => {isFalsy(1)}, null, "isFalsy() should throw an error on positive number");
  willFail(() => {isFalsy(-1)}, null, "isFalsy() should throw an error on negative number");
}

function getSuiteWillFail_() {
  let suite = newTestSuite("willFail()");
  suite.addTest(testWillFailHappyPath_);
  suite.addTest(testWillFailUnhappyPath_);
  return suite;
}

function testWillFailHappyPath_() {
  customMsg = "My error message.";
  willFail(() => {throw new Error()});
  willFail(() => {throw new Error(customMsg)}, customMsg);
}

function testWillFailUnhappyPath_() {
  customMsg = "My error message.";
  let error = false;

  try {
    willFail(() => {});
    error = true;
  } catch {
    //do nothing
  }
  if (error) throw new Error("willFail() did not validate error not thrown.");

  try {
    willFail(() => {throw new Error(customMsg)}, "The wrong message");
    error = true;
  } catch {
    //do nothing
  }
  if (error) throw new Error("willFail() did not validate error message.");
}

function getSuiteMock_() {
  let suite = newTestSuite("Mock");
  suite.addTest(testMockExpects_);
  suite.addTest(testMockMultipleExpects_);
  suite.addTest(testMockWithArgs_);
  suite.addTest(testMockWithOneArg_);
  suite.addTest(testMockWithNoArgs_);
  suite.addTest(testMockWillReturn_);
  suite.addTest(testMockWillThrow_);
  return suite;
}

function testMockExpects_() {
  let mock = new Mock();
  mock.expects("foo");
  mock.expects("bar");

  let mockedObject = mock.build();
  isFalsy(mockedObject.foo());
  isFalsy(mockedObject.bar());
  mockedObject.validate();

  mockedObject = mock.build();
  isFalsy(mockedObject.foo());
  willFail(() => {mockedObject.validate()});

  mockedObject = mock.build();
  willFail(() => {mockedObject.bar()});
}

function testMockMultipleExpects_() {
  let mock = new Mock();
  mock.expects("doThing").withArgs("one").willReturn(true);
  mock.expects("doThing").withArgs("two").willReturn(false);

  let mockedObject = mock.build();
  isTrue(mockedObject.doThing("one"));
  isFalse(mockedObject.doThing("two"));
  mockedObject.validate();

  mockedObject = mock.build();
  isTrue(mockedObject.doThing("one"));
  willFail(() => {mockedObject.validate()});

  mockedObject = mock.build();
  willFail(() => {mockedObject.doThing("two")});
}

function testMockWithArgs_() {
  let mock = new Mock();
  mock.expects("doThing").withArgs("one", "two").willReturn(true);

  let mockedObject = mock.build();
  isTrue(mockedObject.doThing("one", "two"));
  
  mockedObject = mock.build();
  willFail(() => {mockedObject.doThing("one")});
  
  mockedObject = mock.build();
  willFail(() => {mockedObject.doThing()});
}

function testMockWithOneArg_() {
  let mock = new Mock();
  mock.expects("doThing").withArgs("one").willReturn(true);

  let mockedObject = mock.build();
  isTrue(mockedObject.doThing("one"));
  
  mockedObject = mock.build();
  willFail(() => {mockedObject.doThing("one", "two")});
  
  mockedObject = mock.build();
  willFail(() => {mockedObject.doThing()});
}

function testMockWithNoArgs_() {
  let mock = new Mock();
  mock.expects("doThing").willReturn(true);

  let mockedObject = mock.build();
  isTrue(mockedObject.doThing());
  
  mockedObject = mock.build();
  willFail(() => {mockedObject.doThing("one")});
  
  mockedObject = mock.build();
  willFail(() => {mockedObject.doThing("one", "two")});
}

function testMockWillReturn_() {
  let values = [true, false, 100, 100.001, {}, [0,1,2], null, "string", ""];
  let mock = new Mock();
  for (i in values) mock.expects("doThing").willReturn(values[i]);


  mock = new Mock().expects("doThing");
  mockedObject = mock.build();
  isEqual(mockedObject.doThing(), undefined);
}

function testMockWillThrow_() {
  let mock = new Mock();
  mock.expects("doThing").willThrow(new Error("It failed"));

  let mockedObject = mock.build();
  willFail(() => {mockedObject.doThing()}, "It failed");
}