function _version(fn, name){
  return function(){
    var args = Array.prototype.slice.call(arguments)
    var version = args[0].__version || 0
    runHooks(name, version, args)
    if(!runFallback(name, version, args)){
      args.push(version)
      return fn.apply(this, args)
    }
  }
}

function runFallback(name, version, args){
  var ensuredVersion = ensuredVersionForMethod(name)
  var fb = fallbackForMethod(name)
  if(version < ensuredVersion && fb){
    fb(args[0], version, ensuredVersion)
    return true
  } else {
    return false
  }
}

function runHooks(name, version, args){
  var ensuredVersion = ensuredVersionForMethod(name)
  if(version < ensuredVersion){
    for(var i = 0, h; h = hooks[i], h !== undefined; i++){
      h(args[0], version, ensuredVersion)
    }
  }
}

function fallbackForMethod(method){
  var fb = registerdFallbacks[method]
  if(fb === undefined) fb = registerdFallbacks.global
  return fb
}

function ensuredVersionForMethod(method){
  var version = ensuredVersions[method]
  if(version === undefined) version = ensuredVersions.global
  return version
}

function ensureVersionForMethod(version, method, fallback){
  if(version > ensuredVersionForMethod(method)){
    ensuredVersions[method] = version
    registerdFallbacks[method] = fallback
  }
}

var hooks = []
var registerMismatchHook = function(fn){ hooks.push(fn) }

var ensuredVersions = { global: 0 }
var registerdFallbacks = { }
var ensure = function(version, name, fallback){
  var args = Array.prototype.slice.call(arguments)

  if(args.length === 1) {
    ensureVersionForMethod(version, 'global')
  } else if(typeof name === 'string') {
    ensureVersionForMethod(version, name, fallback)
  } else if(typeof name === 'function') {
    ensureVersionForMethod(version, 'global', name)
  } else if(name instanceof Array){
    for(var i = 0, n; n = name[i], n !== undefined; i++){
      ensureVersionForMethod(version, n, fallback)
    }
  }
}

var enable = function(klass){
  for(method in klass){
    klass[method] = _version(klass[method], method)
  }
  return klass
}

var reset = function(){
  hooks = []
  ensuredVersions = { global: 0 }
  registerdFallbacks = { }
}

module.exports = depreciator = {
  reset: reset
, enable: enable
, ensure: ensure
, registerMismatchHook: registerMismatchHook
}
