/*global require, describe, it, expect, setTimeout, waitsFor */
delete require.cache[require.resolve('../fuq.js')];
var fuq = require('../fuq.js');

describe('FuQ src', function() {
    it('should be a string', function() {
        expect(typeof fuq.src).toBe('string');
    });
    
    it('should <= 140 chars', function() {
        expect(fuq.src.length).toBeLessThan(140);    
    });
    
    it('should be compilable', function() {
        eval(fuq.src);
        expect(FuQ).toBeDefined();
    });
});


describe('FuQ constructor', function() {
    it('should be a function', function() {
        expect(typeof FuQ).toBe('function');
    }); 
    
    var queue = FuQ();
    it('should create a queue', function() {
        expect(queue).toBeDefined();
    });
});

describe('Queue', function() {
    var queue = FuQ();
    
    it('should have run method', function() {
        expect(typeof queue.run).toBe('function');
    });
    
    it('should have q property', function() {
        expect(queue.q).toBeDefined();    
    });
    
    it('should provide q.q methond', function() {
        expect(typeof queue.q.q).toBe('function');    
    });
});

describe('Chained calls', function() {
    var dfd = FuQ(),
        q = dfd.q,
        arg = {},
        arg2 = {};
    
    it('should chain result as argument', function() {
        q.q(function(data) {
            expect(data).toBe(arg);
            return arg2;
        }, function(data) {
            expect(data).toBe(arg2);   
        });
        
        dfd.run(arg);
    });    
});

describe('Empty queue', function(){
    it('should work without callbacks', function(){
        var dfd = FuQ().run();
        expect(true).toBe(true);
    });
});

describe('No argument run', function() {
    it('should run without arguments', function() {
        var dfd = FuQ(),
            q = dfd.q;
        
        q.q(function(data){
            expect(data).not.toBeDefined();
        });
        
        dfd.run();
    });
});

describe('Nested async queue', function() {
    
    it('should wait for nested queue', function() {
        function later(timeout, data) {
            var dfd = FuQ();

            setTimeout(function(){
                dfd.run(data);
            }, timeout);

            return dfd.q;
        }

        var arg1 = {}, arg2 = {}, arg3 = {}, arg4 = {}, arg5 = {}, value = 0;

        var q = later(1000, arg1);


        q.q(function(data) {
            expect(data).toBe(arg1);
            expect(value).toBe(0);
            value = 1;

            var q = later(1000, arg2);

            q.q(function(data){
                expect(data).toBe(arg2);
                expect(value).toBe(1);
                value = 2;
                return arg3;
            }, function(data){
                expect(data).toBe(arg3);
                expect(value).toBe(2);
                value = 3;
                return arg4;
            });

            return q;
        }, function(data) {
            expect(data).toBe(arg4);
            expect(value).toBe(3);
            value = 4;
            return arg5;
        }, function(data) {
            expect(data).toBe(arg5);
            expect(value).toBe(4);
            value = 5;
        });

        waitsFor(function(){
            return value === 5;
        }, 'should ran 2000 seconds', 3000);
    });
});