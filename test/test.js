define(['navbar', 'chai', 'sinon'], function (navbar, chai, sinon) {
  'use strict';

  var assert = chai.assert;

  describe('navbar', function () {
    var sandbox;

    function makeNavListItem(element) {
      var li = document.createElement('li');
      li.textContent = element.textContent;

      return li;
    }

    beforeEach(function () {
      sandbox = sinon.sandbox.create();

      var container = document.createElement('div');

      var elements = [
        document.createElement('h2'),
        document.createElement('h2'),
        document.createElement('h2'),
        document.createElement('h2'),
        document.createElement('h2')
      ];

      elements.forEach(function (element, index) {
        element.textContent = '' + index;
        container.appendChild(element);
      });

      this.container = container;
      this.elements = elements;
      this.elementList = container.getElementsByTagName('h2');
    });

    afterEach(function () {
      sandbox.restore();
    });

    it('should be a function', function () {
      assert.equal(typeof navbar, 'function');
    });

    it('should throw if a no options object is provided', function () {
      assert.throws(function () {
        return navbar();
      }, /Options object with elementList and makeNavListItem must be provided./);
    });

    it('should throw if a elementList is not provided', function () {
      assert.throws(function () {
        return navbar({});
      }, /Options object with elementList and makeNavListItem must be provided./);
    });

    it('should throw if a makeNavListItem is not provided', function () {
      var titles = this.elementList;

      assert.throws(function () {
        return navbar({ elementList: titles });
      }, /Options object with elementList and makeNavListItem must be provided./);
    });

    it('should not throw if elementList and makeNavListItem are provided', function () {
      var titles = this.elementList;

      assert.doesNotThrow(function () {
        return navbar({
          elementList: titles,
          makeNavListItem: makeNavListItem
        });
      });
    });

    it('returns a nav element', function () {
      var nav = navbar({
        elementList: this.elementList,
        makeNavListItem: makeNavListItem
      });

      assert.equal(nav.tagName, 'NAV');
    });

    describe('nav', function () {
      beforeEach(function () {
        this.nav = navbar({
          elementList: this.elementList,
          makeNavListItem: makeNavListItem
        });
      });

      it('contains a single element, and it should be a ul', function () {
        assert.equal(this.nav.children.length, 1);
        assert.equal(this.nav.firstChild.tagName, 'UL');
      });

      it('contains the correct number of li elements', function () {
        assert.equal(this.nav.firstChild.children.length, this.elements.length);
      });

      it('contains li elements created from the original elementList', function () {
        var listElements = this.nav.firstChild.children;

        this.elements.forEach(function (element, index) {
          assert.equal(element.textContent, listElements[index].textContent);
        });
      });
    });

    describe('scrolling', function () {
      beforeEach(function () {
        this.stubs = [
          sandbox.stub(this.elements[0], 'getBoundingClientRect').returns({ top: 0 }),
          sandbox.stub(this.elements[1], 'getBoundingClientRect').returns({ top: 1 }),
          sandbox.stub(this.elements[2], 'getBoundingClientRect').returns({ top: 2 }),
          sandbox.stub(this.elements[3], 'getBoundingClientRect').returns({ top: 3 }),
          sandbox.stub(this.elements[4], 'getBoundingClientRect').returns({ top: 4 })
        ];
      });

      it('Should check the position of element list members when the navbar is created', function () {
        navbar({
          elementList: this.elementList,
          makeNavListItem: makeNavListItem
        });

        for (var i = 0, len = this.stubs.length; i < len; i++) {
          assert.equal(this.stubs[i].callCount, 1);
        }
      });

      it('should pick the element closest to the top', function () {
        var lis = navbar({
          elementList: this.elementList,
          makeNavListItem: makeNavListItem
        }).getElementsByTagName('li');

        assert.equal(lis[0].className, 'navbar-active');
        assert.equal(lis[1].className, '');
        assert.equal(lis[2].className, '');
        assert.equal(lis[3].className, '');
        assert.equal(lis[4].className, '');
      });

      it('should use the absolute distance of each element from the top', function () {
        this.stubs[0].returns({ top: -4});
        this.stubs[1].returns({ top: -3 });

        var lis = navbar({
          elementList: this.elementList,
          makeNavListItem: makeNavListItem
        }).getElementsByTagName('li');

        assert.equal(lis[0].className, '');
        assert.equal(lis[1].className, '');
        assert.equal(lis[2].className, 'navbar-active');
        assert.equal(lis[3].className, '');
        assert.equal(lis[4].className, '');
      });

      it('should check each time a scroll event is emitted', function () {
        var lis = navbar({
          elementList: this.elementList,
          makeNavListItem: makeNavListItem
        }).getElementsByTagName('li');

        this.stubs[0].returns({ top: -4});
        this.stubs[1].returns({ top: -3 });

        if (document.createEvent) {
          var evt = document.createEvent('HTMLEvents');
          evt.initEvent('scroll', true, false);
          window.dispatchEvent(evt);
        } else {
          window.fireEvent('onscroll');
        }

        for (var i = 0, len = this.stubs.length; i < len; i++) {
          assert.equal(this.stubs[i].callCount, 2);
        }

        assert.equal(lis[0].className, '');
        assert.equal(lis[1].className, '');
        assert.equal(lis[2].className, 'navbar-active');
        assert.equal(lis[3].className, '');
        assert.equal(lis[4].className, '');
      });
    });
  });
});
