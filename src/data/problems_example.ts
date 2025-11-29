/**
 * DATOS DE EJEMPLO - DASHBOARD ALUCANSA
 * ======================================
 * 
 * Este archivo contiene los datos estáticos de áreas y problemas.
 * 
 * CÓMO AÑADIR NUEVAS ÁREAS:
 * 1. Añade un nuevo objeto Area al array 'areas'
 * 2. Asegúrate de que el id sea único (ej: "area-7")
 * 3. Completa todos los campos requeridos
 * 4. Añade los problemas correspondientes al array 'problemas' del área
 * 
 * CÓMO AÑADIR NUEVOS PROBLEMAS:
 * 1. Localiza el área correspondiente en el array
 * 2. Añade un nuevo objeto Problem al array 'problemas' del área
 * 3. Usa un id único y secuencial (ej: "P07", "P08"...)
 * 4. El areaId debe coincidir con el id del área padre
 * 
 * Los valores de coste están en EUR.
 * Los valores de ROI están en porcentaje (%).
 */

import { Area } from '@/types';

export const areas: Area[] = [
  {
    id: 'area-1',
    codigo: 'ÁREA 1',
    nombre: 'Dirección y Modelo de Negocio',
    descripcion: 'Estrategia empresarial, toma de decisiones directivas y gestión del modelo de negocio.',
    prioridad: 'alta',
    resumen: {
      numProblemas: 3,
      inversionMin: 15000,
      inversionMax: 45000,
      ahorroMin: 50000,
      ahorroMax: 120000,
    },
    problemas: [
      {
        id: 'P01',
        areaId: 'area-1',
        titulo: 'Falta de visibilidad en tiempo real de KPIs de producción',
        descripcion: 'La dirección no dispone de un cuadro de mando integrado que muestre los indicadores clave de producción, ventas y rentabilidad en tiempo real. Las decisiones se toman con información fragmentada y desactualizada.',
        impacto: 'alto',
        urgencia: 'corto',
        causas: [
          'Sistemas de información desconectados entre departamentos',
          'Ausencia de un ERP centralizado o mal configurado',
          'Datos almacenados en hojas Excel sin sincronización',
          'Falta de cultura de medición y reporting automatizado'
        ],
        evidencias: [
          'Reuniones de dirección con datos de hace 2-3 semanas',
          'Decisiones de aprovisionamiento basadas en estimaciones',
          'Quejas de clientes por plazos incumplidos sin detección temprana'
        ],
        solucionPropuesta: 'Implementar un dashboard de Business Intelligence conectado a las fuentes de datos existentes (ERP, producción, ventas). Comenzar con 5-7 KPIs críticos y expandir progresivamente.',
        pasosImplementacion: [
          'Auditar fuentes de datos actuales y calidad de la información',
          'Definir los 7 KPIs críticos con dirección',
          'Seleccionar herramienta BI (Power BI, Metabase o similar)',
          'Desarrollar conectores y ETL básico',
          'Diseñar dashboard inicial y validar con usuarios',
          'Formar al equipo directivo en uso e interpretación',
          'Establecer rutina de revisión semanal'
        ],
        coste: {
          minimo: 8000,
          maximo: 20000,
          moneda: 'EUR'
        },
        roi: {
          minimo: 150,
          maximo: 300
        },
        tags: ['BI', 'KPIs', 'dirección', 'datos']
      },
      {
        id: 'P02',
        areaId: 'area-1',
        titulo: 'Proceso de presupuestación manual y lento',
        descripcion: 'La elaboración de presupuestos para clientes se realiza manualmente, con cálculos en Excel que requieren múltiples iteraciones y generan errores frecuentes. El tiempo medio de respuesta a un cliente es de 5-7 días.',
        impacto: 'alto',
        urgencia: 'medio',
        causas: [
          'Catálogo de productos no digitalizado correctamente',
          'Precios y márgenes dispersos en múltiples fuentes',
          'Falta de configurador de producto automatizado',
          'Dependencia de conocimiento tácito de comerciales veteranos'
        ],
        evidencias: [
          'Tiempo medio de presupuesto: 5-7 días laborables',
          'Tasa de error en presupuestos: ~15%',
          'Pérdida de oportunidades por lentitud de respuesta'
        ],
        solucionPropuesta: 'Desarrollar o adquirir un configurador de presupuestos integrado con el catálogo de productos y costes. Objetivo: reducir tiempo de respuesta a <24h.',
        pasosImplementacion: [
          'Digitalizar y normalizar catálogo de productos',
          'Definir reglas de pricing y márgenes por familia',
          'Evaluar soluciones: desarrollo a medida vs. SaaS',
          'Implementar MVP con productos más frecuentes (80% de ventas)',
          'Integrar con CRM existente',
          'Formar equipo comercial',
          'Medir y optimizar proceso'
        ],
        coste: {
          minimo: 5000,
          maximo: 15000,
          moneda: 'EUR'
        },
        roi: {
          minimo: 100,
          maximo: 200
        },
        dependencias: ['P01'],
        tags: ['comercial', 'presupuestos', 'automatización']
      },
      {
        id: 'P03',
        areaId: 'area-1',
        titulo: 'Ausencia de planificación estratégica documentada',
        descripcion: 'No existe un plan estratégico formal a 3-5 años que guíe las inversiones tecnológicas y de procesos. Las decisiones se toman de forma reactiva.',
        impacto: 'medio',
        urgencia: 'largo',
        causas: [
          'Cultura empresarial orientada al corto plazo',
          'Falta de tiempo dedicado a reflexión estratégica',
          'Ausencia de metodología de planificación'
        ],
        evidencias: [
          'Inversiones tecnológicas sin roadmap definido',
          'Proyectos abandonados a mitad de implementación',
          'Desalineación entre departamentos sobre prioridades'
        ],
        solucionPropuesta: 'Facilitar proceso de planificación estratégica con metodología ágil. Definir visión a 3 años y roadmap tecnológico alineado.',
        pasosImplementacion: [
          'Workshop de diagnóstico estratégico con dirección',
          'Análisis DAFO tecnológico y de procesos',
          'Definición de visión y objetivos a 3 años',
          'Priorización de iniciativas con matriz impacto/esfuerzo',
          'Elaboración de roadmap trimestral',
          'Establecer revisiones trimestrales de avance'
        ],
        coste: {
          minimo: 2000,
          maximo: 10000,
          moneda: 'EUR'
        },
        roi: {
          minimo: 50,
          maximo: 150
        },
        tags: ['estrategia', 'planificación', 'dirección']
      }
    ]
  },
  {
    id: 'area-2',
    codigo: 'ÁREA 2',
    nombre: 'Contabilidad y Finanzas',
    descripcion: 'Gestión contable, facturación, tesorería y control financiero.',
    prioridad: 'media',
    resumen: {
      numProblemas: 2,
      inversionMin: 6000,
      inversionMax: 22000,
      ahorroMin: 25000,
      ahorroMax: 60000,
    },
    problemas: [
      {
        id: 'P04',
        areaId: 'area-2',
        titulo: 'Conciliación bancaria manual y propensa a errores',
        descripcion: 'La conciliación de movimientos bancarios se realiza manualmente comparando extractos PDF con registros contables. El proceso consume 2-3 días al mes y genera discrepancias frecuentes.',
        impacto: 'medio',
        urgencia: 'corto',
        causas: [
          'Software contable sin conexión bancaria directa',
          'Múltiples cuentas en diferentes entidades',
          'Nomenclatura inconsistente en conceptos de pago'
        ],
        evidencias: [
          'Tiempo dedicado: 20-24 horas/mes',
          'Errores detectados en auditoría interna: 3-5 al mes',
          'Retraso en cierre mensual por conciliación'
        ],
        solucionPropuesta: 'Implementar conexión Open Banking o importación automática de movimientos. Configurar reglas de conciliación automática para el 80% de movimientos recurrentes.',
        pasosImplementacion: [
          'Evaluar capacidades Open Banking del software actual',
          'Configurar conexiones con entidades bancarias principales',
          'Definir reglas de matching automático',
          'Período de prueba en paralelo (1 mes)',
          'Formar a equipo contable',
          'Documentar excepciones y proceso manual residual'
        ],
        coste: {
          minimo: 2000,
          maximo: 7000,
          moneda: 'EUR'
        },
        roi: {
          minimo: 120,
          maximo: 200
        },
        tags: ['contabilidad', 'bancos', 'automatización']
      },
      {
        id: 'P05',
        areaId: 'area-2',
        titulo: 'Falta de control de costes por proyecto/pedido',
        descripcion: 'No existe trazabilidad clara de costes (materiales, mano de obra, transporte) asociados a cada pedido o proyecto. La rentabilidad real se conoce solo a nivel agregado mensual.',
        impacto: 'alto',
        urgencia: 'medio',
        causas: [
          'Sistema de imputación de costes inexistente o manual',
          'Partes de trabajo no digitalizados',
          'Materiales no se asocian a órdenes de fabricación'
        ],
        evidencias: [
          'Márgenes reales desconocidos por cliente/producto',
          'Presupuestos que resultaron deficitarios detectados tarde',
          'Imposibilidad de identificar productos/clientes no rentables'
        ],
        solucionPropuesta: 'Implementar sistema de costes por orden de fabricación/pedido. Integrar imputación de materiales, horas y costes indirectos.',
        pasosImplementacion: [
          'Definir modelo de costes (directos, indirectos, overhead)',
          'Configurar órdenes de fabricación en ERP',
          'Implementar captura de partes de trabajo (tablets en planta)',
          'Asociar consumos de material a órdenes',
          'Desarrollar informes de rentabilidad por pedido',
          'Formar a responsables de área'
        ],
        coste: {
          minimo: 4000,
          maximo: 15000,
          moneda: 'EUR'
        },
        roi: {
          minimo: 80,
          maximo: 180
        },
        dependencias: ['P01'],
        tags: ['costes', 'rentabilidad', 'producción', 'finanzas']
      }
    ]
  },
  {
    id: 'area-3',
    codigo: 'ÁREA 3',
    nombre: 'Almacén y Logística',
    descripcion: 'Gestión de inventarios, recepción de materiales, expediciones y logística interna.',
    prioridad: 'alta',
    resumen: {
      numProblemas: 3,
      inversionMin: 12000,
      inversionMax: 35000,
      ahorroMin: 40000,
      ahorroMax: 95000,
    },
    problemas: [
      {
        id: 'P06',
        areaId: 'area-3',
        titulo: 'Stock físico no coincide con stock en sistema',
        descripcion: 'Discrepancias constantes entre el inventario registrado en el ERP y el stock físico real. Esto genera roturas de stock inesperadas y exceso de material obsoleto.',
        impacto: 'alto',
        urgencia: 'corto',
        causas: [
          'Movimientos de material no registrados en tiempo real',
          'Ubicaciones de almacén no mapeadas en sistema',
          'Devoluciones y mermas no contabilizadas',
          'Falta de disciplina en registro de entradas/salidas'
        ],
        evidencias: [
          'Inventario físico anual: desviación del 12-18%',
          'Paradas de producción por falta de material "disponible"',
          'Pedidos urgentes a proveedores por roturas evitables'
        ],
        solucionPropuesta: 'Implementar sistema de gestión de almacén (SGA/WMS) con terminales móviles para registro en tiempo real de todos los movimientos.',
        pasosImplementacion: [
          'Mapear ubicaciones físicas del almacén',
          'Etiquetar ubicaciones con códigos QR/barras',
          'Configurar SGA o módulo de almacén del ERP',
          'Adquirir terminales móviles (PDAs o smartphones)',
          'Formar a personal de almacén',
          'Inventario inicial con nuevo sistema',
          'Establecer inventarios cíclicos mensuales'
        ],
        coste: {
          minimo: 5000,
          maximo: 15000,
          moneda: 'EUR'
        },
        roi: {
          minimo: 100,
          maximo: 250
        },
        tags: ['almacén', 'stock', 'WMS', 'inventario']
      },
      {
        id: 'P07',
        areaId: 'area-3',
        titulo: 'Recepción de materiales sin control de calidad',
        descripcion: 'Los materiales de proveedores se reciben sin inspección sistemática. Los defectos se detectan durante la fabricación, generando retrabajos y retrasos.',
        impacto: 'medio',
        urgencia: 'medio',
        causas: [
          'Ausencia de protocolo de inspección en recepción',
          'Presión por agilizar entradas al almacén',
          'Falta de criterios de calidad documentados por material'
        ],
        evidencias: [
          'Rechazos en producción por material defectuoso: 5-8% mensual',
          'Reclamaciones a proveedores tardías (fuera de plazo)',
          'Costes ocultos de retrabajo no cuantificados'
        ],
        solucionPropuesta: 'Definir e implementar protocolo de inspección en recepción para materiales críticos. Registro digital de no conformidades.',
        pasosImplementacion: [
          'Identificar materiales críticos (Pareto 80/20)',
          'Definir criterios de aceptación por material',
          'Crear checklist digital de inspección',
          'Formar a personal de recepción',
          'Implementar registro de no conformidades',
          'Establecer KPIs de calidad de proveedores'
        ],
        coste: {
          minimo: 3000,
          maximo: 8000,
          moneda: 'EUR'
        },
        roi: {
          minimo: 80,
          maximo: 150
        },
        tags: ['calidad', 'proveedores', 'recepción', 'almacén']
      },
      {
        id: 'P08',
        areaId: 'area-3',
        titulo: 'Rutas de reparto no optimizadas',
        descripcion: 'Las rutas de entrega a clientes se planifican manualmente sin criterios de optimización. Esto genera sobrecostes de transporte y tiempos de entrega variables.',
        impacto: 'medio',
        urgencia: 'largo',
        causas: [
          'Planificación basada en experiencia del transportista',
          'Ausencia de software de optimización de rutas',
          'Pedidos agrupados por fecha sin considerar ubicación'
        ],
        evidencias: [
          'Coste de transporte propio: 8% sobre ventas',
          'Vehículos con capacidad no aprovechada (50-60%)',
          'Quejas de clientes por ventanas de entrega imprecisas'
        ],
        solucionPropuesta: 'Implementar herramienta de optimización de rutas integrada con sistema de pedidos. Considerar opciones cloud como Route4Me, OptimoRoute o similar.',
        pasosImplementacion: [
          'Analizar datos históricos de entregas y rutas',
          'Evaluar herramientas de optimización de rutas',
          'Piloto con zona geográfica representativa',
          'Integrar con sistema de pedidos/ERP',
          'Formar a responsable de logística',
          'Medir ahorro real vs. situación anterior'
        ],
        coste: {
          minimo: 4000,
          maximo: 12000,
          moneda: 'EUR'
        },
        roi: {
          minimo: 60,
          maximo: 120
        },
        tags: ['logística', 'transporte', 'rutas', 'optimización']
      }
    ]
  },
  {
    id: 'area-4',
    codigo: 'ÁREA 4',
    nombre: 'Producción y Fabricación',
    descripcion: 'Procesos de fabricación, planificación de producción, control de calidad y mantenimiento.',
    prioridad: 'alta',
    resumen: {
      numProblemas: 3,
      inversionMin: 18000,
      inversionMax: 55000,
      ahorroMin: 80000,
      ahorroMax: 180000,
    },
    problemas: [
      {
        id: 'P09',
        areaId: 'area-4',
        titulo: 'Planificación de producción en Excel sin visibilidad de carga',
        descripcion: 'La planificación de órdenes de fabricación se realiza en hojas Excel sin conexión con capacidad real de máquinas ni disponibilidad de materiales. Frecuentes cuellos de botella y urgencias.',
        impacto: 'alto',
        urgencia: 'corto',
        causas: [
          'Ausencia de sistema MRP/MES integrado',
          'Tiempos estándar de fabricación no actualizados',
          'Falta de visibilidad de carga de trabajo por centro'
        ],
        evidencias: [
          'Replanificaciones diarias: 3-5 cambios de prioridad',
          'Horas extra no planificadas: 15-20% de la plantilla',
          'Plazos de entrega incumplidos: 22% de pedidos'
        ],
        solucionPropuesta: 'Implementar módulo de planificación de producción (MPS/MRP) integrado con ERP. Definir capacidades y tiempos estándar por centro de trabajo.',
        pasosImplementacion: [
          'Definir centros de trabajo y capacidades',
          'Actualizar rutas de fabricación con tiempos estándar',
          'Configurar módulo MRP del ERP',
          'Integrar con gestión de pedidos',
          'Formar a planificador de producción',
          'Período de convivencia con sistema actual (1 mes)',
          'Establecer reunión diaria de planificación'
        ],
        coste: {
          minimo: 8000,
          maximo: 25000,
          moneda: 'EUR'
        },
        roi: {
          minimo: 150,
          maximo: 300
        },
        dependencias: ['P06'],
        tags: ['producción', 'planificación', 'MRP', 'ERP']
      },
      {
        id: 'P10',
        areaId: 'area-4',
        titulo: 'Mantenimiento reactivo sin planificación preventiva',
        descripcion: 'Las máquinas se reparan cuando fallan, no hay programa de mantenimiento preventivo. Las averías generan paradas no planificadas costosas.',
        impacto: 'alto',
        urgencia: 'medio',
        causas: [
          'Ausencia de histórico de intervenciones',
          'Falta de recursos dedicados a mantenimiento preventivo',
          'Cultura de "si funciona, no lo toques"'
        ],
        evidencias: [
          'Paradas no planificadas: 45 horas/mes promedio',
          'Coste de averías urgentes: 40% más que preventivo',
          'Vida útil de equipos reducida por falta de mantenimiento'
        ],
        solucionPropuesta: 'Implementar sistema GMAO (Gestión de Mantenimiento Asistido por Ordenador) con planes preventivos basados en horas/ciclos de uso.',
        pasosImplementacion: [
          'Inventariar equipos críticos y crear fichas técnicas',
          'Definir planes de mantenimiento por equipo',
          'Seleccionar e implementar GMAO',
          'Formar a equipo de mantenimiento',
          'Establecer indicadores OEE básicos',
          'Revisar y ajustar planes trimestralmente'
        ],
        coste: {
          minimo: 5000,
          maximo: 15000,
          moneda: 'EUR'
        },
        roi: {
          minimo: 120,
          maximo: 250
        },
        tags: ['mantenimiento', 'GMAO', 'producción', 'OEE']
      },
      {
        id: 'P11',
        areaId: 'area-4',
        titulo: 'Trazabilidad de producto inexistente',
        descripcion: 'No existe trazabilidad de lotes de producción ni de materiales utilizados en cada fabricación. Ante una incidencia de calidad, es imposible identificar el alcance del problema.',
        impacto: 'medio',
        urgencia: 'largo',
        causas: [
          'Procesos manuales sin registro de lotes',
          'Materiales mezclados sin identificación',
          'Ausencia de sistema MES'
        ],
        evidencias: [
          'Retiro de producto: afecta a toda la producción de un período',
          'Reclamaciones de cliente no trazables a causa raíz',
          'Incumplimiento de requisitos de clientes industriales'
        ],
        solucionPropuesta: 'Implementar sistema de trazabilidad por lotes integrando materias primas, órdenes de fabricación y expediciones.',
        pasosImplementacion: [
          'Definir política de lotificación de materiales',
          'Implementar etiquetado de lotes en recepción',
          'Asociar consumos a órdenes de fabricación',
          'Registrar lotes en expedición',
          'Desarrollar consulta de trazabilidad ascendente/descendente',
          'Validar con simulacro de retirada'
        ],
        coste: {
          minimo: 5000,
          maximo: 15000,
          moneda: 'EUR'
        },
        roi: {
          minimo: 50,
          maximo: 120
        },
        dependencias: ['P06', 'P09'],
        tags: ['trazabilidad', 'calidad', 'lotes', 'producción']
      }
    ]
  },
  {
    id: 'area-5',
    codigo: 'ÁREA 5',
    nombre: 'Comercial y Ventas',
    descripcion: 'Gestión de clientes, proceso de ventas, CRM y atención comercial.',
    prioridad: 'media',
    resumen: {
      numProblemas: 2,
      inversionMin: 4000,
      inversionMax: 14000,
      ahorroMin: 30000,
      ahorroMax: 70000,
    },
    problemas: [
      {
        id: 'P12',
        areaId: 'area-5',
        titulo: 'Información de clientes dispersa y desactualizada',
        descripcion: 'Los datos de clientes, historial de contactos y oportunidades están dispersos en correos, Excel y la memoria de los comerciales. No hay CRM centralizado.',
        impacto: 'medio',
        urgencia: 'corto',
        causas: [
          'Ausencia de herramienta CRM',
          'Resistencia al cambio del equipo comercial',
          'Falta de proceso comercial definido'
        ],
        evidencias: [
          'Pérdida de información cuando un comercial se va',
          'Duplicación de esfuerzos comerciales sobre mismos clientes',
          'Imposibilidad de medir pipeline comercial'
        ],
        solucionPropuesta: 'Implementar CRM cloud (HubSpot, Pipedrive o similar) integrado con correo y calendario. Definir proceso comercial estándar.',
        pasosImplementacion: [
          'Mapear proceso comercial actual',
          'Definir etapas del pipeline comercial',
          'Seleccionar CRM adecuado a tamaño y presupuesto',
          'Migrar datos de clientes existentes',
          'Integrar con correo electrónico',
          'Formar al equipo comercial',
          'Establecer reunión semanal de pipeline'
        ],
        coste: {
          minimo: 2000,
          maximo: 6000,
          moneda: 'EUR'
        },
        roi: {
          minimo: 100,
          maximo: 180
        },
        tags: ['CRM', 'ventas', 'clientes', 'comercial']
      },
      {
        id: 'P13',
        areaId: 'area-5',
        titulo: 'Sin seguimiento de satisfacción de cliente',
        descripcion: 'No existe un proceso sistemático de medición de satisfacción del cliente ni de gestión de reclamaciones. Las incidencias se gestionan de forma reactiva.',
        impacto: 'bajo',
        urgencia: 'largo',
        causas: [
          'Falta de cultura de feedback del cliente',
          'No hay herramienta de encuestas/NPS',
          'Reclamaciones gestionadas por email sin seguimiento'
        ],
        evidencias: [
          'Desconocimiento del NPS o satisfacción global',
          'Clientes perdidos sin análisis de causas',
          'Reclamaciones repetitivas no detectadas como patrón'
        ],
        solucionPropuesta: 'Implementar proceso de medición de satisfacción (encuestas post-venta, NPS trimestral) y sistema de gestión de reclamaciones.',
        pasosImplementacion: [
          'Definir indicadores de satisfacción a medir',
          'Seleccionar herramienta de encuestas',
          'Diseñar encuesta post-entrega automatizada',
          'Implementar proceso de gestión de reclamaciones',
          'Establecer revisión mensual de resultados',
          'Vincular satisfacción a bonus comercial'
        ],
        coste: {
          minimo: 2000,
          maximo: 8000,
          moneda: 'EUR'
        },
        roi: {
          minimo: 40,
          maximo: 100
        },
        dependencias: ['P12'],
        tags: ['satisfacción', 'NPS', 'clientes', 'calidad']
      }
    ]
  },
  {
    id: 'area-6',
    codigo: 'ÁREA 6',
    nombre: 'Recursos Humanos y Organización',
    descripcion: 'Gestión de personal, formación, nóminas y desarrollo organizacional.',
    prioridad: 'baja',
    resumen: {
      numProblemas: 2,
      inversionMin: 3000,
      inversionMax: 12000,
      ahorroMin: 15000,
      ahorroMax: 40000,
    },
    problemas: [
      {
        id: 'P14',
        areaId: 'area-6',
        titulo: 'Control de presencia manual y poco fiable',
        descripcion: 'El registro de jornada se realiza en papel o con hojas Excel. Esto dificulta el control real de horas trabajadas, horas extra y absentismo.',
        impacto: 'medio',
        urgencia: 'corto',
        causas: [
          'Sistema de fichaje obsoleto o inexistente',
          'Falta de integración con nóminas',
          'Cultura permisiva con flexibilidad horaria'
        ],
        evidencias: [
          'Incumplimiento de normativa de registro horario',
          'Horas extra no registradas ni compensadas',
          'Dificultad para planificar turnos'
        ],
        solucionPropuesta: 'Implementar sistema de control de presencia digital (app móvil o terminal biométrico) integrado con nóminas.',
        pasosImplementacion: [
          'Evaluar requisitos legales y convenio',
          'Seleccionar sistema de control de presencia',
          'Instalar terminales o desplegar app',
          'Definir política de horarios y flexibilidad',
          'Integrar con sistema de nóminas',
          'Comunicar y formar a empleados'
        ],
        coste: {
          minimo: 2000,
          maximo: 7000,
          moneda: 'EUR'
        },
        roi: {
          minimo: 80,
          maximo: 150
        },
        tags: ['RRHH', 'presencia', 'nóminas', 'control']
      },
      {
        id: 'P15',
        areaId: 'area-6',
        titulo: 'Plan de formación inexistente',
        descripcion: 'No hay un plan de formación estructurado. La capacitación es reactiva y depende de iniciativas individuales. Dificulta la polivalencia y el desarrollo profesional.',
        impacto: 'bajo',
        urgencia: 'largo',
        causas: [
          'Falta de identificación de necesidades formativas',
          'Presupuesto de formación no definido',
          'Cultura de aprendizaje informal'
        ],
        evidencias: [
          'Baja polivalencia: dependencia de personas clave',
          'Dificultad para cubrir vacaciones y bajas',
          'Empleados desmotivados por falta de desarrollo'
        ],
        solucionPropuesta: 'Definir plan de formación anual basado en competencias críticas y polivalencia. Aprovechar bonificaciones FUNDAE.',
        pasosImplementacion: [
          'Identificar competencias críticas por puesto',
          'Evaluar gap de competencias actual',
          'Definir plan de formación anual priorizado',
          'Tramitar bonificaciones FUNDAE',
          'Ejecutar plan con seguimiento',
          'Medir impacto y polivalencia conseguida'
        ],
        coste: {
          minimo: 1000,
          maximo: 5000,
          moneda: 'EUR'
        },
        roi: {
          minimo: 50,
          maximo: 120
        },
        tags: ['formación', 'RRHH', 'competencias', 'desarrollo']
      }
    ]
  }
];

/**
 * Obtiene todos los problemas de todas las áreas en un array plano
 */
export function getAllProblems(): import('@/types').Problem[] {
  return areas.flatMap(area => area.problemas);
}

/**
 * Obtiene un problema por su ID
 */
export function getProblemById(id: string): import('@/types').Problem | undefined {
  return getAllProblems().find(p => p.id === id);
}

/**
 * Obtiene un área por su ID
 */
export function getAreaById(id: string): Area | undefined {
  return areas.find(a => a.id === id);
}

/**
 * Obtiene el área a la que pertenece un problema
 */
export function getAreaByProblemId(problemId: string): Area | undefined {
  return areas.find(a => a.problemas.some(p => p.id === problemId));
}

