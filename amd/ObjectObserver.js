(function (window, Object) {
    'use strict';

    var simpleMap = (function () {
        var _simpleMapPrototype = {
            size: function () {
                return this.keys().length;
            },
            add: function (key, val) {
                this.keys().push(key);
                this.values().push(val);

                return this.get(key);
            },
            remove: function (key) {
                var index = this.keys().indexOf(key);

                if (index >= 0) {
                    this.keys().splice(index, 1);
                    this.values().splice(index, 1);
                }
            },
            get: function (key) {
                return this.values()[this.keys().indexOf(key)];
            }
        };

        return function () {
            var keys = [],
                values = [];

            return Object.create(_simpleMapPrototype, {
                keys: {
                    value: function () {
                        return keys;
                    }
                },
                values: {
                    value: function () {
                        return values;
                    }
                }
            });
        };
    }());

    define ([], function () {
        var _observers = simpleMap();

        function _addListener (obj, prop) {
            var _val,
                _initialValue = obj[prop],
                _initialPropertyDescriptor = Object.getOwnPropertyDescriptor(obj, prop),
                _initialSetter = _initialPropertyDescriptor && _initialPropertyDescriptor.set;

            Object.defineProperty(obj, prop, {
                set: function (val) {
                    _initialSetter && _initialSetter(val);

                    if (val !== _val) {
                        _observers.get(obj).get(prop).forEach(function (callback) {
                            callback(val);
                        });

                        _val = val;
                    }
                },
                get: function () {
                    return _val;
                }
            });

            obj[prop] = _initialValue;
        }

        function _removeListener (obj, prop) {
            var _val = obj[prop];

            delete obj[prop];
            obj[prop] = _val;
        }

        function observe (obj, prop, callback) {
            var _props = _observers.get(obj),
                _callbacks;

            // create empty object-properties map, if object not yet in the observers maps
            if (!_props) {
                _props = _observers.add(obj, simpleMap());
            }

            _callbacks = _props.get(prop);

            // create empty properties-callback map, if property not yet in the object-properties map
            if (!_callbacks) {
                _callbacks = _props.add(prop, []);
                _addListener(obj, prop);
            }

            // add setter callback, if not yet in the callback list
            if (_callbacks.indexOf(callback) < 0) {
                _callbacks.push(callback);
            }
        }

        function unobserve (obj, prop, callback) {
            var _props = _observers.get(obj),
                _callbacks,
                _index;

            // if object not observed, leave immediately
            if (!_props) { return; }

            _callbacks = _props.get(prop);

            // if property not observed, leave immediately
            if (!_callbacks) { return; }

            // if callback in callback list, remove it
            _index = _callbacks.indexOf(callback);
            if (_index >= 0) {
                _callbacks.splice(_index, 1);
            }

            // clean up map and object properties, when no callbacks left
            if (!_callbacks.length) {
                _props.remove(prop);
                _removeListener(obj, prop);

                if (!_props.size()) {
                    _observers.remove(obj);
                }
            }
        }

        return {
            observe: observe,
            unobserve: unobserve
        };
    });
}(window, Object));
