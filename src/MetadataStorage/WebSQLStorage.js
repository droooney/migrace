const MetadataStorage = require('./');

class WebSQLMetadataStorage extends MetadataStorage {
  constructor(options = {}) {
    super();

    const {
      db,
      tableName = '__migrace_metadata__'
    } = options;

    if (!db) {
      throw new Error('options.db is not specified');
    }

    this._db = db;
    this._tableName = tableName;
  }

  _transaction(callback) {
    return new Promise((resolve, reject) => {
      this._db.transaction((tx) => {
        try {
          resolve(
            callback((sql, values) => (
              new Promise((resolve, reject) => {
                tx.executeSql(sql, values, (tx, result) => {
                  resolve(result);
                }, (tx, err) => {
                  reject(err);
                });
              })
            ))
          );
        } catch (err) {
          reject(err);
        }
      }, (err) => {
        reject(err);
      });
    });
  }

  ensure() {
    return this._transaction((execute) => (
      execute('CREATE TABLE IF NOT EXISTS ? (data string)', [this._tableName])
    ));
  }

  destroy() {
    return this._transaction((execute) => (
      execute('DROP TABLE IF EXISTS ?', [this._tableName])
    ));
  }

  read() {
    return this._transaction((execute) => (
      execute('SELECT data FROM ?', [this._tableName])
    )).then((result) => (
      result.rows.length
        ? result.rows(0).data
        : ''
    ));
  }

  write(data) {
    return this._transaction((execute) => (
      execute('UPDATE ? SET data = ?', [this._tableName, data])
    ));
  }
}

module.exports = WebSQLMetadataStorage;
