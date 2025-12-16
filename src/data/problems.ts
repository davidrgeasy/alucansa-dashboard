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
    numProblemas: 8,
    inversionMin: 17500,
    inversionMax: 41500,
    ahorroMin: 52000,
    ahorroMax: 170000
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
        minimo: 750,
        maximo: 5000,
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
        minimo: 213,
        maximo: 1880,
        justificacion: "Ahorro de ~3-5h/semana en reuniones improductivas y repetición de información. Reducción de malentendidos que generan errores (~€200-400/mes). Mejor alineación reduce fricciones y urgencias. Retorno anual estimado: 9.400-19.800€."
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
        minimo: 276,
        maximo: 778,
        justificacion: "Liberación del 30-40% del tiempo del perfil técnico para tareas de su competencia real (6.048€/año). Reducción 50% riesgo rotación (2.000-3.750€/año). Proyectos técnicos liberados (5.760€/año). Ahorro anual total: 13.808-15.558€."
      },
      dependencias: ["ORG-1", "ORG-2"],
      tags: ["roles", "tecnologia", "procesos"]
    },
    {
      id: "ORG-6",
      areaId: "area1",
      titulo: "Gestión de precios y actualización de listas bajo procesos manuales",
      descripcion: "La actualización de precios de herrajes y listas comerciales se realiza mensualmente mediante codificación manual de facturas en papel, consolidación en Excel externo y volcado posterior a LIBRA, generando márgenes desactualizados, errores de transcripción y riesgo de ventas a pérdida.",
      impacto: "alto",
      urgencia: "corto",
      causas: [
        "Gestión de precios dependiente de codificación manual externa desde facturas papel.",
        "Dependencia de codificación manual de precios desde papel y Excel para herrajes.",
        "Ausencia de automatización en procesos comerciales que vinculen compras con precios de venta."
      ],
      evidencias: [
        "Se codifican facturas papel para los precios de los herrajes.",
        "Se reciben los datos en Excel mensualmente.",
        "Actualización LIBRA manual con riesgo de errores de transcripción.",
        "Márgenes desactualizados por revisiones lentas."
      ],
      solucionPropuesta: "Automatizar flujo precios: integración automática facturas compra → cálculo margen → actualización precios venta en LIBRA con alertas revisión mensual y validación ATP precios.",
      pasosImplementacion: [
        "Configurar módulo compras LIBRA para importar facturas de proveedores automáticamente vía OCR/email.",
        "Crear regla negocio cálculo automático precios venta (coste + margen estándar) desde datos compra.",
        "Implementar workflow aprobación precios con notificación a responsables.",
        "Programar alertas semanales para revisión de precios críticos de herrajes de rotación alta.",
        "Migrar listas Excel actuales a LIBRA y capacitar 2 usuarios clave en nuevo flujo.",
        "Validar 1 mes paralelo manual/digital antes eliminar papel."
      ],
      coste: {
        minimo: 2000,
        maximo: 3500,
        moneda: "EUR"
      },
      roi: {
        minimo: 323,
        maximo: 420,
        justificacion: "Eliminación 8h/mes transcripción manual (€400/mes ahorro laboral) + aprox 3% mejora márgenes ventas herrajes + reducción errores facturación."
      },
      dependencias: [],
      tags: ["precios", "automatización", "LIBRA", "herrajes"]
    },
    {
      id: "ORG-7",
      areaId: "area1",
      titulo: "Falta de integración documental y gestión de compras fuera del ERP",
      descripcion: "Gestión de compras de consumibles y documentación técnica se realiza vía email personal y archivos externos sin vinculación a LIBRA, generando descontrol de costes, opacidad en proveedores y retrasos en acceso a datos técnicos críticos.",
      impacto: "medio",
      urgencia: "medio",
      causas: [
        "Falta de trazabilidad en compras de consumibles vía email personal sin orden ERP.",
        "Criterios subjetivos sin reglas de negocio estandarizadas en sistema.",
        "Falta de integración documental; planos no vinculados al ERP."
      ],
      evidencias: [
        "Pedidos de pintura gestionados por email personal.",
        "Histórico proveedores en bandeja entrada individual.",
        "Planos técnicos sin vinculación directa LIBRA.",
        "Sin órdenes compra formalizadas en ERP consumibles."
      ],
      solucionPropuesta: "Integrar módulo de compras de LIBRA con workflow de órdenes de compra digital, adjuntos automáticos y vinculación documentos técnicos a artículos ERP.",
      pasosImplementacion: [
        "Configurar módulo compras LIBRA con plantillas órdenes estándar consumibles.",
        "Activar adjuntos digitales email → LIBRA para facturas/proveedores.",
        "Vincular planos técnicos a fichas artículos en módulo producción.",
        "Implementar approvals digitales 2 niveles para compras >€500.",
        "Migrar histórico email proveedores a LIBRA (1 semana).",
        "Capacitar 3 usuarios clave + validar 2 ciclos compras."
      ],
      coste: {
        minimo: 1500,
        maximo: 3000,
        moneda: "EUR"
      },
      roi: {
        minimo: 375,
        maximo: 932,
        justificacion: "Eliminación 12h/mes gestión manual email (€500/mes) + 3% ahorro compras volumen."
      },
      dependencias: ["ALM-6", "ALM-7", "ORG-6"],
      tags: ["compras", "documentación", "ERP", "trazabilidad"]
    },
    {
      id: "ORG-8",
      areaId: "area1",
      titulo: "Control de Calidad y Gestión Reactiva de Incidencias",
      descripcion: "El control de calidad se realiza principalmente mediante inspección visual sin un registro sistemático ni oportuno en el sistema ERP LIBRA. Los rechazos, mermas y defectos no se registran ni analizan digitalmente, lo que provoca falta de visibilidad real sobre costes de no calidad y dificulta la mejora continua.",
      impacto: "alto",
      urgencia: "corto",
      causas: [
        "Control visual sin registro formal ni digitalización de los resultados de inspección.",
        "Falta de registro sistemático y oportuno de mermas y chatarra en LIBRA.",
        "Registro incompleto de piezas defectuosas, sin análisis ni causas documentadas.",
        "Dependencia de canales informales (verbal, papel) para comunicar incidencias entre turnos.",
        "Ausencia de protocolos formales y tickets para gestión de incidencias.",
        "Dependencia crítica de personal único sin backup para soporte ERP e infraestructura."
      ],
      evidencias: [
        "Inspección visual final realizada por operarios sin volcado sistemático en LIBRA.",
        "Anotaciones manuales de chatarra y defectos entregadas de forma física o por WhatsApp.",
        "Comunicación de incidencias hecha verbalmente o con registros físicos sin trazabilidad.",
        "Actualización manual de inventarios y consumos con retrasos y falta de precisión.",
        "Falta de mecanismos de reporte automatizados y seguimiento formal de incidencias con SLAs."
      ],
      solucionPropuesta: "Implementar un módulo digital integrado en LIBRA para el registro sistémico del control de calidad, mermas y defectos, con trazabilidad desde planta hasta administración. Adoptar herramientas de gestión de incidencias con tickets, protocolos claros y métricas.",
      pasosImplementacion: [
        "Desarrollar y configurar en LIBRA formularios digitales para registro en planta de inspección de calidad, mermas y rechazo de materiales.",
        "Adoptar sistema de tickets para incidencias operativas con priorización y seguimiento hasta resolución.",
        "Capacitar a operarios y responsables para uso digital riguroso desde la inspección hasta reporte.",
        "Integrar notificaciones automáticas e informes para análisis de causas de defectos y costos asociados.",
        "Crear plan de backup y formación cruzada para evitar dependencia de personal único en soporte.",
        "Realizar auditorías periódicas para validar calidad de datos y cumplimiento."
      ],
      coste: {
        minimo: 3000,
        maximo: 6000,
        moneda: "EUR"
      },
      roi: {
        minimo: 187,
        maximo: 547,
        justificacion: "Reducción de costos ocultos de no calidad, mejora en la calidad final y satisfacción cliente. Visibilidad sobre mermas permite acciones correctivas que pueden ahorrar 2-4% en costes de producción."
      },
      dependencias: ["ALM-6", "ORG-7"],
      tags: ["calidad", "mermas", "incidencias", "trazabilidad"]
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
    numProblemas: 7,
    inversionMin: 19000,
    inversionMax: 42500,
    ahorroMin: 100000,
    ahorroMax: 270000
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
        minimo: 752,
        maximo: 4680,
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
        minimo: 324,
        maximo: 1334,
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
        minimo: 159,
        maximo: 669,
        justificacion: "Reducción 20-30% tiempo picking (6.720-10.080€/año). Errores picking evitados (2.400-6.000€/año). Mejora inventarios cíclicos +15-25% eficiencia (2.000-4.000€/año). Ahorro anual total: 11.120-20.080€."
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
        minimo: 387,
        maximo: 1760,
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
        minimo: 140,
        maximo: 1500,
        justificacion: "Visibilidad sobre problemas permite actuar antes de perder clientes. Mejora del nivel de servicio retiene clientes (~€5.000-15.000/cliente/año). Datos objetivos para negociar con proveedores de transporte."
      },
      dependencias: ["ALM-1", "ALM-2"],
      tags: ["kpi", "logística", "servicio"]
    },
    {
      id: "ALM-6",
      areaId: "area2",
      titulo: "Inventario preciso y control automatizado de stock",
      descripcion: "El control del stock físico y digital presenta discrepancias constantes. No existe un inventario cíclico formalizado ni automatizado que permita validar entradas, salidas ni mermas de forma periódica y confiable. Esto genera incertidumbre en la disponibilidad real de materiales, afectando la planificación y la gestión de pedidos.",
      impacto: "alto",
      urgencia: "corto",
      causas: [
        "Ausencia de inventarios físicos periódicos estandarizados.",
        "Recuento manual y no sistemático del stock, con altos errores.",
        "Falta de conciliación automática entre stock físico y digital.",
        "Uso preferente de ajustes verbales o en papel para discrepancias.",
        "No hay registros formales ni protocolos para ajustes o mermas."
      ],
      evidencias: [
        "Bruno y equipo realizan conteos esporádicos sin método definido.",
        "Ajustes de stock frecuentes sin documentación formal ni hoy en ERP.",
        "Preferencia por verificaciones visuales o consulta a 'expertos' en lugar de datos digitales.",
        "Discrepancias no resueltas entre software LIBRA y stock real."
      ],
      solucionPropuesta: "Implementar un sistema digitalizado y automatizado de inventarios cíclicos con reconciliación entre stock físico y digital, apoyado en herramientas móviles y procedimientos estandarizados.",
      pasosImplementacion: [
        "Definir ciclos semanales y mensuales de inventario según tipo de materiales y criticidad.",
        "Dotar a operarios de dispositivos móviles para escaneo y registro en LIBRA durante inspecciones.",
        "Configurar alertas automáticas para discrepancias y mermas detectadas.",
        "Establecer protocolos y registros formales para ajustes y causas asociadas.",
        "Capacitar a personal en uso de herramientas y protocolos.",
        "Realizar auditorías periódicas para validar proceso y datos."
      ],
      coste: {
        minimo: 4000,
        maximo: 6000,
        moneda: "EUR"
      },
      roi: {
        minimo: 366,
        maximo: 1225,
        justificacion: "El ahorro en mermas, optimización de recursos y mejor planificación producen un retorno rápido, con beneficios operativos y financieros sostenibles en el tiempo. Implementar controles digitales reduce la investigación manual y evita pérdidas costosas."
      },
      dependencias: ["ALM-5", "ORG-7", "PRO-3", "ORG-8"],
      tags: ["inventario", "stock", "automatización", "control"]
    },
    {
      id: "ALM-7",
      areaId: "area2",
      titulo: "Alertas automáticas de rotura de stock",
      descripcion: "Ausencia total de alertas automáticas para roturas de stock crítico. No existen umbrales configurados en LIBRA ni notificaciones proactivas para reabastecimiento de materias primas y consumibles clave (pintura, perfiles). Esto genera paros de producción imprevistos y compras de emergencia a precios elevados.",
      impacto: "alto",
      urgencia: "corto",
      causas: [
        "Sin umbrales mínimos configurados por artículo crítico en LIBRA.",
        "Ausencia de notificaciones automáticas para responsables de compras.",
        "Dependencia de memoria personal para monitoreo de stocks bajos.",
        "Compras reactivas de emergencia sin planificación.",
        "Stock de seguridad no definido ni respetado sistemáticamente."
      ],
      evidencias: [
        "Se monitorean manualmente stocks sensibles vía Excel paralelo.",
        "Compras urgentes frecuentes por falta de visibilidad stock real.",
        "Ninguna alerta configurada en LIBRA para niveles mínimos críticos.",
        "Paros en producción por falta material sin previsión digital."
      ],
      solucionPropuesta: "Configurar en LIBRA umbrales mínimos/máximos por artículo crítico con alertas automáticas multicanal (email, dashboard, móvil) y workflow de aprobación compras.",
      pasosImplementacion: [
        "Clasificar ABC materiales críticos y definir stock mínimo/seguridad por SKU.",
        "Configurar alertas automáticas LIBRA (email + dashboard visual).",
        "Crear workflow digital aprobación compras desde alerta stock bajo.",
        "Integrar con módulo compras para órdenes automáticas pre-aprobadas.",
        "Testear con 10 artículos críticos + validar 2 ciclos completos.",
        "Dashboard ejecutivo con KPIs roturas stock + tiempo respuesta."
      ],
      coste: {
        minimo: 1500,
        maximo: 3500,
        moneda: "EUR"
      },
      roi: {
        minimo: 397,
        maximo: 1940,
        justificacion: "Compras de emergencia representan un sobrecoste del 10-20% sobre precio normal. El stock de seguridad excesivo inmoviliza capital. Las alertas automáticas eliminan el 99% de compras reactivas y optimizan el inventario en 1 ciclo."
      },
      dependencias: ["ALM-6", "ORG-7", "ALM-4", "PRO-6"],
      tags: ["alertas", "stock", "rotura", "compras"]
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
      titulo: "Entrada manual facturas de compra y conciliación bancaria",
      descripcion: "Más de 100 facturas/mes introducidas manualmente en LIBRA (8-10 min/factura). Conciliación bancaria mediante descarga manual extractos sin automatización. Genera 12-15h/semana trabajo repetitivo, errores humanos y retrasos en cierres financieros.",
      impacto: "alto",
      urgencia: "corto",
      causas: [
        "Entrada manual 100+ facturas/mes sin OCR/automatización.",
        "Conciliación bancaria manual sin matching automático.",
        "Errores transcripción afectan coste artículos y márgenes.",
        "Retrasos cierres mensuales por validación manual.",
        "Ausencia control duplicidades/aprobaciones digitales."
      ],
      evidencias: [
        "Se dedican 12h/semana solo a entrada de facturas de proveedores.",
        "Se descargan de forma manual los extractos bancarios y se lleva la conciliación en Excel.",
        "Los errores en la codificación de artículos pueden afectar al inventario.",
        "Cierres contables retrasados 3-5 días por validaciones manuales."
      ],
      solucionPropuesta: "Automatizar entrada facturas mediante OCR + integración bancaria directa LIBRA + workflow aprobaciones digitales 2 niveles.",
      pasosImplementacion: [
        "Configurar OCR facturas proveedores → LIBRA (scan/email).",
        "Integrar extractos bancarios automáticos con conciliación inteligente.",
        "Implementar workflow aprobaciones digitales (>€500 requiere firma doble).",
        "Migrar histórico 3 meses facturas para test (1 semana).",
        "Dashboard KPIs: tiempo procesado/factura, errores, días cierre.",
        "Capacitación 4h para administración + validación 1 ciclo completo."
      ],
      coste: {
        minimo: 2500,
        maximo: 5000,
        moneda: "EUR"
      },
      roi: {
        minimo: 209,
        maximo: 768,
        justificacion: "600h/año liberadas para análisis financiero vs. tareas administrativas. Errores de codificación pueden generar discrepancias inventario/coste que se corrigen automáticamente. Cierres anticipados mejoran la tesorería."
      },
      dependencias: ["ORG-7", "ALM-6", "ORG-6"],
      tags: ["facturas", "OCR", "conciliación bancaria", "automatización"]
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
        minimo: 68,
        maximo: 566,
        justificacion: "Reducción 70-80% tiempo conciliación (4.800-6.120€/año). Eliminación errores aplicación cobros y costes financieros (3.600-7.200€/año). Ahorro anual total: 8.400-13.320€."
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
        minimo: 150,
        maximo: 500,
        justificacion: "Reducción 70-80% tiempo procesamiento facturas (25h/mes liberadas = 9.000€/año). Búsqueda instantánea documentos (5h/mes = 1.800€/año). Eliminación costes archivo físico y logística entre sedes (1.200€/año). Ahorro anual total: 12.000-18.000€."
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
        minimo: 47,
        maximo: 492,
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
        minimo: 566,
        maximo: 3900,
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
        minimo: 175,
        maximo: 1800,
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
        minimo: 95,
        maximo: 740,
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
        minimo: 50,
        maximo: 900,
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
        minimo: 150,
        maximo: 950,
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
        maximo: 908,
        justificacion: "Reducción horas extra y urgencias por compromisos imposibles (9.600-18.000€/año). Eliminación penalizaciones y descuentos por incumplimientos (3.600-7.200€/año). Ahorro anual total: 13.200-25.200€."
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
    numProblemas: 6,
    inversionMin: 21500,
    inversionMax: 49000,
    ahorroMin: 89000,
    ahorroMax: 305000
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
        minimo: 216,
        maximo: 1420,
        justificacion: "Mejora eficiencia 10-15% (1% = 20.000-40.000€/año en extrusión). Reducción horas extra y urgencias (18.000-36.000€/año). Ahorro anual total: 38.000-76.000€."
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
        minimo: 185,
        maximo: 1316,
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
        minimo: 257,
        maximo: 2566,
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
        minimo: 116,
        maximo: 770,
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
        minimo: 171,
        maximo: 1200,
        justificacion: "Reducir dependencia del regulador disminuye riesgo operativo (€15.000-25.000 si hay baja prolongada). Herramientas visuales reducen llamadas (~50-70%) y permiten delegar decisiones. Reglas claras reducen conflictos."
      },
      dependencias: ["PRO-1", "ALM-4"],
      tags: ["regulación", "carga de trabajo", "paneles"]
    },
    {
      id: "PRO-6",
      areaId: "area5",
      titulo: "Desfase entre jaula virtual y realidad física",
      descripcion: "La jaula virtual de LIBRA no refleja de forma fiable el estado real de las jaulas y burras en planta. Esto provoca que el sistema muestre material disponible o en ubicación incorrecta mientras físicamente ya se ha movido, consumido o descartado, rompiendo la trazabilidad.",
      impacto: "alto",
      urgencia: "corto",
      causas: [
        "Gestión de stock 'a ojo' por desconfianza total en LIBRA; el regulador verifica visualmente en planta en lugar de fiarse del sistema.",
        "Retraso deliberado de 2-3 días en registrar consumos para 'protegerse' ante cambios del cliente, dejando el stock digital falseado.",
        "Comunicación de producción terminada por foto de parte manuscrito vía WhatsApp, sin cambio de estado fiable en el ERP.",
        "Falta de registro sistemático de mermas/chatarra, con barras defectuosas que no se dan de baja de forma consistente."
      ],
      evidencias: [
        "Regulador y responsables recorren físicamente las jaulas para validar disponibilidad, ignorando el dato de LIBRA.",
        "El sistema muestra barras y kilos como disponibles que ya han sido cortados, pintados o incluso enviados.",
        "El cierre de pedidos se comunica por canales informales (foto, llamada) sin reflejo inmediato y estructurado en el sistema.",
        "Las bajas por chatarra dependen de partes en papel y comunicación verbal, no de un flujo estándar en el ERP."
      ],
      solucionPropuesta: "Rediseñar el flujo de jaulas para que cada movimiento crítico (carga, proceso, merma, cierre) se registre en LIBRA en tiempo casi real, con estados estandarizados por fase y responsabilidades claras de imputación.",
      pasosImplementacion: [
        "Definir mapa estándar de estados de jaula (Planificada, En proceso, En acabado, Pendiente revisión, Lista para expedición, Cerrada).",
        "Configurar en LIBRA los movimientos obligatorios por fase (carga, corte, lacado/anodizado, control calidad, empaquetado, expedición).",
        "Implantar registro de movimientos en planta mediante terminales fijos/tablets en puntos clave, eliminando notas intermedias en papel.",
        "Obligar al registro inmediato de consumos y chatarra al finalizar fase, con campos mínimos (causa, kilos, referencia).",
        "Sustituir la confirmación por WhatsApp por un cambio de estado en el ERP que dispare aviso automático a facturación.",
        "Auditoría semanal: comparar muestreo de jaulas físicas vs jaula virtual hasta alcanzar >95% de concordancia."
      ],
      coste: {
        minimo: 3500,
        maximo: 5000,
        moneda: "EUR"
      },
      roi: {
        minimo: 205,
        maximo: 471,
        justificacion: "Reducción de paros y re-trabajos por errores de material: ahorro estimado de 10h/mes de prensa y acabados. Disminución de descuadres de stock y correcciones manuales: 12h/mes de regulador y administración. Mejora en aprovechamiento de material (mermas visibles y acotadas)."
      },
      dependencias: ["ALM-4", "ALM-6", "ORG-8", "PRO-3"],
      tags: ["jaulas", "trazabilidad", "stock", "LIBRA"]
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
    numProblemas: 6,
    inversionMin: 16000,
    inversionMax: 36000,
    ahorroMin: 47000,
    ahorroMax: 175000
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
        minimo: 200,
        maximo: 1650,
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
        minimo: 0,
        maximo: 633,
        justificacion: "Evitación proyectos fallidos y cambios de rumbo (5.000-15.000€/año). Optimización contratos y licencias tecnológicas (3.000-7.000€/año). Ahorro anual total: 8.000-22.000€. Escenario mínimo = punto equilibrio año 1."
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
        maximo: 900,
        justificacion: "Eliminación proyectos zombis e improductivos (5.000-10.000€/año en horas redirigidas). Reducción costes oportunidad por cumplimiento plazos (5.000-10.000€/año). Ahorro anual total: 10.000-20.000€."
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
        minimo: 233,
        maximo: 1900,
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
        minimo: 25,
        maximo: 566,
        justificacion: "Gestión del cambio bien hecha aumenta adopción de mejoras (~50% más éxito en proyectos). Reduce resistencias que alargan implantaciones. Mejora clima laboral y retención de talento (~€5.000-10.000/año en rotación evitada)."
      },
      dependencias: ["DIR-2", "ORG-4"],
      tags: ["cultura", "cambio", "personas"]
    },
    {
      id: "DIR-6",
      areaId: "area6",
      titulo: "Dashboards ejecutivos y visibilidad estratégica para dirección",
      descripcion: "La dirección carece de dashboards operativos fiables en LIBRA que consoliden KPIs críticos (stock real, avance producción, costes por pedido, carga capacidad). Los informes actuales son manuales, parciales o basados en datos no fiables, forzando decisiones intuitivas en lugar de datos estructurados.",
      impacto: "alto",
      urgencia: "medio",
      causas: [
        "Dependencia crítica de conocimiento tácito en responsable técnico; dirección sin visibilidad sobre planificación real y priorización.",
        "Gestión en silos paralelos (Excel personal, email); opacidad total sobre recursos y materiales clave.",
        "Desconfianza estructural en stock contable; balances que no reflejan realidad física del inventario.",
        "Información fragmentada sobre avances de producción; sin seguimiento preciso de estados de pedidos.",
        "Errores ERP (ventas negativo, stock fantasma) comunicados oralmente sin análisis sistemático."
      ],
      evidencias: [
        "Propiedad invierte horas en extraer datos de LIBRA que resultan inutilizables por inconsistencias.",
        "Ausencia de pantallas ejecutivas con stock real, OEE máquinas, mermas por línea o plazos entrega reales.",
        "Dirección recurre a visitas físicas o llamadas para validar cualquier métrica operativa crítica.",
        "Informes financieros distorsionados por stock 'fantasma' y ajustes manuales no trazados."
      ],
      solucionPropuesta: "Implantar 5 dashboards ejecutivos en LIBRA con refresh automático: Stock precisión, Avance producción, Rentabilidad pedidos, Capacidad planta, Alertas desviaciones.",
      pasosImplementacion: [
        "Identificar 12-15 KPIs prioritarios (stock % precisión, mermas diarias, pedidos con retraso >3 días, utilización prensas).",
        "Configurar queries LIBRA para extraer datos limpios post-ALM-4/PRO-6 (jaulas fiables).",
        "Diseñar 5 pantallas: Dashboard Dirección (global), Stock (diario), Producción (hora), Financiero (semanal), Alertas (tiempo real).",
        "Acceso móvil/tablet para propiedad con notificaciones push desviaciones > umbral.",
        "Formación 4h dirección + testeo 2 semanas con datos simulados.",
        "Mantenimiento mensual: revisión KPIs + 1h soporte."
      ],
      coste: {
        minimo: 5000,
        maximo: 8000,
        moneda: "EUR"
      },
      roi: {
        minimo: 112,
        maximo: 640,
        justificacion: "Ahorro tiempo propiedad: 10-15h/mes liberadas (7.000-12.000€/año). Mejora margen comercial 0,5% + reducción stock inmovilizado: 10.000-25.000€/año. Beneficio económico anual total: 17.000-37.000€. Payback escenario mínimo: 5,6 meses. Payback escenario máximo: 1,6 meses."
      },
      dependencias: ["ALM-4", "PRO-6", "ORG-8"],
      tags: ["dashboards", "KPIs", "dirección", "LIBRA"]
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
