import { describe, expect, it, stub } from '/spec.helpers';

import PostgreSQLClient from '.';

import { mockConnectionPool } from './spec.mocks';

describe('PostgreSQLClient', () => {
  const subject = () => new PostgreSQLClient(mockConnectionPool());

  it('has a #connect() function', () => expect(subject()).to.have.property('connect'));

  describe('#connect()', () => {
    const subject = () => {
      const client = new PostgreSQLClient(mockConnectionPool());
      const connected = client.connect();
      return connected;
    };

    it('eventually has a #disconnect() function', () => expect(subject()).to.eventually.have.property('disconnect'));

    it('eventually has a #read() function', () => expect(subject()).to.eventually.have.property('read'));

    it('eventually has a #write() function', () => expect(subject()).to.eventually.have.property('write'));

    describe('#disconnect()', () => {
      const subject = async () => {
        const client = new PostgreSQLClient(mockConnectionPool());
        const connected = await client.connect();
        return connected.disconnect();
      };

      it('eventually has a #connect() function', () => expect(subject()).to.eventually.have.property('connect'));
    });

    describe('#read()', () => {
      const subject = async (statement, parameters) => {
        const client = new PostgreSQLClient(mockConnectionPool());
        const connected = await client.connect();
        return connected.read(statement, parameters);
      };

      it('is eventually an array', () => expect(subject()).to.eventually.be.an('array'));
    });

    describe('#write()', () => {
      const subject = async (transact) => {
        const client = new PostgreSQLClient(mockConnectionPool());
        const connected = await client.connect();
        return connected.write(transact);
      };

      it('is eventually the return value of the given function', () => expect(subject(() => 'hello')).to.eventually.equal('hello'));

      it('eventually calls the given function', async () => {
        const transact = stub();
        await subject(transact);
        expect(transact).to.have.been.calledOnce;
      });

      it('provides a function when calling the given function', async () => {
        const transact = stub();
        await subject(transact);
        expect(transact.firstCall.args[0]).to.be.a('function');
      });

      it('provides a function that returns an array when calling the given function', () => expect(subject((query) => query())).to.eventually.be.an('array'));

      it('re-throws an error from the given function', () => {
        const error = new Error('I was thrown by the given function');
        const transact = () => {
          throw error;
        };
        return expect(subject(transact)).to.eventually.be.rejectedWith(error);
      });
    });
  });
});
