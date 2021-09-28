import navbar from '../navbar.es6.js';

var assert = chai.assert;

mocha.setup('bdd');

describe('navbar', function () {
  var sandbox;
  var container;
  var elements;
  var elementList;

  function makeNavListItem(element) {
    var li = document.createElement('li');
    li.textContent = element.textContent;

    return li;
  }

  function triggerScrollEvent(element) {
    if (document.createEvent) {
      var evt = document.createEvent('HTMLEvents');
      evt.initEvent('scroll', true, false);
      element.dispatchEvent(evt);
    } else {
      element.fireEvent('onscroll');
    }
  }

  beforeEach(function () {
    sandbox = sinon.createSandbox();

    container = document.createElement('div');

    elements = [
      document.createElement('h2'),
      document.createElement('h2'),
      document.createElement('h2'),
      document.createElement('h2'),
      document.createElement('h2')
    ];

    for (var i = 0, len = elements.length; i < len; i++) {
      elements[i].textContent = '' + i;
      container.appendChild(elements[i]);
    }

    elementList = container.getElementsByTagName('h2');
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('is a function', function () {
    assert.equal(typeof navbar, 'function');
  });

  it('throws if a no options object is provided', function () {
    assert.throws(function () {
      return navbar();
    }, /Options object with elementList and makeNavListItem must be provided./);
  });

  it('throws if a elementList is not provided', function () {
    assert.throws(function () {
      return navbar({});
    }, /Options object with elementList and makeNavListItem must be provided./);
  });

  it('throws if a makeNavListItem is not provided', function () {
    var titles = elementList;

    assert.throws(function () {
      return navbar({ elementList: titles });
    }, /Options object with elementList and makeNavListItem must be provided./);
  });

  it('does not throw if elementList and makeNavListItem are provided', function () {
    var titles = elementList;

    assert.doesNotThrow(function () {
      return navbar({
        elementList: titles,
        makeNavListItem: makeNavListItem
      });
    });
  });

  it('defaults to listening for document scroll events', function () {
    var addEventListenerSpy = sandbox.spy(document, 'addEventListener');

    navbar({
      elementList: elementList,
      makeNavListItem: makeNavListItem
    });

    assert.equal(addEventListenerSpy.callCount, 1);
  });

  it('uses a given element to listen to for scroll events', function () {
    var element = document.createElement('div');
    var addEventListenerSpy = sandbox.spy(element, 'addEventListener');

    navbar({
      target: element,
      elementList: elementList,
      makeNavListItem: makeNavListItem
    });

    assert.equal(addEventListenerSpy.callCount, 1);
  });

  it('returns a nav element by default', function () {
    var nav = navbar({
      elementList: elementList,
      makeNavListItem: makeNavListItem
    });

    assert.equal(nav.tagName, 'NAV');
  });

  it('returns another tag name if tagName is provided', function () {
    var nav = navbar({
      elementList: elementList,
      makeNavListItem: makeNavListItem,
      tagName: 'div'
    });

    assert.equal(nav.tagName, 'DIV');
  });

  describe('nav', function () {
    var nav;

    beforeEach(function () {
      nav = navbar({
        elementList: elementList,
        makeNavListItem: makeNavListItem
      });
    });

    it('contains a single element, and it should be a ul', function () {
      assert.equal(nav.children.length, 1);
      assert.equal(nav.firstChild.tagName, 'UL');
    });

    it('contains the correct number of li elements', function () {
      assert.equal(nav.firstChild.children.length, elements.length);
    });

    it('contains li elements created from the original elementList', function () {
      var listElements = nav.firstChild.children;

      for (var i = 0, len = elements.length; i < len; i++) {
        assert.equal(elements[i].textContent, listElements[i].textContent);
      }
    });
  });

  describe('scrolling', function () {
    var stubs;

    beforeEach(function () {
      stubs = [
        sandbox.stub(elements[0], 'getBoundingClientRect').returns({ top: 0 }),
        sandbox.stub(elements[1], 'getBoundingClientRect').returns({ top: 1 }),
        sandbox.stub(elements[2], 'getBoundingClientRect').returns({ top: 2 }),
        sandbox.stub(elements[3], 'getBoundingClientRect').returns({ top: 3 }),
        sandbox.stub(elements[4], 'getBoundingClientRect').returns({ top: 4 })
      ];
    });

    it('checks the position of element list members when the navbar created', function () {
      navbar({
        elementList: elementList,
        makeNavListItem: makeNavListItem
      });

      for (var i = 0, len = stubs.length; i < len; i++) {
        assert.equal(stubs[i].callCount, 1);
      }
    });

    it('picks the element closest to the top', function () {
      var lis = navbar({
        elementList: elementList,
        makeNavListItem: makeNavListItem
      }).getElementsByTagName('li');

      assert.equal(lis[0].className, 'navbar-active');
      assert.equal(lis[1].className, '');
      assert.equal(lis[2].className, '');
      assert.equal(lis[3].className, '');
      assert.equal(lis[4].className, '');
    });

    it('uses the absolute distance of each element from the top', function () {
      stubs[0].returns({ top: -4 });
      stubs[1].returns({ top: -3 });

      var lis = navbar({
        elementList: elementList,
        makeNavListItem: makeNavListItem
      }).getElementsByTagName('li');

      assert.equal(lis[0].className, '');
      assert.equal(lis[1].className, '');
      assert.equal(lis[2].className, 'navbar-active');
      assert.equal(lis[3].className, '');
      assert.equal(lis[4].className, '');
    });

    it('sets the list items with the correct className values', function () {
      var element = document.createElement('div');

      var lis = navbar({
        target: element,
        elementList: elementList,
        makeNavListItem: makeNavListItem
      }).getElementsByTagName('li');

      stubs[0].returns({ top: -4 });
      stubs[1].returns({ top: -3 });

      triggerScrollEvent(element);

      assert.equal(lis[0].className, '');
      assert.equal(lis[1].className, '');
      assert.equal(lis[2].className, 'navbar-active');
      assert.equal(lis[3].className, '');
      assert.equal(lis[4].className, '');
    });

    it('checks each time a scroll event is emitted when debounceTime is undefined', function () {
      var element = document.createElement('div');

      navbar({
        target: element,
        elementList: elementList,
        makeNavListItem: makeNavListItem
      });

      assert.equal(stubs[0].callCount, 1);

      triggerScrollEvent(element);

      assert.equal(stubs[0].callCount, 2);
    });

    it('checks only after a debounceTime has elapsed when debounceTime is a number', function () {
      var element = document.createElement('div');
      var clock = sandbox.useFakeTimers();

      navbar({
        target: element,
        elementList: elementList,
        makeNavListItem: makeNavListItem,
        debounceTime: 100
      });

      assert.equal(stubs[0].callCount, 1); // Creation of the navbar counts.

      clock.tick(110);

      triggerScrollEvent(element); // This one should count.

      assert.equal(stubs[0].callCount, 2);

      triggerScrollEvent(element); // This one should not.

      assert.equal(stubs[0].callCount, 2);

      clock.tick(110);

      triggerScrollEvent(element); // This one should count.

      assert.equal(stubs[0].callCount, 3);
    });

    it('ignores scroll events from child elements of the target', function () {
      var element = document.createElement('div');
      var child = document.createElement('div');

      element.appendChild(child);

      var lis = navbar({
        target: element,
        elementList: elementList,
        makeNavListItem: makeNavListItem
      }).getElementsByTagName('li');

      stubs[0].returns({ top: -4 });
      stubs[1].returns({ top: -3 });

      if (document.createEvent) {
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent('scroll', true, false);
        child.dispatchEvent(evt);
      } else {
        child.fireEvent('onscroll');
      }

      assert.equal(lis[0].className, 'navbar-active');
      assert.equal(lis[1].className, '');
      assert.equal(lis[2].className, '');
      assert.equal(lis[3].className, '');
      assert.equal(lis[4].className, '');
    });
  });
});

mocha.run();
