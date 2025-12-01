import { areas } from '@/data/problems';
import ProblemDetailClient from './ProblemDetailClient';

// Genera las rutas estáticas para todos los problemas
export function generateStaticParams() {
  const allProblems = areas.flatMap((area) => 
    area.problemas.map((problem) => ({
      id: problem.id,
    }))
  );
  return allProblems;
}

export default function ProblemDetailPage() {
  return <ProblemDetailClient />;
}
