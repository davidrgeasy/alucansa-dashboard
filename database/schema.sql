-- ===========================================
-- ALUCANSA DASHBOARD - ESQUEMA DE BASE DE DATOS
-- ===========================================
-- Ejecutar este script en phpMyAdmin o consola MySQL
-- para crear la estructura de tablas

-- Eliminar tablas si existen (en orden inverso por FK)
DROP TABLE IF EXISTS roi_calculations;
DROP TABLE IF EXISTS follow_ups;
DROP TABLE IF EXISTS tracking;
DROP TABLE IF EXISTS problemas;
DROP TABLE IF EXISTS areas;

-- ===========================================
-- TABLA: ÁREAS
-- ===========================================
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- TABLA: PROBLEMAS
-- ===========================================
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- TABLA: TRACKING (Seguimiento de problemas)
-- ===========================================
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- TABLA: FOLLOW-UPS (Notas de seguimiento)
-- ===========================================
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- TABLA: ROI CALCULATIONS (Cálculos de ROI)
-- ===========================================
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- FIN DEL ESQUEMA
-- ===========================================



