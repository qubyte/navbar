function makeNavListItem(element) {
  'use strict';

  var li = document.createElement('li');
  var label = document.createElement('span');
  var spot = document.createElement('span');

  label.className = 'nav-label';
  label.textContent = element.textContent.trim();

  spot.className = 'nav-spot';
  spot.textContent = ' ●';

  li.appendChild(label);
  li.appendChild(spot);

  li.addEventListener('click', function () {
    element.scrollIntoView(true);
  });

  return li;
}

// Generate a nav list element for ever h2 element on the page.
var nav = navbar(document.querySelectorAll('h2'), makeNavListItem);

document.querySelector('body').appendChild(nav);
