require.config({
  paths: {
    navbar: '../navbar'
  }
});

require(['navbar'], function (navbar) {
  'use strict';

  // This function is where you define a list element, giving it classes, registering listeners, and
  // appending children as you like.
  function makeNavListItem(element) {
    var li = document.createElement('li');
    var label = document.createElement('span');
    var spot = document.createElement('span');

    label.className = 'nav-label';
    label.textContent = element.textContent.trim();

    spot.className = 'nav-spot';
    spot.textContent = ' ●';

    li.appendChild(label);
    li.appendChild(spot);

    // I want clicks on nav items to scroll the relevant title into view.
    li.addEventListener('click', function () {
      element.scrollIntoView(true);
    });

    // Remember to return the list element at the end!
    return li;
  }

  // I'm going to build a nav using all the h2 elements on the page.
  var titles = document.querySelectorAll('h2');

  // Generate a nav list element for every h2 element on the page.
  var nav = navbar(titles, makeNavListItem);

  // Finally, append the element to the document. In this demo the navbar is fixed, so I have simply
  // appended to the body.
  document.querySelector('body').appendChild(nav);
});
