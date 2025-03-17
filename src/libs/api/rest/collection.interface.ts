export interface Collection<E> {
  items: E[];
  total: number;
}

export const emptyCollection = <E>(): Collection<E> => ({
  items: [],
  total: 0,
});
