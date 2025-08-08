zhzddzfhypwzfbji

---
```javascript
function macro() { 
    for (var _len = arguments.length, macroArgs = new Array(_len), _key = 0; _key < _len; _key++) { 
        macroArgs[_key] = arguments[_key]; } var argCount = numArgs(macroArgs); var args; var kwargs = getKeywordArgs(macroArgs); if (argCount > argNames.length) { args = macroArgs.slice(0, argNames.length); // Positional arguments that should be passed in as // keyword arguments (essentially default values) 
macroArgs.slice(args.length, argCount).forEach(function (val, i) { if (i < kwargNames.length) { kwargs[kwargNames[i]] = val; } }); args.push(kwargs); } else if (argCount < argNames.length) { args = macroArgs.slice(0, argCount); for (var i = argCount; i < argNames.length; i++) { var arg = argNames[i]; // Keyword arguments that should be passed as // positional arguments, i.e. the caller explicitly // used the name of a positional arg args.push(kwargs[arg]); delete kwargs[arg]; } args.push(kwargs); } else { args = macroArgs; } return func.apply(this, args); }
```