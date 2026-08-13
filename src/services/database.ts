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

  //Creating the tables if they don't exist
  await db.execute(`
    CREATE TABLE IF NOT EXISTS species (
      id INTEGER PRIMARY KEY,
      specie TEXT NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS trees (
      id INTEGER PRIMARY KEY NOT NULL,
      species_id INTEGER NOT NULL,
      year_planted INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (species_id) REFERENCES species(id)
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

//TEst query
export async function getAllTrees() {
  const db = await getConnection();
  return db.query('SELECT * FROM trees ORDER BY created_at DESC');
}