import { NextApiRequest, NextApiResponse } from 'next';
import { fetchData } from '@/lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = await fetchData('some-url');
  res.status(200).json(data);
}
