import { areas } from '@/data/problems';
import ProblemDetailClient from './ProblemDetailClient';

// Genera las rutas estáticas para problemas del archivo de datos
// Nota: Los problemas creados dinámicamente (guardados en localStorage)
// se renderizan en el cliente mediante ProblemDetailClient
export function generateStaticParams() {
  const allProblems = areas.flatMap((area) => 
    area.problemas.map((problem) => ({
      id: problem.id,
    }))
  );
  return allProblems;
}

// Permite rutas dinámicas que no estén pre-generadas
export const dynamicParams = true;

export default function ProblemDetailPage() {
  return <ProblemDetailClient />;
}
