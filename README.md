# Panel de Mejora ALUCANSA

Dashboard de consultoría de procesos y tecnología para la empresa industrial de aluminio ALUCANSA.

## 🚀 Tecnologías

- **Next.js 14** (App Router)
- **TypeScript** (tipado estricto)
- **TailwindCSS** (estilos)
- **Zustand** (gestión de estado)
- **Lucide React** (iconos)

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── page.tsx           # Dashboard principal
│   ├── layout.tsx         # Layout raíz
│   ├── globals.css        # Estilos globales
│   ├── problemas/
│   │   └── [id]/
│   │       └── page.tsx   # Detalle de problema
│   └── roadmap/
│       └── page.tsx       # Vista roadmap/cronograma
├── components/
│   ├── ui/                # Componentes base reutilizables
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── RangeInput.tsx
│   │   └── Select.tsx
│   ├── layout/            # Componentes de layout
│   │   ├── DashboardLayout.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   └── dashboard/         # Componentes específicos del dashboard
│       ├── FilterBar.tsx
│       ├── KPICards.tsx
│       ├── ProblemCard.tsx
│       └── ProblemGrid.tsx
├── data/
│   └── problems.ts        # Datos estáticos (áreas y problemas)
├── lib/
│   └── utils.ts           # Utilidades y helpers
├── store/
│   └── useFilters.ts      # Store de Zustand para filtros
└── types/
    └── index.ts           # Tipos TypeScript
```

## 🏃‍♂️ Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en el navegador
open http://localhost:3000
```

## 📊 Modelo de Datos

### Área
```typescript
interface Area {
  id: string;           // "area-1", "area-2"...
  codigo: string;       // "ÁREA 1", "ÁREA 2"...
  nombre: string;
  descripcion: string;
  prioridad: 'alta' | 'media' | 'baja';
  resumen: {
    numProblemas: number;
    inversionMin: number;
    inversionMax: number;
    ahorroMin: number;
    ahorroMax: number;
  };
  problemas: Problem[];
}
```

### Problema
```typescript
interface Problem {
  id: string;                    // "P01", "P02"...
  areaId: string;
  titulo: string;
  descripcion: string;
  impacto: 'alto' | 'medio' | 'bajo';
  urgencia: 'corto' | 'medio' | 'largo';
  causas: string[];
  evidencias: string[];
  solucionPropuesta: string;
  pasosImplementacion: string[];
  coste: { minimo: number; maximo: number; moneda: 'EUR' };
  roi: { minimo: number; maximo: number };
  dependencias?: string[];
  tags?: string[];
}
```

## 📝 Añadir Nuevos Datos

### Añadir una nueva Área

1. Abre `/src/data/problems.ts`
2. Añade un nuevo objeto al array `areas`:

```typescript
{
  id: 'area-7',
  codigo: 'ÁREA 7',
  nombre: 'Nueva Área',
  descripcion: 'Descripción del área',
  prioridad: 'media',
  resumen: {
    numProblemas: 0,
    inversionMin: 0,
    inversionMax: 0,
    ahorroMin: 0,
    ahorroMax: 0,
  },
  problemas: []
}
```

### Añadir un nuevo Problema

1. Localiza el área correspondiente en `/src/data/problems.ts`
2. Añade un nuevo objeto al array `problemas` del área:

```typescript
{
  id: 'P16',
  areaId: 'area-1',
  titulo: 'Título del problema',
  descripcion: 'Descripción completa...',
  impacto: 'alto',
  urgencia: 'corto',
  causas: ['Causa 1', 'Causa 2'],
  evidencias: ['Evidencia 1', 'Evidencia 2'],
  solucionPropuesta: 'Solución propuesta...',
  pasosImplementacion: ['Paso 1', 'Paso 2'],
  coste: { minimo: 5000, maximo: 15000, moneda: 'EUR' },
  roi: { minimo: 100, maximo: 200 },
  tags: ['tag1', 'tag2']
}
```

## 🔧 Extender Filtros

Para añadir un nuevo filtro:

1. Añade el campo al interface `FiltrosState` en `/src/types/index.ts`
2. Añade el estado inicial y setter en `/src/store/useFilters.ts`
3. Actualiza la función `applyFilters` para incluir la lógica del nuevo filtro
4. Añade el componente de filtro en `/src/components/dashboard/FilterBar.tsx`

## 🎨 Personalización de Estilos

Los colores principales se definen en `tailwind.config.ts`:

- **primary**: Tonos azul/gris industrial (#192239)
- **accent**: Naranja para destacar (#f97316)
- **industrial**: Colores adicionales (steel, aluminum, graphite, slate)

## 📱 Vistas Disponibles

1. **Dashboard Principal** (`/`)
   - Filtros globales
   - KPIs resumidos
   - Grid de tarjetas de problemas

2. **Detalle de Problema** (`/problemas/[id]`)
   - Información completa del problema
   - Causas, evidencias, solución
   - Métricas económicas y dependencias

3. **Roadmap** (`/roadmap`)
   - Vista de cronograma por horizonte temporal
   - Agrupación de problemas por plazo
   - Métricas agregadas por grupo

## 🤝 Contribución

Este proyecto fue creado como herramienta de visualización para un informe de consultoría.
Para modificar o extender el proyecto, sigue las convenciones establecidas y mantén el tipado estricto.

---

Desarrollado con ❤️ para ALUCANSA

