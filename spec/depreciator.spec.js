var depreciator = require("../index")

describe('depreciator', function() {
  var thing

  beforeEach(function() {
    thing = {}
  })

  afterEach(function() {
    depreciator.reset()
  })

  describe('enable', function() {

    describe('extracted version', function() {

      it('passes to the function', function(done) {
        thing.f = function(e, v) {
          expect(v).toBe(1)
          done()
        }
        var element = { __version: 1 }
        depreciator.enable(thing)
        thing.f(element)
      })

      it('passes 0 for no version', function(done) {
        thing.f = function(e, v) {
          expect(v).toBe(0)
          done()
        }
        depreciator.enable(thing)
        thing.f({})
      })

      it('passes additional parameters through', function(done) {
        thing.f = function(e, p1, p2, v) {
          expect(p1).toBe('one')
          expect(p2).toBe('two')
          done()
        }
        depreciator.enable(thing)
        thing.f({}, 'one', 'two')
      })

    })

  })

  describe('ensure', function() {

    describe('specific version', function() {

      it('for default runs hooks for mismatch', function(done) {
        var hookRan = false
        var element = { __version: 1 }
        thing.f = function(e, v) {
          expect(hookRan).toBe(true)
          done()
        }

        depreciator.registerMismatchHook(function(e, version, expected) {
          expect(e).toBe(element)
          expect(version).toBe(1)
          expect(expected).toBe(2)
          hookRan = true
        })

        depreciator.ensure(2)
        depreciator.enable(thing)
        thing.f(element)
      })

      it('for a method', function(done) {
        var hookRan = 0
        var element = { __version: 1 }
        thing.f = function(e, v) { expect(hookRan).toBe(1); done() }
        thing.b = function(_, _) { }
        depreciator.registerMismatchHook(function(e, _, _) { hookRan++ })
        depreciator.ensure(2, 'f')
        depreciator.enable(thing)
        thing.b(element)
        thing.f(element)
      })

      it('for a number of methods', function(done) {
        var hookRan = 0
        var element = { __version: 1 }
        thing.f = function(e, v) { expect(hookRan).toBe(2); done() }
        thing.b = function(_, _) { }
        depreciator.registerMismatchHook(function(_, _, _) { hookRan++ })
        depreciator.ensure(2, ['f', 'b'])
        depreciator.enable(thing)
        thing.b(element)
        thing.f(element)
      })

    })

    describe('set fallback behavior', function() {

      it('replaces the function with the fallback', function(done) {
        thing.f = function() { expect(true).toBeFalsy() /* this should never run */ }
        depreciator.ensure(2, 'f', function(e, version, expected) { done() })
        var element = { __version: 1 }
        depreciator.enable(thing)
        thing.f(element)
      })

      it('works for a global fallback', function(done) {
        thing.f = function() { expect(true).toBeFalsy() /* this should never run */ }
        depreciator.ensure(2, function(e, version, expected) { done() })
        var element = { __version: 1 }
        depreciator.enable(thing)
        thing.f(element)
      })

    })

  })

})
