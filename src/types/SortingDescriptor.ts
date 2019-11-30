import { Process } from "./Process";

export interface SortingDescriptor {
	key: keyof Process;
	asc: boolean;
}