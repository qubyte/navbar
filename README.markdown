![](https://ci.testling.com/qubyte/navbar.png)

# navbar

navbar is a tiny library to help you create navigation bars that listen for
scroll events and calculate which element is closest to the top left of the
window, giving the associated navigation list item a `navbar-active` class.
You feed it a list of elements and a function that returns navbar list items,
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

## TODO

 - Tests.
 - Call throttling.
