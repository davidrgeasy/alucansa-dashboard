import { areas } from '@/data/problems';
import AreaDetailClient from './AreaDetailClient';

// Genera las rutas estáticas para todas las áreas
export function generateStaticParams() {
  return areas.map((area) => ({
    id: area.id,
  }));
}

export default function AreaDetailPage() {
  return <AreaDetailClient />;
}
