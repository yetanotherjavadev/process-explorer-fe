/**
 * A simple descriptor meta for Column.
 */
import { Process } from "./Process";

export interface ColumnDescriptor {
	columnName: string;
	key: keyof Process;
	sortable: boolean;
	sortingType?: "number" | "string"; // defines the way the values in this column will be sorted. TODO: implement date sorting
}