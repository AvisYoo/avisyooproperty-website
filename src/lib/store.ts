import {mkdir,readFile,writeFile,rename} from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {db} from './db';
import {demoProperties} from './demo';
import {listingSchema,type Property,type Lead,type LeadInput} from './domain';
type Local={listings:Property[];leads:Lead[]};
const dir=path.join(process.cwd(),'.local');const file=path.join(dir,'data.json');
let queue:Promise<unknown>=Promise.resolve();
function localAllowed(){if(process.env.NODE_ENV==='production')throw new Error('Database configuration required');}
async function localRead():Promise<Local>{localAllowed();try{return JSON.parse(await readFile(file,'utf8')) as Local;}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return {listings:structuredClone(demoProperties),leads:[]};throw e;}}
async function mutate<T>(fn:(d:Local)=>T):Promise<T>{const task=queue.then(async()=>{const d=await localRead();const result=fn(d);await mkdir(dir,{recursive:true});const temp=file+'.tmp';await writeFile(temp,JSON.stringify(d,null,2),{mode:0o600});await rename(temp,file);return result;});queue=task.catch(()=>{});return task;}
export async function properties(all=false):Promise<Property[]>{const client=db();if(client){const rows=await client.listing.findMany({where:all?{}:{published:true},orderBy:{updatedAt:'desc'}});return rows.map(r=>listingSchema.parse({...r.data as object,id:r.id,slug:r.slug,published:r.published,featured:r.featured}));}if(process.env.NODE_ENV==='production')return all?[]:demoProperties;const d=await localRead();return d.listings.filter(p=>all||p.published);}
export async function saveProperty(p:Property){const client=db();if(client){await client.listing.upsert({where:{id:p.id},create:{id:p.id,slug:p.slug,published:p.published,featured:p.featured,data:p},update:{slug:p.slug,published:p.published,featured:p.featured,data:p}});return;}await mutate(d=>{if(d.listings.some(x=>x.slug===p.slug&&x.id!==p.id))throw new Error('Duplicate slug');const i=d.listings.findIndex(x=>x.id===p.id);if(i<0)d.listings.unshift(p);else d.listings[i]=p;});}
export async function deleteProperty(id:string){const client=db();if(client){await client.listing.delete({where:{id}});return;}await mutate(d=>{d.listings=d.listings.filter(p=>p.id!==id)});}
export async function saveLead(input:LeadInput){const {website:_,...fields}=input;void _;const lead:Lead={...fields,id:randomUUID(),createdAt:new Date().toISOString(),status:'new'};const client=db();if(client){await client.lead.create({data:{...lead,createdAt:new Date(lead.createdAt)}});}else await mutate(d=>{d.leads.unshift(lead)});return lead.id;}
export async function leads(){const client=db();if(client)return (await client.lead.findMany({orderBy:{createdAt:'desc'},take:500})).map(l=>({...l,createdAt:l.createdAt.toISOString()}));return (await localRead()).leads;}
export async function updateLead(id:string,status:'new'|'contacted'|'closed'){const client=db();if(client){await client.lead.update({where:{id},data:{status}});return;}await mutate(d=>{const lead=d.leads.find(l=>l.id===id);if(!lead)throw new Error('Lead not found');lead.status=status;});}
export async function storeImage(bytes:Buffer){const id=randomUUID();const client=db();if(client)await client.image.create({data:{id,mime:'image/jpeg',bytes:new Uint8Array(bytes)}});else{localAllowed();await mkdir(path.join(dir,'images'),{recursive:true});await writeFile(path.join(dir,'images',id+'.jpg'),bytes,{mode:0o600});}return id;}
export async function image(id:string){const client=db();if(client){const row=await client.image.findUnique({where:{id}});return row?Buffer.from(row.bytes):null;}localAllowed();try{return await readFile(path.join(dir,'images',id+'.jpg'));}catch{return null;}}
