const assert = require('chai').assert;
const sinon = require('sinon');
const allowFeature = require('../allow-feature');

const createRes = ({ hasFeature }) => ({
  locals: {
    hasToggle: () => hasFeature,
  },
  status: sinon.spy(),
  send: sinon.spy(),
});

describe('allowFeature', () => {
  let middleware;

  beforeEach(() => {
    middleware = allowFeature.allowWith('feature1');
  });

  it('is it a function', () => {
    assert.typeOf(middleware, 'function');
  });

  it('is allowed', () => {
    const req = {};
    const res = createRes({ hasFeature: true });
    const next = sinon.spy();
    middleware(req, res, next);
    assert.equal(res.status.callCount, 0);
    assert.equal(next.callCount, 1);
  })

  it('is not allowed', () => {
    const req = {};
    const res = createRes({ hasFeature: false });
    const next = sinon.spy();
    middleware(req, res, next);
    assert(res.status.calledWith(404));
    assert.equal(next.callCount, 0);
  })
});

describe('allowFeature', () => {
  let middleware;

  beforeEach(() => {
    middleware = allowFeature.disallowWith('feature1');
  });

  it('is it a function', () => {
    assert.typeOf(middleware, 'function');
  });

  it('is allowed', () => {
    const req = {};
    const res = createRes({ hasFeature: false });
    const next = sinon.spy();
    middleware(req, res, next);
    assert.equal(res.status.callCount, 0);
    assert.equal(next.callCount, 1);
  })

  it('is not allowed', () => {
    const req = {};
    const res = createRes({ hasFeature: true });
    const next = sinon.spy();
    middleware(req, res, next);
    assert(res.status.calledWith(404));
    assert.equal(next.callCount, 0);
  })
});
