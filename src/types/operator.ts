export type Operator = {
  readonly name: string;
  readonly token: string;
  readonly func: (a: boolean, b: boolean) => boolean;
};
