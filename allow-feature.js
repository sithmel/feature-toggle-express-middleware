

function checkIf(isTrue) {
  return function allowWith(featureToggle) {
    return (req, res, next) => {
      if (!res.locals.hasToggle) {
        return res.status(500).send('The "checkFeature" middleware requires to be preceded by the "featureToggle" middleware');
      }
      const hasToggle = res.locals.hasToggle(featureToggle);
      const canProceed = isTrue ? hasToggle : !hasToggle;
      if (canProceed) {
        return next();
      }
      res.status(404);
      res.send('This feature not enabled.');
    };
  };
}

module.exports = {
  allowWith: checkIf(true),
  disallowWith: checkIf(false),
};
