import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { bikeValidationSchema } from 'validationSchema/bikes';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.bike
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getBikeById();
    case 'PUT':
      return updateBikeById();
    case 'DELETE':
      return deleteBikeById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBikeById() {
    const data = await prisma.bike.findFirst(convertQueryToPrismaUtil(req.query, 'bike'));
    return res.status(200).json(data);
  }

  async function updateBikeById() {
    await bikeValidationSchema.validate(req.body);
    const data = await prisma.bike.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteBikeById() {
    const data = await prisma.bike.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
