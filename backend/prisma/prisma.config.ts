import { PrismaClient } from '@prisma/client'

const globalConfig = {
  log: ['warn', 'error'],
  errorFormat: 'compact',
}

declare global {
  namespace: string;
  var: any;
}

let prisma: PrismaClient;

const prismaClientSingleton = () => {
  if (!global.prisma) {
    global.prisma = new PrismaClient(globalConfig);
  }
  return global.prisma;
};

export default prismaClientSingleton;