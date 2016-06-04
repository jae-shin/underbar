(function() {
  'use strict';

  var checkForNativeMethods = function(runUnderbarFunction) {
    it('should not use the native version of any underbar methods in its implementation', function() {
      // These spies are set up in testSupport.js
      runUnderbarFunction();
      expect(Array.prototype.map.called).to.equal(false);
      expect(Array.prototype.indexOf.called).to.equal(false);
      expect(Array.prototype.forEach.called).to.equal(false);
      expect(Array.prototype.filter.called).to.equal(false);
      expect(Array.prototype.reduce.called).to.equal(false);
      expect(Array.prototype.every.called).to.equal(false);
      expect(Array.prototype.some.called).to.equal(false);
    });
  };

  describe('Advanced', function() {

    describe('invoke, when provided a function reference', function() {
      checkForNativeMethods(function() {
        _.invoke(['dog', 'cat'], _.identity);
      });

      it('runs the input function on each item in the array, and returns a list of results', function() {
        var reverse = function() {
          return this.split('').reverse().join('');
        };

        var reversedStrings = _.invoke(['dog', 'cat'], reverse);

        expect(reversedStrings).to.eql(['god', 'tac']);
      });

    });

    describe('invoke, when provided a method name', function() {
      checkForNativeMethods(function() {
        _.invoke(['dog', 'cat'], 'toUpperCase');
      });

      it('runs the specified method on each item in the array, and returns a list of results', function() {
        var upperCasedStrings = _.invoke(['dog', 'cat'], 'toUpperCase');

        expect(upperCasedStrings).to.eql(['DOG', 'CAT']);
      });
    });

    describe('sortBy', function() {
      checkForNativeMethods(function() {
        _.sortBy([{name: 'curly', age: 50}, {name: 'moe', age: 30}], function(person) {
          return person.age;
        });
      });

      it('should sort by age', function() {
        var people = [{name: 'curly', age: 50}, {name: 'moe', age: 30}];
        people = _.sortBy(people, function(person) {
          return person.age;
        });

        expect(_.pluck(people, 'name')).to.eql(['moe', 'curly']);
      });

      it('should handle undefined values', function() {
        var list = [undefined, 4, 1, undefined, 3, 2];
        var result = _.sortBy(list, function(i) { return i; });

        expect(result).to.eql([1, 2, 3, 4, undefined, undefined]);
      });

      it('should sort by length', function() {
        var list = ['one', 'two', 'three', 'four', 'five'];
        var sorted = _.sortBy(list, 'length');

        expect(sorted).to.eql(['one', 'two', 'four', 'five', 'three']);
      });

      it('should produce results that change the order of the list as little as possible', function() {
        var Pair = function(x, y) {
          this.x = x;
          this.y = y;
        };

        var collection = [
          new Pair(1, 1), new Pair(1, 2),
          new Pair(1, 3), new Pair(1, 4),
          new Pair(1, 5), new Pair(1, 6),
          new Pair(2, 1), new Pair(2, 2),
          new Pair(2, 3), new Pair(2, 4),
          new Pair(2, 5), new Pair(2, 6),
          new Pair(undefined, 1), new Pair(undefined, 2),
          new Pair(undefined, 3), new Pair(undefined, 4),
          new Pair(undefined, 5), new Pair(undefined, 6)
        ];

        var actual = _.sortBy(collection, function(pair) {
          return pair.x;
        });

        expect(actual).to.eql(collection);
      });
    });

    describe('flatten', function() {
      checkForNativeMethods(function() {
        _.flatten([1, [2], [3, [[[4]]]]]);
      });

      it('can flatten nested arrays', function() {
        var nestedArray = [1, [2], [3, [[[4]]]]];

        expect(_.flatten(nestedArray)).to.eql([1, 2, 3, 4]);
      });
    });

    describe('zip', function() {
      checkForNativeMethods(function() {
        _.zip(['moe', 'larry', 'curly'], [30, 40, 50], [true]);
      });

      it('should zip together arrays of different lengths', function() {
        var names = ['moe', 'larry', 'curly'];
        var ages = [30, 40, 50];
        var leaders = [true];

        expect(_.zip(names, ages, leaders)).to.eql([
          ['moe', 30, true],
          ['larry', 40, undefined],
          ['curly', 50, undefined]
        ]);
      });
    });

    describe('intersection', function() {
      checkForNativeMethods(function() {
        _.intersection(['moe', 'curly', 'larry'], ['moe', 'groucho']);
      });

      it('should take the set intersection of two arrays', function() {
        var stooges = ['moe', 'curly', 'larry'];
        var leaders = ['moe', 'groucho'];

        expect(_.intersection(stooges, leaders)).to.eql(['moe']);
      });

    });

    describe('difference', function() {
      checkForNativeMethods(function() {
        _.difference([1, 2, 3], [2, 30, 40]);
      });

      it('should return the difference between two arrays', function() {
        var diff = _.difference([1, 2, 3], [2, 30, 40]);

        expect(diff).to.eql([1, 3]);
      });

      it('should return the difference between three arrays', function() {
        var result = _.difference([1, 2, 3, 4], [2, 30, 40], [1, 11, 111]);

        expect(result).to.eql([3, 4]);
      });

    });

    describe('throttle, when given a wait of 100ms', function() {
      var callback;

      beforeEach(function() {
        callback = sinon.spy();
      });

      checkForNativeMethods(function() {
        _.throttle(callback, 100);
      });

      it('should return a function callable twice in the first 200ms', function() {
        var fn = _.throttle(callback, 100);
        fn(); // called
        setTimeout(fn, 50);
        setTimeout(fn, 100); // called
        setTimeout(fn, 150);
        setTimeout(fn, 199);
        clock.tick(200);

        expect(callback).to.have.been.calledTwice;
      });

    });

    describe('throttle, as described in Precourse docs', function() {
      var argSpy = sinon.spy();

      beforeEach(function() {

      });

      checkForNativeMethods(function() {
        _.throttle(argSpy, 100);
      });

      it('should pass arguments passed in to the original function', function() {
        var fn = _.throttle(argSpy, 100);
        fn(1, 2);
        expect(argSpy).to.have.been.calledWith(1, 2);
      });

      it('should return a function that schedules a second call to the function when called \
        within the wait period, and ignores subsequent calls until the wait period is over', function() {
        var calledTimes = [];
        var timeSpy = sinon.spy(function() {
          calledTimes.push(Date.now());
        });

        var fn = _.throttle(timeSpy, 100);
        fn();                // 0 ms: called normally
        setTimeout(fn, 10);  // schedule call for 100 ms
        setTimeout(fn, 25);  // ignored
        setTimeout(fn, 35);  // ignored
        setTimeout(fn, 45);  // ignored
                             // 100 ms: called by schedule
        setTimeout(fn, 225); // 225 ms: called normally
        setTimeout(fn, 300); // schedule call for 325 ms
        setTimeout(fn, 305); // ignored
                             // 325 ms: called by schedule
        setTimeout(fn, 800); // 800 ms: called normally
        setTimeout(fn, 801); // schedule call for 900 ms
                             // 900 ms: called by schedule
        clock.tick(900);

        var relativeTimes = calledTimes.map(function(time) {
          return time - calledTimes[0];
        });
        expect(relativeTimes).to.deep.equal([0, 100, 225, 325, 800, 900]);
      });

      it('should always return the most recently returned value of the original function', function() {
        var add = function(x, y) {
          return x + y;
        };
        var throttledAdd = _.throttle(add, 100);
        var returns = [];

        setTimeout(function() { returns.push(throttledAdd(2, 3)); }, 10);  // call callback and return new value (5)
        setTimeout(function() { returns.push(throttledAdd(2, 4)); }, 20);  // throttled; return old value (5), schedule
        setTimeout(function() { returns.push(throttledAdd(2, 5)); }, 30);  // throttled; return old value (5)
        setTimeout(function() { returns.push(throttledAdd(2, 6)); }, 40);  // throttled; return old value (5)
                                                                           // 110 ms: scheduled call fires, (result discarded)
        setTimeout(function() { returns.push(throttledAdd(2, 7)); }, 220); // call callback and return new value (9)
        clock.tick(220);

        expect(returns).to.deep.equal([5, 5, 5, 5, 9]);
      });

    });
    
  });

}());
