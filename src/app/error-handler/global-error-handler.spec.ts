import { GlobalErrorHandler } from './global-error-handler';

describe('GlobalErrorHandler', () => {
  let handler: GlobalErrorHandler;
  let consoleError: jasmine.Spy;
  let reload: jasmine.Spy;

  beforeEach(() => {
    handler = new GlobalErrorHandler();
    consoleError = spyOn(console, 'error');
    reload = spyOn(handler, 'reload');
  });

  it('logs an ordinary error', () => {
    const error = new Error('boom');
    handler.handleError(error);
    expect(consoleError).toHaveBeenCalledOnceWith(error);
    expect(reload).not.toHaveBeenCalled();
  });

  it('reloads the page when a chunk fails to load, and still logs the error', () => {
    for (const n of ['1', '23', '456']) {
      const error = new Error(`Loading chunk ${n} failed`);
      handler.handleError(error);
      expect(consoleError).toHaveBeenCalledWith(error);
    }
    expect(reload).toHaveBeenCalledTimes(3);
  });

  it('reloads when the chunk message is part of a longer one', () => {
    handler.handleError(
      new Error('ChunkLoadError: Loading chunk 7 failed. (missing: x.js)'),
    );
    expect(reload).toHaveBeenCalledTimes(1);
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
    expect(reload).not.toHaveBeenCalled();
  });

  it('logs an error without a message', () => {
    const error = {};
    handler.handleError(error);
    expect(consoleError).toHaveBeenCalledOnceWith(error);
  });

  it('logs null and undefined without throwing, and does not reload', () => {
    expect(() => handler.handleError(null)).not.toThrow();
    expect(() => handler.handleError(undefined)).not.toThrow();
    expect(consoleError.calls.allArgs()).toEqual([[null], [undefined]]);
    expect(reload).not.toHaveBeenCalled();
  });
});
