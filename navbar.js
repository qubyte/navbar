(function () {
  'use strict';

  var selectedClass = 'navbar-active';

  // It'd be nicer to use the classList API, but I prefer to support more browsers. Remove a class
  // if it's found on the element.
  function removeClassIfNeeded(el) {
    if (!el.className) {
      return;
    }

    var splitClassName = el.className.split(' ');
    var selectedIndex = splitClassName.indexOf(selectedClass);

    if (selectedIndex !== -1) {
      splitClassName.splice(selectedIndex, 1);
      el.className = splitClassName.join(' ');
    }
  }

  // Add a class to an element if it is not found.
  function addClassIfNeeded(el) {
    if (!el.className) {
      el.className = selectedClass;
      return;
    }

    var splitClassName = el.className.split(' ');
    var selectedIndex = splitClassName.indexOf(selectedClass);

    if (selectedIndex === -1) {
      splitClassName.push(selectedClass);
      el.className = splitClassName.join(' ');
    }
  }

  function createListItems(navList, elementList, makeNavListItem) {
    var pairs = [];
    var element;
    var li;

    // Create list elements
    for (var i = 0, len = elementList.length; i < len; i++) {
      element = elementList[i];
      li = makeNavListItem(element);

      navList.appendChild(li);

      pairs.push({ element: element, navElement: li });
    }

    return pairs;
  }

  function makeHandleScroll(pairs) {
    return function handleScroll() {
      var frontRunner = { navElement: {} };
      var closestDist = Infinity;
      var pair, absDist;

      for (var i = 0, len = pairs.length; i < len; i++) {
        pair = pairs[i];
        absDist = Math.abs(pair.element.getBoundingClientRect().top);

        // If this element is not the front runner for top, deactivate it.
        if (absDist > closestDist) {
          removeClassIfNeeded(pair.navElement);
          continue;
        }

        // If this is a new front runner, deactivate the previous front runner.
        removeClassIfNeeded(frontRunner);

        frontRunner = pair.navElement;
        closestDist = absDist;
      }

      // All other elements have been deactivated, and now the top element is known and can be set
      // as active.
      addClassIfNeeded(frontRunner, selectedClass);
    };
  }

  function addScrollListener(handleScroll) {
    if (window.addEventListener) {
      window.addEventListener('scroll', handleScroll);
    } else if (window.attachEvent)  {
      window.attachEvent('onscroll', handleScroll);
    }
  }

  function makeNav(elementList, makeNavListItem) {
    var nav = document.createElement('nav');
    var navList = document.createElement('ul');

    if (!elementList) {
      throw new Error('elementList must be provided.');
    }

    if (!makeNavListItem) {
      throw new Error('makeNavListItem must be provided.');
    }

    // Create list elements
    var pairs = createListItems(navList, elementList, makeNavListItem);
    var navItemsLength = pairs.length;

    if (!navItemsLength) {
      throw new Error('No navigation items for given selector.');
    }

    // Use classList to avoid overwriting user classes.
    var handleScroll = makeHandleScroll(pairs);

    // Whenever the window is scrolled, recalculate the active list element. Compatible with older
    // versions of IE.
    addScrollListener(handleScroll);

    // To calculate the initial active list element.
    handleScroll();

    nav.appendChild(navList);

    return nav;
  }

  // If navbar is being loaded with an AMD module loader.
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return makeNav;
    });

    return;
  }

  // If navbar is being loaded in Node.js or with Browserify.
  if (typeof module === 'object' && module && module.exports) {
    module.exports = makeNav;

    return;
  }

  // Finally, if the module is being loaded as a global, then append navbar to the window.
  window.navbar = makeNav;
}());
