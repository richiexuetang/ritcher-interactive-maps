import { MongoClient } from 'mongodb';
import { Mongoose } from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    promise: Promise<Mongoose> | null;
    conn: Mongoose | null;
  };
}

const uri = process.env.NEXT_PUBLIC_MONGODB_URI || '';
const options = {};

if (!process.env.NEXT_PUBLIC_MONGODB_URI) {
  throw new Error('Mongo URI missing');
}

const client = new MongoClient(uri, options);
const clientPromise = client.connect();

export default clientPromise;
