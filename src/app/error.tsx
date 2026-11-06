'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <section className="container section"><h1>Unable to load / 暂时无法加载</h1><p>Please try again later. / 请稍后重试。</p><button className="button navy" onClick={reset}>Try again / 重试</button></section>}
