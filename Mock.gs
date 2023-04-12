/**
 * An internal helper that provides the metadata for a mocked function to the mock
 * @param name: the name of the function that will be called
 * @property args: the arguments that the function will be called with
 * @property returnValue: the value the function will return. This will only return if the function doesn't throw an error.
 * @property error: an error to throw. If this is set then the function will not return a value
 */
function MockFunction_(name) {
  this.name = name;
  this.args;
  this.returnValue;
  this.error;
}

/**
 * This is the Mock that mocks out a dependency. You can chain the function expectation calls to allow for very readable code in tests.
 * The generated mock object has both explicit and implicit expectations
 * Explicit:
 *  - Functions will be called with the names that have been provided for the mock. Unmocked functions will not exist and so cause an error
 *  - Functions when called will have their parameters compared against any provided parameters for the mocked function
 * Implicit
 *  - Functions will be called in the sequence they are specified in. If not an error will be thrown.
 *  - It can be checked that all mocked functions have been invoked by calling the validate() function on the generated mock object.
 * 
 * @function expects(name): sets the name of the function to expect and implicitly creates a new MockFunction_ to configure under the hood
 * @function withArgs(...args): sets the arguments the mocked functiuon should expect
 * @function willReturn(returnValue): sets the value that the mocked function will return. Ignored if an error is to be thrown instead.
 * @function willThrow(error): sets the error that will be thrown when the function is called. Any return value will be ignored.
 * @function build(): builds the mockedObject with the mock functions attached.
 * @function validate(): validates the mockedObject has been completely used up.
 */
class Mock {
  constructor() {
    this.functions = [];
  }

  expects(name) {
    this.functions[this.functions.length] = new MockFunction_(name);
    return this;
  }

  withArgs(...args) {
    this.functions[this.functions.length-1].args = args;
    return this;
  }

  willReturn(returnValue) {
    this.functions[this.functions.length-1].returnValue = returnValue;
    return this;
  }

  willThrow(error) {
    this.functions[this.functions.length-1].error = error;
    return this;
  }

  build() {
    //create our mocked target
    let target = {
      validate : () => {
        isEqual(target.callSequence, this.functions.length, `Expected ${this.functions.length} function calls but only received ${target.callSequence}`);
      }
    };

    //keep track of the sequence of functions. Functions should be called in the sequence they are provided in.
    target["callSequence"] = 0;
    target["functions"] = {};

    //mock out each of the functions on the target one at a time
    for (let i in this.functions) {
      //the metadata of the function to mock
      let functionMeta = this.functions[i];
      //uncomment for debugging purposes
      //console.log(`Mocking the function for ${JSON.stringify(functionMeta)}`);

      //create mocked function on the target
      let mockedFunction = (...args) => {
        //because of the wrapping of the function in the target, the args get boxed in an array so we need to unbox here
        args = args[0];
        //if args is an empty array it means nothing has been passed so should be undefined instead
        args = args.length == 0 ? undefined : args;

        //check that this function is called in the sequence it was created. This will be equivalent to it's position in the array.
        isEqual(target.callSequence, Number.parseInt(i), `Expected function ${functionMeta.name} with arguments ${JSON.stringify(functionMeta.args)} to be called in sequence ${i} but was ${target.callSequence}`);

        //the arguments should be equal to the expected arguments
        isEqual(args, functionMeta.args, `Expected the arguments to ${functionMeta.name} to be ${JSON.stringify(functionMeta.args)} but was ${JSON.stringify(args)}`)

        target["callSequence"]++;
        if (functionMeta.error) {
          throw functionMeta.error;
        }
        return functionMeta.returnValue
      }

      //Okay, we have the mocked function, but it could be called several times. To get around this
      //we keep track of the mocked functions and have a wrapper function that calls each mock of the
      //function in sequence.

      //first check to see if this is the first time we have seen this function name.
      if (!target.functions[functionMeta.name]) {
        //this is the first time this function has been mocked so we have some setup to do.
        //creates an empty array of the mocked functions with this name
        target.functions[functionMeta.name] = [];
        //sets the current call stack pointer of the mocked functions to the first one
        target.functions[functionMeta.name]["callStack"] = 0;
        //creates the wrapper function that will invoke the function from the mocked function array in order.
        target[functionMeta.name] = (...args) => {
          //get the current call stack pointer to know which function to call.
          let stackId = target.functions[functionMeta.name].callStack;
          //increment the call stack pointer so the next time this function is called we use the next function in order
          target.functions[functionMeta.name]["callStack"]++;
          //get the function as specified by the pointer in the function array
          let invoker = target.functions[functionMeta.name][stackId];
          //log the fact that the function is being called. Uncomment if debugging is required
          //console.log(`Invoking iteration ${stackId} of function ${functionMeta.name} with arguments ${JSON.stringify(args)}`);
          //call the function
          let returnValue = invoker(args);
          //log the fact the function was called and returned an argument. Uncomment if debugging is required
          //console.log(`Function ${functionMeta.name} with arguments ${JSON.stringify(args)} returned ${JSON.stringify(returnValue)}`);
          //return the return value
          return returnValue;
        }
      }
      //finally add the mocked function to the end of the function array
      target.functions[functionMeta.name][target.functions[functionMeta.name].length] = mockedFunction;
    }

    //we are done mocking functions - return the completed mock
    return target;
  }
};