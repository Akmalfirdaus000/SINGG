-- ============================================================================
-- SISTEM PELAYANAN PUBLIK & PENGADUAN MASYARAKAT
-- Skema Database Normalized (1NF-3NF)
-- Database: MySQL 8.0+
-- Author: Claude AI
-- Created: 2026-04-07
-- ============================================================================

-- Create database
CREATE DATABASE IF NOT EXISTS singg_public_service
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE singg_public_service;

-- ============================================================================
-- SET SQL MODE
-- ============================================================================
SET SQL_MODE = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO';

-- ============================================================================
-- HELPER FUNCTIONS FOR UUID
-- ============================================================================
DELIMITER $$

-- Function to generate UUID v4
CREATE FUNCTION uuid_v4() RETURNS CHAR(36)
DETERMINISTIC
SQL SECURITY INVOKER
RETURN
    CONCAT(
        HEX(RAND() * 4294967296),
        '-',
        HEX(FLOOR(RAND() * 65536) + 4096),
        '-',
        HEX(FLOOR(RAND() * 65536) + 16384),
        '-',
        HEX(FLOOR(RAND() * 65536) + 32768),
        '-',
        CONCAT(HEX(RAND() * 281474976710656), HEX(RAND() * 4294967296))
    );
$$

DELIMITER ;

-- ============================================================================
-- TABLES: AUTHENTICATION & USER MANAGEMENT
-- ============================================================================

-- ============================================================================
-- Table: users
-- Menyimpan data user dasar
-- Normalisasi: 1NF (atomic values), 2NF (no partial dependencies), 3NF (no transitive dependencies)
-- ============================================================================
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    email VARCHAR(255) UNIQUE,
    nik VARCHAR(16) UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255),
    auth_method ENUM('password', 'otp_whatsapp', 'otp_email', 'magic_link', 'google', 'facebook') DEFAULT 'password',
    email_verified_at TIMESTAMP NULL,
    phone_verified_at TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    last_login_ip VARCHAR(45), -- IPv6 ready
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    must_change_password BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    INDEX idx_email (email),
    INDEX idx_nik (nik),
    INDEX idx_phone (phone),
    INDEX idx_is_active (is_active),
    INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: user_profiles
-- Menyimpan profil lengkap user (dipisah untuk 3NF)
-- ============================================================================
CREATE TABLE user_profiles (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    user_id CHAR(36) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    place_of_birth VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(10), -- 'L', 'P', atau lainnya
    occupation VARCHAR(100),
    profile_photo_url VARCHAR(500),
    bio TEXT,
    identity_card_url VARCHAR(500), -- Foto KTP
    address TEXT,
    province VARCHAR(100),
    city VARCHAR(100),
    district VARCHAR(100),
    village VARCHAR(100),
    postal_code VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_full_name (full_name),
    INDEX idx_location (city, district)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: user_roles
-- Many-to-many relationship antara users dan roles
-- ============================================================================
CREATE TABLE user_roles (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    user_id CHAR(36) NOT NULL,
    role ENUM('superadmin', 'admin', 'verifikator', 'petugas_lapangan', 'warga') NOT NULL,
    assigned_by CHAR(36),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY uk_user_role (user_id, role),
    INDEX idx_user_id (user_id),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: user_preferences
-- Preferensi user (notifikasi, tampilan, dll)
-- ============================================================================
CREATE TABLE user_preferences (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    user_id CHAR(36) NOT NULL UNIQUE,
    language VARCHAR(10) DEFAULT 'id',
    theme VARCHAR(20) DEFAULT 'light', -- light, dark, auto
    timezone VARCHAR(50) DEFAULT 'Asia/Jakarta',
    notification_email BOOLEAN DEFAULT TRUE,
    notification_whatsapp BOOLEAN DEFAULT TRUE,
    notification_sms BOOLEAN DEFAULT FALSE,
    notification_push BOOLEAN DEFAULT TRUE,
    newsletter_subscription BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: refresh_tokens
-- Untuk JWT refresh token management
-- ============================================================================
CREATE TABLE refresh_tokens (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    user_id CHAR(36) NOT NULL,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP NULL,
    revoked_by CHAR(36),
    device_info VARCHAR(255),
    ip_address VARCHAR(45),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (revoked_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: password_resets
-- Untuk reset password flow
-- ============================================================================
CREATE TABLE password_resets (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    user_id CHAR(36) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLES: TICKETS / PENGADUAN
-- ============================================================================

-- ============================================================================
-- Table: ticket_categories
-- Master kategori pengaduan
-- ============================================================================
CREATE TABLE ticket_categories (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    name ENUM('infrastruktur', 'kebersihan', 'keamanan', 'kesehatan', 'pendidikan', 'pelayanan_publik', 'administrasi', 'lainnya') NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20), -- Hex color code
    sla_hours INT DEFAULT 168, -- SLA dalam jam (default 7 hari)
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default categories
INSERT INTO ticket_categories (name, display_name, description, icon, color, sla_hours, sort_order) VALUES
('infrastruktur', 'Infrastruktur', 'Masalah jalan, jembatan, drainase, dll', '🚧', '#FF6B6B', 72, 1),
('kebersihan', 'Kebersihan', 'Masalah sampah, kebersihan lingkungan', '🗑️', '#4ECDC4', 48, 2),
('keamanan', 'Keamanan', 'Masalah keamanan, ketertiban', '👮', '#95E1D3', 24, 3),
('kesehatan', 'Kesehatan', 'Masalah kesehatan, puskesmas, dll', '🏥', '#F38181', 48, 4),
('pendidikan', 'Pendidikan', 'Masalah sekolah, pendidikan', '📚', '#AA96DA', 120, 5),
('pelayanan_publik', 'Pelayanan Publik', 'Pelayanan publik lainnya', '🏛️', '#FCBAD3', 72, 6),
('administrasi', 'Administrasi', 'Masalah administratif', '📄', '#FFFFD2', 168, 7),
('lainnya', 'Lainnya', 'Kategori lainnya', '📦', '#A8E6CF', 168, 8);

-- ============================================================================
-- Table: tickets
-- Pengaduan masyarakat
-- ============================================================================
CREATE TABLE tickets (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    ticket_number VARCHAR(50) UNIQUE NOT NULL, -- Format: PGD-YYYY-XXXX
    user_id CHAR(36) NOT NULL,
    category_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('draft', 'pending_verification', 'verified', 'in_progress', 'resolved', 'closed', 'rejected') DEFAULT 'pending_verification',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',

    -- Lokasi kejadian
    location_address TEXT,
    location_district VARCHAR(100),
    location_village VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    -- Assigned to
    assigned_to CHAR(36),
    assigned_at TIMESTAMP NULL,

    -- SLA
    sla_deadline TIMESTAMP NULL,
    sla_breach BOOLEAN DEFAULT FALSE,
    sla_breach_notified BOOLEAN DEFAULT FALSE,

    -- Resolution
    resolution_notes TEXT,
    resolved_at TIMESTAMP NULL,
    resolved_by CHAR(36),

    -- Statistics
    view_count INT DEFAULT 0,
    support_count INT DEFAULT 0, -- Jumlah warga yang mendukung

    -- Metadata
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE, -- Bisa dilihat publik atau tidak
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES ticket_categories(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_ticket_number (ticket_number),
    INDEX idx_status (status),
    INDEX idx_category_id (category_id),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_created_at (created_at),
    INDEX idx_sla_deadline (sla_deadline),
    INDEX idx_location (latitude, longitude),
    FULLTEXT INDEX ft_title_description (title, description) WITH PARSER ngram
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: ticket_attachments
-- Lampiran foto/video/dokumen pada pengaduan
-- ============================================================================
CREATE TABLE ticket_attachments (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    ticket_id CHAR(36) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- image/jpeg, video/mp4, application/pdf
    file_size BIGINT NOT NULL, -- dalam bytes
    uploaded_by CHAR(36) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE, -- Foto utama
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_uploaded_by (uploaded_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: ticket_comments
-- Komentar dan diskusi pada pengaduan
-- ============================================================================
CREATE TABLE ticket_comments (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    ticket_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    comment TEXT NOT NULL,
    comment_type ENUM('ticket', 'document', 'forum', 'announcement') DEFAULT 'ticket',
    parent_id CHAR(36),
    is_internal BOOLEAN DEFAULT FALSE, -- Komentar internal (hanya admin)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES ticket_comments(id) ON DELETE CASCADE,
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: ticket_history
-- Riwayat perubahan status pengaduan (Audit trail)
-- ============================================================================
CREATE TABLE ticket_history (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    ticket_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    old_status ENUM('draft', 'pending_verification', 'verified', 'in_progress', 'resolved', 'closed', 'rejected'),
    new_status ENUM('draft', 'pending_verification', 'verified', 'in_progress', 'resolved', 'closed', 'rejected') NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: ticket_supports
-- Warga yang mendukung pengaduan (seperti like/upvote)
-- ============================================================================
CREATE TABLE ticket_supports (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    ticket_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_ticket_user (ticket_id, user_id),
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: ticket_ratings
-- Rating user setelah pengaduan selesai
-- ============================================================================
CREATE TABLE ticket_ratings (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    ticket_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    admin_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_ticket_user (ticket_id, user_id),
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLES: DOCUMENTS / LAYANAN ADMINISTRASI
-- ============================================================================

-- ============================================================================
-- Table: document_types
-- Master jenis dokumen/administrasi
-- ============================================================================
CREATE TABLE document_types (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    name ENUM('surat_pengantar_rt', 'surat_pengantar_rw', 'surat_keterangan_domisili', 'surat_keterangan_usaha', 'surat_pengantar_skck', 'surat_keterangan_tidak_mampu', 'surat_keterangan_belum_menikah', 'surat_keterangan_kematian', 'surat_keterangan_kelahiran', 'surat_pengantar_pembuatan_ktp', 'surat_pengantar_pembuatan_kk', 'lainnya') NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    requirements JSON, -- Array persyaratan dokumen dalam format JSON
    fee DECIMAL(12, 2) DEFAULT 0.00, -- Biaya (jika ada)
    processing_days INT DEFAULT 7, -- Estimasi hari proses
    is_active BOOLEAN DEFAULT TRUE,
    requires_verification BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default document types
INSERT INTO document_types (name, display_name, description, requirements, fee, processing_days, sort_order) VALUES
('surat_pengantar_rt', 'Surat Pengantar RT', 'Surat pengantar dari Ketua RT', '["Foto KTP", "Foto KK", "Pas Foto"]', 0.00, 1, 1),
('surat_pengantar_rw', 'Surat Pengantar RW', 'Surat pengantar dari Ketua RW', '["Foto KTP", "Foto KK", "Surat Pengantar RT"]', 0.00, 2, 2),
('surat_keterangan_domisili', 'Surat Keterangan Domisili', 'Surat keterangan tempat tinggal', '["Foto KTP", "Foto KK", "Surat Pengantar RT/RW"]', 0.00, 3, 3),
('surat_keterangan_usaha', 'Surat Keterangan Usaha', 'Surat keterangan usaha/niaga', '["Foto KTP", "Foto KK", "Bukti usaha"]', 0.00, 3, 4),
('surat_pengantar_skck', 'Surat Pengantar SKCK', 'Surat pengantar pembuatan SKCK', '["Foto KTP", "Foto KK", "Surat Pengantar RT/RW"]', 0.00, 1, 5),
('surat_keterangan_tidak_mampu', 'Surat Keterangan Tidak Mampu', 'Surat keterangan tidak mampu (SKTM)', '["Foto KTP", "Foto KK", "Surat Pengantar RT/RW", "Penghasilan orang tua"]', 0.00, 5, 6),
('surat_keterangan_belum_menikah', 'Surat Keterangan Belum Menikah', 'Surat keterangan belum menikah', '["Foto KTP", "Foto KK", "Surat Pengantar RT/RW"]', 0.00, 2, 7),
('surat_keterangan_kematian', 'Surat Keterangan Kematian', 'Surat keterangan kematian', '["Foto KTP pelapor", "Surat keterangan RS", "Surat Pengantar RT/RW"]', 0.00, 2, 8),
('surat_keterangan_kelahiran', 'Surat Keterangan Kelahiran', 'Surat keterangan kelahiran', '["Foto KTP ortu", "Surat bidan/rs", "Surat Pengantar RT/RW", "KK"]', 0.00, 2, 9),
('surat_pengantar_pembuatan_ktp', 'Surat Pengantar Pembuatan KTP', 'Surat pengantar pembuatan KTP baru', '["Foto KK", "Surat Pengantar RT/RW"]', 0.00, 1, 10),
('surat_pengantar_pembuatan_kk', 'Surat Pengantar Pembuatan KK', 'Surat pengantar pembuatan KK', '["Foto KTP", "Surat Pengantar RT/RW"]', 0.00, 1, 11);

-- ============================================================================
-- Table: document_templates
-- Template dokumen untuk generate otomatis
-- ============================================================================
CREATE TABLE document_templates (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    document_type_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    template_content TEXT NOT NULL, -- HTML template atau format lain
    variables JSON, -- Variables yang bisa diganti ({"nama": "...", "nik": "..."})
    is_active BOOLEAN DEFAULT TRUE,
    version INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (document_type_id) REFERENCES document_types(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: documents
-- Permohonan dokumen/administrasi
-- ============================================================================
CREATE TABLE documents (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    document_number VARCHAR(50) UNIQUE NOT NULL, -- Format: ADM-YYYY-XXXX
    user_id CHAR(36) NOT NULL,
    document_type_id CHAR(36) NOT NULL,
    status ENUM('draft', 'pending_verification', 'verified', 'in_review', 'approved', 'rejected', 'completed', 'expired') DEFAULT 'pending_verification',

    -- Data pemohon (diambil dari profil tapi bisa berbeda)
    applicant_name VARCHAR(255) NOT NULL,
    applicant_nik VARCHAR(16) NOT NULL,
    applicant_address TEXT NOT NULL,
    applicant_phone VARCHAR(20),

    -- Data spesifik dokumen (flexible data)
    form_data JSON, -- Data form dinamis tergantung jenis dokumen

    -- Assigned to
    assigned_to CHAR(36),
    assigned_at TIMESTAMP NULL,

    -- Verification & Approval
    verified_by CHAR(36),
    verified_at TIMESTAMP NULL,
    verification_notes TEXT,

    approved_by CHAR(36),
    approved_at TIMESTAMP NULL,
    approval_notes TEXT,

    rejected_by CHAR(36),
    rejected_at TIMESTAMP NULL,
    rejection_reason TEXT,

    -- Document output
    generated_document_url VARCHAR(500),
    generated_at TIMESTAMP NULL,

    -- Processing
    processing_days INT,
    estimated_completion_date TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,

    -- Payment (jika ada biaya)
    is_paid BOOLEAN DEFAULT FALSE,
    payment_amount DECIMAL(12, 2),
    payment_status VARCHAR(50), -- pending, paid, failed, refunded
    payment_date TIMESTAMP NULL,

    -- Metadata
    is_expedited BOOLEAN DEFAULT FALSE, -- Proses kilat
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (document_type_id) REFERENCES document_types(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (rejected_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_document_number (document_number),
    INDEX idx_status (status),
    INDEX idx_document_type_id (document_type_id),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: document_attachments
-- Lampiran dokumen persyaratan
-- ============================================================================
CREATE TABLE document_attachments (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    document_id CHAR(36) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT NOT NULL,
    requirement_name VARCHAR(255), -- Nama persyaratan (mis: "Foto KTP")
    uploaded_by CHAR(36) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_document_id (document_id),
    INDEX idx_uploaded_by (uploaded_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: document_approvals
-- Workflow approval berjenjang
-- ============================================================================
CREATE TABLE document_approvals (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    document_id CHAR(36) NOT NULL,
    approver_id CHAR(36) NOT NULL,
    approval_level INT NOT NULL, -- 1: verifikator, 2: supervisor, 3: lurah, dst
    status VARCHAR(50) NOT NULL, -- pending, approved, rejected
    notes TEXT,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_document_level (document_id, approval_level),
    INDEX idx_document_id (document_id),
    INDEX idx_approver_id (approver_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: document_history
-- Riwayat perubahan status dokumen
-- ============================================================================
CREATE TABLE document_history (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    document_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    old_status ENUM('draft', 'pending_verification', 'verified', 'in_review', 'approved', 'rejected', 'completed', 'expired'),
    new_status ENUM('draft', 'pending_verification', 'verified', 'in_review', 'approved', 'rejected', 'completed', 'expired') NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_document_id (document_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLES: NOTIFICATIONS
-- ============================================================================

-- ============================================================================
-- Table: notification_templates
-- Template notifikasi
-- ============================================================================
CREATE TABLE notification_templates (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    name VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('email', 'whatsapp', 'sms', 'push', 'in_app') NOT NULL,
    subject_template VARCHAR(500),
    body_template TEXT NOT NULL,
    variables JSON, -- Variables yang bisa digunakan
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: notifications
-- Notifikasi yang akan dikirim ke user
-- ============================================================================
CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    user_id CHAR(36) NOT NULL,
    template_id CHAR(36),
    type ENUM('email', 'whatsapp', 'sms', 'push', 'in_app') NOT NULL,
    channels JSON NOT NULL, -- Array channels: ["email", "whatsapp", "push"]
    subject VARCHAR(500),
    content TEXT NOT NULL,
    data JSON, -- Additional data (link, ticket_number, dll)

    -- Status per channel
    email_status ENUM('pending', 'sent', 'delivered', 'read', 'failed') DEFAULT 'pending',
    email_sent_at TIMESTAMP NULL,
    whatsapp_status ENUM('pending', 'sent', 'delivered', 'read', 'failed') DEFAULT 'pending',
    whatsapp_sent_at TIMESTAMP NULL,
    sms_status ENUM('pending', 'sent', 'delivered', 'read', 'failed') DEFAULT 'pending',
    sms_sent_at TIMESTAMP NULL,
    push_status ENUM('pending', 'sent', 'delivered', 'read', 'failed') DEFAULT 'pending',
    push_sent_at TIMESTAMP NULL,

    -- Overall status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,

    -- Metadata
    priority INT DEFAULT 0, -- 0: normal, 1: high, 2: urgent
    scheduled_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP NULL,

    -- Retry logic
    retry_count INT DEFAULT 0,
    last_retry_at TIMESTAMP NULL,
    error_message TEXT,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES notification_templates(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at),
    INDEX idx_scheduled_at (scheduled_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLES: GAMIFICATION (POINTS, BADGES, LEADERBOARD)
-- ============================================================================

-- ============================================================================
-- Table: point_rules
-- Aturan perolehan poin
-- ============================================================================
CREATE TABLE point_rules (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    name VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    action VARCHAR(100) NOT NULL, -- create_ticket, upload_photo, rate_ticket, dll
    points INT NOT NULL,
    max_per_day INT, -- Maksimal poin per hari untuk action ini
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default point rules
INSERT INTO point_rules (name, display_name, description, action, points, max_per_day) VALUES
('create_ticket', 'Buat Pengaduan', 'Poin untuk membuat pengaduan baru', 'create_ticket', 10, 50),
('upload_photo', 'Upload Foto', 'Poin untuk mengupload foto bukti', 'upload_photo', 5, 25),
('rate_ticket', 'Beri Rating', 'Poin untuk memberi rating', 'rate_ticket', 5, 20),
('helpful_comment', 'Komentar Berguna', 'Poin untuk komentar yang dianggap berguna', 'helpful_comment', 10, 50),
('forum_post', 'Posting Forum', 'Poin untuk membuat postingan forum', 'forum_post', 5, 20),
('login_daily', 'Login Harian', 'Poin untuk login setiap hari', 'login_daily', 1, 1),
('complete_profile', 'Lengkapi Profil', 'Poin untuk melengkapi profil', 'complete_profile', 50, 50),
('referral', 'Referal Teman', 'Poin untuk mengajak teman', 'referral', 100, NULL);

-- ============================================================================
-- Table: user_points
-- Saldo poin user
-- ============================================================================
CREATE TABLE user_points (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    user_id CHAR(36) NOT NULL UNIQUE,
    total_points INT DEFAULT 0,
    available_points INT DEFAULT 0, -- Poin yang bisa ditukar (expired points tidak termasuk)
    earned_points INT DEFAULT 0, -- Total poin yang pernah didapat
    redeemed_points INT DEFAULT 0, -- Total poin yang sudah ditukar
    expired_points INT DEFAULT 0, -- Total poin yang expired
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_total_points (total_points)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: point_transactions
-- Riwayat transaksi poin
-- ============================================================================
CREATE TABLE point_transactions (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    user_id CHAR(36) NOT NULL,
    point_rule_id CHAR(36),
    transaction_type ENUM('earned', 'redeemed', 'expired', 'adjusted') NOT NULL,
    points INT NOT NULL, -- Positif untuk earned, negatif untuk redeemed
    balance_after INT NOT NULL, -- Saldo setelah transaksi
    description TEXT NOT NULL,
    reference_type VARCHAR(50), -- ticket, document, forum, dll
    reference_id CHAR(36), -- ID dari reference
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (point_rule_id) REFERENCES point_rules(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_reference (reference_type, reference_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: badges
-- Master badge/pencapaian
-- ============================================================================
CREATE TABLE badges (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    name VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    badge_type ENUM('first_complaint', 'active_citizen', 'photographer', 'contributor', 'helper', 'verified_user', 'top_reviewer', 'early_adopter') NOT NULL,
    icon_url VARCHAR(500),
    requirement JSON NOT NULL, -- Aturan untuk dapat badge ({"complaints": 10})
    points_reward INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default badges
INSERT INTO badges (name, display_name, description, badge_type, requirement, points_reward, sort_order) VALUES
('first_complaint', 'Pengaduan Pertama', 'Membuat pengaduan pertama', 'first_complaint', '{"min_tickets": 1}', 10, 1),
('active_citizen', 'Warga Aktif', 'Membuat 10 pengaduan valid', 'active_citizen', '{"min_tickets": 10}', 100, 2),
('photographer', 'Fotografer', 'Mengupload 20 foto', 'photographer', '{"min_uploads": 20}', 50, 3),
('contributor', 'Kontributor', '50 komentar di forum', 'contributor', '{"min_comments": 50}', 75, 4),
('verified_user', 'User Terverifikasi', 'Profil sudah terverifikasi', 'verified_user', '{"is_verified": true}', 25, 5),
('top_reviewer', 'Top Reviewer', 'Memberi 20 rating', 'top_reviewer', '{"min_ratings": 20}', 60, 6),
('early_adopter', 'Early Adopter', 'Gabung dalam 30 hari pertama', 'early_adopter', '{"joined_within_days": 30}', 15, 7);

-- ============================================================================
-- Table: user_badges
-- Badge yang didapat user
-- ============================================================================
CREATE TABLE user_badges (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    user_id CHAR(36) NOT NULL,
    badge_id CHAR(36) NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_badge (user_id, badge_id),
    INDEX idx_user_id (user_id),
    INDEX idx_badge_id (badge_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLES: FORUM & COMMUNITY
-- ============================================================================

-- ============================================================================
-- Table: forum_categories
-- Kategori forum
-- ============================================================================
CREATE TABLE forum_categories (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default categories
INSERT INTO forum_categories (name, description, icon, color, sort_order) VALUES
('pengumuman', 'Pengumuman resmi dari negeri', '📢', '#FF6B6B', 1),
('diskusi', 'Diskusi umum antar warga', '💬', '#4ECDC4', 2),
('ide_saran', 'Ide dan saran untuk negeri', '💡', '#95E1D3', 3),
('tanya_jawab', 'Tanya jawab seputar negeri', '❓', '#F38181', 4),
('jual_beli', 'Jual beli barang antar warga', '🛒', '#AA96DA', 5);

-- ============================================================================
-- Table: forum_posts
-- Postingan forum
-- ============================================================================
CREATE TABLE forum_posts (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    post_number VARCHAR(50) UNIQUE NOT NULL, -- Format: FRM-YYYY-XXXX
    user_id CHAR(36) NOT NULL,
    category_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    post_type ENUM('discussion', 'question', 'suggestion', 'announcement', 'poll') DEFAULT 'discussion',
    status ENUM('draft', 'published', 'archived', 'locked') DEFAULT 'published',

    -- Poll data (jika post_type = poll)
    poll_options JSON, -- Array opsi: ["Option 1", "Option 2", ...]
    poll_expires_at TIMESTAMP NULL,
    poll_allow_multiple BOOLEAN DEFAULT FALSE,

    -- Statistics
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    share_count INT DEFAULT 0,

    -- Pinned & Featured
    is_pinned BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,

    -- Tags
    tags JSON, -- Array tags dalam format JSON

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES forum_categories(id),
    INDEX idx_user_id (user_id),
    INDEX idx_category_id (category_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_is_pinned (is_pinned),
    FULLTEXT INDEX ft_title_content (title, content) WITH PARSER ngram
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: forum_comments
-- Komentar pada postingan forum
-- ============================================================================
CREATE TABLE forum_comments (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    post_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    parent_id CHAR(36),
    content TEXT NOT NULL,
    like_count INT DEFAULT 0,

    -- Statistics
    is_answer BOOLEAN DEFAULT FALSE, -- Jika comment adalah jawaban yang diterima

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES forum_comments(id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: forum_post_likes
-- Like pada postingan forum
-- ============================================================================
CREATE TABLE forum_post_likes (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    post_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_post_user (post_id, user_id),
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: forum_comment_likes
-- Like pada komentar forum
-- ============================================================================
CREATE TABLE forum_comment_likes (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    comment_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (comment_id) REFERENCES forum_comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_comment_user (comment_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: forum_poll_votes
-- Voting pada poll
-- ============================================================================
CREATE TABLE forum_poll_votes (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    post_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    option_index INT NOT NULL, -- Index dari array poll_options
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_post_user (post_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLES: MESSAGES / CHAT
-- ============================================================================

-- ============================================================================
-- Table: conversations
-- Percakapan antara user dan admin
-- ============================================================================
CREATE TABLE conversations (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    conversation_number VARCHAR(50) UNIQUE NOT NULL, -- Format: CON-YYYY-XXXX
    user_id CHAR(36) NOT NULL,
    admin_id CHAR(36),

    -- Metadata
    subject VARCHAR(255),
    status VARCHAR(50) DEFAULT 'open', -- open, pending, closed, archived

    -- Statistics
    message_count INT DEFAULT 0,
    last_message_at TIMESTAMP NULL,

    -- Assignment
    assigned_at TIMESTAMP NULL,
    closed_at TIMESTAMP NULL,
    closed_by CHAR(36),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (closed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_admin_id (admin_id),
    INDEX idx_status (status),
    INDEX idx_last_message_at (last_message_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: messages
-- Pesan dalam percakapan
-- ============================================================================
CREATE TABLE messages (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    conversation_id CHAR(36) NOT NULL,
    sender_id CHAR(36) NOT NULL,
    receiver_id CHAR(36) NOT NULL,
    content TEXT NOT NULL,
    message_status ENUM('sent', 'delivered', 'read', 'deleted') DEFAULT 'sent',

    -- Attachments
    attachment_url VARCHAR(500),
    attachment_type VARCHAR(50),

    -- Reply to
    reply_to_id CHAR(36),

    -- Read status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reply_to_id) REFERENCES messages(id) ON DELETE SET NULL,
    INDEX idx_conversation_id (conversation_id),
    INDEX idx_sender_id (sender_id),
    INDEX idx_receiver_id (receiver_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLES: EVENTS
-- ============================================================================

-- ============================================================================
-- Table: events
-- Event/kegiatan negeri
-- ============================================================================
CREATE TABLE events (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    event_number VARCHAR(50) UNIQUE NOT NULL, -- Format: EVT-YYYY-XXXX
    created_by CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    event_type ENUM('gotong_royong', 'rapat', 'sosialisasi', 'pelatihan', 'lainnya') NOT NULL,
    status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',

    -- Waktu & Lokasi
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NULL,
    location_name VARCHAR(255),
    location_address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    -- Registration
    requires_registration BOOLEAN DEFAULT FALSE,
    max_participants INT,
    registration_deadline TIMESTAMP NULL,

    -- Cover image
    cover_image_url VARCHAR(500),

    -- Statistics
    view_count INT DEFAULT 0,
    participant_count INT DEFAULT 0,
    interested_count INT DEFAULT 0,

    -- Tags
    tags JSON,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_created_by (created_by),
    INDEX idx_status (status),
    INDEX idx_start_date (start_date),
    INDEX idx_event_type (event_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: event_registrations
-- Pendaftaran peserta event
-- ============================================================================
CREATE TABLE event_registrations (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    event_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    status VARCHAR(50) DEFAULT 'registered', -- registered, confirmed, cancelled, attended

    -- Additional data
    notes TEXT,
    qr_code VARCHAR(255), -- QR code untuk check-in

    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    attended_at TIMESTAMP NULL,

    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_event_user (event_id, user_id),
    INDEX idx_event_id (event_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: event_interests
-- User yang interested tapi belum register
-- ============================================================================
CREATE TABLE event_interests (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    event_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_event_user (event_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLES: ANNOUNCEMENTS
-- ============================================================================

-- ============================================================================
-- Table: announcements
-- Pengumuman resmi dari negeri
-- ============================================================================
CREATE TABLE announcements (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    created_by CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    announcement_type VARCHAR(50) DEFAULT 'general', -- general, urgent, maintenance, event

    -- Targeting
    target_role ENUM('superadmin', 'admin', 'verifikator', 'petugas_lapangan', 'warga'),

    -- Priority
    is_urgent BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,

    -- Scheduling
    publish_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expire_at TIMESTAMP NULL,

    -- Statistics
    view_count INT DEFAULT 0,
    read_count INT DEFAULT 0,

    -- Attachment
    attachment_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_created_by (created_by),
    INDEX idx_publish_at (publish_at),
    INDEX idx_is_pinned (is_pinned)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: announcement_reads
-- Track pengumuman yang sudah dibaca user
-- ============================================================================
CREATE TABLE announcement_reads (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    announcement_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (announcement_id) REFERENCES announcements(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_announcement_user (announcement_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLES: AUDIT LOGS & ANALYTICS
-- ============================================================================

-- ============================================================================
-- Table: audit_logs
-- Log aktivitas user untuk security dan compliance
-- ============================================================================
CREATE TABLE audit_logs (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    user_id CHAR(36),
    action ENUM('create', 'read', 'update', 'delete', 'login', 'logout', 'download', 'upload', 'approve', 'reject') NOT NULL,
    entity_type VARCHAR(100), -- ticket, document, user, dll
    entity_id CHAR(36),
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: analytics_events
-- Event tracking untuk analytics
-- ============================================================================
CREATE TABLE analytics_events (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    user_id CHAR(36),
    session_id VARCHAR(255),
    event_name VARCHAR(255) NOT NULL,
    event_properties JSON,
    page_url VARCHAR(500),
    referrer_url VARCHAR(500),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_event_name (event_name),
    INDEX idx_session_id (session_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLES: SYSTEM CONFIGURATION
-- ============================================================================

-- ============================================================================
-- Table: system_settings
-- Pengaturan sistem
-- ============================================================================
CREATE TABLE system_settings (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    value_type VARCHAR(50) DEFAULT 'string', -- string, number, boolean, json
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE, -- Bisa diakses oleh user
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default settings
INSERT INTO system_settings (setting_key, setting_value, value_type, description, is_public) VALUES
('system_name', 'Sistem Pelayanan Publik Negeri', 'string', 'Nama sistem', TRUE),
('maintenance_mode', 'false', 'boolean', 'Mode maintenance', FALSE),
('max_upload_size', '10485760', 'number', 'Maksimal upload file dalam bytes', FALSE),
('allowed_file_types', '["jpg","jpeg","png","pdf","doc","docx"]', 'json', 'Tipe file yang diizinkan', FALSE),
('default_sla_hours', '168', 'number', 'SLA default dalam jam', FALSE),
('registration_enabled', 'true', 'boolean', 'Apakah pendaftaran user baru diizinkan', TRUE);

-- ============================================================================
-- Table: feature_flags
-- Feature flags untuk enable/disable fitur
-- ============================================================================
CREATE TABLE feature_flags (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    is_enabled BOOLEAN DEFAULT FALSE,
    enabled_for_roles JSON, -- Array roles yang dapat akses dalam format JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default feature flags
INSERT INTO feature_flags (name, description, is_enabled, enabled_for_roles) VALUES
('forum', 'Fitur Forum Diskusi', TRUE, '["warga", "admin", "superadmin"]'),
('events', 'Fitur Event & Kegiatan', TRUE, '["warga", "admin", "superadmin"]'),
('gamification', 'Fitur Gamifikasi (Poin & Badge)', TRUE, '["warga", "admin", "superadmin"]'),
('dark_mode', 'Tema Dark Mode', TRUE, '["warga", "admin", "superadmin"]'),
('mobile_app', 'Akses via Mobile App', FALSE, '["warga", "admin", "superadmin"]');

-- ============================================================================
-- TABLES: REPORTS & SCHEDULES
-- ============================================================================

-- ============================================================================
-- Table: report_schedules
-- Jadwal generate laporan otomatis
-- ============================================================================
CREATE TABLE report_schedules (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    name VARCHAR(255) NOT NULL,
    report_type VARCHAR(100) NOT NULL, -- daily_tickets, monthly_documents, etc
    schedule VARCHAR(100) NOT NULL, -- Cron expression: 0 9 * * *
    recipients JSON NOT NULL, -- Array email addresses dalam format JSON
    format VARCHAR(20) DEFAULT 'pdf', -- pdf, excel, csv
    is_active BOOLEAN DEFAULT TRUE,
    last_run_at TIMESTAMP NULL,
    next_run_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: report_cache
-- Cache untuk laporan yang sudah di-generate
-- ============================================================================
CREATE TABLE report_cache (
    id CHAR(36) PRIMARY KEY DEFAULT (uuid_v4()),
    report_type VARCHAR(100) NOT NULL,
    report_key VARCHAR(255) NOT NULL, -- Unique identifier untuk cache
    file_url VARCHAR(500),
    data JSON,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uk_type_key (report_type, report_key),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TRIGGERS & STORED PROCEDURES
-- ============================================================================

DELIMITER $$

-- Trigger: Generate ticket number
CREATE TRIGGER generate_ticket_number
BEFORE INSERT ON tickets
FOR EACH ROW
BEGIN
    DECLARE year_part VARCHAR(4);
    DECLARE sequence_num INT;

    SET year_part = YEAR(CURRENT_DATE);

    -- Get next sequence number for this year
    SELECT COALESCE(COUNT(*) + 1, 1) INTO sequence_num
    FROM tickets
    WHERE ticket_number LIKE CONCAT('PGD-', year_part, '-%');

    -- Format: PGD-YYYY-XXXX (4 digits, zero-padded)
    SET NEW.ticket_number = CONCAT('PGD-', year_part, '-', LPAD(sequence_num, 4, '0'));

    -- Set SLA deadline based on category
    IF NEW.sla_deadline IS NULL THEN
        SELECT sla_hours INTO @sla_hours
        FROM ticket_categories
        WHERE id = NEW.category_id;

        SET NEW.sla_deadline = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL COALESCE(@sla_hours, 168) HOUR);
    END IF;
END$$

-- Trigger: Generate document number
CREATE TRIGGER generate_document_number
BEFORE INSERT ON documents
FOR EACH ROW
BEGIN
    DECLARE year_part VARCHAR(4);
    DECLARE sequence_num INT;

    SET year_part = YEAR(CURRENT_DATE);

    -- Get next sequence number for this year
    SELECT COALESCE(COUNT(*) + 1, 1) INTO sequence_num
    FROM documents
    WHERE document_number LIKE CONCAT('ADM-', year_part, '-%');

    -- Format: ADM-YYYY-XXXX (4 digits, zero-padded)
    SET NEW.document_number = CONCAT('ADM-', year_part, '-', LPAD(sequence_num, 4, '0'));

    -- Set estimated completion date
    IF NEW.estimated_completion_date IS NULL THEN
        SELECT processing_days INTO @processing_days
        FROM document_types
        WHERE id = NEW.document_type_id;

        SET NEW.estimated_completion_date = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL COALESCE(@processing_days, 7) DAY);
    END IF;
END$$

-- Trigger: Generate forum post number
CREATE TRIGGER generate_forum_post_number
BEFORE INSERT ON forum_posts
FOR EACH ROW
BEGIN
    DECLARE year_part VARCHAR(4);
    DECLARE sequence_num INT;

    SET year_part = YEAR(CURRENT_DATE);

    -- Get next sequence number for this year
    SELECT COALESCE(COUNT(*) + 1, 1) INTO sequence_num
    FROM forum_posts
    WHERE post_number LIKE CONCAT('FRM-', year_part, '-%');

    -- Format: FRM-YYYY-XXXX (4 digits, zero-padded)
    SET NEW.post_number = CONCAT('FRM-', year_part, '-', LPAD(sequence_num, 4, '0'));
END$$

-- Trigger: Generate event number
CREATE TRIGGER generate_event_number
BEFORE INSERT ON events
FOR EACH ROW
BEGIN
    DECLARE year_part VARCHAR(4);
    DECLARE sequence_num INT;

    SET year_part = YEAR(CURRENT_DATE);

    -- Get next sequence number for this year
    SELECT COALESCE(COUNT(*) + 1, 1) INTO sequence_num
    FROM events
    WHERE event_number LIKE CONCAT('EVT-', year_part, '-%');

    -- Format: EVT-YYYY-XXXX (4 digits, zero-padded)
    SET NEW.event_number = CONCAT('EVT-', year_part, '-', LPAD(sequence_num, 4, '0'));
END$$

-- Trigger: Generate conversation number
CREATE TRIGGER generate_conversation_number
BEFORE INSERT ON conversations
FOR EACH ROW
BEGIN
    DECLARE year_part VARCHAR(4);
    DECLARE sequence_num INT;

    SET year_part = YEAR(CURRENT_DATE);

    -- Get next sequence number for this year
    SELECT COALESCE(COUNT(*) + 1, 1) INTO sequence_num
    FROM conversations
    WHERE conversation_number LIKE CONCAT('CON-', year_part, '-%');

    -- Format: CON-YYYY-XXXX (4 digits, zero-padded)
    SET NEW.conversation_number = CONCAT('CON-', year_part, '-', LPAD(sequence_num, 4, '0'));
END$$

-- Trigger: Update ticket support count
CREATE TRIGGER update_ticket_support_count
AFTER INSERT ON ticket_supports
FOR EACH ROW
BEGIN
    UPDATE tickets
    SET support_count = support_count + 1
    WHERE id = NEW.ticket_id;
END$$

-- Trigger: Update ticket support count on delete
CREATE TRIGGER update_ticket_support_count_delete
AFTER DELETE ON ticket_supports
FOR EACH ROW
BEGIN
    UPDATE tickets
    SET support_count = GREATEST(support_count - 1, 0)
    WHERE id = OLD.ticket_id;
END$$

-- Trigger: Update forum post like count
CREATE TRIGGER update_forum_post_like_count
AFTER INSERT ON forum_post_likes
FOR EACH ROW
BEGIN
    UPDATE forum_posts
    SET like_count = like_count + 1
    WHERE id = NEW.post_id;
END$$

-- Trigger: Update forum post like count on delete
CREATE TRIGGER update_forum_post_like_count_delete
AFTER DELETE ON forum_post_likes
FOR EACH ROW
BEGIN
    UPDATE forum_posts
    SET like_count = GREATEST(like_count - 1, 0)
    WHERE id = OLD.post_id;
END$$

DELIMITER ;

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View: User dengan role dan profil lengkap
CREATE OR REPLACE VIEW v_users_full AS
SELECT
    u.id,
    u.email,
    u.nik,
    u.phone,
    u.is_active,
    u.created_at,
    up.full_name,
    up.address,
    up.city,
    up.district,
    up.village,
    up.profile_photo_url,
    up.latitude,
    up.longitude,
    GROUP_CONCAT(ur.role SEPARATOR ',') AS roles
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN user_roles ur ON u.id = ur.user_id AND ur.is_active = TRUE
WHERE u.deleted_at IS NULL
GROUP BY u.id, up.id;

-- View: Tickets dengan detail lengkap
CREATE OR REPLACE VIEW v_tickets_full AS
SELECT
    t.id,
    t.ticket_number,
    t.user_id,
    up.full_name AS user_name,
    t.category_id,
    tc.display_name AS category_name,
    t.title,
    t.description,
    t.status,
    t.priority,
    t.location_address,
    t.latitude,
    t.longitude,
    t.assigned_to,
    assignee.full_name AS assigned_to_name,
    t.sla_deadline,
    t.resolution_notes,
    t.support_count,
    t.view_count,
    t.created_at
FROM tickets t
LEFT JOIN user_profiles up ON t.user_id = up.user_id
LEFT JOIN ticket_categories tc ON t.category_id = tc.id
LEFT JOIN user_profiles assignee ON t.assigned_to = assignee.user_id
WHERE t.deleted_at IS NULL;

-- View: Documents dengan detail lengkap
CREATE OR REPLACE VIEW v_documents_full AS
SELECT
    d.id,
    d.document_number,
    d.user_id,
    up.full_name AS user_name,
    d.document_type_id,
    dt.display_name AS document_type_name,
    d.status,
    d.applicant_name,
    d.applicant_nik,
    d.assigned_to,
    assignee.full_name AS assigned_to_name,
    d.estimated_completion_date,
    d.is_paid,
    d.payment_status,
    d.created_at
FROM documents d
LEFT JOIN user_profiles up ON d.user_id = up.user_id
LEFT JOIN document_types dt ON d.document_type_id = dt.id
LEFT JOIN user_profiles assignee ON d.assigned_to = assignee.user_id
WHERE d.deleted_at IS NULL;

-- View: Leaderboard poin
CREATE OR REPLACE VIEW v_leaderboard AS
SELECT
    up.user_id,
    p.full_name,
    p.profile_photo_url,
    COALESCE(up.total_points, 0) AS total_points,
    COALESCE(t.ticket_count, 0) AS ticket_count,
    COALESCE(f.post_count, 0) AS forum_post_count
FROM user_points up
LEFT JOIN user_profiles p ON up.user_id = p.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) AS ticket_count
    FROM tickets
    WHERE deleted_at IS NULL
    GROUP BY user_id
) t ON up.user_id = t.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) AS post_count
    FROM forum_posts
    WHERE deleted_at IS NULL
    GROUP BY user_id
) f ON up.user_id = f.user_id
ORDER BY total_points DESC;

-- ============================================================================
-- SEED DATA (DATA AWAL)
-- ============================================================================

-- Buat user superadmin default
-- Password: Admin123! (harus di-generate dengan bcrypt di application)
-- Ini hanya placeholder, di production gunakan password hash yang proper
INSERT INTO users (id, email, password_hash, is_active, email_verified_at) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@negeri.id', '$2y$10$placeholder_hash_generate_with_bcrypt', TRUE, NOW())
ON DUPLICATE KEY UPDATE email = email;

-- Insert profile untuk superadmin
INSERT INTO user_profiles (user_id, full_name, address) VALUES
('00000000-0000-0000-0000-000000000001', 'Super Administrator', 'Kantor Negeri')
ON DUPLICATE KEY UPDATE user_id = user_id;

-- Insert role superadmin
INSERT INTO user_roles (user_id, role) VALUES
('00000000-0000-0000-0000-000000000001', 'superadmin')
ON DUPLICATE KEY UPDATE user_id = user_id;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

-- Tampilkan pesan sukses
SELECT 'Database schema created successfully!' AS status,
       (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'singg_public_service' AND table_type = 'BASE TABLE') AS total_tables,
       (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'singg_public_service') AS total_views,
       (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'singg_public_service') AS total_triggers;
