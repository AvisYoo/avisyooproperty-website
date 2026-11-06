import {PrismaClient} from '@prisma/client';
const globalDb=globalThis as unknown as {prisma?:PrismaClient};
export function db(){if(!process.env.DATABASE_URL)return null;return globalDb.prisma??(globalDb.prisma=new PrismaClient());}
