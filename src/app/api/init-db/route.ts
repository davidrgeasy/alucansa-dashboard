/**
 * API - INICIALIZAR BASE DE DATOS
 * ================================
 * POST: Crea las tablas y los datos iniciales
 * 
 * ⚠️ SOLO USAR UNA VEZ para configurar la BD
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST() {
  try {
    // =====================
    // CREAR TABLAS
    // =====================
    
    // Eliminar tablas si existen
    await query(`DROP TABLE IF EXISTS roi_calculations`);
    await query(`DROP TABLE IF EXISTS follow_ups`);
    await query(`DROP TABLE IF EXISTS tracking`);
    await query(`DROP TABLE IF EXISTS problemas`);
    await query(`DROP TABLE IF EXISTS areas`);

    // Crear tabla AREAS
    await query(`
      CREATE TABLE areas (
        id VARCHAR(50) PRIMARY KEY,
        codigo VARCHAR(10) NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        prioridad ENUM('alto', 'medio', 'bajo') DEFAULT 'medio',
        is_custom TINYINT(1) DEFAULT 0,
        created_by VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_by VARCHAR(255),
        updated_at DATETIME,
        INDEX idx_codigo (codigo),
        INDEX idx_prioridad (prioridad)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Crear tabla PROBLEMAS
    await query(`
      CREATE TABLE problemas (
        id VARCHAR(50) PRIMARY KEY,
        area_id VARCHAR(50) NOT NULL,
        titulo VARCHAR(500) NOT NULL,
        descripcion TEXT,
        impacto ENUM('alto', 'medio', 'bajo') DEFAULT 'medio',
        urgencia ENUM('corto', 'medio', 'largo') DEFAULT 'medio',
        causas JSON,
        evidencias JSON,
        solucion_propuesta TEXT,
        pasos_implementacion JSON,
        coste_minimo DECIMAL(12,2) DEFAULT 0,
        coste_maximo DECIMAL(12,2) DEFAULT 0,
        roi_minimo INT DEFAULT 0,
        roi_maximo INT DEFAULT 0,
        roi_justificacion TEXT,
        dependencias JSON,
        tags JSON,
        is_custom TINYINT(1) DEFAULT 0,
        created_by VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_by VARCHAR(255),
        updated_at DATETIME,
        FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE CASCADE,
        INDEX idx_area (area_id),
        INDEX idx_impacto (impacto),
        INDEX idx_urgencia (urgencia)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Crear tabla TRACKING
    await query(`
      CREATE TABLE tracking (
        id INT AUTO_INCREMENT PRIMARY KEY,
        problema_id VARCHAR(50) NOT NULL UNIQUE,
        status ENUM('pendiente', 'en_analisis', 'en_progreso', 'bloqueado', 'completado', 'descartado') DEFAULT 'pendiente',
        internal_priority ENUM('critica', 'alta', 'media', 'baja') DEFAULT 'media',
        assignee VARCHAR(255),
        progress INT DEFAULT 0,
        start_date DATE,
        target_date DATE,
        completed_date DATE,
        custom_cost_min DECIMAL(12,2),
        custom_cost_max DECIMAL(12,2),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (problema_id) REFERENCES problemas(id) ON DELETE CASCADE,
        INDEX idx_status (status),
        INDEX idx_assignee (assignee)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Crear tabla FOLLOW_UPS
    await query(`
      CREATE TABLE follow_ups (
        id VARCHAR(50) PRIMARY KEY,
        tracking_id INT NOT NULL,
        type ENUM('nota', 'reunion', 'decision', 'bloqueo', 'avance') DEFAULT 'nota',
        content TEXT NOT NULL,
        author VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tracking_id) REFERENCES tracking(id) ON DELETE CASCADE,
        INDEX idx_tracking (tracking_id),
        INDEX idx_type (type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Crear tabla ROI_CALCULATIONS
    await query(`
      CREATE TABLE roi_calculations (
        id VARCHAR(50) PRIMARY KEY,
        tracking_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        inversion DECIMAL(12,2) DEFAULT 0,
        ahorro_anual DECIMAL(12,2) DEFAULT 0,
        roi DECIMAL(8,2) DEFAULT 0,
        payback_meses INT DEFAULT 0,
        notas TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tracking_id) REFERENCES tracking(id) ON DELETE CASCADE,
        INDEX idx_tracking (tracking_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // =====================
    // INSERTAR ÁREAS
    // =====================
    await query(`
      INSERT INTO areas (id, codigo, nombre, descripcion, prioridad, is_custom) VALUES
      ('area1', 'ORG', 'Organización y modelo operativo', 'Estructura organizativa, definición de roles, gobierno del dato y forma en que las decisiones se apoyan (o no) en información fiable.', 'alto', 0),
      ('area2', 'ALM', 'Almacén y logística', 'Gestión de existencias, movimientos entre almacenes, preparación de pedidos y coordinación logística con producción y clientes.', 'alto', 0),
      ('area3', 'ADM', 'Administración, facturación y contabilidad', 'Procesos administrativos, facturación, contabilidad, conciliaciones y reporting financiero.', 'alto', 0),
      ('area4', 'VEN', 'Ventas, cliente y área comercial', 'Relación con clientes, gestión de oportunidades, pedidos comerciales y calidad de servicio percibida.', 'medio', 0),
      ('area5', 'PRO', 'Producción', 'Planificación, ejecución y control de la fabricación, con especial foco en extrusión y acabados.', 'alto', 0),
      ('area6', 'DIR', 'Dirección y estrategia', 'Enfoque estratégico, priorización de inversiones, gobierno de proyectos y cultura de mejora continua.', 'alto', 0)
    `);

    // =====================
    // INSERTAR PROBLEMAS
    // =====================
    
    // ÁREA 1: ORGANIZACIÓN
    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('ORG-1', 'area1', 'Ausencia de responsable claro del dato y de procesos', 'No existe una figura formal que asuma la responsabilidad global sobre la calidad del dato, la coherencia de los procesos y la coordinación entre departamentos.', 'alto', 'corto', '["Crecimiento orgánico de la empresa sin rediseñar la estructura", "Responsabilidades históricas asumidas por personas y no por puestos", "Falta de gobierno del dato y de procesos documentado"]', '["Nadie puede explicar de principio a fin el flujo de un pedido con datos fiables", "Cada departamento tiene una visión parcial y a veces contradictoria de la realidad", "Las incidencias de datos se parchean pero no se atacan de raíz"]', 'Crear la figura de Responsable de Procesos y Datos (interno o compartido) con autoridad transversal para definir, documentar y velar por el cumplimiento de los procesos y estándares de información.', '["Definir funciones y alcance del rol (responsable del dato y procesos)", "Asignar la función a una persona interna o incorporar un perfil adecuado", "Documentar responsabilidades, indicadores clave y canales de comunicación", "Establecer un circuito de gestión de incidencias de datos y procesos", "Revisar trimestralmente avances y bloqueos con la Dirección"]', 3000, 8000, 150, 400, 'Ahorro estimado de 15-25h/semana en resolución de incidencias y duplicidades.', '[]', '["gobierno del dato", "procesos", "organización"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('ORG-2', 'area1', 'Procesos no documentados y dependientes de personas clave', 'Los procesos críticos de negocio están en la cabeza de unas pocas personas y no existen procedimientos escritos.', 'alto', 'medio', '["Falta de tiempo y metodología para documentar procedimientos", "Cultura de cada uno sabe lo suyo", "Ausencia de plantillas y responsables de documentación"]', '["Discrepancias entre sedes sobre cómo se hacen tareas iguales", "Dificultad para sustituir a personas clave cuando no están presentes"]', 'Implantar un sistema ligero de documentación de procesos accesible para toda la organización.', '["Seleccionar una herramienta simple para documentación", "Priorizar los procesos críticos que deben documentarse primero", "Asignar responsables de redacción y validación por proceso"]', 2000, 5000, 100, 300, 'Reducción del tiempo de formación de nuevos empleados (~40%).', '["ORG-1"]', '["procedimientos", "documentación", "conocimiento"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('ORG-3', 'area1', 'Decisiones reactivas sin indicadores comunes', 'La empresa toma decisiones importantes sin un cuadro de indicadores compartido ni criterios homogéneos.', 'alto', 'medio', '["No existe un cuadro de mando mínimo consensuado", "Cada área calcula sus números con herramientas distintas"]', '["Discurso recurrente de no tenemos datos fiables", "Dificultad para responder preguntas básicas sobre rentabilidad"]', 'Definir un cuadro de mando básico transversal con indicadores mínimos por área.', '["Definir junto a Dirección el set mínimo de KPIs", "Identificar de dónde sale cada dato y quién es responsable", "Montar un primer cuadro de mando simple"]', 3000, 8000, 120, 350, 'Mejora en la toma de decisiones que puede evitar ~2-3% de pérdidas.', '["ORG-1"]', '["kpi", "cuadro de mando", "dato"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('ORG-4', 'area1', 'Reuniones y comunicación poco estructuradas', 'Las reuniones entre áreas son poco sistemáticas y muchas decisiones se toman por canales informales.', 'medio', 'medio', '["No existe un calendario de reuniones operativas definido", "Ausencia de actas o acuerdos escritos"]', '["Desalineación frecuente entre lo que se acordó y lo que se ejecuta", "Decisiones importantes que dependen de recordar conversaciones"]', 'Diseñar un sistema mínimo de gobernanza: tipos de reuniones, frecuencia, asistentes y actas.', '["Definir tipos de reuniones (dirección, operativa, seguimiento)", "Asignar periodicidad y responsables de convocatoria", "Implantar una plantilla simple de acta de reunión"]', 1000, 3000, 80, 200, 'Ahorro de ~3-5h/semana en reuniones improductivas.', '[]', '["comunicación interna", "reuniones", "gobernanza"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('ORG-5', 'area1', 'Dependencia excesiva de perfiles técnicos para decisiones de negocio', 'Se espera que el perfil técnico defina o valide decisiones de negocio que exceden su ámbito.', 'alto', 'corto', '["Confusión entre gestionar tecnología y diseñar procesos de negocio", "Ausencia de rol de consultoría interna"]', '["Expectativa de que el técnico asuma trazabilidad completa del dato", "Sobrecarga de tareas no técnicas en el perfil técnico"]', 'Separar claramente el rol de tecnología del rol de procesos/negocio.', '["Mapear tareas actuales del perfil técnico y clasificarlas", "Definir qué tareas de negocio deben reasignarse", "Comunicar la nueva distribución de responsabilidades"]', 2000, 5000, 100, 250, 'Liberación del 30-40% del tiempo del perfil técnico.', '["ORG-1", "ORG-2"]', '["roles", "tecnologia", "procesos"]', 0)`);

    // ÁREA 2: ALMACÉN
    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('ALM-1', 'area2', 'Descuadre crónico entre stock físico y stock digital', 'Las existencias registradas en el sistema no coinciden con lo que hay en los almacenes.', 'alto', 'corto', '["Entradas y salidas sin registrar o registradas con retraso", "Procesos manuales y heterogéneos entre sedes"]', '["Imposibilidad de conocer el stock real disponible por referencia", "Necesidad de comprobaciones físicas constantes"]', 'Diseñar e implantar un modelo de gestión de stock con ubicaciones y responsables por zona.', '["Definir estructura de almacén (zonas, ubicaciones)", "Asignar responsables de stock por área", "Implantar inventarios cíclicos planificados"]', 4000, 10000, 180, 450, 'Reducción del stock de seguridad innecesario (~10-15%).', '["ORG-1"]', '["stock", "inventario", "logística"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('ALM-2', 'area2', 'Pedidos internos entre sedes sin circuito estándar', 'Los almacenes envían peticiones de material mediante proformas o correos no integrados.', 'alto', 'medio', '["Inexistencia de un flujo estándar de pedido interno en el sistema", "Histórico de usar formatos ofimáticos ad hoc"]', '["Pedidos de almacenes introducidos como si fueran de Candelaria", "Pérdida de trazabilidad desde el almacén de origen"]', 'Implantar un circuito formal de pedidos internos entre sedes dentro del ERP.', '["Definir el flujo estándar de pedido interno", "Parametrizar el ERP para soportar el circuito", "Formar a los responsables de cada almacén"]', 2500, 6000, 120, 320, 'Ahorro de ~8-12h/semana en gestión manual de pedidos entre sedes.', '["ALM-1"]', '["pedidos internos", "multi-almacén", "trazabilidad"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('ALM-3', 'area2', 'Falta de ubicaciones definidas y etiquetado sistemático', 'El material no está asociado a una ubicación estructurada.', 'medio', 'medio', '["Almacenes creados y ampliados sin un plan de ubicaciones", "Ausencia de etiquetas normalizadas"]', '["Dependencia del conocimiento de personas concretas para encontrar material", "Tiempos largos de preparación de pedidos"]', 'Diseñar un esquema de ubicaciones y etiquetado compatible con el ERP.', '["Analizar distribución actual y definir arquitectura de ubicaciones", "Diseñar sistema de codificación", "Etiquetar físicamente ubicaciones"]', 3000, 7000, 100, 280, 'Reducción del tiempo de preparación de pedidos (~20-30%).', '["ALM-1"]', '["ubicaciones", "etiquetado", "almacén"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('ALM-4', 'area2', 'Uso intensivo de llamadas y WhatsApp para coordinar envíos', 'La coordinación diaria depende de llamadas y mensajes informales sin registro estructurado.', 'medio', 'corto', '["Carencia de herramientas sencillas para registrar y consultar estados", "Falta de confianza en el dato del sistema"]', '["Cientos de llamadas mensuales para consultar estados de pedidos", "Repetición de la misma información a distintas personas"]', 'Reducir las dependencias de comunicación informal implantando estados visibles en el ERP.', '["Definir un catálogo simple de estados de pedido", "Parametrizar el ERP para reflejar estos estados", "Crear vistas donde los responsables puedan ver la carga"]', 2000, 5000, 150, 380, 'Reducción drástica de llamadas internas (~60-80%).', '["ALM-1", "ALM-2"]', '["comunicación", "operaciones", "paneles"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('ALM-5', 'area2', 'Ausencia de indicadores logísticos', 'No se miden de forma sistemática los plazos de preparación, errores o incidencias.', 'medio', 'medio', '["No se han definido indicadores logísticos concretos", "Los datos necesarios no siempre se registran"]', '["Dificultad para saber cuántos pedidos salen en plazo", "Imposibilidad de cuantificar errores de preparación"]', 'Definir y poner en marcha un pequeño cuadro de mando logístico.', '["Seleccionar 3-5 indicadores clave", "Verificar qué datos existen en el ERP", "Configurar informes o paneles automáticos"]', 2000, 5000, 90, 220, 'Visibilidad sobre problemas permite actuar antes de perder clientes.', '["ALM-1", "ALM-2"]', '["kpi", "logística", "servicio"]', 0)`);

    // ÁREA 3: ADMINISTRACIÓN
    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('ADM-1', 'area3', 'Dispersión de herramientas contables y administrativas', 'Coexisten distintos programas y hojas auxiliares para facturación y contabilidad.', 'alto', 'medio', '["Evolución histórica con soluciones parciales", "Diferente grado de confianza en cada herramienta"]', '["Repetición de datos en varias herramientas", "Tareas manuales para cuadrar información entre sistemas"]', 'Definir un sistema contable y de facturación de referencia y una estrategia de transición.', '["Mapear qué procesos se hacen en cada herramienta actual", "Evaluar funcionalidad y costes de cada sistema", "Tomar una decisión sobre el sistema de referencia"]', 3500, 9000, 130, 350, 'Eliminación de duplicidades ahorra ~10-15h/semana.', '["ORG-1"]', '["contabilidad", "facturación", "sistemas"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('ADM-2', 'area3', 'Conciliaciones bancarias y gestión de cobros demasiado manuales', 'La conciliación de movimientos bancarios requiere muchas horas de trabajo manual.', 'medio', 'medio', '["No se aprovechan funcionalidades de conciliación automática", "Dificultad de integración directa con bancos"]', '["Muchas horas mensuales dedicadas a conciliar bancos", "Revisión manual de movimientos y asignación a facturas"]', 'Introducir conciliación semiautomática con ficheros bancarios.', '["Revisar qué opciones de conciliación ofrece el sistema contable", "Configurar la importación de movimientos bancarios", "Definir reglas de conciliación automática"]', 2000, 5000, 150, 400, 'La conciliación automática reduce el tiempo de ~20h/mes a ~3-4h/mes.', '["ADM-1"]', '["conciliación", "banca", "automatización"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('ADM-3', 'area3', 'Carga administrativa elevada por falta de automatización documental', 'Gran parte del tiempo se consume en introducir datos de facturas y buscar documentos.', 'medio', 'medio', '["Digitalización de facturas poco sistemática", "No se utiliza OCR de forma integrada"]', '["Tiempo significativo dedicado a registrar facturas de proveedores", "Búsquedas manuales frecuentes de documentos"]', 'Introducir un flujo de captura y clasificación automática de documentos (OCR).', '["Seleccionar una solución OCR adecuada al volumen de facturas", "Definir el flujo de trabajo", "Integrar el OCR con el sistema contable"]', 3000, 8000, 120, 300, 'OCR reduce tiempo de entrada de facturas ~70-80%.', '["ADM-1"]', '["ocr", "documentos", "automatización"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('ADM-4', 'area3', 'Reporting financiero poco orientado a la operación', 'La información financiera se centra en cierres y obligaciones legales.', 'medio', 'largo', '["Prioridad en cumplimiento fiscal frente a visión de gestión", "Falta de conexión entre contabilidad analítica y operativa"]', '["Dificultad para obtener información por línea de negocio", "Escaso uso de la contabilidad analítica"]', 'Rediseñar el reporting financiero desde una lógica de gestión.', '["Definir qué preguntas de negocio debe responder la información financiera", "Ajustar el plan contable y la analítica", "Configurar informes estándar o cuadros de mando"]', 2500, 6000, 80, 220, 'Información financiera orientada a gestión permite identificar líneas no rentables.', '["ORG-3", "ADM-1"]', '["reporting", "finanzas", "gestión"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('ADM-5', 'area3', 'Uso limitado de la información administrativa para detectar fugas de margen', 'No se explota sistemáticamente la información para detectar baja rentabilidad.', 'medio', 'medio', '["Datos dispersos en varios sistemas", "Falta de visión integrada coste-precio-desperdicio"]', '["Desconocimiento del margen real por producto o cliente", "Dificultad para priorizar subidas de precio"]', 'Construir una visión simplificada de margen por línea y cliente.', '["Identificar qué datos de coste y precio están disponibles", "Definir un modelo simple de cálculo de margen", "Montar un primer informe de margen"]', 2500, 6000, 200, 500, 'Detectar fugas de margen del 2-5% representa €40.000-100.000/año.', '["ADM-1", "ADM-4"]', '["margen", "análisis", "rentabilidad"]', 0)`);

    // ÁREA 4: VENTAS
    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('VEN-1', 'area4', 'Ausencia de CRM para gestión de clientes y oportunidades', 'La relación con clientes se gestiona principalmente a través de correo, teléfono y conocimiento individual.', 'alto', 'medio', '["Enfoque tradicional basado en relaciones personales", "No se ha priorizado la implantación de un CRM"]', '["No hay listado único y actualizado de oportunidades abiertas", "Dificultad para saber qué clientes están en riesgo de fuga"]', 'Implantar un CRM ligero integrado con el flujo de pedidos.', '["Seleccionar una herramienta CRM adaptada al tamaño", "Definir campos mínimos y etapas del embudo comercial", "Cargar la base activa de clientes"]', 3000, 8000, 150, 400, 'Un CRM evita perder oportunidades (~5-10% más conversión).', '["ORG-3"]', '["crm", "clientes", "ventas"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('VEN-2', 'area4', 'Gestión reactiva de incidencias comerciales y de servicio', 'Las incidencias de clientes se gestionan caso a caso sin registro sistemático.', 'medio', 'medio', '["No existe un registro estructurado de incidencias comerciales", "Falta de responsables claros de seguimiento"]', '["Repetición de problemas con algunos clientes sin visibilidad", "Imposibilidad de saber cuántas incidencias se producen al mes"]', 'Crear un circuito simple de registro y seguimiento de incidencias comerciales.', '["Definir tipos de incidencias y niveles de gravedad", "Diseñar un formulario mínimo de registro", "Asignar responsables de resolución"]', 1500, 4000, 100, 280, 'Gestión estructurada de incidencias reduce tiempo de resolución (~40%).', '["VEN-1"]', '["incidencias", "servicio", "clientes"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('VEN-3', 'area4', 'Escasa visibilidad sobre pérdida de clientes y motivos', 'No se dispone de datos estructurados sobre qué clientes han reducido o dejado de comprar.', 'alto', 'medio', '["No se analizan patrones de compra por cliente", "No hay procesos de post mortem cuando se pierde un cliente"]', '["Percepción de pérdida o estancamiento de ventas sin detalle", "Ausencia de indicadores de retención o abandono"]', 'Analizar ventas históricas por cliente y crear un panel de actividad.', '["Exportar y consolidar datos de ventas por cliente", "Definir qué se considera cliente activo, en riesgo y perdido", "Configurar un informe periódico"]', 2000, 5000, 200, 600, 'Detectar y recuperar 3-5 clientes en riesgo/año representa €30.000-80.000.', '["ADM-5", "VEN-1"]', '["fuga de clientes", "análisis", "ventas"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('VEN-4', 'area4', 'Canales de comunicación con clientes poco estructurados', 'Las peticiones de clientes llegan por múltiples canales sin entrada única.', 'medio', 'corto', '["No existe una bandeja de entrada común para solicitudes comerciales", "Cada persona gestiona sus propios correos"]', '["Llamadas perdidas o correos no respondidos a tiempo", "Sensación de ir siempre apagando fuegos"]', 'Centralizar la entrada de solicitudes comerciales en una herramienta o buzón compartido.', '["Crear una dirección de correo o canal común", "Definir reglas de asignación y tiempos de respuesta", "Configurar alertas o paneles de solicitudes pendientes"]', 1000, 3000, 80, 200, 'Centralizar comunicaciones reduce tiempo de respuesta (~50%).', '[]', '["comunicación", "clientes", "operación comercial"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('VEN-5', 'area4', 'Poca conexión entre información comercial y capacidad productiva', 'Las decisiones comerciales no siempre se basan en información actualizada de carga de producción.', 'medio', 'medio', '["Falta de visibilidad compartida sobre carga de planta", "No existen alertas cuando se comprometen plazos difíciles"]', '["Promesa de plazos que luego son difíciles de cumplir", "Tensiones entre comercial y producción"]', 'Crear un mecanismo mínimo de visibilidad de capacidad y carga.', '["Definir indicadores simples de carga", "Configurar vistas en el ERP para ver carga actual", "Formar al equipo comercial para consultar esta información"]', 2500, 6000, 120, 320, 'Evitar compromisos de plazo imposibles reduce tensiones y horas extra.', '["PRO-1"]', '["planificación", "comercial", "capacidad"]', 0)`);

    // ÁREA 5: PRODUCCIÓN
    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('PRO-1', 'area5', 'Ausencia de planificación formal de producción (MRP/MPS)', 'La carga de producción se organiza de forma muy manual y reactiva.', 'alto', 'medio', '["No se ha configurado un módulo de planificación en el ERP", "La experiencia de las personas suple la falta de herramienta"]', '["Dificultad para anticipar carga y cuellos de botella", "Reprogramaciones frecuentes y urgencias diarias"]', 'Implantar una planificación básica de producción apoyada en el ERP.', '["Definir reglas básicas de secuenciación", "Configurar el módulo de planificación existente", "Formar a la figura de Regulador"]', 5000, 12000, 180, 500, 'Planificación formal reduce tiempos muertos de máquina (~10-15%).', '["ALM-1"]', '["planificación", "producción", "mrp"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('PRO-2', 'area5', 'Datos de producción sin objetivo ni explotación real', 'Se introducen datos en fases intermedias sin un plan claro sobre cómo se van a utilizar.', 'alto', 'corto', '["Implantación de fases en el ERP sin diseño de indicadores previos", "Ausencia de cuadro de mando de producción"]', '["Horas dedicadas a introducir datos que no retornan información útil", "No hay indicadores consolidados de eficiencia"]', 'Redefinir las capturas de datos de planta partiendo de los indicadores que se quieren obtener.', '["Definir junto a planta qué indicadores son prioritarios", "Analizar qué datos son imprescindibles", "Rediseñar las pantallas de captura de datos"]', 3000, 8000, 150, 400, 'Datos útiles permiten identificar cuellos de botella y pérdidas ocultas.', '["ORG-3"]', '["datos de planta", "indicadores", "eficiencia"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('PRO-3', 'area5', 'Falta de control estructurado del desperdicio en extrusión', 'No se hace de manera consistente el cálculo del desperdicio por matriz.', 'alto', 'medio', '["No existe una tabla consolidada de desperdicio por matriz", "El ERP no se explota para integrar estos datos"]', '["Imposibilidad actual de conocer el desperdicio real por producto", "Falta de objetivos de mejora ligados a indicadores"]', 'Construir un sistema sencillo de registro y análisis de desperdicio por matriz.', '["Definir claramente el modelo de datos de desperdicio", "Determinar si se captura en el ERP o en tabla externa", "Establecer la rutina de registro por turno"]', 3000, 7000, 250, 800, 'Controlar el desperdicio y reducirlo un 1-2% representa €25.000-80.000/año.', '["PRO-2"]', '["desperdicio", "extrusión", "costes"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('PRO-4', 'area5', 'Trazabilidad incompleta de pedidos a lo largo del flujo productivo', 'No se puede seguir fácilmente el estado de un pedido desde la recepción hasta la expedición.', 'alto', 'medio', '["Fases de producción configuradas sin conexión con el flujo de pedidos", "Falta de disciplina a la hora de actualizar estados"]', '["Necesidad de preguntar físicamente en planta por el estado", "Descoordinación entre producción y administración"]', 'Diseñar un flujo mínimo de estados de pedido enlazado a hitos reales de producción.', '["Definir estados clave del pedido", "Mapear estos estados con las etapas reales", "Configurar el ERP para reflejar estos estados"]', 4000, 10000, 120, 350, 'Trazabilidad completa reduce tiempo de consultas (~10-15h/semana).', '["ALM-2", "ALM-4", "PRO-1"]', '["trazabilidad", "pedidos", "producción"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('PRO-5', 'area5', 'Dependencia excesiva de la figura del Regulador para priorizar y coordinar', 'La persona que regula la producción asume una carga muy alta de llamadas y decisiones.', 'medio', 'corto', '["Falta de paneles visuales de carga y estados", "Ausencia de criterios objetivos compartidos para priorizar"]', '["Elevado número de llamadas diarias hacia el regulador", "Baja posibilidad de delegar si esa persona no está"]', 'Dotar al Regulador de herramientas visuales de planificación y estados.', '["Identificar la información mínima que el Regulador necesita", "Configurar un panel de trabajo", "Definir reglas de prioridad y documentarlas"]', 3000, 7000, 130, 350, 'Reducir dependencia del regulador disminuye riesgo operativo.', '["PRO-1", "ALM-4"]', '["regulación", "carga de trabajo", "paneles"]', 0)`);

    // ÁREA 6: DIRECCIÓN
    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('DIR-1', 'area6', 'Inversiones tecnológicas sin cálculo formal de retorno (ROI)', 'Las decisiones de inversión en software se han tomado sin análisis estructurado de retorno.', 'alto', 'medio', '["Falta de metodología de evaluación económica para tecnología", "Presión de urgencias operativas y normativas"]', '["Dificultad para defender nuevas inversiones frente a la propiedad", "Percepción de mucho dinero gastado sin resultados claros"]', 'Implantar una metodología simple de análisis de ROI tecnológico.', '["Definir plantilla estándar de caso de negocio", "Incluir siempre estimación de ahorro de horas", "Hacer seguimiento anual del ROI real"]', 2000, 5000, 150, 400, 'Metodología de ROI evita inversiones fallidas (~€10.000-30.000/año).', '["ORG-3"]', '["roi", "inversión", "estrategia"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('DIR-2', 'area6', 'Falta de hoja de ruta tecnológica alineada con la estrategia de negocio', 'No existe un plan a 2-3 años que marque qué sistemas se van a mantener o sustituir.', 'alto', 'medio', '["Enfoque reactivo frente a problemas inmediatos", "Incógnitas sobre la situación actual de los sistemas"]', '["Dudas recurrentes sobre seguir o no con determinados proveedores", "Multiplicidad de propuestas y ofertas sin marco de decisión"]', 'Construir una hoja de ruta tecnológica realista que priorice pocas decisiones clave.', '["Tomar como base el diagnóstico actual de sistemas", "Identificar 3-5 decisiones críticas", "Ordenarlas por impacto y viabilidad económica"]', 3000, 8000, 120, 350, 'Una hoja de ruta clara evita cambios de rumbo costosos.', '["DIR-1", "ORG-1"]', '["roadmap", "tecnología", "priorización"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('DIR-3', 'area6', 'Gobierno de proyectos de mejora poco definido', 'Los proyectos de mejora no siempre tienen un patrocinador claro ni estructura de seguimiento.', 'medio', 'medio', '["Carencia de metodología de gestión de proyectos adaptada", "Asunción informal de responsabilidades"]', '["Proyectos que se alargan más de lo previsto", "Cambios de alcance sobre la marcha"]', 'Introducir una forma ligera de gestión de proyectos con roles básicos y hitos.', '["Definir qué se considera proyecto y qué no", "Asignar siempre un patrocinador y un responsable operativo", "Usar una plantilla estándar de plan de proyecto"]', 2000, 5000, 100, 280, 'Proyectos bien gestionados terminan en plazo y presupuesto (~30% menos desviaciones).', '["DIR-1", "DIR-2"]', '["proyectos", "gobernanza", "mejora continua"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('DIR-4', 'area6', 'Dependencia elevada de personas concretas para el funcionamiento global', 'Algunos puestos acumulan decisiones y conocimiento clave, con riesgo operativo importante.', 'alto', 'medio', '["No se han definido siempre puestos sino personas", "Poca rotación o backup planificado de funciones críticas"]', '["Preocupación cuando determinadas personas no están presentes", "Dificultad para delegar o escalar responsabilidades"]', 'Reducir la dependencia de personas individuales documentando procesos y definiendo suplencias.', '["Identificar roles críticos y tareas que dependen de una sola persona", "Documentar procesos clave asociados a esos roles", "Definir personas de backup"]', 2500, 6000, 120, 320, 'Reducir dependencia mitiga riesgo operativo (coste potencial de baja: €20.000-50.000).', '["ORG-2"]', '["personas clave", "riesgo operativo", "conocimiento"]', 0)`);

    await query(`INSERT INTO problemas (id, area_id, titulo, descripcion, impacto, urgencia, causas, evidencias, solucion_propuesta, pasos_implementacion, coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion, dependencias, tags, is_custom) VALUES
      ('DIR-5', 'area6', 'Cultura de siempre se ha trabajado así que frena cambios', 'Existe resistencia natural al cambio que dificulta aprovechar las mejoras tecnológicas.', 'medio', 'largo', '["Histórico de intentos de mejora que no han llegado a buen puerto", "Falta de comunicación clara sobre el porqué de los cambios"]', '["Comentarios recurrentes de antes funcionaba o siempre se ha hecho así", "Reticencia a registrar datos nuevos"]', 'Acompañar los cambios con comunicación honesta y participación de las personas afectadas.', '["Involucrar a personas clave en el diseño de nuevas formas de trabajar", "Explicar con claridad los beneficios esperados", "Planificar pilotos acotados antes de escalar"]', 1500, 4000, 80, 200, 'Gestión del cambio bien hecha aumenta adopción de mejoras (~50% más éxito).', '["DIR-2", "ORG-4"]', '["cultura", "cambio", "personas"]', 0)`);

    return NextResponse.json({
      success: true,
      message: 'Base de datos inicializada correctamente',
      data: {
        areas: 6,
        problemas: 30,
      }
    });

  } catch (error: any) {
    console.error('Error initializing database:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Error al inicializar la base de datos',
    }, { status: 500 });
  }
}

// GET para verificar estado
export async function GET() {
  try {
    const areas = await query<any[]>(`SELECT COUNT(*) as count FROM areas`);
    const problemas = await query<any[]>(`SELECT COUNT(*) as count FROM problemas`);

    return NextResponse.json({
      initialized: true,
      areas: areas[0]?.count || 0,
      problemas: problemas[0]?.count || 0,
    });
  } catch (error: any) {
    return NextResponse.json({
      initialized: false,
      error: error.message,
    });
  }
}

