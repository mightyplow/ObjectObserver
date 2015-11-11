# Observable
small js library to watch objects for changes

# What gets created by this script
The script creates an object on the window with the name 'Observer'.

# The interface of the 'Observer' object
- methods
    - observe (object, property, callback)
        - listens for changes of the given property on the given object and invokes the callback with the new value, if the value gets set
        - callbacks only get invoked, if the new value is different from the old one
        - unique callbacks get only added once
    - unobserve (object, property, callback)
        - removes the listeners for the property changes of the given object

# Example
```
var f = {
        foo: 'foo'
    },

    cb = function (newVal) {
        console.log(newVal);
    },

    i = document.getElementById('foo');

Observer.observe(f, 'foo', cb);

console.log(f.foo) // >> foo
f.foo = 'bar'; // >> bar

Observer.unobserve(f, 'foo', cb);
f.foo = 'baz'; // >> [no output]
```

# Notes
- when deleting an object property which gets observed, the observing of that property gets lost
    - to reenable observing, you have to call Observer.observe() again
