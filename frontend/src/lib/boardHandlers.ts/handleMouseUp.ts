  export function handleMouseUp(drawing: React.RefObject<boolean>, lastPos: React.RefObject<{x: number, y: number} | null>) {
    drawing.current = false;
    lastPos.current = null;
  }