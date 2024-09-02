/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from '@/lib/logger';
import clientPromise from '@/lib/mongodb';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: any, res: any) => {
  try {
    const client = await clientPromise;
    const db = client.db('interactive-map');
    const games = await db.collection('games').find({}).toArray();
    res.json(games);
  } catch (e) {
    logger(e);
  }
};
