/**
 * DATOS REALES - DASHBOARD ALUCANSA
 * ==================================
 * 
 * Este archivo contiene los datos de áreas y problemas del informe de consultoría.
 * 
 * Estructura:
 * - 6 Áreas de análisis
 * - 30 Problemas identificados con causas, evidencias, soluciones y métricas
 * 
 * Para añadir nuevas áreas o problemas, sigue la estructura de tipos definida.
 */

// ======================
// TIPOS BASE
// ======================

export type Impacto = "alto" | "medio" | "bajo";
export type Urgencia = "corto" | "medio" | "largo";

export interface Coste {
  minimo: number;
  maximo: number;
  moneda: "EUR";
}

export interface ROI {
  minimo: number;
  maximo: number;
  justificacion: string;
}

export interface Problem {
  id: string;
  areaId: string;
  titulo: string;
  descripcion: string;
  impacto: Impacto;
  urgencia: Urgencia;
  causas: string[];
  evidencias: string[];
  solucionPropuesta: string;
  pasosImplementacion: string[];
  coste: Coste;
  roi: ROI;
  dependencias?: string[];
  tags?: string[];
}

export interface AreaResumen {
  numProblemas: number;
  inversionMin: number;
  inversionMax: number;
  ahorroMin: number;
  ahorroMax: number;
}

export interface Area {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  prioridad: Impacto;
  resumen: AreaResumen;
  problemas: Problem[];
}

// ======================
// ÁREA 1 — ORGANIZACIÓN / MODELO OPERATIVO
// ======================

const area1: Area = {
  id: "area1",
  codigo: "ORG",
  nombre: "Organización y modelo operativo",
  descripcion: "Estructura organizativa, definición de roles, gobierno del dato y forma en que las decisiones se apoyan (o no) en información fiable.",
  prioridad: "alto",
  resumen: {
    numProblemas: 5,
    inversionMin: 11000,
    inversionMax: 29000,
    ahorroMin: 35000,
    ahorroMax: 120000
  },
  problemas: [
    {
      id: "ORG-1",
      areaId: "area1",
      titulo: "Ausencia de responsable claro del dato y de procesos",
      descripcion: "No existe una figura formal que asuma la responsabilidad global sobre la calidad del dato, la coherencia de los procesos y la coordinación entre departamentos.",
      impacto: "alto",
      urgencia: "corto",
      causas: [
        "Crecimiento orgánico de la empresa sin rediseñar la estructura",
        "Responsabilidades históricas asumidas por personas y no por puestos",
        "Falta de gobierno del dato y de procesos documentado"
      ],
      evidencias: [
        "Nadie puede explicar de principio a fin el flujo de un pedido con datos fiables",
        "Cada departamento tiene una visión parcial y a veces contradictoria de la realidad",
        "Las incidencias de datos se parchean pero no se atacan de raíz"
      ],
      solucionPropuesta: "Crear la figura de Responsable de Procesos y Datos (interno o compartido) con autoridad transversal para definir, documentar y velar por el cumplimiento de los procesos y estándares de información.",
      pasosImplementacion: [
        "Definir funciones y alcance del rol (responsable del dato y procesos)",
        "Asignar la función a una persona interna o incorporar un perfil adecuado",
        "Documentar responsabilidades, indicadores clave y canales de comunicación",
        "Establecer un circuito de gestión de incidencias de datos y procesos",
        "Revisar trimestralmente avances y bloqueos con la Dirección"
      ],
      coste: {
        minimo: 3000,
        maximo: 8000,
        moneda: "EUR"
      },
      roi: {
        minimo: 150,
        maximo: 400,
        justificacion: "Ahorro estimado de 15-25h/semana en resolución de incidencias y duplicidades. Una persona con visión transversal evita retrabajos y errores que hoy cuestan ~€500-1.000/semana entre tiempo perdido, urgencias y decisiones mal informadas."
      },
      dependencias: [],
      tags: ["gobierno del dato", "procesos", "organización"]
    },
    {
      id: "ORG-2",
      areaId: "area1",
      titulo: "Procesos no documentados y dependientes de personas clave",
      descripcion: "Los procesos críticos de negocio están en la cabeza de unas pocas personas y no existen procedimientos escritos, versiones oficiales ni circuitos estándar.",
      impacto: "alto",
      urgencia: "medio",
      causas: [
        "Falta de tiempo y metodología para documentar procedimientos",
        "Cultura de \"cada uno sabe lo suyo\"",
        "Ausencia de plantillas y responsables de documentación"
      ],
      evidencias: [
        "Discrepancias entre sedes sobre cómo se hacen tareas iguales",
        "Dificultad para sustituir a personas clave cuando no están presentes",
        "Cambios de criterio frecuentes sin trazabilidad ni comunicación formal"
      ],
      solucionPropuesta: "Implantar un sistema ligero de documentación de procesos (procedimientos operativos estándar) accesible para toda la organización.",
      pasosImplementacion: [
        "Seleccionar una herramienta simple para documentación (Wiki interna, Notion, Confluence o similar)",
        "Priorizar los procesos críticos que deben documentarse primero",
        "Asignar responsables de redacción y validación por proceso",
        "Definir formato estándar de procedimiento (objetivo, pasos, responsables, entradas/salidas)",
        "Implantar un ciclo de revisión anual de procesos"
      ],
      coste: {
        minimo: 2000,
        maximo: 5000,
        moneda: "EUR"
      },
      roi: {
        minimo: 100,
        maximo: 300,
        justificacion: "Reducción del tiempo de formación de nuevos empleados (~40%), menor dependencia de personas clave (riesgo valorado en ~€15.000/año) y eliminación de errores por desconocimiento de procedimientos (~5h/semana)."
      },
      dependencias: ["ORG-1"],
      tags: ["procedimientos", "documentación", "conocimiento"]
    },
    {
      id: "ORG-3",
      areaId: "area1",
      titulo: "Decisiones reactivas sin indicadores comunes",
      descripcion: "La empresa toma decisiones importantes sobre precios, stocks, producción y personal sin un cuadro de indicadores compartido ni criterios homogéneos.",
      impacto: "alto",
      urgencia: "medio",
      causas: [
        "No existe un cuadro de mando mínimo consensuado",
        "Cada área calcula \"sus números\" con herramientas distintas",
        "Falta de cultura de dato como base de decisión"
      ],
      evidencias: [
        "Discurso recurrente de \"no tenemos datos fiables\"",
        "Dificultad para responder preguntas básicas sobre rentabilidad por línea o por cliente",
        "Discusión frecuente sobre qué cifras son las \"buenas\""
      ],
      solucionPropuesta: "Definir un cuadro de mando básico transversal con indicadores mínimos por área, alimentado con datos reales, aunque al principio la extracción no sea perfecta.",
      pasosImplementacion: [
        "Definir junto a Dirección el set mínimo de KPIs (ventas, margen, servicio, desperdicio, incidencias, etc.)",
        "Identificar de dónde sale cada dato y quién es responsable",
        "Montar un primer cuadro de mando simple (Excel avanzado, Power BI u otra herramienta BI)",
        "Revisar mensualmente los indicadores con los responsables de área",
        "Ajustar definición y fuentes de datos según se detecten incoherencias"
      ],
      coste: {
        minimo: 3000,
        maximo: 8000,
        moneda: "EUR"
      },
      roi: {
        minimo: 120,
        maximo: 350,
        justificacion: "Mejora en la toma de decisiones que puede evitar ~2-3% de pérdidas por malas decisiones de precio, stock o producción. En una facturación de 3-5M€ representa €60.000-150.000/año de impacto potencial."
      },
      dependencias: ["ORG-1"],
      tags: ["kpi", "cuadro de mando", "dato"]
    },
    {
      id: "ORG-4",
      areaId: "area1",
      titulo: "Reuniones y comunicación poco estructuradas",
      descripcion: "Las reuniones entre áreas son poco sistemáticas y muchas decisiones importantes se toman por correo, WhatsApp o conversaciones informales sin seguimiento.",
      impacto: "medio",
      urgencia: "medio",
      causas: [
        "No existe un calendario de reuniones operativas definido",
        "Ausencia de actas o acuerdos escritos y compartidos",
        "Uso intensivo de canales informales para decisiones críticas"
      ],
      evidencias: [
        "Desalineación frecuente entre lo que se acordó y lo que se ejecuta",
        "Decisiones importantes que dependen de recordar conversaciones",
        "Reuniones que se convierten en discusiones circulares sin cierre claro"
      ],
      solucionPropuesta: "Diseñar un sistema mínimo de gobernanza: tipos de reuniones, frecuencia, asistentes, agenda y actas de acuerdos.",
      pasosImplementacion: [
        "Definir tipos de reuniones (dirección, operativa, seguimiento de proyectos)",
        "Asignar periodicidad y responsables de convocatoria",
        "Implantar una plantilla simple de acta de reunión compartida",
        "Asegurar que las decisiones que afecten a procesos/datos se registran",
        "Revisar trimestralmente si las reuniones aportan valor o deben ajustarse"
      ],
      coste: {
        minimo: 1000,
        maximo: 3000,
        moneda: "EUR"
      },
      roi: {
        minimo: 80,
        maximo: 200,
        justificacion: "Ahorro de ~3-5h/semana en reuniones improductivas y repetición de información. Reducción de malentendidos que generan errores (~€200-400/mes). Mejor alineación reduce fricciones y urgencias."
      },
      dependencias: [],
      tags: ["comunicación interna", "reuniones", "gobernanza"]
    },
    {
      id: "ORG-5",
      areaId: "area1",
      titulo: "Dependencia excesiva de perfiles técnicos para decisiones de negocio",
      descripcion: "Se espera que el perfil técnico (informático) defina o valide decisiones de negocio y de procesos que exceden su ámbito y requieren visión global de la empresa.",
      impacto: "alto",
      urgencia: "corto",
      causas: [
        "Confusión entre \"gestionar tecnología\" y \"diseñar procesos de negocio\"",
        "Ausencia de rol de consultoría interna o analista de procesos",
        "Histórico de delegar en informática todo aquello que toca un software"
      ],
      evidencias: [
        "Expectativa de que el técnico asuma trazabilidad completa del dato",
        "Decisiones de proceso justificadas por \"lo que dice el programa\"",
        "Sobrecarga de tareas no técnicas en el perfil técnico"
      ],
      solucionPropuesta: "Separar claramente el rol de tecnología (soporte, sistemas) del rol de procesos/negocio, redefiniendo responsabilidades y expectativas.",
      pasosImplementacion: [
        "Mapear tareas actuales del perfil técnico y clasificarlas (sistemas vs procesos)",
        "Definir qué tareas de negocio deben reasignarse a responsables de proceso",
        "Comunicar la nueva distribución de responsabilidades a toda la organización",
        "Acompañar al perfil técnico en la transición para centrarlo en su rol real",
        "Revisar tras 6 meses si la separación de funciones ha reducido fricciones"
      ],
      coste: {
        minimo: 2000,
        maximo: 5000,
        moneda: "EUR"
      },
      roi: {
        minimo: 100,
        maximo: 250,
        justificacion: "Liberación del 30-40% del tiempo del perfil técnico para tareas de su competencia real. Reducción de frustraciones y rotación (coste de sustitución ~€8.000-15.000). Mejor rendimiento de proyectos tecnológicos."
      },
      dependencias: ["ORG-1", "ORG-2"],
      tags: ["roles", "tecnologia", "procesos"]
    }
  ]
};

// ======================
// ÁREA 2 — ALMACÉN Y LOGÍSTICA
// ======================

const area2: Area = {
  id: "area2",
  codigo: "ALM",
  nombre: "Almacén y logística",
  descripcion: "Gestión de existencias, movimientos entre almacenes, preparación de pedidos y coordinación logística con producción y clientes.",
  prioridad: "alto",
  resumen: {
    numProblemas: 5,
    inversionMin: 13500,
    inversionMax: 33000,
    ahorroMin: 55000,
    ahorroMax: 180000
  },
  problemas: [
    {
      id: "ALM-1",
      areaId: "area2",
      titulo: "Descuadre crónico entre stock físico y stock digital",
      descripcion: "Las existencias registradas en el sistema no coinciden de forma fiable con lo que realmente hay en los almacenes, lo que impide confiar en el dato para planificar.",
      impacto: "alto",
      urgencia: "corto",
      causas: [
        "Entradas y salidas sin registrar o registradas con retraso",
        "Procesos manuales y heterogéneos entre sedes",
        "Falta de ciclos de inventario y de responsables claros por zona"
      ],
      evidencias: [
        "Imposibilidad de conocer el stock real disponible por referencia",
        "Necesidad de comprobaciones físicas constantes para servir pedidos",
        "Desajustes importantes detectados tras inventarios anuales"
      ],
      solucionPropuesta: "Diseñar e implantar un modelo de gestión de stock con ubicaciones, responsables por zona e inventarios cíclicos apoyados en el ERP.",
      pasosImplementacion: [
        "Definir estructura de almacén (zonas, ubicaciones, referencias por zona)",
        "Asignar responsables de stock por área/ubicación",
        "Implantar inventarios cíclicos planificados por familias y zonas",
        "Ajustar procedimientos de entrada y salida para que sean obligatorios",
        "Medir y seguir mensualmente el nivel de ajuste stock físico/digital"
      ],
      coste: {
        minimo: 4000,
        maximo: 10000,
        moneda: "EUR"
      },
      roi: {
        minimo: 180,
        maximo: 450,
        justificacion: "Reducción del stock de seguridad innecesario (~10-15% del valor de inventario). Eliminación de roturas de stock y urgencias (~€500-1.500/mes). Ahorro en tiempo de comprobaciones físicas (~10h/semana)."
      },
      dependencias: ["ORG-1"],
      tags: ["stock", "inventario", "logística"]
    },
    {
      id: "ALM-2",
      areaId: "area2",
      titulo: "Pedidos internos entre sedes sin circuito estándar",
      descripcion: "Los almacenes envían peticiones de material a la sede central mediante proformas, correos o documentos no integrados, perdiendo trazabilidad desde el origen.",
      impacto: "alto",
      urgencia: "medio",
      causas: [
        "Inexistencia de un flujo estándar de \"pedido interno\" en el sistema",
        "Histórico de usar formatos ofimáticos ad hoc",
        "Falta de formación y acompañamiento en el uso del ERP para estas funciones"
      ],
      evidencias: [
        "Pedidos de almacenes introducidos como si fueran de Candelaria",
        "Pérdida de trazabilidad desde el almacén de origen hasta la producción",
        "Necesidad de llamadas y correos para confirmar estados de peticiones"
      ],
      solucionPropuesta: "Implantar un circuito formal de pedidos internos entre sedes dentro del ERP, con estados y responsabilidades claros.",
      pasosImplementacion: [
        "Definir el flujo estándar de pedido interno (origen, revisión, preparación, envío, recepción)",
        "Parametrizar el ERP para soportar el circuito de pedidos internos",
        "Formar a los responsables de cada almacén en el nuevo flujo",
        "Cerrar progresivamente los canales paralelos (proformas, hojas sueltas)",
        "Revisar incidencias y ajustar el flujo tras los primeros meses"
      ],
      coste: {
        minimo: 2500,
        maximo: 6000,
        moneda: "EUR"
      },
      roi: {
        minimo: 120,
        maximo: 320,
        justificacion: "Ahorro de ~8-12h/semana en gestión manual de pedidos entre sedes. Reducción de errores en pedidos internos (~€300-600/mes). Mejor trazabilidad reduce pérdidas y reclamaciones internas."
      },
      dependencias: ["ALM-1"],
      tags: ["pedidos internos", "multi-almacén", "trazabilidad"]
    },
    {
      id: "ALM-3",
      areaId: "area2",
      titulo: "Falta de ubicaciones definidas y etiquetado sistemático",
      descripcion: "El material no está siempre asociado a una ubicación estructurada (pasillo/estantería/nivel), lo que dificulta localizar referencias de forma rápida y homogénea.",
      impacto: "medio",
      urgencia: "medio",
      causas: [
        "Almacenes creados y ampliados sin un plan de ubicaciones",
        "Ausencia de etiquetas normalizadas y criterios únicos de colocación",
        "Falta de integración entre ubicación física y registro digital"
      ],
      evidencias: [
        "Dependencia del conocimiento de personas concretas para encontrar material",
        "Tiempos largos de preparación de pedidos en determinados almacenes",
        "Dificultad para implantar inventarios cíclicos por zonas"
      ],
      solucionPropuesta: "Diseñar un esquema de ubicaciones y etiquetado compatible con el ERP, empezando por las zonas de mayor rotación.",
      pasosImplementacion: [
        "Analizar distribución actual y definir arquitectura de ubicaciones",
        "Diseñar sistema de codificación (ej. pasillo-estantería-nivel)",
        "Etiquetar físicamente ubicaciones y, cuando proceda, mercancías",
        "Vincular ubicaciones al maestro de artículos en el ERP",
        "Formar al personal de almacén e incluir ubicaciones en los documentos de trabajo"
      ],
      coste: {
        minimo: 3000,
        maximo: 7000,
        moneda: "EUR"
      },
      roi: {
        minimo: 100,
        maximo: 280,
        justificacion: "Reducción del tiempo de preparación de pedidos (~20-30%). Cualquier operario puede localizar material sin depender de expertos. Menos errores de picking (~€200-500/mes en devoluciones/correcciones)."
      },
      dependencias: ["ALM-1"],
      tags: ["ubicaciones", "etiquetado", "almacén"]
    },
    {
      id: "ALM-4",
      areaId: "area2",
      titulo: "Uso intensivo de llamadas y WhatsApp para coordinar envíos",
      descripcion: "La coordinación diaria entre almacenes, producción y administración depende de llamadas, mensajes instantáneos y comunicaciones informales sin registro estructurado.",
      impacto: "medio",
      urgencia: "corto",
      causas: [
        "Carencia de herramientas sencillas para registrar y consultar estados",
        "Falta de confianza en el dato del sistema y en sus estados",
        "Necesidad de resolver urgencias en el día a día sin soporte digital"
      ],
      evidencias: [
        "Cientos de llamadas mensuales para consultar estados de pedidos y stock",
        "Repetición de la misma información a distintas personas",
        "Imposibilidad de auditar a posteriori qué se acordó y cuándo"
      ],
      solucionPropuesta: "Reducir las dependencias de comunicación informal implantando estados visibles en el ERP y un panel mínimo de seguimiento operativo.",
      pasosImplementacion: [
        "Definir un catálogo simple de estados de pedido y de movimientos de almacén",
        "Parametrizar el ERP para reflejar estos estados y hacerlos visibles",
        "Crear vistas/paneles donde los responsables puedan ver la carga y los estados sin llamar",
        "Establecer la regla de que primero se consulta el sistema y solo luego se llama si hay dudas",
        "Medir la reducción de llamadas tras la implantación"
      ],
      coste: {
        minimo: 2000,
        maximo: 5000,
        moneda: "EUR"
      },
      roi: {
        minimo: 150,
        maximo: 380,
        justificacion: "Reducción drástica de llamadas internas (~60-80%, estimado 200+ llamadas/mes). Ahorro de ~15-20h/semana en interrupciones. Personal puede consultar estados sin depender de otros, mejorando productividad general."
      },
      dependencias: ["ALM-1", "ALM-2"],
      tags: ["comunicación", "operaciones", "paneles"]
    },
    {
      id: "ALM-5",
      areaId: "area2",
      titulo: "Ausencia de indicadores logísticos (nivel de servicio, plazos, incidencias)",
      descripcion: "No se miden de forma sistemática los plazos de preparación, frecuencia de errores, retrasos o incidencias en almacén y logística.",
      impacto: "medio",
      urgencia: "medio",
      causas: [
        "No se han definido indicadores logísticos concretos",
        "Los datos necesarios no siempre se registran en el sistema",
        "La prioridad diaria es \"sacar el trabajo\" sin medir cómo"
      ],
      evidencias: [
        "Dificultad para saber cuántos pedidos salen en plazo",
        "Imposibilidad de cuantificar errores de preparación o envíos incompletos",
        "Sensación generalizada de saturación sin métricas objetivas"
      ],
      solucionPropuesta: "Definir y poner en marcha un pequeño cuadro de mando logístico a partir de la información disponible en el ERP y/o herramientas complementarias.",
      pasosImplementacion: [
        "Seleccionar 3–5 indicadores clave (plazo medio, pedidos en plazo, errores de preparación, etc.)",
        "Verificar qué datos existen en el ERP y qué hay que empezar a registrar",
        "Configurar informes o paneles automáticos mensuales",
        "Revisar los indicadores con responsables de almacén y producción",
        "Utilizar los datos para priorizar mejoras de proceso"
      ],
      coste: {
        minimo: 2000,
        maximo: 5000,
        moneda: "EUR"
      },
      roi: {
        minimo: 90,
        maximo: 220,
        justificacion: "Visibilidad sobre problemas permite actuar antes de perder clientes. Mejora del nivel de servicio retiene clientes (~€5.000-15.000/cliente/año). Datos objetivos para negociar con proveedores de transporte."
      },
      dependencias: ["ALM-1", "ALM-2"],
      tags: ["kpi", "logística", "servicio"]
    }
  ]
};

// ======================
// ÁREA 3 — ADMINISTRACIÓN, FACTURACIÓN Y CONTABILIDAD
// ======================

const area3: Area = {
  id: "area3",
  codigo: "ADM",
  nombre: "Administración, facturación y contabilidad",
  descripcion: "Procesos administrativos, facturación, contabilidad, conciliaciones y reporting financiero.",
  prioridad: "alto",
  resumen: {
    numProblemas: 5,
    inversionMin: 13500,
    inversionMax: 34000,
    ahorroMin: 50000,
    ahorroMax: 160000
  },
  problemas: [
    {
      id: "ADM-1",
      areaId: "area3",
      titulo: "Dispersión de herramientas contables y administrativas",
      descripcion: "Coexisten distintos programas y hojas auxiliares para facturación, contabilidad y reporting, lo que genera duplicidades, errores y falta de visión única.",
      impacto: "alto",
      urgencia: "medio",
      causas: [
        "Evolución histórica con soluciones parciales (LIBRA, TRIVALLE, hojas de cálculo)",
        "Diferente grado de confianza en cada herramienta según el usuario",
        "Ausencia de una hoja de ruta clara sobre qué sistema es el de referencia"
      ],
      evidencias: [
        "Repetición de datos en varias herramientas",
        "Tareas manuales para cuadrar información entre sistemas",
        "Dudas recurrentes sobre qué cifra es la \"buena\" en cada informe"
      ],
      solucionPropuesta: "Definir un sistema contable y de facturación de referencia y una estrategia de transición clara para reducir herramientas y duplicidades.",
      pasosImplementacion: [
        "Mapear qué procesos se hacen en cada herramienta actual",
        "Evaluar funcionalidad y costes de cada sistema frente a necesidades reales",
        "Tomar una decisión explícita sobre el sistema contable/facturación de referencia",
        "Definir un plan de transición por fases, priorizando la eliminación de duplicidades",
        "Formar al equipo en el sistema objetivo y acompañar durante la adaptación"
      ],
      coste: {
        minimo: 3500,
        maximo: 9000,
        moneda: "EUR"
      },
      roi: {
        minimo: 130,
        maximo: 350,
        justificacion: "Eliminación de duplicidades ahorra ~10-15h/semana. Un solo sistema de referencia reduce errores de cuadre (~€500-1.000/mes). Menor coste de mantenimiento de múltiples herramientas (~€2.000-4.000/año)."
      },
      dependencias: ["ORG-1"],
      tags: ["contabilidad", "facturación", "sistemas"]
    },
    {
      id: "ADM-2",
      areaId: "area3",
      titulo: "Conciliaciones bancarias y gestión de cobros demasiado manuales",
      descripcion: "La conciliación de movimientos bancarios y la gestión de cobros requiere muchas horas de trabajo manual y controles adicionales.",
      impacto: "medio",
      urgencia: "medio",
      causas: [
        "No se aprovechan funcionalidades de conciliación automática del ERP",
        "Dificultad de integración directa con bancos",
        "Procesos diseñados históricamente alrededor del papel y listados impresos"
      ],
      evidencias: [
        "Muchas horas mensuales dedicadas a conciliar bancos",
        "Revisión manual de movimientos y asignación a facturas",
        "Riesgo de errores en la aplicación de cobros y saldos abiertos"
      ],
      solucionPropuesta: "Introducir conciliación semiautomática o automática con ficheros bancarios e integrar, cuando sea viable, los bancos con el ERP.",
      pasosImplementacion: [
        "Revisar qué opciones de conciliación ofrece el sistema contable elegido",
        "Configurar la importación de movimientos bancarios (ficheros norma 43 u otros)",
        "Definir reglas de conciliación automática por patrón de conceptos e importes",
        "Formar al equipo para validar y revisar las conciliaciones sugeridas por el sistema",
        "Medir la reducción de tiempo dedicado a esta tarea"
      ],
      coste: {
        minimo: 2000,
        maximo: 5000,
        moneda: "EUR"
      },
      roi: {
        minimo: 150,
        maximo: 400,
        justificacion: "La conciliación automática reduce el tiempo de ~20h/mes a ~3-4h/mes. Menos errores de aplicación de cobros (~€300-600/mes en incidencias). Personal administrativo liberado para tareas de mayor valor."
      },
      dependencias: ["ADM-1"],
      tags: ["conciliación", "banca", "automatización"]
    },
    {
      id: "ADM-3",
      areaId: "area3",
      titulo: "Carga administrativa elevada por falta de automatización documental",
      descripcion: "Gran parte del tiempo administrativo se consume en introducir datos de facturas, buscar documentos y completar tareas mecánicas.",
      impacto: "medio",
      urgencia: "medio",
      causas: [
        "Digitalización de facturas y documentos poco sistemática",
        "No se utiliza OCR de forma integrada",
        "Ausencia de flujos automáticos de aprobación o clasificación"
      ],
      evidencias: [
        "Tiempo significativo dedicado a registrar facturas de proveedores",
        "Búsquedas manuales frecuentes de documentos para aclarar incidencias",
        "Sensación de \"papel digital\" en lugar de procesos digitalizados"
      ],
      solucionPropuesta: "Introducir un flujo de captura y clasificación automática de documentos (OCR) integrado con el sistema contable y de gestión.",
      pasosImplementacion: [
        "Seleccionar una solución OCR adecuada al volumen de facturas",
        "Definir el flujo de trabajo: recepción, escaneo, validación, contabilización",
        "Integrar el OCR con el sistema contable/ERP",
        "Formar al personal administrativo en el nuevo flujo",
        "Medir tiempos antes y después para validar el ahorro real"
      ],
      coste: {
        minimo: 3000,
        maximo: 8000,
        moneda: "EUR"
      },
      roi: {
        minimo: 120,
        maximo: 300,
        justificacion: "OCR reduce tiempo de entrada de facturas de proveedores ~70-80% (~15-25h/mes). Menor tasa de errores de transcripción. Búsqueda de documentos instantánea vs. archivos físicos (~5h/mes ahorradas)."
      },
      dependencias: ["ADM-1"],
      tags: ["ocr", "documentos", "automatización"]
    },
    {
      id: "ADM-4",
      areaId: "area3",
      titulo: "Reporting financiero poco orientado a la operación",
      descripcion: "La información financiera se centra en cierres y obligaciones legales, pero no se orienta de manera sistemática a la toma de decisiones operativas y comerciales.",
      impacto: "medio",
      urgencia: "largo",
      causas: [
        "Prioridad en cumplimiento fiscal frente a visión de gestión",
        "Falta de conexión entre contabilidad analítica y la operativa diaria",
        "Limitaciones de los informes estándar del sistema actual"
      ],
      evidencias: [
        "Dificultad para obtener información por línea de negocio, sede o familia",
        "Escaso uso de la contabilidad analítica para decisiones de precios o clientes",
        "Necesidad de exportar datos a Excel para hacer análisis ad hoc"
      ],
      solucionPropuesta: "Rediseñar el reporting financiero desde una lógica de gestión, conectándolo con operaciones, ventas y producción.",
      pasosImplementacion: [
        "Definir, con Dirección, qué preguntas de negocio debe responder la información financiera",
        "Ajustar el plan contable y la analítica a esa estructura",
        "Configurar informes estándar o cuadros de mando financieros",
        "Formar a mandos intermedios en la interpretación de estos informes",
        "Revisar cada trimestre si la información responde a las necesidades reales"
      ],
      coste: {
        minimo: 2500,
        maximo: 6000,
        moneda: "EUR"
      },
      roi: {
        minimo: 80,
        maximo: 220,
        justificacion: "Información financiera orientada a gestión permite identificar líneas/clientes no rentables (~1-2% de mejora de margen). Reducción de tiempo en preparar informes ad hoc (~8-10h/mes)."
      },
      dependencias: ["ORG-3", "ADM-1"],
      tags: ["reporting", "finanzas", "gestión"]
    },
    {
      id: "ADM-5",
      areaId: "area3",
      titulo: "Uso limitado de la información administrativa para detectar fugas de margen",
      descripcion: "Aunque se dispone de mucha información de compras y ventas, no se explota sistemáticamente para detectar clientes, productos o líneas con baja rentabilidad.",
      impacto: "medio",
      urgencia: "medio",
      causas: [
        "Datos dispersos en varios sistemas",
        "Falta de visión integrada coste–precio–desperdicio",
        "Escasez de herramientas de análisis orientadas a negocio"
      ],
      evidencias: [
        "Desconocimiento del margen real por producto o cliente",
        "Dificultad para priorizar subidas de precio o renegociaciones",
        "Poca visibilidad sobre el impacto económico del desperdicio"
      ],
      solucionPropuesta: "Construir una visión simplificada de margen por línea y cliente, usando la información disponible y completándola allí donde sea necesario.",
      pasosImplementacion: [
        "Identificar qué datos de coste y precio están disponibles por referencia",
        "Definir un modelo simple de cálculo de margen por producto/cliente",
        "Montar un primer informe o dashboard de margen",
        "Validar los resultados con administración y dirección",
        "Usar estos datos como base para decisiones comerciales y de precios"
      ],
      coste: {
        minimo: 2500,
        maximo: 6000,
        moneda: "EUR"
      },
      roi: {
        minimo: 200,
        maximo: 500,
        justificacion: "Detectar fugas de margen del 2-5% en líneas o clientes concretos representa €40.000-100.000/año en una empresa de este tamaño. Permite renegociar precios o eliminar productos/clientes no rentables."
      },
      dependencias: ["ADM-1", "ADM-4"],
      tags: ["margen", "análisis", "rentabilidad"]
    }
  ]
};

// ======================
// ÁREA 4 — VENTAS, CLIENTE Y ÁREA COMERCIAL
// ======================

const area4: Area = {
  id: "area4",
  codigo: "VEN",
  nombre: "Ventas, cliente y área comercial",
  descripcion: "Relación con clientes, gestión de oportunidades, pedidos comerciales y calidad de servicio percibida.",
  prioridad: "medio",
  resumen: {
    numProblemas: 5,
    inversionMin: 10000,
    inversionMax: 26000,
    ahorroMin: 45000,
    ahorroMax: 140000
  },
  problemas: [
    {
      id: "VEN-1",
      areaId: "area4",
      titulo: "Ausencia de CRM para gestión de clientes y oportunidades",
      descripcion: "La relación con clientes se gestiona principalmente a través de correo, teléfono y conocimiento individual, sin una herramienta centralizada de seguimiento.",
      impacto: "alto",
      urgencia: "medio",
      causas: [
        "Enfoque tradicional basado en relaciones personales",
        "No se ha priorizado la implantación de un CRM",
        "Miedo a añadir carga administrativa al equipo comercial"
      ],
      evidencias: [
        "No hay listado único y actualizado de oportunidades abiertas",
        "Dificultad para saber qué clientes están en riesgo de fuga",
        "Pérdida de histórico cuando cambia una persona del equipo"
      ],
      solucionPropuesta: "Implantar un CRM ligero integrado con el flujo de pedidos y comunicaciones básicas.",
      pasosImplementacion: [
        "Seleccionar una herramienta CRM adaptada al tamaño y necesidades reales",
        "Definir campos mínimos y etapas del embudo comercial",
        "Cargar la base activa de clientes y principales contactos",
        "Formar al equipo comercial y administración en su uso diario",
        "Conectar el CRM, cuando sea posible, con el sistema de pedidos"
      ],
      coste: {
        minimo: 3000,
        maximo: 8000,
        moneda: "EUR"
      },
      roi: {
        minimo: 150,
        maximo: 400,
        justificacion: "Un CRM evita perder oportunidades (~5-10% más conversión). Retener 2-3 clientes/año que se habrían perdido representa €15.000-50.000. Ahorro de tiempo comercial en buscar información (~5h/semana)."
      },
      dependencias: ["ORG-3"],
      tags: ["crm", "clientes", "ventas"]
    },
    {
      id: "VEN-2",
      areaId: "area4",
      titulo: "Gestión reactiva de incidencias comerciales y de servicio",
      descripcion: "Las incidencias de clientes (retrasos, errores de preparación, problemas de calidad) se gestionan caso a caso sin un registro sistemático ni análisis posterior.",
      impacto: "medio",
      urgencia: "medio",
      causas: [
        "No existe un registro estructurado de incidencias comerciales",
        "Falta de responsables claros de seguimiento por tipo de incidencia",
        "Ausencia de indicadores de calidad de servicio por cliente o línea"
      ],
      evidencias: [
        "Repetición de problemas con algunos clientes sin visibilidad agregada",
        "Imposibilidad de saber cuántas incidencias se producen al mes",
        "Gestión de quejas muy dependiente de la buena voluntad de las personas"
      ],
      solucionPropuesta: "Crear un circuito simple de registro y seguimiento de incidencias comerciales, enlazado a clientes y pedidos.",
      pasosImplementacion: [
        "Definir tipos de incidencias y niveles de gravedad",
        "Diseñar un formulario mínimo de registro (en CRM o herramienta compartida)",
        "Asignar responsables de resolución y plazos máximos",
        "Revisar mensualmente incidencias abiertas/cerradas y causas raíz",
        "Priorizar mejoras de proceso donde más se repiten incidencias"
      ],
      coste: {
        minimo: 1500,
        maximo: 4000,
        moneda: "EUR"
      },
      roi: {
        minimo: 100,
        maximo: 280,
        justificacion: "Gestión estructurada de incidencias reduce tiempo de resolución (~40%). Identificar causas raíz evita repetición (~€400-800/mes en costes de re-envíos, descuentos, etc.). Mejora satisfacción cliente."
      },
      dependencias: ["VEN-1"],
      tags: ["incidencias", "servicio", "clientes"]
    },
    {
      id: "VEN-3",
      areaId: "area4",
      titulo: "Escasa visibilidad sobre pérdida de clientes y motivos",
      descripcion: "No se dispone de datos estructurados que indiquen qué clientes han reducido o dejado de comprar, ni por qué.",
      impacto: "alto",
      urgencia: "medio",
      causas: [
        "No se analizan patrones de compra por cliente de forma periódica",
        "No hay procesos de \"post mortem\" cuando se pierde un cliente",
        "Limitaciones de los sistemas actuales para segmentar ventas por cliente"
      ],
      evidencias: [
        "Percepción de pérdida o estancamiento de ventas sin detalle por cliente",
        "Ausencia de indicadores de retención o abandono",
        "Dificultad para separar \"menos demanda\" de \"cliente fugado\""
      ],
      solucionPropuesta: "Analizar ventas históricas por cliente y crear un panel de actividad que marque clientes en riesgo de fuga.",
      pasosImplementacion: [
        "Exportar y consolidar datos de ventas por cliente de los últimos 12–24 meses",
        "Definir qué se considera cliente \"activo\", \"en riesgo\" y \"perdido\"",
        "Configurar un informe periódico que identifique cambios significativos",
        "Implantar un protocolo de contacto cuando un cliente entre en riesgo",
        "Medir recuperación o pérdida definitiva tras estas acciones"
      ],
      coste: {
        minimo: 2000,
        maximo: 5000,
        moneda: "EUR"
      },
      roi: {
        minimo: 200,
        maximo: 600,
        justificacion: "Captar un cliente nuevo cuesta 5-7x más que retener uno existente. Detectar y recuperar 3-5 clientes en riesgo/año representa €30.000-80.000 en facturación salvada. El coste de análisis es mínimo."
      },
      dependencias: ["ADM-5", "VEN-1"],
      tags: ["fuga de clientes", "análisis", "ventas"]
    },
    {
      id: "VEN-4",
      areaId: "area4",
      titulo: "Canales de comunicación con clientes poco estructurados",
      descripcion: "Las peticiones de clientes llegan por múltiples canales (teléfono, correo, WhatsApp) sin una entrada única ni prioridad clara.",
      impacto: "medio",
      urgencia: "corto",
      causas: [
        "No existe una bandeja de entrada común para solicitudes comerciales",
        "Cada persona gestiona sus propios correos y mensajes",
        "No se ha definido un SLA de respuesta"
      ],
      evidencias: [
        "Llamadas perdidas o correos no respondidos a tiempo",
        "Sensación en el equipo de \"ir siempre apagando fuegos\"",
        "Clientes que vuelven a llamar porque no obtienen respuesta"
      ],
      solucionPropuesta: "Centralizar la entrada de solicitudes comerciales en una herramienta o buzón compartido, con criterios de reparto y prioridad.",
      pasosImplementacion: [
        "Crear una dirección de correo o canal común para peticiones de clientes",
        "Definir reglas de asignación y tiempos de respuesta estándar",
        "Configurar alertas o paneles de solicitudes pendientes",
        "Formar al equipo en el uso del nuevo canal y apagar canales alternativos de forma gradual",
        "Revisar mensualmente tiempos de respuesta y volumen de solicitudes"
      ],
      coste: {
        minimo: 1000,
        maximo: 3000,
        moneda: "EUR"
      },
      roi: {
        minimo: 80,
        maximo: 200,
        justificacion: "Centralizar comunicaciones reduce tiempo de respuesta (~50%), mejorando satisfacción. Evita pérdida de pedidos por mensajes no atendidos (~€500-1.500/mes). Libera tiempo comercial para vender, no para buscar información."
      },
      dependencias: [],
      tags: ["comunicación", "clientes", "operación comercial"]
    },
    {
      id: "VEN-5",
      areaId: "area4",
      titulo: "Poca conexión entre información comercial y capacidad productiva",
      descripcion: "Las decisiones comerciales (plazos, compromisos, ofertas) no siempre se basan en información actualizada de carga de producción y disponibilidad real.",
      impacto: "medio",
      urgencia: "medio",
      causas: [
        "Falta de visibilidad compartida sobre carga de planta y colas",
        "No existen alertas cuando se comprometen plazos difíciles de cumplir",
        "Desconexión entre los sistemas de pedidos y la planificación"
      ],
      evidencias: [
        "Promesa de plazos que luego son difíciles de cumplir",
        "Tensiones entre comercial y producción en momentos de carga alta",
        "Ajustes de última hora que penalizan organización interna"
      ],
      solucionPropuesta: "Crear un mecanismo mínimo de visibilidad de capacidad y carga que pueda ser consultado por el área comercial al comprometer plazos.",
      pasosImplementacion: [
        "Definir indicadores simples de carga (por máquina, por semana, por línea)",
        "Configurar vistas en el ERP o herramienta auxiliar para ver carga actual y comprometida",
        "Formar al equipo comercial para consultar esta información antes de prometer fechas",
        "Revisar semanalmente desviaciones entre plazos prometidos y reales",
        "Ajustar reglas de compromiso de plazo en función de los datos"
      ],
      coste: {
        minimo: 2500,
        maximo: 6000,
        moneda: "EUR"
      },
      roi: {
        minimo: 120,
        maximo: 320,
        justificacion: "Evitar compromisos de plazo imposibles reduce tensiones y horas extra (~€800-1.500/mes). Menos incumplimientos mejora satisfacción cliente y reduce penalizaciones/descuentos (~€300-600/mes)."
      },
      dependencias: ["PRO-1"],
      tags: ["planificación", "comercial", "capacidad"]
    }
  ]
};

// ======================
// ÁREA 5 — PRODUCCIÓN
// ======================

const area5: Area = {
  id: "area5",
  codigo: "PRO",
  nombre: "Producción",
  descripcion: "Planificación, ejecución y control de la fabricación, con especial foco en extrusión y acabados.",
  prioridad: "alto",
  resumen: {
    numProblemas: 5,
    inversionMin: 18000,
    inversionMax: 44000,
    ahorroMin: 80000,
    ahorroMax: 280000
  },
  problemas: [
    {
      id: "PRO-1",
      areaId: "area5",
      titulo: "Ausencia de planificación formal de producción (MRP/MPS)",
      descripcion: "La carga de producción se organiza de forma muy manual y reactiva, con poca ayuda estructurada del sistema para secuenciar trabajos y asignar recursos.",
      impacto: "alto",
      urgencia: "medio",
      causas: [
        "No se ha configurado o aprovechado un módulo de planificación en el ERP",
        "La experiencia de las personas suple la falta de herramienta",
        "Cambios constantes de prioridad sin un sistema que los gestione"
      ],
      evidencias: [
        "Dificultad para anticipar carga y cuellos de botella",
        "Reprogramaciones frecuentes y urgencias diarias",
        "Escaso control sobre el impacto de cambios de última hora"
      ],
      solucionPropuesta: "Implantar una planificación básica de producción apoyada en el ERP o en una herramienta especializada integrada.",
      pasosImplementacion: [
        "Definir reglas básicas de secuenciación (por tipo de perfil, aleación, plazo, etc.)",
        "Configurar el módulo de planificación existente o seleccionar uno nuevo",
        "Formar a la figura de Regulador en el uso de la herramienta",
        "Establecer una rutina diaria de planificación y revisión",
        "Analizar indicadores de cumplimiento de plan y ajustar reglas"
      ],
      coste: {
        minimo: 5000,
        maximo: 12000,
        moneda: "EUR"
      },
      roi: {
        minimo: 180,
        maximo: 500,
        justificacion: "Planificación formal reduce tiempos muertos de máquina (~10-15%), horas extra por urgencias (~€1.500-3.000/mes) y mejora OEE general. En producción de extrusión, 1% de mejora de eficiencia puede representar €20.000-40.000/año."
      },
      dependencias: ["ALM-1"],
      tags: ["planificación", "producción", "mrp"]
    },
    {
      id: "PRO-2",
      areaId: "area5",
      titulo: "Datos de producción sin objetivo ni explotación real",
      descripcion: "Se introducen datos en fases intermedias sin un plan claro sobre cómo se van a utilizar para medir rendimiento, desperdicio o trazabilidad.",
      impacto: "alto",
      urgencia: "corto",
      causas: [
        "Implantación de fases en el ERP sin diseño de indicadores previos",
        "Ausencia de cuadro de mando de producción",
        "Falta de acompañamiento para transformar datos en decisiones"
      ],
      evidencias: [
        "Horas dedicadas a introducir datos que no retornan información útil",
        "No hay indicadores consolidados de eficiencia por máquina o línea",
        "Gestores que desconocen el destino y utilidad de los datos que piden"
      ],
      solucionPropuesta: "Redefinir las capturas de datos de planta partiendo de los indicadores que se quieren obtener, no al revés.",
      pasosImplementacion: [
        "Definir junto a planta qué indicadores son prioritarios (rendimiento, desperdicio, OEE simplificado, etc.)",
        "Analizar qué datos son imprescindibles para esos indicadores",
        "Rediseñar las pantallas o registros de captura de datos",
        "Eliminar capturas que no aportan valor y generan carga",
        "Construir informes claros que devuelvan información útil de esos datos"
      ],
      coste: {
        minimo: 3000,
        maximo: 8000,
        moneda: "EUR"
      },
      roi: {
        minimo: 150,
        maximo: 400,
        justificacion: "Datos útiles permiten identificar cuellos de botella y pérdidas ocultas. Eliminar capturas innecesarias ahorra ~5-8h/semana. Indicadores claros motivan mejoras que pueden representar 2-3% de productividad (~€15.000-30.000/año)."
      },
      dependencias: ["ORG-3"],
      tags: ["datos de planta", "indicadores", "eficiencia"]
    },
    {
      id: "PRO-3",
      areaId: "area5",
      titulo: "Falta de control estructurado del desperdicio en extrusión",
      descripcion: "Aunque teóricamente se puede calcular el desperdicio como diferencia entre kg de entrada y salida por matriz, esto no se hace de manera consistente ni se integra en la gestión diaria.",
      impacto: "alto",
      urgencia: "medio",
      causas: [
        "No existe una tabla consolidada y operativa de desperdicio por matriz",
        "El ERP no se explota para integrar estos datos en los informes de gestión",
        "Estos datos no se vinculan a decisiones de mejora o mantenimiento"
      ],
      evidencias: [
        "Imposibilidad actual de conocer el desperdicio real por producto o matriz",
        "Falta de objetivos de mejora ligados a indicadores de desperdicio",
        "Percepción de que se pierde dinero sin cuantificación exacta"
      ],
      solucionPropuesta: "Construir un sistema sencillo y fiable de registro y análisis de desperdicio por matriz y periodo.",
      pasosImplementacion: [
        "Definir claramente el modelo de datos de desperdicio (entradas, salidas, matriz, fecha, máquina)",
        "Determinar si se captura en el ERP actual o en una tabla externa integrada",
        "Establecer la rutina de registro por turno o por orden de fabricación",
        "Configurar informes que muestren desperdicio por matriz, máquina y periodo",
        "Ligar estos datos a decisiones de mantenimiento, ajustes de proceso o formación"
      ],
      coste: {
        minimo: 3000,
        maximo: 7000,
        moneda: "EUR"
      },
      roi: {
        minimo: 250,
        maximo: 800,
        justificacion: "El desperdicio en extrusión puede representar 3-8% del aluminio procesado. Controlarlo y reducirlo un 1-2% en una planta que procesa 500-1.000 toneladas/año representa €25.000-80.000/año de ahorro directo en materia prima."
      },
      dependencias: ["PRO-2"],
      tags: ["desperdicio", "extrusión", "costes"]
    },
    {
      id: "PRO-4",
      areaId: "area5",
      titulo: "Trazabilidad incompleta de pedidos a lo largo del flujo productivo",
      descripcion: "No se puede seguir fácilmente el estado de un pedido desde la recepción hasta la expedición utilizando únicamente el sistema.",
      impacto: "alto",
      urgencia: "medio",
      causas: [
        "Fases de producción configuradas sin conexión práctica con el flujo de pedidos",
        "Falta de disciplina a la hora de actualizar estados",
        "Uso de comunicaciones paralelas (boca-oreja, listas de papel, llamadas)"
      ],
      evidencias: [
        "Necesidad de preguntar físicamente en planta por el estado de un pedido",
        "Descoordinación entre lo que producción considera terminado y lo que administración sabe",
        "Clientes que preguntan por pedidos y no obtienen respuesta inmediata fiable"
      ],
      solucionPropuesta: "Diseñar un flujo mínimo de estados de pedido enlazado a hitos reales de producción y registro en el sistema.",
      pasosImplementacion: [
        "Definir estados clave del pedido (ej. en cola, en fabricación, en anodizado, listo para expedición, enviado)",
        "Mapear estos estados con las etapas reales de producción",
        "Configurar el ERP para reflejar estos estados y quién los actualiza",
        "Formar al personal en el uso de estos estados como parte del trabajo",
        "Crear vistas para que administración y comercial puedan consultar el estado sin llamar"
      ],
      coste: {
        minimo: 4000,
        maximo: 10000,
        moneda: "EUR"
      },
      roi: {
        minimo: 120,
        maximo: 350,
        justificacion: "Trazabilidad completa reduce tiempo de consultas (~10-15h/semana). Clientes pueden ser informados sin llamadas internas. Menos errores de expedición (~€400-800/mes). Mejor imagen ante clientes exigentes."
      },
      dependencias: ["ALM-2", "ALM-4", "PRO-1"],
      tags: ["trazabilidad", "pedidos", "producción"]
    },
    {
      id: "PRO-5",
      areaId: "area5",
      titulo: "Dependencia excesiva de la figura del Regulador para priorizar y coordinar",
      descripcion: "La persona que regula la producción asume una carga muy alta de llamadas, decisiones y coordinación manual, con poco apoyo estructurado del sistema.",
      impacto: "medio",
      urgencia: "corto",
      causas: [
        "Falta de paneles visuales de carga y estados",
        "Ausencia de criterios objetivos compartidos para priorizar",
        "Insuficiente distribución de responsabilidad en el equipo"
      ],
      evidencias: [
        "Elevado número de llamadas diarias hacia el regulador",
        "Baja posibilidad de delegar si esa persona no está",
        "Dificultad para explicar por qué se priorizaron unos trabajos frente a otros"
      ],
      solucionPropuesta: "Dotar al Regulador de herramientas visuales de planificación y estados, y definir reglas de prioridad compartidas.",
      pasosImplementacion: [
        "Identificar la información mínima que el Regulador necesita ver en tiempo real",
        "Configurar un panel de trabajo (en ERP o herramienta auxiliar) con esa información",
        "Definir reglas de prioridad y documentarlas para todo el equipo",
        "Formar a otros perfiles para que puedan asumir parte de la regulación si es necesario",
        "Medir reducción de llamadas e incidencias en el área tras los cambios"
      ],
      coste: {
        minimo: 3000,
        maximo: 7000,
        moneda: "EUR"
      },
      roi: {
        minimo: 130,
        maximo: 350,
        justificacion: "Reducir dependencia del regulador disminuye riesgo operativo (€15.000-25.000 si hay baja prolongada). Herramientas visuales reducen llamadas (~50-70%) y permiten delegar decisiones. Reglas claras reducen conflictos."
      },
      dependencias: ["PRO-1", "ALM-4"],
      tags: ["regulación", "carga de trabajo", "paneles"]
    }
  ]
};

// ======================
// ÁREA 6 — DIRECCIÓN Y ESTRATEGIA
// ======================

const area6: Area = {
  id: "area6",
  codigo: "DIR",
  nombre: "Dirección y estrategia",
  descripcion: "Enfoque estratégico, priorización de inversiones, gobierno de proyectos y cultura de mejora continua.",
  prioridad: "alto",
  resumen: {
    numProblemas: 5,
    inversionMin: 11000,
    inversionMax: 28000,
    ahorroMin: 40000,
    ahorroMax: 130000
  },
  problemas: [
    {
      id: "DIR-1",
      areaId: "area6",
      titulo: "Inversiones tecnológicas sin cálculo formal de retorno (ROI)",
      descripcion: "Las decisiones de inversión en software y servicios tecnológicos se han tomado históricamente sin un análisis estructurado de retorno de inversión.",
      impacto: "alto",
      urgencia: "medio",
      causas: [
        "Falta de metodología de evaluación económica específica para tecnología",
        "Presión de urgencias operativas y normativas",
        "Historial de proyectos donde el beneficio esperado no se ha hecho explícito"
      ],
      evidencias: [
        "Dificultad para defender nuevas inversiones frente a la propiedad",
        "Percepción de \"mucho dinero gastado\" sin resultados claros",
        "Ausencia de comparativas antes/después por proyecto tecnológico"
      ],
      solucionPropuesta: "Implantar una metodología simple de análisis de ROI tecnológico para cualquier proyecto relevante.",
      pasosImplementacion: [
        "Definir plantilla estándar de caso de negocio para proyectos de tecnología",
        "Incluir siempre estimación de ahorro de horas, reducción de errores y mejora de servicio",
        "Hacer seguimiento anual del ROI real de los proyectos aprobados",
        "Usar estos datos para priorizar futuras inversiones",
        "Compartir con la propiedad resultados de forma clara y transparente"
      ],
      coste: {
        minimo: 2000,
        maximo: 5000,
        moneda: "EUR"
      },
      roi: {
        minimo: 150,
        maximo: 400,
        justificacion: "Metodología de ROI evita inversiones fallidas (~€10.000-30.000/año en proyectos que no aportan). Permite priorizar inversiones con mayor retorno. Facilita comunicación con propiedad y justificación de gastos."
      },
      dependencias: ["ORG-3"],
      tags: ["roi", "inversión", "estrategia"]
    },
    {
      id: "DIR-2",
      areaId: "area6",
      titulo: "Falta de hoja de ruta tecnológica alineada con la estrategia de negocio",
      descripcion: "No existe un plan a 2–3 años que marque qué sistemas se van a mantener, sustituir o reforzar y en qué orden.",
      impacto: "alto",
      urgencia: "medio",
      causas: [
        "Enfoque reactivo frente a problemas inmediatos",
        "Incógnitas sobre la situación actual real de los sistemas",
        "Escasez de tiempo para pensar en clave de medio plazo"
      ],
      evidencias: [
        "Dudas recurrentes sobre seguir o no con determinados proveedores",
        "Multiplicidad de propuestas y ofertas sin un marco de decisión claro",
        "Sensación de estar \"atado\" a decisiones del pasado"
      ],
      solucionPropuesta: "Construir una hoja de ruta tecnológica realista que priorice pocas decisiones clave y las conecte con objetivos de negocio.",
      pasosImplementacion: [
        "Tomar como base el diagnóstico actual de sistemas y procesos",
        "Identificar 3–5 decisiones críticas (ERP, CRM, BI, automatización, etc.)",
        "Ordenarlas por impacto y viabilidad económica",
        "Asignar horizontes temporales y criterios de éxito por hito",
        "Revisar la hoja de ruta cada 6 meses en función de la realidad"
      ],
      coste: {
        minimo: 3000,
        maximo: 8000,
        moneda: "EUR"
      },
      roi: {
        minimo: 120,
        maximo: 350,
        justificacion: "Una hoja de ruta clara evita cambios de rumbo costosos (~€5.000-15.000/año). Permite negociar mejor con proveedores tecnológicos. Reduce ansiedad organizacional y mejora adopción de cambios."
      },
      dependencias: ["DIR-1", "ORG-1"],
      tags: ["roadmap", "tecnología", "priorización"]
    },
    {
      id: "DIR-3",
      areaId: "area6",
      titulo: "Gobierno de proyectos de mejora poco definido",
      descripcion: "Los proyectos de mejora (tecnológicos y organizativos) no siempre tienen un patrocinador claro, un alcance definido ni una estructura de seguimiento.",
      impacto: "medio",
      urgencia: "medio",
      causas: [
        "Carencia de metodología de gestión de proyectos adaptada a la empresa",
        "Asunción informal de responsabilidades por parte de personas concretas",
        "Limitaciones de tiempo de la Dirección para seguimiento detallado"
      ],
      evidencias: [
        "Proyectos que se alargan más de lo previsto sin explicación clara",
        "Cambios de alcance sobre la marcha",
        "Iniciativas que se quedan a medias o no se consolidan"
      ],
      solucionPropuesta: "Introducir una forma ligera de gestión de proyectos con roles básicos, hitos y revisiones periódicas.",
      pasosImplementacion: [
        "Definir qué se considera proyecto y qué no",
        "Asignar siempre un patrocinador, un responsable operativo y un equipo",
        "Usar una plantilla estándar de plan de proyecto con hitos y fechas",
        "Revisar proyectos activos mensualmente en un foro específico",
        "Cerrar formalmente los proyectos, recogiendo lecciones aprendidas"
      ],
      coste: {
        minimo: 2000,
        maximo: 5000,
        moneda: "EUR"
      },
      roi: {
        minimo: 100,
        maximo: 280,
        justificacion: "Proyectos bien gestionados terminan en plazo y presupuesto (~30% menos desviaciones). Evita proyectos zombi que consumen recursos sin cerrar. Lecciones aprendidas mejoran proyectos futuros."
      },
      dependencias: ["DIR-1", "DIR-2"],
      tags: ["proyectos", "gobernanza", "mejora continua"]
    },
    {
      id: "DIR-4",
      areaId: "area6",
      titulo: "Dependencia elevada de personas concretas para el funcionamiento global",
      descripcion: "Algunos puestos acumulan decisiones y conocimiento clave, de forma que su ausencia genera riesgo operativo importante.",
      impacto: "alto",
      urgencia: "medio",
      causas: [
        "No se han definido siempre puestos sino personas",
        "Poca rotación o backup planificado de funciones críticas",
        "Conocimiento no documentado y poco compartido"
      ],
      evidencias: [
        "Preocupación cuando determinadas personas no están presentes",
        "Dificultad para delegar o escalar responsabilidades",
        "Sensación de \"insustituibilidad\" de algunos perfiles"
      ],
      solucionPropuesta: "Reducir la dependencia de personas individuales documentando procesos y definiendo suplencias y backups.",
      pasosImplementacion: [
        "Identificar roles críticos y tareas que dependen de una sola persona",
        "Documentar procesos clave asociados a esos roles",
        "Definir personas de backup y darles tiempo para formarse",
        "Introducir rotaciones puntuales en tareas clave para compartir conocimiento",
        "Incorporar este enfoque en la estrategia de personas de la empresa"
      ],
      coste: {
        minimo: 2500,
        maximo: 6000,
        moneda: "EUR"
      },
      roi: {
        minimo: 120,
        maximo: 320,
        justificacion: "Reducir dependencia de personas clave mitiga riesgo operativo (coste potencial de baja prolongada: €20.000-50.000). Backups formados permiten vacaciones sin estrés. Conocimiento distribuido acelera resolución de problemas."
      },
      dependencias: ["ORG-2"],
      tags: ["personas clave", "riesgo operativo", "conocimiento"]
    },
    {
      id: "DIR-5",
      areaId: "area6",
      titulo: "Cultura de \"siempre se ha trabajado así\" que frena cambios",
      descripcion: "Existe resistencia natural al cambio en algunos niveles, lo que dificulta aprovechar plenamente las mejoras tecnológicas y de proceso.",
      impacto: "medio",
      urgencia: "largo",
      causas: [
        "Histórico de intentos de mejora que no han llegado a buen puerto",
        "Falta de comunicación clara sobre el porqué de los cambios",
        "Temor a que la tecnología sirva solo para controlar o recortar"
      ],
      evidencias: [
        "Comentarios recurrentes del tipo \"antes funcionaba\" o \"siempre se ha hecho así\"",
        "Reticencia a registrar datos nuevos o seguir procedimientos modificados",
        "Percepción de la tecnología como imposición externa"
      ],
      solucionPropuesta: "Acompañar los cambios con comunicación honesta, participación de las personas afectadas y victorias tempranas visibles.",
      pasosImplementacion: [
        "Involucrar a personas clave en el diseño de nuevas formas de trabajar",
        "Explicar con claridad los beneficios esperados para la empresa y para cada rol",
        "Planificar pilotos acotados con equipos concretos antes de escalar",
        "Reconocer públicamente los avances y las mejoras conseguidas",
        "Recoger feedback y ajustar sin perder el rumbo general"
      ],
      coste: {
        minimo: 1500,
        maximo: 4000,
        moneda: "EUR"
      },
      roi: {
        minimo: 80,
        maximo: 200,
        justificacion: "Gestión del cambio bien hecha aumenta adopción de mejoras (~50% más éxito en proyectos). Reduce resistencias que alargan implantaciones. Mejora clima laboral y retención de talento (~€5.000-10.000/año en rotación evitada)."
      },
      dependencias: ["DIR-2", "ORG-4"],
      tags: ["cultura", "cambio", "personas"]
    }
  ]
};

// ======================
// EXPORT GLOBAL
// ======================

export const AREAS: Area[] = [area1, area2, area3, area4, area5, area6];

// Alias para compatibilidad con el código existente
export const areas = AREAS;

// ======================
// FUNCIONES HELPER
// ======================

/**
 * Obtiene todos los problemas de todas las áreas en un array plano
 */
export function getAllProblems(): Problem[] {
  return AREAS.flatMap(area => area.problemas);
}

/**
 * Obtiene un problema por su ID
 */
export function getProblemById(id: string): Problem | undefined {
  return getAllProblems().find(p => p.id === id);
}

/**
 * Obtiene un área por su ID
 */
export function getAreaById(id: string): Area | undefined {
  return AREAS.find(a => a.id === id);
}

/**
 * Obtiene el área a la que pertenece un problema
 */
export function getAreaByProblemId(problemId: string): Area | undefined {
  return AREAS.find(a => a.problemas.some(p => p.id === problemId));
}
