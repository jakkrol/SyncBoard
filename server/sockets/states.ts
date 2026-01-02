import type { User, Room } from "../types.ts";

export const rooms: { [roomId: string]: Room } = {};
export const users: { [userId: string]: User } = {};