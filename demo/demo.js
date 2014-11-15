// This function is where you define a list element, giving it classes,
// registering listeners, and appending children as you like. This one couples
// with demo.css to produce labels that appear when a the list item is hovered
// over.
function makeNavListItem(element) {
  'use strict';

  var li = document.createElement('li');
  var label = document.createElement('span');
  var spot = document.createElement('span');

  // A label should have a nav-label class and contain the same text as the
  // element.
  label.className = 'nav-label';
  label.textContent = element.textContent.trim();

  spot.className = 'nav-spot';
  spot.textContent = '●';

  li.appendChild(label);
  li.appendChild(spot);

  // Custom className for our CSS purposes only. navbar will work around
  // existing classes by appending or removing the navbar-active class.
  li.className = 'nav-element';

  // I want clicks on nav items to scroll the relevant title to the top of the
  // view.
  li.addEventListener('click', function () {
    element.scrollIntoView(true);
  });

  // Remember to return the list element at the end!
  return li;
}

// Generate a nav list element for every h2 element on the page.
var nav = window.navbar({
  elementList: document.querySelectorAll('h2'),
  makeNavListItem: makeNavListItem
});

// Finally, append the element to the document. In this demo the navbar is
// fixed, so I have simply appended to the body.
document.querySelector('body').appendChild(nav);
