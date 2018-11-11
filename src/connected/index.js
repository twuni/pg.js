import Disconnected from '../disconnected';

/**
 * Initializes a PostgreSQL client state machine in the Connected state.
 *
 * @param {PostgreSQL} psql - A PostgreSQL client connection pool.
 *
 * @returns {Connected} - Returns a connected PostgreSQL client state.
 */
const Connected = function Connected(psql) {
  /**
   * Disconnects from the server, draining all clients from the connection pool.
   * Transitions this client to the Disconnected state, preventing further actions on this state.
   *
   * @returns {Disconnected} - Returns the Disconnected state.
   */
  this.disconnect = async () => {
    await psql.end();
    return new Disconnected();
  };

  /**
   * Executes a read-only query.
   *
   * @param {string} statement - The SQL statement to execute, with 1-indexed $i placeholders for interpolating parameters.
   * @param {string[]} [parameters=[]] - Query parameters to be interpolated.
   *
   * @returns {Object[]} - The rows resulting from executing the given query.
   */
  this.read = async (statement, parameters = []) => {
    const { rows } = await psql.query(statement, parameters);
    return rows;
  };

  /**
   * Executes a transaction consisting of one or more state-changing queries.
   *
   * @param {function(function(string, string[]): Object[]): Object} transact - A function that receives a `query()` function that operates within a transaction.
   *
   * @returns {Object} - Returns the result of calling the given `transact()` function.
   */
  this.write = async (transact) => {
    const client = await psql.connect();
    try {
      await client.query('BEGIN');
      const returnValue = await transact(async (statement, parameters = []) => {
        const { rows } = await client.query(statement, parameters);
        return rows;
      });
      await client.query('COMMIT');
      return returnValue;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  };

  return this;
};

export default Connected;
