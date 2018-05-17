var assert = require('proclaim');

var Cookies = require('js-cookie');
var cookie = require('../../../../lib/utils/cookie');

describe('Keen.utils.cookie', function() {

  beforeEach(function(){
    this.cookie = cookie('keen-test-cookie');
  });

  afterEach(function(){
    this.cookie.expire();
  });

  describe('constructor', function(){

    it('should return a constructed object', function() {
      expect().isObject(this.cookie);
    });

    it('should have internal properties', function() {
      expect().isObject(this.cookie.data);
      expect().isObject(this.cookie.config.options);
      expect().isString(this.cookie.config.key);
      expect().equal(this.cookie.config.key, 'keen-test-cookie');
    });

    it('should have prototype methods', function() {
      expect().isFunction(this.cookie.get);
      expect().isFunction(this.cookie.set);
      expect().isFunction(this.cookie.expire);
    });

  });

  describe('.get', function(){

    it('should return a simple string for pre-existing non-json data', function(){
      Cookies.set('keen-test-cookie', 'some thing that is not json');
      expect().deepEqual(this.cookie.get(), 'some thing that is not json');
    });

    it('should return an empty object when no key name is provided and no data has been stored', function(){
      expect().deepEqual(this.cookie.get(), {});
    });

    it('should return stored key', function(){
      this.cookie.set('mocha-test-getter', 123);
      expect().deepEqual(this.cookie.get('mocha-test-getter'), 123);
    });

    it('should return null when requesting an unstored key', function(){
      expect().isNull(this.cookie.get('mocha-null'));
    });

  });

  describe('.set', function(){

    it('should set a string value', function(){
      this.cookie.set('library', 'keen-tracking.js');
      expect().equal(this.cookie.get('library'), 'keen-tracking.js');
    });

    it('should set a numeric value', function(){
      this.cookie.set('number', 123);
      expect().equal(this.cookie.get('number'), 123);
    });

    it('should set an array value', function(){
      this.cookie.set('array', ['1', 2, false]);
      expect().deepEqual(this.cookie.get('array'), ['1', 2, false]);
    });

    it('should set an object value to a key', function(){
      this.cookie.set('object', { object: true });
      expect().deepEqual(this.cookie.get('object'), { object: true });
    });

    it('should set an object of key:value pairs', function(){
      this.cookie.set({
        library: 'keen-tracking.js',
        number: 123,
        array: ['1', 2, false],
        object: { object: true }
      });
      var data = this.cookie.get();
      expect().equal(data.library, 'keen-tracking.js');
      expect().equal(data.number, 123);
      expect().deepEqual(data.array, ['1', 2, false]);
      expect().deepEqual(data.object, { object: true });
    });

  });

  describe('.expire', function(){

    it('should expire the cookie', function(){
      this.cookie.set('library', 'keen-tracking.js');
      this.cookie.expire();
      expect().deepEqual(this.cookie.get(), {});
    });

  });

  describe('.options', function(){

    it('should set options for cookies', function(){
      this.cookie.options({ secure: false });
      expect().equal(this.cookie.config.options.secure, false);
    });

    it('should get options for cookies', function(){
      this.cookie.options({ secure: false });
      expect().deepEqual(this.cookie.options(), { secure: false });
    });

  });

  describe('.enabled', function(){

    it('should return a boolean value', function(){
      expect().isBoolean(this.cookie.enabled());
    });

  });

});
