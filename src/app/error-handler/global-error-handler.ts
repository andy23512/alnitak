import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
    if (chunkFailedMessage.test(error?.message)) {
      // Force reload to get the new version of the app
      this.reload();
    }
    console.error(error); // Keep original error logging
  }

  /** Kept as its own method so tests can replace it; reloading the page would end the test run. */
  reload(): void {
    window.location.reload();
  }
}
