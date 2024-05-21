import { Signal, effect, signal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

export function computedAsync<T>(
  computation: () => Observable<T>,
): Signal<T | null> & { recompute: () => void } {
  const sig = signal<T | null>(null);

  // Save current subscription to be able to unsubscribe
  let subscription: Subscription;

  // Create an arrow function that contains the signal updating logic
  const recompute = () => {
    sig.set(null);
    // Before making the new subscription, unsub from the previous one
    if (subscription && !subscription.closed) {
      subscription.unsubscribe();
    }
    const observable = computation();
    subscription = observable.subscribe((result) => sig.set(result));
  };

  effect(recompute, { allowSignalWrites: true });

  // Add the recompute function to the returned signal, so that it can be called from the outside
  return Object.assign(sig, { recompute });
}
