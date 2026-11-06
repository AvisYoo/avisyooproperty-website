import {headers} from 'next/headers';
import type {Lang} from './domain';
export async function language():Promise<Lang>{return (await headers()).get('x-jc-lang')==='zh'?'zh':'en';}
