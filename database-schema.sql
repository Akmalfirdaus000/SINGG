-- ============================================================================
-- SISTEM PELAYANAN PUBLIK & PENGADUAN MASYARAKAT
-- Skema Database Normalized (1NF-3NF)
-- Database: PostgreSQL
-- ============================================================================

-- Drop database jika exists (untuk development)
-- DROP DATABASE IF EXISTS singg_public_service;
-- CREATE DATABASE singg_public_service;

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Untuk full-text search

-- ============================================================================
-- SCHEMA
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS singg;
SET search_path TO singg, public;

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

-- User roles
CREATE TYPE user_role_enum AS ENUM (
    'superadmin',
    'admin',
    'verifikator',
    'petugas_lapangan',
    'warga'
);

-- Auth methods
CREATE TYPE auth_method_enum AS ENUM (
    'password',
    'otp_whatsapp',
    'otp_email',
    'magic_link',
    'google',
    'facebook'
);

-- Ticket statuses
CREATE TYPE ticket_status_enum AS ENUM (
    'draft',
    'pending_verification',
    'verified',
    'in_progress',
    'resolved',
    'closed',
    'rejected'
);

-- Ticket categories
CREATE TYPE ticket_category_enum AS ENUM (
    'infrastruktur',
    'kebersihan',
    'keamanan',
    'kesehatan',
    'pendidikan',
    'pelayanan_publik',
    'administrasi',
    'lainnya'
);

-- Ticket priorities
CREATE TYPE ticket_priority_enum AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
);

-- Document statuses
CREATE TYPE document_status_enum AS ENUM (
    'draft',
    'pending_verification',
    'verified',
    'in_review',
    'approved',
    'rejected',
    'completed',
    'expired'
);

-- Document types
CREATE TYPE document_type_enum AS ENUM (
    'surat_pengantar_rt',
    'surat_pengantar_rw',
    'surat_keterangan_domisili',
    'surat_keterangan_usaha',
    'surat_pengantar_skck',
    'surat_keterangan_tidak_mampu',
    'surat_keterangan_belum_menikah',
    'surat_keterangan_kematian',
    'surat_keterangan_kelahiran',
    'surat_pengantar_pembuatan_ktp',
    'surat_pengantar_pembuatan_kk',
    'lainnya'
);

-- Notification types
CREATE TYPE notification_type_enum AS ENUM (
    'email',
    'whatsapp',
    'sms',
    'push',
    'in_app'
);

-- Notification channels
CREATE TYPE notification_channel_enum AS ENUM (
    'email',
    'whatsapp',
    'sms',
    'push',
    'in_app'
);

-- Notification statuses
CREATE TYPE notification_status_enum AS ENUM (
    'pending',
    'sent',
    'delivered',
    'read',
    'failed'
);

-- Point transaction types
CREATE TYPE point_transaction_type_enum AS ENUM (
    'earned',
    'redeemed',
    'expired',
    'adjusted'
);

-- Badge types
CREATE TYPE badge_type_enum AS ENUM (
    'first_complaint',
    'active_citizen',
    'photographer',
    'contributor',
    'helper',
    'verified_user',
    'top_reviewer',
    'early_adopter'
);

-- Comment types
CREATE TYPE comment_type_enum AS ENUM (
    'ticket',
    'document',
    'forum',
    'announcement'
);

-- Post types (forum)
CREATE TYPE post_type_enum AS ENUM (
    'discussion',
    'question',
    'suggestion',
    'announcement',
    'poll'
);

-- Post statuses
CREATE TYPE post_status_enum AS ENUM (
    'draft',
    'published',
    'archived',
    'locked'
);

-- Event statuses
CREATE TYPE event_status_enum AS ENUM (
    'upcoming',
    'ongoing',
    'completed',
    'cancelled'
);

-- Event types
CREATE TYPE event_type_enum AS ENUM (
    'gotong_royong',
    'rapat',
    'sosialisasi',
    'pelatihan',
    'lainnya'
);

-- Message statuses
CREATE TYPE message_status_enum AS ENUM (
    'sent',
    'delivered',
    'read',
    'deleted'
);

-- Audit action types
CREATE TYPE audit_action_enum AS ENUM (
    'create',
    'read',
    'update',
    'delete',
    'login',
    'logout',
    'download',
    'upload',
    'approve',
    'reject'
);

-- ============================================================================
-- TABLES: AUTHENTICATION & USER MANAGEMENT
-- ============================================================================

-- ============================================================================
-- Table: users
-- Menyimpan data user dasar
-- Normalisasi: 1NF (atomic values), 2NF (no partial dependencies), 3NF (no transitive dependencies)
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    nik VARCHAR(16) UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255),
    auth_method auth_method_enum DEFAULT 'password',
    email_verified_at TIMESTAMP WITH TIME ZONE,
    phone_verified_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    must_change_password BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_nik ON users(nik) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_phone ON users(phone) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_is_active ON users(is_active) WHERE deleted_at IS NULL;

-- ============================================================================
-- Table: user_profiles
-- Menyimpan profil lengkap user (dipisah untuk 3NF)
-- ============================================================================
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_user_profiles_user_id UNIQUE(user_id)
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_full_name ON user_profiles(full_name);
CREATE INDEX idx_user_profiles_location ON user_profiles(city, district);

-- ============================================================================
-- Table: user_roles
-- Many-to-many relationship antara users dan roles
-- ============================================================================
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role user_role_enum NOT NULL,
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,

    CONSTRAINT uk_user_roles_user_role UNIQUE(user_id, role)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);
CREATE INDEX idx_user_roles_is_active ON user_roles(is_active);

-- ============================================================================
-- Table: user_preferences
-- Preferensi user (notifikasi, tampilan, dll)
-- ============================================================================
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    language VARCHAR(10) DEFAULT 'id',
    theme VARCHAR(20) DEFAULT 'light', -- light, dark, auto
    timezone VARCHAR(50) DEFAULT 'Asia/Jakarta',
    notification_email BOOLEAN DEFAULT TRUE,
    notification_whatsapp BOOLEAN DEFAULT TRUE,
    notification_sms BOOLEAN DEFAULT FALSE,
    notification_push BOOLEAN DEFAULT TRUE,
    newsletter_subscription BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_user_preferences_user_id UNIQUE(user_id)
);

-- ============================================================================
-- Table: refresh_tokens
-- Untuk JWT refresh token management
-- ============================================================================
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoked_by UUID REFERENCES users(id),
    device_info VARCHAR(255),
    ip_address INET
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- ============================================================================
-- Table: password_resets
-- Untuk reset password flow
-- ============================================================================
CREATE TABLE password_resets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_password_resets_user_id ON password_resets(user_id);
CREATE INDEX idx_password_resets_token ON password_resets(token);
CREATE INDEX idx_password_resets_expires_at ON password_resets(expires_at);

-- ============================================================================
-- TABLES: TICKETS / PENGADUAN
-- ============================================================================

-- ============================================================================
-- Table: ticket_categories
-- Master kategori pengaduan
-- ============================================================================
CREATE TABLE ticket_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name ticket_category_enum NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20), -- Hex color code
    sla_hours INT DEFAULT 168, -- SLA dalam jam (default 7 hari)
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(50) UNIQUE NOT NULL, -- Format: PGD-YYYY-XXXX
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES ticket_categories(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ticket_status_enum DEFAULT 'pending_verification',
    priority ticket_priority_enum DEFAULT 'medium',

    -- Lokasi kejadian
    location_address TEXT,
    location_district VARCHAR(100),
    location_village VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    -- Assigned to
    assigned_to UUID REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE,

    -- SLA
    sla_deadline TIMESTAMP WITH TIME ZONE,
    sla_breach BOOLEAN DEFAULT FALSE,
    sla_breach_notified BOOLEAN DEFAULT FALSE,

    -- Resolution
    resolution_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES users(id),

    -- Statistics
    view_count INT DEFAULT 0,
    support_count INT DEFAULT 0, -- Jumlah warga yang mendukung

    -- Metadata
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE, -- Bisa dilihat publik atau tidak
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_tickets_user_id ON tickets(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_tickets_ticket_number ON tickets(ticket_number);
CREATE INDEX idx_tickets_status ON tickets(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_tickets_category_id ON tickets(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to) WHERE deleted_at IS NULL;
CREATE INDEX idx_tickets_created_at ON tickets(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_tickets_sla_deadline ON tickets(sla_deadline) WHERE status NOT IN ('resolved', 'closed', 'rejected');
CREATE INDEX idx_tickets_location ON tickets(latitude, longitude) WHERE deleted_at IS NULL;

-- Full-text search index
CREATE INDEX idx_tickets_fulltext ON tickets USING gin(
    to_tsvector('indonesian', COALESCE(title, '') || ' ' || COALESCE(description, ''))
);

-- ============================================================================
-- Table: ticket_attachments
-- Lampiran foto/video/dokumen pada pengaduan
-- ============================================================================
CREATE TABLE ticket_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- image/jpeg, video/mp4, application/pdf
    file_size BIGINT NOT NULL, -- dalam bytes
    uploaded_by UUID NOT NULL REFERENCES users(id),
    is_primary BOOLEAN DEFAULT FALSE, -- Foto utama
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ticket_attachments_ticket_id ON ticket_attachments(ticket_id);
CREATE INDEX idx_ticket_attachments_uploaded_by ON ticket_attachments(uploaded_by);

-- ============================================================================
-- Table: ticket_comments
-- Komentar dan diskusi pada pengaduan
-- ============================================================================
CREATE TABLE ticket_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    comment_type comment_type_enum DEFAULT 'ticket',
    parent_id UUID REFERENCES ticket_comments(id), -- Untuk nested comments
    is_internal BOOLEAN DEFAULT FALSE, -- Komentar internal (hanya admin)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_ticket_comments_ticket_id ON ticket_comments(ticket_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_ticket_comments_user_id ON ticket_comments(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_ticket_comments_parent_id ON ticket_comments(parent_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_ticket_comments_created_at ON ticket_comments(created_at DESC);

-- ============================================================================
-- Table: ticket_history
-- Riwayat perubahan status pengaduan (Audit trail)
-- ============================================================================
CREATE TABLE ticket_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    old_status ticket_status_enum,
    new_status ticket_status_enum NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ticket_history_ticket_id ON ticket_history(ticket_id);
CREATE INDEX idx_ticket_history_created_at ON ticket_history(created_at DESC);

-- ============================================================================
-- Table: ticket_supports
-- Warga yang mendukung pengaduan (seperti like/upvote)
-- ============================================================================
CREATE TABLE ticket_supports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_ticket_supports_ticket_user UNIQUE(ticket_id, user_id)
);

CREATE INDEX idx_ticket_supports_ticket_id ON ticket_supports(ticket_id);
CREATE INDEX idx_ticket_supports_user_id ON ticket_supports(user_id);

-- ============================================================================
-- Table: ticket_ratings
-- Rating user setelah pengaduan selesai
-- ============================================================================
CREATE TABLE ticket_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    admin_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_ticket_ratings_ticket_user UNIQUE(ticket_id, user_id)
);

CREATE INDEX idx_ticket_ratings_ticket_id ON ticket_ratings(ticket_id);
CREATE INDEX idx_ticket_ratings_user_id ON ticket_ratings(user_id);

-- ============================================================================
-- TABLES: DOCUMENTS / LAYANAN ADMINISTRASI
-- ============================================================================

-- ============================================================================
-- Table: document_types
-- Master jenis dokumen/administrasi
-- ============================================================================
CREATE TABLE document_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name document_type_enum NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    requirements TEXT[], -- Array persyaratan dokumen
    fee DECIMAL(12, 2) DEFAULT 0, -- Biaya (jika ada)
    processing_days INT DEFAULT 7, -- Estimasi hari proses
    is_active BOOLEAN DEFAULT TRUE,
    requires_verification BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default document types
INSERT INTO document_types (name, display_name, description, requirements, fee, processing_days, sort_order) VALUES
('surat_pengantar_rt', 'Surat Pengantar RT', 'Surat pengantar dari Ketua RT', ARRAY['Foto KTP', 'Foto KK', 'Pas Foto'], 0, 1, 1),
('surat_pengantar_rw', 'Surat Pengantar RW', 'Surat pengantar dari Ketua RW', ARRAY['Foto KTP', 'Foto KK', 'Surat Pengantar RT'], 0, 2, 2),
('surat_keterangan_domisili', 'Surat Keterangan Domisili', 'Surat keterangan tempat tinggal', ARRAY['Foto KTP', 'Foto KK', 'Surat Pengantar RT/RW'], 0, 3, 3),
('surat_keterangan_usaha', 'Surat Keterangan Usaha', 'Surat keterangan usaha/niaga', ARRAY['Foto KTP', 'Foto KK', 'Bukti usaha'], 0, 3, 4),
('surat_pengantar_skck', 'Surat Pengantar SKCK', 'Surat pengantar pembuatan SKCK', ARRAY['Foto KTP', 'Foto KK', 'Surat Pengantar RT/RW'], 0, 1, 5),
('surat_keterangan_tidak_mampu', 'Surat Keterangan Tidak Mampu', 'Surat keterangan tidak mampu (SKTM)', ARRAY['Foto KTP', 'Foto KK', 'Surat Pengantar RT/RW', 'Penghasilan orang tua'], 0, 5, 6),
('surat_keterangan_belum_menikah', 'Surat Keterangan Belum Menikah', 'Surat keterangan belum menikah', ARRAY['Foto KTP', 'Foto KK', 'Surat Pengantar RT/RW'], 0, 2, 7),
('surat_keterangan_kematian', 'Surat Keterangan Kematian', 'Surat keterangan kematian', ARRAY['Foto KTP pelapor', 'Surat keterangan RS', 'Surat Pengantar RT/RW'], 0, 2, 8),
('surat_keterangan_kelahiran', 'Surat Keterangan Kelahiran', 'Surat keterangan kelahiran', ARRAY['Foto KTP ortu', 'Surat bidan/rs', 'Surat Pengantar RT/RW', 'KK'], 0, 2, 9),
('surat_pengantar_pembuatan_ktp', 'Surat Pengantar Pembuatan KTP', 'Surat pengantar pembuatan KTP baru', ARRAY['Foto KK', 'Surat Pengantar RT/RW'], 0, 1, 10),
('surat_pengantar_pembuatan_kk', 'Surat Pengantar Pembuatan KK', 'Surat pengantar pembuatan KK', ARRAY['Foto KTP', 'Surat Pengantar RT/RW'], 0, 1, 11);

-- ============================================================================
-- Table: document_templates
-- Template dokumen untuk generate otomatis
-- ============================================================================
CREATE TABLE document_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_type_id UUID NOT NULL REFERENCES document_types(id),
    name VARCHAR(255) NOT NULL,
    template_content TEXT NOT NULL, -- HTML template atau format lain
    variables JSONB, -- Variables yang bisa diganti ({{nama}}, {{nik}}, dll)
    is_active BOOLEAN DEFAULT TRUE,
    version INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Table: documents
-- Permohonan dokumen/administrasi
-- ============================================================================
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_number VARCHAR(50) UNIQUE NOT NULL, -- Format: ADM-YYYY-XXXX
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_type_id UUID NOT NULL REFERENCES document_types(id),
    status document_status_enum DEFAULT 'pending_verification',

    -- Data pemohon (diambil dari profil tapi bisa berbeda)
    applicant_name VARCHAR(255) NOT NULL,
    applicant_nik VARCHAR(16) NOT NULL,
    applicant_address TEXT NOT NULL,
    applicant_phone VARCHAR(20),

    -- Data spesifik dokumen (flexible data)
    form_data JSONB, -- Data form dinamis tergantung jenis dokumen

    -- Assigned to
    assigned_to UUID REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE,

    -- Verification & Approval
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    verification_notes TEXT,

    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    approval_notes TEXT,

    rejected_by UUID REFERENCES users(id),
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,

    -- Document output
    generated_document_url VARCHAR(500),
    generated_at TIMESTAMP WITH TIME ZONE,

    -- Processing
    processing_days INT,
    estimated_completion_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Payment (jika ada biaya)
    is_paid BOOLEAN DEFAULT FALSE,
    payment_amount DECIMAL(12, 2),
    payment_status VARCHAR(50), -- pending, paid, failed, refunded
    payment_date TIMESTAMP WITH TIME ZONE,

    -- Metadata
    is_expedited BOOLEAN DEFAULT FALSE, -- Proses kilat
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_documents_user_id ON documents(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_document_number ON documents(document_number);
CREATE INDEX idx_documents_status ON documents(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_document_type_id ON documents(document_type_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_assigned_to ON documents(assigned_to) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_created_at ON documents(created_at DESC) WHERE deleted_at IS NULL;

-- ============================================================================
-- Table: document_attachments
-- Lampiran dokumen persyaratan
-- ============================================================================
CREATE TABLE document_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT NOT NULL,
    requirement_name VARCHAR(255), -- Nama persyaratan (mis: "Foto KTP")
    uploaded_by UUID NOT NULL REFERENCES users(id),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_document_attachments_document_id ON document_attachments(document_id);
CREATE INDEX idx_document_attachments_uploaded_by ON document_attachments(uploaded_by);

-- ============================================================================
-- Table: document_approvals
-- Workflow approval berjenjang
-- ============================================================================
CREATE TABLE document_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    approver_id UUID NOT NULL REFERENCES users(id),
    approval_level INT NOT NULL, -- 1: verifikator, 2: supervisor, 3: lurah, dst
    status VARCHAR(50) NOT NULL, -- pending, approved, rejected
    notes TEXT,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_document_approvals_doc_level UNIQUE(document_id, approval_level)
);

CREATE INDEX idx_document_approvals_document_id ON document_approvals(document_id);
CREATE INDEX idx_document_approvals_approver_id ON document_approvals(approver_id);

-- ============================================================================
-- Table: document_history
-- Riwayat perubahan status dokumen
-- ============================================================================
CREATE TABLE document_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    old_status document_status_enum,
    new_status document_status_enum NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_document_history_document_id ON document_history(document_id);
CREATE INDEX idx_document_history_created_at ON document_history(created_at DESC);

-- ============================================================================
-- TABLES: NOTIFICATIONS
-- ============================================================================

-- ============================================================================
-- Table: notification_templates
-- Template notifikasi
-- ============================================================================
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    type notification_type_enum NOT NULL,
    subject_template VARCHAR(500),
    body_template TEXT NOT NULL,
    variables JSONB, -- Variables yang bisa digunakan
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Table: notifications
-- Notifikasi yang akan dikirim ke user
-- ============================================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES notification_templates(id),
    type notification_type_enum NOT NULL,
    channels notification_channel_enum[] NOT NULL, -- Array channels: {email, whatsapp, push}
    subject VARCHAR(500),
    content TEXT NOT NULL,
    data JSONB, -- Additional data (link, ticket_number, dll)

    -- Status per channel
    email_status notification_status_enum DEFAULT 'pending',
    email_sent_at TIMESTAMP WITH TIME ZONE,
    whatsapp_status notification_status_enum DEFAULT 'pending',
    whatsapp_sent_at TIMESTAMP WITH TIME ZONE,
    sms_status notification_status_enum DEFAULT 'pending',
    sms_sent_at TIMESTAMP WITH TIME ZONE,
    push_status notification_status_enum DEFAULT 'pending',
    push_sent_at TIMESTAMP WITH TIME ZONE,

    -- Overall status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    priority INT DEFAULT 0, -- 0: normal, 1: high, 2: urgent
    scheduled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP WITH TIME ZONE,

    -- Retry logic
    retry_count INT DEFAULT 0,
    last_retry_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_scheduled_at ON notifications(scheduled_at) WHERE scheduled_at IS NOT NULL;

-- ============================================================================
-- TABLES: GAMIFICATION (POINTS, BADGES, LEADERBOARD)
-- ============================================================================

-- ============================================================================
-- Table: point_rules
-- Aturan perolehan poin
-- ============================================================================
CREATE TABLE point_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    action VARCHAR(100) NOT NULL, -- create_ticket, upload_photo, rate_ticket, dll
    points INT NOT NULL,
    max_per_day INT, -- Maksimal poin per hari untuk action ini
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_points INT DEFAULT 0,
    available_points INT DEFAULT 0, -- Poin yang bisa ditukar (expired points tidak termasuk)
    earned_points INT DEFAULT 0, -- Total poin yang pernah didapat
    redeemed_points INT DEFAULT 0, -- Total poin yang sudah ditukar
    expired_points INT DEFAULT 0, -- Total poin yang expired
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_user_points_user_id UNIQUE(user_id)
);

CREATE INDEX idx_user_points_user_id ON user_points(user_id);
CREATE INDEX idx_user_points_total_points ON user_points(total_points DESC);

-- ============================================================================
-- Table: point_transactions
-- Riwayat transaksi poin
-- ============================================================================
CREATE TABLE point_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    point_rule_id UUID REFERENCES point_rules(id),
    transaction_type point_transaction_type_enum NOT NULL,
    points INT NOT NULL, -- Positif untuk earned, negatif untuk redeemed
    balance_after INT NOT NULL, -- Saldo setelah transaksi
    description TEXT NOT NULL,
    reference_type VARCHAR(50), -- ticket, document, forum, dll
    reference_id UUID, -- ID dari reference
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_point_transactions_user_id ON point_transactions(user_id);
CREATE INDEX idx_point_transactions_created_at ON point_transactions(created_at DESC);
CREATE INDEX idx_point_transactions_reference ON point_transactions(reference_type, reference_id);

-- ============================================================================
-- Table: badges
-- Master badge/pencapaian
-- ============================================================================
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    badge_type badge_type_enum NOT NULL,
    icon_url VARCHAR(500),
    requirement JSONB NOT NULL, -- Aturan untuk dapat badge (mis: {"complaints": 10})
    points_reward INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_user_badges_user_badge UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge_id ON user_badges(badge_id);

-- ============================================================================
-- TABLES: FORUM & COMMUNITY
-- ============================================================================

-- ============================================================================
-- Table: forum_categories
-- Kategori forum
-- ============================================================================
CREATE TABLE forum_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_number VARCHAR(50) UNIQUE NOT NULL, -- Format: FRM-YYYY-XXXX
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES forum_categories(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    post_type post_type_enum DEFAULT 'discussion',
    status post_status_enum DEFAULT 'published',

    -- Poll data (jika post_type = poll)
    poll_options JSONB, -- Array opsi: ["Option 1", "Option 2", ...]
    poll_expires_at TIMESTAMP WITH TIME ZONE,
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
    tags VARCHAR(500)[], -- Array tags

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_forum_posts_user_id ON forum_posts(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_forum_posts_category_id ON forum_posts(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_forum_posts_status ON forum_posts(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_forum_posts_created_at ON forum_posts(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_forum_posts_is_pinned ON forum_posts(is_pinned) WHERE is_pinned = TRUE;

-- Full-text search
CREATE INDEX idx_forum_posts_fulltext ON forum_posts USING gin(
    to_tsvector('indonesian', COALESCE(title, '') || ' ' || COALESCE(content, ''))
);

-- ============================================================================
-- Table: forum_comments
-- Komentar pada postingan forum
-- ============================================================================
CREATE TABLE forum_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES forum_comments(id), -- Untuk nested comments
    content TEXT NOT NULL,
    like_count INT DEFAULT 0,

    -- Statistics
    is_answer BOOLEAN DEFAULT FALSE, -- Jika comment adalah jawaban yang diterima

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_forum_comments_post_id ON forum_comments(post_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_forum_comments_user_id ON forum_comments(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_forum_comments_parent_id ON forum_comments(parent_id) WHERE deleted_at IS NULL;

-- ============================================================================
-- Table: forum_post_likes
-- Like pada postingan forum
-- ============================================================================
CREATE TABLE forum_post_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_forum_post_likes_post_user UNIQUE(post_id, user_id)
);

CREATE INDEX idx_forum_post_likes_post_id ON forum_post_likes(post_id);
CREATE INDEX idx_forum_post_likes_user_id ON forum_post_likes(user_id);

-- ============================================================================
-- Table: forum_comment_likes
-- Like pada komentar forum
-- ============================================================================
CREATE TABLE forum_comment_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comment_id UUID NOT NULL REFERENCES forum_comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_forum_comment_likes_comment_user UNIQUE(comment_id, user_id)
);

-- ============================================================================
-- Table: forum_poll_votes
-- Voting pada poll
-- ============================================================================
CREATE TABLE forum_poll_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    option_index INT NOT NULL, -- Index dari array poll_options
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_forum_poll_votes_post_user UNIQUE(post_id, user_id)
);

-- ============================================================================
-- TABLES: MESSAGES / CHAT
-- ============================================================================

-- ============================================================================
-- Table: conversations
-- Percakapan antara user dan admin
-- ============================================================================
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_number VARCHAR(50) UNIQUE NOT NULL, -- Format: CON-YYYY-XXXX
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES users(id), -- Admin yang handle

    -- Metadata
    subject VARCHAR(255),
    status VARCHAR(50) DEFAULT 'open', -- open, pending, closed, archived

    -- Statistics
    message_count INT DEFAULT 0,
    last_message_at TIMESTAMP WITH TIME ZONE,

    -- Assignment
    assigned_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,
    closed_by UUID REFERENCES users(id),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_admin_id ON conversations(admin_id);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at DESC);

-- ============================================================================
-- Table: messages
-- Pesan dalam percakapan
-- ============================================================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    receiver_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    message_status message_status_enum DEFAULT 'sent',

    -- Attachments
    attachment_url VARCHAR(500),
    attachment_type VARCHAR(50),

    -- Reply to
    reply_to_id UUID REFERENCES messages(id),

    -- Read status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_is_read ON messages(is_read) WHERE is_read = FALSE;
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- ============================================================================
-- TABLES: EVENTS
-- ============================================================================

-- ============================================================================
-- Table: events
-- Event/kegiatan negeri
-- ============================================================================
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_number VARCHAR(50) UNIQUE NOT NULL, -- Format: EVT-YYYY-XXXX
    created_by UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    event_type event_type_enum NOT NULL,
    status event_status_enum DEFAULT 'upcoming',

    -- Waktu & Lokasi
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    location_name VARCHAR(255),
    location_address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    -- Registration
    requires_registration BOOLEAN DEFAULT FALSE,
    max_participants INT,
    registration_deadline TIMESTAMP WITH TIME ZONE,

    -- Cover image
    cover_image_url VARCHAR(500),

    -- Statistics
    view_count INT DEFAULT 0,
    participant_count INT DEFAULT 0,
    interested_count INT DEFAULT 0,

    -- Tags
    tags VARCHAR(500)[],

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_events_created_by ON events(created_by) WHERE deleted_at IS NULL;
CREATE INDEX idx_events_status ON events(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_events_start_date ON events(start_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_events_event_type ON events(event_type) WHERE deleted_at IS NULL;

-- ============================================================================
-- Table: event_registrations
-- Pendaftaran peserta event
-- ============================================================================
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'registered', -- registered, confirmed, cancelled, attended

    -- Additional data
    notes TEXT,
    qr_code VARCHAR(255), -- QR code untuk check-in

    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    attended_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT uk_event_registrations_event_user UNIQUE(event_id, user_id)
);

CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX idx_event_registrations_status ON event_registrations(status);

-- ============================================================================
-- Table: event_interests
-- User yang interested tapi belum register
-- ============================================================================
CREATE TABLE event_interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_event_interests_event_user UNIQUE(event_id, user_id)
);

-- ============================================================================
-- TABLES: ANNOUNCEMENTS
-- ============================================================================

-- ============================================================================
-- Table: announcements
-- Pengumuman resmi dari negeri
-- ============================================================================
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_by UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    announcement_type VARCHAR(50) DEFAULT 'general', -- general, urgent, maintenance, event

    -- Targeting
    target_role user_role_enum, -- Null = all users

    -- Priority
    is_urgent BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,

    -- Scheduling
    publish_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expire_at TIMESTAMP WITH TIME ZONE,

    -- Statistics
    view_count INT DEFAULT 0,
    read_count INT DEFAULT 0,

    -- Attachment
    attachment_url VARCHAR(500),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_announcements_created_by ON announcements(created_by) WHERE deleted_at IS NULL;
CREATE INDEX idx_announcements_publish_at ON announcements(publish_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_announcements_is_pinned ON announcements(is_pinned) WHERE is_pinned = TRUE;

-- ============================================================================
-- Table: announcement_reads
-- Track pengumuman yang sudah dibaca user
-- ============================================================================
CREATE TABLE announcement_reads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_announcement_reads_announcement_user UNIQUE(announcement_id, user_id)
);

-- ============================================================================
-- TABLES: AUDIT LOGS & ANALYTICS
-- ============================================================================

-- ============================================================================
-- Table: audit_logs
-- Log aktivitas user untuk security dan compliance
-- ============================================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action audit_action_enum NOT NULL,
    entity_type VARCHAR(100), -- ticket, document, user, dll
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Partitioning untuk performance (opsional, untuk data besar)
-- CREATE TABLE audit_logs_y2024 PARTITION OF audit_logs FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- ============================================================================
-- Table: analytics_events
-- Event tracking untuk analytics
-- ============================================================================
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    event_name VARCHAR(255) NOT NULL,
    event_properties JSONB,
    page_url VARCHAR(500),
    referrer_url VARCHAR(500),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- Partitioning untuk performance
-- CREATE TABLE analytics_events_y2024 PARTITION OF analytics_events FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- ============================================================================
-- TABLES: SYSTEM CONFIGURATION
-- ============================================================================

-- ============================================================================
-- Table: system_settings
-- Pengaturan sistem
-- ============================================================================
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    value_type VARCHAR(50) DEFAULT 'string', -- string, number, boolean, json
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE, -- Bisa diakses oleh user
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO system_settings (key, value, value_type, description, is_public) VALUES
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    is_enabled BOOLEAN DEFAULT FALSE,
    enabled_for_roles user_role_enum[], -- Array roles yang dapat akses
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default feature flags
INSERT INTO feature_flags (name, description, is_enabled, enabled_for_roles) VALUES
('forum', 'Fitur Forum Diskusi', TRUE, ARRAY['warga', 'admin', 'superadmin']::user_role_enum[]),
('events', 'Fitur Event & Kegiatan', TRUE, ARRAY['warga', 'admin', 'superadmin']::user_role_enum[]),
('gamification', 'Fitur Gamifikasi (Poin & Badge)', TRUE, ARRAY['warga', 'admin', 'superadmin']::user_role_enum[]),
('dark_mode', 'Tema Dark Mode', TRUE, ARRAY['warga', 'admin', 'superadmin']::user_role_enum[]),
('mobile_app', 'Akses via Mobile App', FALSE, ARRAY['warga', 'admin', 'superadmin']::user_role_enum[]);

-- ============================================================================
-- TABLES: REPORTS & SCHEDULES
-- ============================================================================

-- ============================================================================
-- Table: report_schedules
-- Jadwal generate laporan otomatis
-- ============================================================================
CREATE TABLE report_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    report_type VARCHAR(100) NOT NULL, -- daily_tickets, monthly_documents, etc
    schedule VARCHAR(100) NOT NULL, -- Cron expression: 0 9 * * *
    recipients VARCHAR(500)[] NOT NULL, -- Array email addresses
    format VARCHAR(20) DEFAULT 'pdf', -- pdf, excel, csv
    is_active BOOLEAN DEFAULT TRUE,
    last_run_at TIMESTAMP WITH TIME ZONE,
    next_run_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Table: report_cache
-- Cache untuk laporan yang sudah di-generate
-- ============================================================================
CREATE TABLE report_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type VARCHAR(100) NOT NULL,
    report_key VARCHAR(255) NOT NULL, -- Unique identifier untuk cache
    file_url VARCHAR(500),
    data JSONB,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_report_cache_type_key UNIQUE(report_type, report_key)
);

CREATE INDEX idx_report_cache_expires_at ON report_cache(expires_at);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Apply updated_at to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ticket_categories_updated_at BEFORE UPDATE ON ticket_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ticket_comments_updated_at BEFORE UPDATE ON ticket_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_types_updated_at BEFORE UPDATE ON document_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_point_rules_updated_at BEFORE UPDATE ON point_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_points_updated_at BEFORE UPDATE ON user_points
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_badges_updated_at BEFORE UPDATE ON badges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_categories_updated_at BEFORE UPDATE ON forum_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON forum_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_comments_updated_at BEFORE UPDATE ON forum_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON feature_flags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_report_schedules_updated_at BEFORE UPDATE ON report_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
DECLARE
    year_part VARCHAR(4);
    sequence_num INT;
    new_number VARCHAR(50);
BEGIN
    year_part := TO_CHAR(CURRENT_DATE, 'YYYY');

    -- Get next sequence number for this year
    SELECT COALESCE(COUNT(*) + 1, 1) INTO sequence_num
    FROM tickets
    WHERE ticket_number LIKE 'PGD-' || year_part || '-%';

    -- Format: PGD-YYYY-XXXX (4 digits, zero-padded)
    new_number := 'PGD-' || year_part || '-' || LPAD(sequence_num::TEXT, 4, '0');

    NEW.ticket_number := new_number;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-generate ticket number
CREATE TRIGGER generate_ticket_number_trigger
    BEFORE INSERT ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION generate_ticket_number();

-- Function: Generate document number
CREATE OR REPLACE FUNCTION generate_document_number()
RETURNS TRIGGER AS $$
DECLARE
    year_part VARCHAR(4);
    sequence_num INT;
    new_number VARCHAR(50);
BEGIN
    year_part := TO_CHAR(CURRENT_DATE, 'YYYY');

    -- Get next sequence number for this year
    SELECT COALESCE(COUNT(*) + 1, 1) INTO sequence_num
    FROM documents
    WHERE document_number LIKE 'ADM-' || year_part || '-%';

    -- Format: ADM-YYYY-XXXX (4 digits, zero-padded)
    new_number := 'ADM-' || year_part || '-' || LPAD(sequence_num::TEXT, 4, '0');

    NEW.document_number := new_number;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-generate document number
CREATE TRIGGER generate_document_number_trigger
    BEFORE INSERT ON documents
    FOR EACH ROW
    EXECUTE FUNCTION generate_document_number();

-- Function: Generate forum post number
CREATE OR REPLACE FUNCTION generate_forum_post_number()
RETURNS TRIGGER AS $$
DECLARE
    year_part VARCHAR(4);
    sequence_num INT;
    new_number VARCHAR(50);
BEGIN
    year_part := TO_CHAR(CURRENT_DATE, 'YYYY');

    -- Get next sequence number for this year
    SELECT COALESCE(COUNT(*) + 1, 1) INTO sequence_num
    FROM forum_posts
    WHERE post_number LIKE 'FRM-' || year_part || '-%';

    -- Format: FRM-YYYY-XXXX (4 digits, zero-padded)
    new_number := 'FRM-' || year_part || '-' || LPAD(sequence_num::TEXT, 4, '0');

    NEW.post_number := new_number;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-generate forum post number
CREATE TRIGGER generate_forum_post_number_trigger
    BEFORE INSERT ON forum_posts
    FOR EACH ROW
    EXECUTE FUNCTION generate_forum_post_number();

-- Function: Generate event number
CREATE OR REPLACE FUNCTION generate_event_number()
RETURNS TRIGGER AS $$
DECLARE
    year_part VARCHAR(4);
    sequence_num INT;
    new_number VARCHAR(50);
BEGIN
    year_part := TO_CHAR(CURRENT_DATE, 'YYYY');

    -- Get next sequence number for this year
    SELECT COALESCE(COUNT(*) + 1, 1) INTO sequence_num
    FROM events
    WHERE event_number LIKE 'EVT-' || year_part || '-%';

    -- Format: EVT-YYYY-XXXX (4 digits, zero-padded)
    new_number := 'EVT-' || year_part || '-' || LPAD(sequence_num::TEXT, 4, '0');

    NEW.event_number := new_number;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-generate event number
CREATE TRIGGER generate_event_number_trigger
    BEFORE INSERT ON events
    FOR EACH ROW
    EXECUTE FUNCTION generate_event_number();

-- Function: Generate conversation number
CREATE OR REPLACE FUNCTION generate_conversation_number()
RETURNS TRIGGER AS $$
DECLARE
    year_part VARCHAR(4);
    sequence_num INT;
    new_number VARCHAR(50);
BEGIN
    year_part := TO_CHAR(CURRENT_DATE, 'YYYY');

    -- Get next sequence number for this year
    SELECT COALESCE(COUNT(*) + 1, 1) INTO sequence_num
    FROM conversations
    WHERE conversation_number LIKE 'CON-' || year_part || '-%';

    -- Format: CON-YYYY-XXXX (4 digits, zero-padded)
    new_number := 'CON-' || year_part || '-' || LPAD(sequence_num::TEXT, 4, '0');

    NEW.conversation_number := new_number;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-generate conversation number
CREATE TRIGGER generate_conversation_number_trigger
    BEFORE INSERT ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION generate_conversation_number();

-- ============================================================================
-- VIEWS (untuk query yang sering digunakan)
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
    ARRAY_AGG(ur.role) FILTER (WHERE ur.is_active = TRUE) AS roles,
    up.latitude,
    up.longitude
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN user_roles ur ON u.id = ur.user_id
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
    up.full_name,
    up.profile_photo_url,
    COALESCE(up.total_points, 0) AS total_points,
    COALESCE(t.ticket_count, 0) AS ticket_count,
    COALESCE(f.post_count, 0) AS forum_post_count,
    ROW_NUMBER() OVER (ORDER BY COALESCE(up.total_points, 0) DESC) AS rank
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
-- COMMENTS & DOCUMENTATION
-- ============================================================================

COMMENT ON DATABASE singg_public_service IS 'Sistem Pelayanan Publik & Pengaduan Masyarakat - Database';

COMMENT ON TABLE users IS 'Tabel utama user - menyimpan data autentikasi user';
COMMENT ON TABLE user_profiles IS 'Profil lengkap user - dipisah untuk 3NF';
COMMENT ON TABLE user_roles IS 'Role user (many-to-many)';
COMMENT ON TABLE tickets IS 'Pengaduan masyarakat';
COMMENT ON TABLE ticket_categories IS 'Kategori pengaduan (master)';
COMMENT ON TABLE documents IS 'Permohonan dokumen/administrasi';
COMMENT ON TABLE document_types IS 'Jenis dokumen (master)';
COMMENT ON TABLE notifications IS 'Notifikasi ke user';
COMMENT ON TABLE user_points IS 'Saldo poin user untuk gamification';
COMMENT ON TABLE badges IS 'Master badge/pencapaian';
COMMENT ON TABLE forum_posts IS 'Postingan forum komunitas';
COMMENT ON TABLE events IS 'Event/kegiatan negeri';
COMMENT ON TABLE audit_logs IS 'Log aktivitas user untuk audit';

-- ============================================================================
-- SEED DATA (DATA AWAL)
-- ============================================================================

-- Buat user superadmin default (password: Admin123!)
-- Password hash di-generate dengan bcrypt (ini hanya contoh, di production harus di-generate dengan benar)
INSERT INTO users (id, email, password_hash, is_active, email_verified_at) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@negeri.id', '$2b$10$YourBcryptHashHere', TRUE, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Insert profile untuk superadmin
INSERT INTO user_profiles (user_id, full_name, address) VALUES
('00000000-0000-0000-0000-000000000001', 'Super Administrator', 'Kantor Negeri')
ON CONFLICT (user_id) DO NOTHING;

-- Insert role superadmin
INSERT INTO user_roles (user_id, role) VALUES
('00000000-0000-0000-0000-000000000001', 'superadmin')
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

-- Tampilkan pesan sukses
DO $$
BEGIN
    RAISE NOTICE 'Database schema created successfully!';
    RAISE NOTICE 'Total tables created: %', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'singg' AND table_type = 'BASE TABLE');
    RAISE NOTICE 'Total views created: %', (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'singg');
    RAISE NOTICE 'Total triggers created: %', (SELECT COUNT(*) FROM information_schema.triggers WHERE event_object_schema = 'singg');
END $$;
