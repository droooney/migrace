export type AsyncFunction = () => Promise;

export interface Migration {
  id: string;
  up: AsyncFunction;
  down: AsyncFunction;
  wasExecuted?: AsyncFunction;
}
