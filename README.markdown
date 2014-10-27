# navbar

`navbar` is a tiny library to help you create navigation bars that listen for
scroll events and calculate which element is closest to the top left of the
window, giving the associated navigation list item a `navbar-active` class.
You feed it a list of elements and a function that returns `navbar` list items,
and it returns a `nav` element populated with navigation items. You can dress
this up with CSS to make it look how you like.

It may not look like it's doing much, but it's fiddly stuff. For a demonstration
open `demo.js` in your (recent version) browser.

## Support

This library comes with built in support for loading with RequireJS and
Browserify. If you prefer to use neither, then you can still load it the old
fashioned way, which will append the `navbar` function to the `window` object
(as in the demo).

This library has no production dependencies, making loading with any of the
above mentioned schemes a breeze!

This library should support any browser that implements
`EventTarget.addEventListener` or `EventTarget.attachEvent`, which should cover
almost any browser in use today, and certainly IE >= 6. If you find that navbar
does not support a browser newer than IE6 then I consider it a bug, so please
open an issue for it.

## Usage

`navbar` is a function that takes an options object with two (mandatory) fields:

 - `elementList`: An array or array-like object populated with elements to be
represented in the nav list.
 - `makeNavListItem`: A function that takes an element and creates a navigation
list item from it.

The navbar listens to scroll events, and will add a `navbar-active` class to the
nav list item which is closest to the top of the window. This is pretty much all
that `navbar` does, although I like to think that the interface that it presents
is nice for defining a `nav` element. Only one element will have this class at
any given time.

## Example

Similar to the [demo](/demo), except using Browserify rather than RequireJS:

```javascript
var navbar = require('navbar');

// This function is where you define a list element, giving it classes,
// registering listeners, and appending children as you like. This one couples
// with demo.css to produce labels that appear when a the list item is hovered
// over.
function makeNavListItem(element) {
  var li = document.createElement('li');
  var label = document.createElement('span');
  var spot = document.createElement('span');

  // A label should have a nav-label class and contain the same text as the
  // element.
  label.className = 'nav-label';
  label.textContent = element.textContent.trim();

  spot.className = 'nav-spot';
  spot.textContent = ' ●';

  li.appendChild(label);
  li.appendChild(spot);

  // Custom className for our CSS purposes only. navbar will work around
  // existing classes by appending or removing the navbar-active class.
  li.className = 'nav-element';

  // I want clicks on nav items to scroll the relevant title into view.
  li.addEventListener('click', function () {
    element.scrollIntoView(true);
  });

  // Remember to return the list element at the end!
  return li;
}

// Generate a nav list element for every h2 element on the page.
var nav = navbar({
  elementList: document.querySelectorAll('h2'),
  makeNavListItem: makeNavListItem
});

// Finally, append the element to the document. In this demo the navbar is
// fixed, so I have simply appended to the body.
document.querySelector('body').appendChild(nav);
```
