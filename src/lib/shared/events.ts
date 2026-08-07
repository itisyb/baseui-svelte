export function composeEventHandlers<E extends Event>(
  consumer: ((event: E) => void) | null | undefined,
  library: (event: E) => void,
): (event: E) => void {
  return (event) => {
    consumer?.(event);
    if (!event.defaultPrevented) library(event);
  };
}

export function isActivationKey(event: KeyboardEvent): boolean {
  return event.key === 'Enter' || event.key === ' ';
}
