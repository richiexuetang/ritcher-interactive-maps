/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from '@/lib/logger';
import clientPromise from '@/lib/mongodb';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: any, res: any) => {
  try {
    const { searchParam, mapSlug } = req.query;
    const client = await clientPromise;
    const db = client.db('ritcher-map');

    const markers = await db
      .collection('markers')
      .find({
        $and: [
          {
            $or: [
              { markerName: { $regex: searchParam, $options: 'i' } },
              { description: { $regex: searchParam, $options: 'i' } },
            ],
          },
          {
            mapSlug: mapSlug,
          },
        ],
      })
      .collation({ locale: 'en', strength: 1 })
      .toArray();

    res.json(markers);
  } catch (e) {
    logger(e);
  }
};
