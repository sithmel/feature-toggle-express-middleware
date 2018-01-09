const assert = require('chai').assert;
const sinon = require('sinon');
const featureToggle = require('..');

const createReq = (query = {}, currentToggles = []) => ({
  query,
  cookies: {
    'myapp-feature-toggles': currentToggles.join(',')
  },
});

const createRes = () => ({
  locals: {},
  cookie: sinon.spy(),
  clearCookie: sinon.spy(),
  header: sinon.spy(),
});

describe('featureToggle', () => {
  let middleware;

  beforeEach(() => {
    middleware = featureToggle(['feature1', 'feature2'], 'myapp');
  });

  it('is it a function', () => {
    assert.typeOf(middleware, 'function');
  });

  it('has no toggle', (done) => {
    const req = createReq();
    const res = createRes();
    middleware(req, res, () => {
      assert.isFalse(res.locals.hasToggle('xyz'));
      assert.equal(res.clearCookie.callCount, 1);
      assert(res.clearCookie.calledWith('myapp-feature-toggles'));
      done();
    });
  })

  it('has a toggle', (done) => {
    const req = createReq(undefined, ['feature1']);
    const res = createRes();
    middleware(req, res, () => {
      assert.isFalse(res.locals.hasToggle('xyz'));
      assert.isTrue(res.locals.hasToggle('feature1'));
      assert.equal(res.cookie.callCount, 1);
      assert(res.cookie.calledWith('myapp-feature-toggles', 'feature1'));
      done();
    });
  })

  it('filters invalid toggles', (done) => {
    const req = createReq(undefined, ['feature3']);
    const res = createRes();
    middleware(req, res, () => {
      assert.isFalse(res.locals.hasToggle('feature3'));
      assert.equal(res.clearCookie.callCount, 1);
      assert(res.clearCookie.calledWith('myapp-feature-toggles'));
      done();
    });
  })

  it('adds single toggles', (done) => {
    const req = createReq({ myappAddToggles: 'feature2' }, ['feature1']);
    const res = createRes();
    middleware(req, res, () => {
      assert.isTrue(res.locals.hasToggle('feature1'));
      assert.isTrue(res.locals.hasToggle('feature2'));
      assert.equal(res.cookie.callCount, 1);
      assert(res.cookie.calledWith('myapp-feature-toggles', 'feature1,feature2'));
      done();
    });
  })

  it('adds multiple toggles', (done) => {
    const req = createReq({ myappAddToggles: 'feature1,feature2' });
    const res = createRes();
    middleware(req, res, () => {
      assert.isTrue(res.locals.hasToggle('feature1'));
      assert.isTrue(res.locals.hasToggle('feature2'));
      assert.equal(res.cookie.callCount, 1);
      assert(res.cookie.calledWith('myapp-feature-toggles', 'feature1,feature2'));
      done();
    });
  })

  it('removes multiple toggles', (done) => {
    const req = createReq({ myappRemoveToggles: 'feature1' }, ['feature1', 'feature2']);
    const res = createRes();
    middleware(req, res, () => {
      assert.isFalse(res.locals.hasToggle('feature1'));
      assert.isTrue(res.locals.hasToggle('feature2'));
      assert.equal(res.cookie.callCount, 1);
      assert(res.cookie.calledWith('myapp-feature-toggles', 'feature2'));
      done();
    });
  })

  it('reset the toggles', (done) => {
    const req = createReq({ myappResetToggles: 'true' }, ['feature1', 'feature2']);
    const res = createRes();
    middleware(req, res, () => {
      assert.isFalse(res.locals.hasToggle('feature1'));
      assert.isFalse(res.locals.hasToggle('feature2'));
      assert.equal(res.clearCookie.callCount, 1);
      assert(res.clearCookie.calledWith('myapp-feature-toggles'));
      done();
    });
  })

});
