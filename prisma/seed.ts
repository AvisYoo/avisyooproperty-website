import {PrismaClient} from '@prisma/client';import {demoProperties} from '../src/lib/demo';
const client=new PrismaClient();
async function seed(){for(const p of demoProperties)await client.listing.upsert({where:{id:p.id},update:{},create:{id:p.id,slug:p.slug,published:p.published,featured:p.featured,data:p}});console.log('Demo seed inserted without overwriting existing records.');}
seed().catch(()=>{console.error('Seed failed; check DATABASE_URL and database schema.');process.exitCode=1}).finally(()=>client.$disconnect());
