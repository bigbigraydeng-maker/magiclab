import type { Metadata } from 'next';
import MagicContentEngineMVP from '@/components/MagicContentEngineMVP';

export const metadata: Metadata = {
  title: 'Magic Content Engine | 中文内容员工 MVP',
  description: '从真实素材生成每周中文社媒内容包的 Magic Content Engine 最小可用版本。',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MagicContentEnginePage() {
  return <MagicContentEngineMVP />;
}
