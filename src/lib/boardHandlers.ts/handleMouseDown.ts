  export function handleMouseDown(e: React.MouseEvent, drawing: React.RefObject<boolean>, lastPos: React.RefObject<{x: number, y: number} | null>, getPositionMouse: (e: React.MouseEvent) => {x: number, y: number}) {
    drawing.current = true;
    const {x, y} = getPositionMouse(e);
    lastPos.current = {x, y};

  };