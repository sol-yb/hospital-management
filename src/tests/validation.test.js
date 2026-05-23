const { validateAuth } = require('../validators/auth.validator');

describe('Auth validator middleware', () => {
  it('collects errors for missing fields on register', () => {
    const req = { body: {} };
    const res = {};
    const next = jest.fn();
    validateAuth('register')(req, res, next);
    expect(req.validationErrors.length).toBeGreaterThan(0);
    expect(next).toHaveBeenCalled();
  });
});
