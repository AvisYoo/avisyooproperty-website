import {NextRequest,NextResponse} from 'next/server';
export function proxy(req:NextRequest){const requested=req.nextUrl.searchParams.get('lang');const lang=requested==='zh'||requested==='en'?requested:req.cookies.get('jc-lang')?.value==='zh'?'zh':'en';const headers=new Headers(req.headers);headers.set('x-jc-lang',lang);const response=NextResponse.next({request:{headers}});if(requested==='en'||requested==='zh')response.cookies.set('jc-lang',lang,{sameSite:'lax',maxAge:31536000,path:'/'});return response;}
export const config={matcher:['/((?!api|_next|favicon.ico|.*\\..*).*)']};
