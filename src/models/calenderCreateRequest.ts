export type CalenderCreateRequest = {
  name: string;
  fileName: string;
}

export type CalenderJsonRequest = {
  events:  Array<{[field: string]: string}>;
} & CalenderCreateRequest