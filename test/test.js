import navbar from '../navbar.js';
import * as assert from './assert.js';

mocha.setup('bdd');

describe('navbar', () => {
  let sandbox;
  let container;
  let elements;
  let elementList;

  function makeNavListItem(element) {
    const li = document.createElement('li');
    li.textContent = element.textContent;

    return li;
  }

  function triggerScrollEvent(element) {
    if (document.createEvent) {
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('scroll', true, false);
      element.dispatchEvent(evt);
    } else {
      element.fireEvent('onscroll');
    }
  }

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    container = document.createElement('div');

    elements = [
      document.createElement('h2'),
      document.createElement('h2'),
      document.createElement('h2'),
      document.createElement('h2'),
      document.createElement('h2')
    ];

    for (let i = 0, len = elements.length; i < len; i++) {
      elements[i].textContent = i.toString();
      container.appendChild(elements[i]);
    }

    elementList = container.getElementsByTagName('h2');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('is a function', () => {
    assert.equal(typeof navbar, 'function');
  });

  it('throws if a no options object is provided', () => {
    assert.throws(() => {
      return navbar();
    }, /Options object with elementList and makeNavListItem must be provided./);
  });

  it('throws if a elementList is not provided', () => {
    assert.throws(() => {
      return navbar({});
    }, /Options object with elementList and makeNavListItem must be provided./);
  });

  it('throws if a makeNavListItem is not provided', () => {
    const titles = elementList;

    assert.throws(() => {
      return navbar({ elementList: titles });
    }, /Options object with elementList and makeNavListItem must be provided./);
  });

  it('does not throw if elementList and makeNavListItem are provided', () => {
    const titles = elementList;

    assert.doesNotThrow(() => {
      return navbar({ elementList: titles, makeNavListItem });
    });
  });

  it('defaults to listening for document scroll events', () => {
    const addEventListenerSpy = sandbox.spy(document, 'addEventListener');

    navbar({ elementList, makeNavListItem });

    assert.equal(addEventListenerSpy.callCount, 1);
  });

  it('uses a given element to listen to for scroll events', () => {
    const element = document.createElement('div');
    const addEventListenerSpy = sandbox.spy(element, 'addEventListener');

    navbar({ target: element, elementList, makeNavListItem });

    assert.equal(addEventListenerSpy.callCount, 1);
  });

  it('returns a nav element by default', () => {
    const nav = navbar({ elementList, makeNavListItem });

    assert.equal(nav.tagName, 'NAV');
  });

  it('returns another tag name if tagName is provided', () => {
    const nav = navbar({ elementList, makeNavListItem, tagName: 'div' });

    assert.equal(nav.tagName, 'DIV');
  });

  describe('nav', () => {
    let nav;

    beforeEach(() => {
      nav = navbar({ elementList, makeNavListItem });
    });

    it('contains a single element, and it should be a ul', () => {
      assert.equal(nav.children.length, 1);
      assert.equal(nav.firstChild.tagName, 'UL');
    });

    it('contains the correct number of li elements', () => {
      assert.equal(nav.firstChild.children.length, elements.length);
    });

    it('contains li elements created from the original elementList', () => {
      const listElements = nav.firstChild.children;

      for (let i = 0, len = elements.length; i < len; i++) {
        assert.equal(elements[i].textContent, listElements[i].textContent);
      }
    });
  });

  describe('scrolling', () => {
    let stubs;

    beforeEach(() => {
      stubs = [
        sandbox.stub(elements[0], 'getBoundingClientRect').returns({ top: 0 }),
        sandbox.stub(elements[1], 'getBoundingClientRect').returns({ top: 1 }),
        sandbox.stub(elements[2], 'getBoundingClientRect').returns({ top: 2 }),
        sandbox.stub(elements[3], 'getBoundingClientRect').returns({ top: 3 }),
        sandbox.stub(elements[4], 'getBoundingClientRect').returns({ top: 4 })
      ];
    });

    it('checks the position of element list members when the navbar created', () => {
      navbar({ elementList, makeNavListItem });

      for (let i = 0, len = stubs.length; i < len; i++) {
        assert.equal(stubs[i].callCount, 1);
      }
    });

    it('picks the element closest to the top', () => {
      const lis = navbar({ elementList, makeNavListItem }).getElementsByTagName('li');

      assert.equal(lis[0].className, 'navbar-active');
      assert.equal(lis[1].className, '');
      assert.equal(lis[2].className, '');
      assert.equal(lis[3].className, '');
      assert.equal(lis[4].className, '');
    });

    it('uses the absolute distance of each element from the top', () => {
      stubs[0].returns({ top: -4 });
      stubs[1].returns({ top: -3 });

      const lis = navbar({ elementList, makeNavListItem }).getElementsByTagName('li');

      assert.equal(lis[0].className, '');
      assert.equal(lis[1].className, '');
      assert.equal(lis[2].className, 'navbar-active');
      assert.equal(lis[3].className, '');
      assert.equal(lis[4].className, '');
    });

    it('sets the list items with the correct className values', () => {
      const element = document.createElement('div');

      const lis = navbar({ target: element, elementList, makeNavListItem }).getElementsByTagName('li');

      stubs[0].returns({ top: -4 });
      stubs[1].returns({ top: -3 });

      triggerScrollEvent(element);

      assert.equal(lis[0].className, '');
      assert.equal(lis[1].className, '');
      assert.equal(lis[2].className, 'navbar-active');
      assert.equal(lis[3].className, '');
      assert.equal(lis[4].className, '');
    });

    it('checks each time a scroll event is emitted when debounceTime is undefined', () => {
      const element = document.createElement('div');

      navbar({ target: element, elementList, makeNavListItem });

      assert.equal(stubs[0].callCount, 1);

      triggerScrollEvent(element);

      assert.equal(stubs[0].callCount, 2);
    });

    it('checks only after a debounceTime has elapsed when debounceTime is a number', () => {
      const element = document.createElement('div');
      const clock = sandbox.useFakeTimers();

      navbar({ target: element, elementList, makeNavListItem, debounceTime: 100 });

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

    it('ignores scroll events from child elements of the target', () => {
      const element = document.createElement('div');
      const child = document.createElement('div');

      element.appendChild(child);

      const lis = navbar({ target: element, elementList, makeNavListItem }).getElementsByTagName('li');

      stubs[0].returns({ top: -4 });
      stubs[1].returns({ top: -3 });

      if (document.createEvent) {
        const evt = document.createEvent('HTMLEvents');
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
