FuQ
===

Functional Queue in &lt;= 140 chars of code. Actually it is 122 now, so there is 18 symbols more you can add. :)

```javascript
FuQ=function(c,o){return{run:function r(d){for(o=d;(d=c.shift())&&!((o=d(o))&&o.q&&o.q(r)););},q:{q:(c=[]).push.bind(c)}}}
```

Library provides an easy way to chain asynchrnous function calls.

Example
=====

Demonstrates asynchronous nested queues.
Logs:

* `Hello, world!`  in a second.
* `Nested: Hello, world!` in 2 seconds.
* `Nested: Nested: Hello, world!` immediately after the second one.


```javascript
function later(timeout, data) {
    var dfd = FuQ(); 
    
    setTimeout(function(){
        dfd.run(data); //run all added functions
    }, timeout)
    
    return dfd.q; //return a queue;
}

function tap(f) { //make any function to return its first argument
    return function(data){
        f.apply(this, arguments);
        return data;
    }
}

var log = tap(console.log.bind(console)); //make console.log to return its first argument

later(1000, 'Hello, world!').q(log, function(msg){
    var q = later(2000, 'Nested: ' + msg);
    
    q.q(log, function(msg) { //log and process a message
        return 'Nested: ' + msg;
    });
    
    return q; //return a nested async queue
}, log);

```

