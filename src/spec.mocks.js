import { stub } from './spec.helpers';

export const mockConnectionPool = () => {
  const MockConnectionPool = function MockConnectionPool() {
    this.connect = stub().returns(Promise.resolve({
      query: stub().returns(Promise.resolve({
        rows: []
      })),
      release: stub()
    }));

    this.end = stub();

    this.query = stub().returns(Promise.resolve({
      rows: []
    }));

    return this;
  };
  return MockConnectionPool;
};
