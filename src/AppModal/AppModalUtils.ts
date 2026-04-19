export const stopEventPropagation = (event: unknown) => {
  const e = event as {
    preventDefault?: () => void;
    stopPropagation?: () => void;
    stopImmediatePropagation?: () => void;
  };

  e.preventDefault?.();
  e.stopPropagation?.();
  e.stopImmediatePropagation?.();
};

export const attachCloseToEscape = (handleClose: () => void) => {
  const closeOnEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" || e.code === "Escape") {
      stopEventPropagation(e);
      handleClose();
    }
  };

  // Capture phase makes this resilient if inner components stopPropagation() on Escape.
  window.addEventListener("keydown", closeOnEscape, { capture: true });
  return () =>
    window.removeEventListener("keydown", closeOnEscape, { capture: true });
};
