# Depreciator versioning support for data argument

Sometimes a it is nice to know which version of data a function is passed.
Especially in NoSQL land it can be used to ensure some kind of schema, and
handle changes transparently.

Todo this Depreciator assumes that the data contains a numeric version under the
key \__version

  ```javascript
  { __version: 1, something: 'else', can: 'be here' }
  ```

This version is checked against the ensured, and actions can be take for it.
No version present assumes a 0.

## Usage


### enable depreciator
For depreciator to hook the functions it need to be required and enabled for a
given module

  ```javascript
  var depreciator = require('depreciator')

  var myThing = {
    myFunc: function(thing, param, stuff) {
      doGreatThings(thing, param, stuff)
    },
    func: function(thing, stuff) {
      doAwesomeStuff(thing, stuff)
    }
  }

  module.exports = depreciator.enable(myThing)
  ```

Now versions can be ensured on the functions, it will check the first argument
to the function for it's \__version field.

### ensure a version
ensure version for just this function

  ```javascript
  depreciator.ensure(2, 'myFunc')
  ```

ensure version globally for every function in the module it is enabled for.

  ```javascript
  depreciator.ensure(1)
  ```

### handle missmatches
ensure version for just this function and call fallback if versions don't match

  ```javascript
  version.ensure(3, 'func', function(thing, version, expectedVersion) {
    console.log("you are old")
  })
  ```

install a global fallback function to be called on version missmatch

  ```javascript
  version.ensure(1, function(thing, version, expected) {
    console.log("OLD!!!")
  })
  ```

### hook the function
register hook for when versions are not satisfied hooks are run before the function is called

  ```javascript
  version.registerMismatchHook(function(thing, version, expected) {
    console.log("OLD!!!")
  })
  ```

## License
MIT



