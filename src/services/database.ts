import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from "@capacitor-community/sqlite";

let db: SQLiteDBConnection | null = null;
const sqlite = new SQLiteConnection(CapacitorSQLite);

export async function initDatabase(): Promise<void> {
  try {
    db = await sqlite.retrieveConnection('bonsai-db', false);
  }
  catch (error) {
    //Create new connection
    db = await sqlite.createConnection('bonsai-db', false, 'no-encryption', 1, false);
  }
  await db.open();

  //Dropping the tables for easier development
  //await dropTables(db);
  
  //Creating the tables if they don't exist
  await db.execute(`
    CREATE TABLE IF NOT EXISTS trees (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      image TEXT NOT NULL,
      species TEXT NOT NULL,
      year_planted INTEGER,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS feed (
      id INTEGER PRIMARY KEY,
      tree_id INTEGER,
      text TEXT,
      image_path TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (tree_id) REFERENCES trees(id)
    );
  `);
}

export async function getConnection(): Promise<SQLiteDBConnection> {
  if (!db) throw new Error('Database not initialized');
  return db;
}


export async function getMenuTrees() {
  const db = await getConnection();
  return db.query('SELECT id, name, image, species FROM trees');
}

export async function getTreeData(id: string) {
  const db = await getConnection();
  return db.query('SELECT * FROM trees WHERE id = ?', [id]);
}

export async function addNewTree(name: string, species: string, imgPath:string): Promise<boolean> {
  const db = await getConnection();

  const result = await db.run(`
    INSERT INTO trees (name, species, image) VALUES (?, ?, ?)
    `, [name, species, imgPath]);

  const id = result.changes?.lastId;

  return id != undefined;
}

const dropTables = async (database: SQLiteDBConnection) => {
  await database.execute(`DROP TABLE IF EXISTS trees`);
  await database.execute(`DROP TABLE IF EXISTS feed`);
}