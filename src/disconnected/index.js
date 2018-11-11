import Connected from '/connected';

/**
 * @typedef {Object} Disconnected~ConnectParameters
 *
 * @property {string} database - The name of the database to use.
 * @property {string} host - The hostname of the database server to which to connect.
 * @property {string} password - The password to provide when connecting to the database server.
 * @property {number} port - The TCP port number on which the database server is listening.
 * @property {string} user - The name of the database user to use when authenticating to the database server.
 */

/**
 * Initializes a PostgreSQL client state machine in the Disconnected state.
 *
 * @param {PostgreSQL~Pool} Pool - The constructor for an implementation of a PostgreSQL connection pool.
 *
 * @returns {Disconnected} - Returns a disconnected PostgreSQL client state.
 *
 * @see {@link https://node-postgres.com/features/pooling#checkout-use-and-return}
 */
const Disconnected = function Disconnected(Pool) {
  /**
   * Connects to a PostgreSQL database server.
   *
   * @param {Disconnected~ConnectParameters} parameters - Named parameters to use for the connection.
   *
   * @returns {Promise<Connected>} - Returns a promise that resolves when the client is ready.
   */
  this.connect = (parameters = {}) => Promise.resolve(new Connected(new Pool({
    database: parameters.database,
    host: parameters.host,
    password: parameters.password,
    port: parameters.port,
    user: parameters.user
  })));

  return this;
};

export default Disconnected;
