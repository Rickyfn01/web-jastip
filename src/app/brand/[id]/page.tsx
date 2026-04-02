import { Metadata } from 'next';
import LandingPage from '@/components/LandingPage';

type Props = {
  params: { id: string }
};

function formatBrandName(raw: string) {
  return raw
    .split('-')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const brandName = formatBrandName(params.id);

  return {
    title: `Jasa Titip ${brandName} 100% Original | JastipVIP`,
    description: `Layanan personal shopper VIP khusus produk ${brandName} resmi dari MAP Group. Dapatkan penawaran terbaik, tanpa antre. Kirim seluruh Indonesia.`,
    openGraph: {
      title: `Jasa Titip ${brandName} Original`,
      description: `Titip beli produk ${brandName} di store resmi terpercaya.`,
    }
  };
}

export default function BrandPage({ params }: Props) {
  const brandName = formatBrandName(params.id);

  return <LandingPage brandName={brandName} />;
}
