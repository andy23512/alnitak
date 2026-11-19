import { GlobalErrorHandler } from './global-error-handler';

/**
 * The branch for "Loading chunk N failed" calls window.location.reload(), which cannot be
 * replaced in the browser and would reload the test page, so it is not exercised here.
 */
describe('GlobalErrorHandler', () => {
  let handler: GlobalErrorHandler;
  let consoleError: jasmine.Spy;

  beforeEach(() => {
    handler = new GlobalErrorHandler();
    consoleError = spyOn(console, 'error');
  });

  it('logs an ordinary error', () => {
    const error = new Error('boom');
    handler.handleError(error);
    expect(consoleError).toHaveBeenCalledOnceWith(error);
  });

  it('logs an error that only looks a little like a chunk failure', () => {
    for (const message of [
      'Loading chunk failed',
      'Loading chunk x failed',
      'chunk 12 failed',
    ]) {
      const error = new Error(message);
      handler.handleError(error);
      expect(consoleError).toHaveBeenCalledWith(error);
    }
    expect(consoleError).toHaveBeenCalledTimes(3);
  });

  it('logs an error without a message', () => {
    const error = {};
    handler.handleError(error);
    expect(consoleError).toHaveBeenCalledOnceWith(error);
  });

  it('currently throws for null, because it reads the message first (recorded behavior)', () => {
    expect(() => handler.handleError(null)).toThrowError(TypeError);
    expect(consoleError).not.toHaveBeenCalled();
  });
});
