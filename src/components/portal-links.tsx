import { ArrowUpRight } from 'lucide-react';
import type { Lang } from '@/lib/domain';
import { choose } from '@/lib/i18n-client';

const portals = [
  { name: 'Mudah.my', url: 'https://www.mudah.my/yoo-jia-jun-the-roof-realty-jb' },
  { name: 'NextSix', url: 'https://nextsix.com/agent/avis-yoo/61309fb53d83b815941ba095' },
];

export function PortalLinks({ lang }: { lang: Lang }) {
  return (
    <aside className="portal-links" aria-label={choose(lang, 'My property listing profiles', '我的房源平台主页')}>
      <div>
        <p className="eyebrow">{choose(lang, 'My property listings', '我的平台房源')}</p>
        <h3>{choose(lang, 'Explore my listings on Mudah & NextSix.', '前往 Mudah 与 NextSix 查看我的房源。')}</h3>
        <p>{choose(lang, 'Visit my agent profiles for property details. Confirm availability and pricing with Avis.', '浏览我的经纪人主页与房源详情。价格及供应情况请与 Avis 确认。')}</p>
      </div>
      <div className="portal-actions">
        {portals.map(portal => (
          <a key={portal.name} className="button navy" href={portal.url} target="_blank" rel="noopener noreferrer" aria-label={choose(lang, `View my ${portal.name} listings (opens in a new tab)`, `查看我的 ${portal.name} 房源（在新标签页打开）`)}>
            {portal.name}<ArrowUpRight size={17} aria-hidden="true" />
          </a>
        ))}
      </div>
    </aside>
  );
}
