//Interface for filter params object
export interface FilterParam {
  breeds: string[] | null;
  sort: string;
  from?: number;
}
