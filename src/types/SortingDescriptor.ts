import { Process } from "./Process";

/**
 * Simple type that describes "sorting state"
 */
export interface SortingDescriptor {
	key: keyof Process;
	asc: boolean;
}