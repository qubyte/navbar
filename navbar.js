const selectedClass = 'navbar-active';
let supportsPassive = false;

try {
  const opts = Object.defineProperty({}, 'passive', {
    get() {
      supportsPassive = true;
      return true;
    }
  });

  window.addEventListener('test', null, opts);
} catch { /* nothing */ }

function createAndAppendListItems(navList, elementList, makeNavListItem) {
  const pairs = [];

  // Create list elements
  for (const element of elementList) {
    const li = makeNavListItem(element);

    navList.appendChild(li);

    pairs.push({ element, navElement: li });
  }

  return pairs;
}

function makeHandleScroll(pairs, debounceTime) {
  function handleScroll() {
    /** @type {HTMLElement|null} */
    let frontRunner = null;
    let closestDist = Infinity;

    for (const pair of pairs) {
      const absDist = Math.abs(pair.element.getBoundingClientRect().top);

      // If this element is not the front runner for top, deactivate it.
      if (absDist > closestDist) {
        pair.navElement.classList.remove(selectedClass);
        continue;
      }

      // If this is a new front runner, deactivate the previous front runner.
      if (frontRunner) {
        frontRunner.classList.remove(selectedClass);
      }

      frontRunner = pair.navElement;
      closestDist = absDist;
    }

    // All other elements have been deactivated, and now the top element is known and can be set
    // as active.
    frontRunner.classList.add(selectedClass);
  }

  // The default behaviour is no debounce.
  if (typeof debounceTime !== 'number' || isNaN(debounceTime)) {
    return handleScroll;
  }

  let timeout;

  function nullifyTimeout() {
    timeout = null;
  }

  return function debouncedHandleScroll() {
    if (timeout) {
      return;
    }

    // Immediately use handleScroll to calculate.
    handleScroll();

    // No further calls to handleScroll until debounceTime has elapsed.
    timeout = setTimeout(nullifyTimeout, debounceTime);
  };
}

function addScrollListener(target, handleScroll) {
  function scrollHandleWrapper(evt) {
    if (evt.target === target) {
      handleScroll();
    }
  }

  if (target.addEventListener) {
    target.addEventListener('scroll', scrollHandleWrapper, supportsPassive ? { passive: true } : false);
  } else if (target.attachEvent) {
    target.attachEvent('onscroll', scrollHandleWrapper);
  } else {
    throw new Error('This browser does not support addEventListener or attachEvent.');
  }

  // To calculate the initial active list element.
  handleScroll();
}

export default function makeNav(options) {
  if (!options || !options.elementList || !options.makeNavListItem) {
    throw new Error('Options object with elementList and makeNavListItem must be provided.');
  }

  const nav = document.createElement(options.tagName || 'nav');
  const navList = document.createElement('ul');

  // The target defaults to window.
  const target = options.target || document;

  // Create list elements
  const pairs = createAndAppendListItems(navList, options.elementList, options.makeNavListItem);

  // Whenever the window is scrolled, recalculate the active list element. Compatible with older
  // versions of IE.
  addScrollListener(target, makeHandleScroll(pairs, options.debounceTime));

  nav.appendChild(navList);

  return nav;
}
