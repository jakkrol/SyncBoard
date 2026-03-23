import type { User, Room } from "../types";

export const rooms: { [roomId: string]: Room } = {};
export const users: { [userId: string]: User } = {};