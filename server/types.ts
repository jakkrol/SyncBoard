  export type User = {
    id: string;
    name: string;
    color: string;
    room: string;
  }

  export interface BaseRoom {
    id: string;
    users: string[];
    boardData: string;
  }

  export interface DrawingRoom extends BaseRoom {
    type: "drawing";
  }

  export interface ScribbleRoom extends BaseRoom {
    type: "scribble";
    drawingUser: string;
    currentWord: string;
  }

  export type Room = DrawingRoom | ScribbleRoom;