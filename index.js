const getSet = (str) => (str ? new Set(str.split(',')) : new Set());

function union(setA, setB) {
  const unionSet = new Set(setA);
  for (const elem of setB) {
    unionSet.add(elem);
  }
  return unionSet;
}

function intersection(setA, setB) {
  const intersectionSet = new Set();
  for (const elem of setB) {
    if (setA.has(elem)) {
      intersectionSet.add(elem);
    }
  }
  return intersectionSet;
}

function difference(setA, setB) {
  const differenceSet = new Set(setA);
  for (const elem of setB) {
    differenceSet.delete(elem);
  }
  return differenceSet;
}

module.exports = function featureToggle(allowedTogglesArray, prefix, cookieOptions) {
  const cookieName = `${prefix}-feature-toggles`;
  const addTogglesAttr = `${prefix}AddToggles`;
  const removeTogglesAttr = `${prefix}RemoveToggles`;
  const resetTogglesAttr = `${prefix}ResetToggles`;

  const allowedToggles = new Set(allowedTogglesArray);

  return (req, res, next) => {
    const addToggles = getSet(req.query[addTogglesAttr]);
    const removeToggles = getSet(req.query[removeTogglesAttr]);
    const resetToggles = req.query[resetTogglesAttr];
    const currentToggles = getSet(req.cookies[cookieName]);

    const toggles = resetToggles ? new Set() : intersection(
      union(
        difference(currentToggles, removeToggles), // removing toggles
        addToggles), // adding new toggles
      allowedToggles); // removing not allowed

    res.locals.hasToggle = (name) => toggles.has(name);

    const arrayToggles = Array.from(toggles);
    arrayToggles.sort();

    res.cookie(cookieName, arrayToggles.join(','), cookieOptions);

    if (arrayToggles.length) {
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');
    }

    next();
  };
}
