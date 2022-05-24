export type Arg = {
  readonly id: string;
  readonly name: string;
  readonly value: boolean;
  readonly createdAt: number;
};

export type ArgsApi = {
  add: () => Arg | undefined;
  update: (id: string, attributes: Partial<Arg>) => Arg | undefined;
  remove: (id: string) => Arg | undefined;
};
