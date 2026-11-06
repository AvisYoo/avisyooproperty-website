import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';

test('development repository persists leads, listing changes and images; production fails closed',async()=>{
 const previous=process.cwd(),database=process.env.DATABASE_URL,environment=process.env.NODE_ENV;
 const testRoot=path.resolve(previous,'../../work');await mkdir(testRoot,{recursive:true});const temp=await mkdtemp(path.join(testRoot,'jc-property-test-'));
 try{
  delete process.env.DATABASE_URL;Object.assign(process.env,{NODE_ENV:'development'});process.chdir(temp);
  const store=await import('../src/lib/store');
  const initial=await store.properties();assert.equal(initial.length,3);
  const id=await store.saveLead({name:'Test Enquiry',phone:'0000000000',enquiry:'buy',message:'Disposable local persistence check.',consent:true});
  assert.equal((await store.leads())[0].id,id);await store.updateLead(id,'contacted');assert.equal((await store.leads())[0].status,'contacted');
  const property={...initial[0],id:randomUUID(),slug:'temporary-test-property',published:false};await store.saveProperty(property);assert.equal((await store.properties(true)).length,4);assert.equal((await store.properties()).length,3);
  await assert.rejects(store.saveProperty({...property,id:randomUUID()}));
  await store.deleteProperty(property.id);assert.equal((await store.properties(true)).length,3);
  const bytes=Buffer.from('disposable-image-store-check');const imageId=await store.storeImage(bytes);assert.deepEqual(await store.image(imageId),bytes);
  Object.assign(process.env,{NODE_ENV:'production'});
  await assert.rejects(store.saveLead({name:'Test Enquiry',phone:'0000000000',enquiry:'buy',message:'Must not be saved in production without a database.',consent:true}));
  assert.equal((await store.properties()).every(p=>p.demo),true);
 }finally{
  process.chdir(previous);if(database===undefined)delete process.env.DATABASE_URL;else process.env.DATABASE_URL=database;
  if(environment===undefined)Reflect.deleteProperty(process.env,'NODE_ENV');else Object.assign(process.env,{NODE_ENV:environment});
  const resolved=path.resolve(temp);if(path.dirname(resolved)===testRoot&&path.basename(resolved).startsWith('jc-property-test-'))await rm(resolved,{recursive:true,force:true});
 }
});

