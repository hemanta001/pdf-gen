export interface BaseEncodedData {
  pageNumber: number;
  encodedValue: string;
}

export const DEFAULT_ENCODED_VALUE: BaseEncodedData = {
  pageNumber: null,
  encodedValue: null,
};
