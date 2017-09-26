var assert = require('proclaim');
var Keen = require('../../../../lib/browser');
var each = require('../../../../lib/utils/each');
var listener = require('../../../../lib/utils/listener')(Keen);

describe('Keen.utils.listener', function() {

  beforeEach(function(){
    this.timeout(5000);
    Keen.debug = true;
  });

  it('should be a function', function(){
    assert.isFunction(listener);
  });

  it('should create a Keen.domListeners object', function(){
    assert.isObject(Keen.domListeners);
  });

  it('should create a Keen.listenTo function that creates unassigned listeners', function(){
    assert.isFunction(Keen.listenTo);
    Keen.listenTo({
      'resize window': function(e){}
    });
    assert.isObject(Keen.domListeners.resize);
    assert.isArray(Keen.domListeners.resize['window']);
  });

  it('should set window events', function(){
    var win = listener('window');
    var eventTypes = [
      'keydown',
      'keypress',
      'keyup',
      'mousedown',
      'mousemove',
      'mouseout',
      'mouseover',
      'mouseup',
      'blur',
      'focus',
      'hashchange',
      'resize',
      'scroll'
    ];
    each(eventTypes, function(type){
      win.on(type, function(e){ });
      assert.isObject(Keen.domListeners[type]);
      assert.isObject(Keen.domListeners[type]['window']);
    });
  });

  it('should set `<a>` events', function(){
    var a = listener('a#test-anchors');
    var eventTypes = [
      'mousedown',
      'mousemove',
      'mouseout',
      'mouseover',
      'mouseup'
    ];
    each(eventTypes, function(type){
      a.on(type, function(e){ });
      assert.isObject(Keen.domListeners[type]);
      assert.isObject(Keen.domListeners[type]['a#test-anchors']);
    });
  });

  it('should set `<form>` events', function(){
    var form = listener('form#test-forms');
    var eventTypes = [
      'keydown',
      'keypress',
      'keyup',
      'mousedown',
      'mousemove',
      'mouseout',
      'mouseover',
      'mouseup'
      // 'submit'
    ];
    each(eventTypes, function(type){
      form.on(type, function(e){ });
      assert.isObject(Keen.domListeners[type]);
      assert.isObject(Keen.domListeners[type]['form#test-forms']);
    });
  });


  it('should set and handle `<a>` click events set with .on("click", fn)', function(done){
    var listenToThis = listener('body a#listen-to-anchor');
    listenToThis.on('click', callback);

    this.timeout(5000);

    function callback(e){
      // Keen.log('click a#listen-to-anchor');
      done();
      return false;
    }

    setTimeout(function(){
      var ev, a;

      a = document.createElement("A");
      a.id = 'listen-to-anchor';
      a.href = './index.html';
      document.body.appendChild(a);

      if (a.click) {
        a.click();
      }
      else if(document.createEvent) {
        ev = document.createEvent("MouseEvent");
        ev.initMouseEvent("click",
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0,
            false, false, false, false,
            0, null
        );
        a.dispatchEvent(ev);
      }
    }, 1000);
  });

  it('should set and handle `<a>` click events set with .once("click", fn)', function(done){
    var listen = listener('a#listen-to-anchor-once');
    listen.once('click', callback);

    this.timeout(5000);

    function callback(e){
      // Keen.log('click a#listen-to-anchor-once');
      done();
      return false;
    }

    setTimeout(function(){
      var ev, a;

      a = document.createElement('A');
      a.id = 'listen-to-anchor-once';
      a.href = './index.html';
      document.body.appendChild(a);

      if (a.click) {
        a.click();
      }
      else if(document.createEvent) {
        ev = document.createEvent('MouseEvent');
        ev.initMouseEvent("click",
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0,
            false, false, false, false,
            0, null
        );
        a.dispatchEvent(ev);
      }
    }, 1000);
  });

  it('should remove specific handlers with .off("click", fn)', function(){
    var listenToThis = listener('body a#on-off');

    listenToThis.on('click', noop);
    listenToThis.on('click', noop);
    listenToThis.on('click', function(){
      // Not the same
    });
    assert.equal(Keen.domListeners['click']['body a#on-off'].length, 3);

    listenToThis.off('click', noop);
    assert.equal(Keen.domListeners['click']['body a#on-off'].length, 1);

    function noop(e){ }
  });

  // // Not testable by IE8
  if(!document.addEventListener) return;

  it('should handle `<form>` submit events', function(done){
    var listen = listener('form#listen-to-form');
    listen.on('submit', function(e){
      Keen.log('submit form#listen-to-form');
      done();
      return false;
    });

    setTimeout(function(){
      var form = document.createElement('FORM');
      form.id = 'listen-to-form';
      form.action = "./";

      var input = window.input = document.createElement('INPUT');
      input.id = 'listen-to-form-btn';
      input.type = 'submit';

      form.appendChild(input);
      document.body.appendChild(form);

      input.click();
      // form.submit();
    }, 1000);

  });

});
