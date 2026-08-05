import { MongoClient, GridFSBucket } from 'mongodb';

const uri = process.env.MONGO_URL;
const dbName = process.env.DB_NAME || 'search2service';

let clientPromise;

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function getDb() {
  const c = await clientPromise;
  return c.db(dbName);
}

export async function getFilesBucket() {
  const db = await getDb();
  return new GridFSBucket(db, { bucketName: 'uploads', chunkSizeBytes: 255 * 1024 });
}
