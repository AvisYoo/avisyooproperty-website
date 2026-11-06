import {hash} from 'bcryptjs';
import {createInterface} from 'node:readline';
import {Writable} from 'node:stream';
if(!process.stdin.isTTY){console.error('Run this command in an interactive terminal.');process.exit(1);}
let muted=false;
const output=new Writable({write(chunk,encoding,callback){if(!muted)process.stdout.write(chunk,encoding);callback();}});
const rl=createInterface({input:process.stdin,output,terminal:true});
process.stdout.write('New administrator password (minimum 14 characters; input hidden): ');muted=true;
rl.question('',async password=>{rl.close();muted=false;process.stdout.write('\n');if(password.length<14){console.error('Use at least 14 characters.');process.exitCode=1;return;}console.log('Add this hash to ADMIN_PASSWORD_HASH in .env.local:');console.log(await hash(password,12));});
