/**
 * A simple descriptor meta for Column.
 */
export interface ColumnDescriptor {
	columnName: string;
	sortable: boolean;
	sortingType?: "number" | "string"; // defines the way the values in this column will be sorted. TODO: implement date sorting
}