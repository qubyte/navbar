;(function () {
  'use strict';

  function makeNav(elementList, makeNavListItem) {
    var selectedClass = 'navbar-active';
    var nav = document.createElement('nav');
    var navList = document.createElement('ul');
    var pairs = [];
    var i, len, element, li;

    // Create list elements
    for (i = 0, len = elementList.length; i < len; i++) {
      element = elementList[i];
      li = makeNavListItem(element);

      navList.appendChild(li);

      pairs.push({ element: element, navElement: li });
    }

    var navItemsLength = pairs.length;

    if (!navItemsLength) {
      throw new Error('No navigation items for given selector.');
    }

    // Favour className over classList for speed here.
    function handleScroll() {
      var frontRunner = { navElement: {} };
      var closestDist = Infinity;
      var i, pair, absDist;

      for (i = 0; i < navItemsLength; i++) {
        pair = pairs[i];
        absDist = Math.abs(pair.element.getBoundingClientRect().top);

        // If this element is not the front runner for top, deactivate it.
        if (absDist > closestDist) {
          if (pair.navElement.className) {
            pair.navElement.className = '';
          }

          continue;
        }

        // If this is a new front runner, deactivate the previous front runner.
        if (frontRunner.className) {
          frontRunner.className = '';
        }

        frontRunner = pair.navElement;
        closestDist = absDist;
      }

      // All other elements have been deactivated, and now the top element is known and can be set
      // as active.
      frontRunner.className = selectedClass;
    }

    // Whenever the window is scrolled, recalculate the active list element.
    window.addEventListener('scroll', handleScroll);

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
