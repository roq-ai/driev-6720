import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { rateValidationSchema } from 'validationSchema/rates';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.rate
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getRateById();
    case 'PUT':
      return updateRateById();
    case 'DELETE':
      return deleteRateById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getRateById() {
    const data = await prisma.rate.findFirst(convertQueryToPrismaUtil(req.query, 'rate'));
    return res.status(200).json(data);
  }

  async function updateRateById() {
    await rateValidationSchema.validate(req.body);
    const data = await prisma.rate.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteRateById() {
    const data = await prisma.rate.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
