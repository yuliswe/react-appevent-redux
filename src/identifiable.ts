import * as uuid from "uuid";

export type identifer = string;
export interface Identifiable {
  get key(): identifer;
}
export const uuid4 = uuid.v4;
