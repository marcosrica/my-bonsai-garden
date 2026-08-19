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
      dead BOOLEAN DEFAULT false,
      name TEXT NOT NULL,
      description TEXT,
      image TEXT NOT NULL,
      species TEXT NOT NULL,
      year_planted INTEGER,
      last_transplanted TEXT,
      last_abonated TEXT,
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
  return await db.query('SELECT id, name, image, species FROM trees');
}

export async function getTreeData(id: string) {
  const db = await getConnection();
  console.log("Searching for a tree with id " + id);
  const result = await db.query('SELECT * FROM trees WHERE id = ?', [id]);
  console.log(result);
  return result;
}

export async function addNewTree(name: string, species: string, imgPath:string): Promise<boolean> {
  const db = await getConnection();

  const result = await db.run(`
    INSERT INTO trees (name, species, image) VALUES (?, ?, ?)
    `, [name, species, imgPath]);

  const id = result.changes?.lastId;

  return id != undefined;
}

export async function addFullTreeData(name: string, description:string, image:string, species: string, year_planted: number, last_transplanted: string, last_abonated:string, created_at: string, dead: boolean) {
  const db = await getConnection();

  const result = await db.run(`
    INSERT INTO trees (name, description, image, species, year_planted, last_transplanted, last_abonated, created_at, dead) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, description, image, species, year_planted, last_transplanted, last_abonated, created_at, dead]);

  const id = result.changes?.lastId;

  return id != undefined;
}

export async function changeTreeInit(id: string, year: number): Promise<boolean> {
  const db = await getConnection();

  const result = await db.run(`
    UPDATE trees SET year_planted = ? WHERE id = ?
    `, [year, id]);

  const finalId = result.changes?.lastId;
  return finalId != undefined; 
}

export async function abonateTree(id: string) {
  const db = await getConnection();
  let date: Date = new Date(Date.now());
  const formattedDate = (date.getMonth() + 1) + "/" + date.getFullYear();

  const result = await db.run(`
    UPDATE trees SET last_abonated = ? WHERE id = ?
    `, [formattedDate, id]);

  const finalId = result.changes?.lastId;
  return finalId != undefined; 
}

export async function transplantTree(id: string) {
  const db = await getConnection();
  let date: Date = new Date(Date.now());
  const formattedDate = (date.getMonth() + 1) + "/" + date.getFullYear();

  const result = await db.run(`
    UPDATE trees SET last_transplanted = ? WHERE id = ?
    `, [formattedDate, id]);

  const finalId = result.changes?.lastId;
  return finalId != undefined; 
}

export async function killTree(id: string, value:boolean) {
  const db = await getConnection();

  const result = await db.run(`
    UPDATE trees SET dead = ? WHERE id = ?
    `, [value, id]);

  const finalId = result.changes?.lastId;
  return finalId != undefined; 
}

export async function changeTreeName(id: string, newName: string) {
  const db = await getConnection();

  const result = await db.run(`
    UPDATE trees SET name = ? WHERE id = ?
    `, [newName, id]);

  const finalId = result.changes?.lastId;
  return finalId != undefined; 
}

export async function changeTreeSpecies(id: string, newSpecies: string) {
  const db = await getConnection();

  const result = await db.run(`
    UPDATE trees SET species = ? WHERE id = ?
    `, [newSpecies, id]);

  const finalId = result.changes?.lastId;
  return finalId != undefined; 
}

export async function changeTreeImage(id: string, newImageUrl: string) {
  const db = await getConnection();

  const result = await db.run(`
    UPDATE trees SET image = ? WHERE id = ?
  `, [newImageUrl, id]);

  const finalId = result.changes?.lastId;
  return finalId != undefined; 
}

export async function addEntry(treeId: string, imagePath: string, text: string) {
  const db = await getConnection();

  const date = new Date(Date.now());
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const finalDay: string = day < 10 ? "0" + day.toString() : day.toString();
  const finalMonth: string = month < 10 ? "0" + month.toString() : month.toString();
  const finalDate: string = finalDay + "/" + finalMonth + "/" + year.toString();
  
  const result = await db.run(`
    INSERT INTO feed (tree_id, image_path, text, created_at) VALUES (?, ?, ?, ?)
  `, [treeId, imagePath, text, finalDate]);
  
  const id = result.changes?.lastId;
  
  return id != undefined;
}

export async function addEntry_withTime(treeId: string, imagePath: string, text: string, createdAt:string) {
  const db = await getConnection();

  console.log("ADDING ENTRY WITH DATE " + createdAt);
  
  const result = await db.run(`
    INSERT INTO feed (tree_id, image_path, text, created_at) VALUES (?, ?, ?, ?)
  `, [treeId, imagePath, text, createdAt]);
  
  const id = result.changes?.lastId;
  
  return id != undefined;
}

export async function getEntries(treeId: string) {
  const db = await getConnection();
  return await db.query('SELECT id, text, image_path, created_at FROM feed WHERE tree_id = ?', [treeId]);
}

const dropTables = async (database: SQLiteDBConnection) => {
  await database.execute(`DROP TABLE IF EXISTS trees`);
  await database.execute(`DROP TABLE IF EXISTS feed`);
}