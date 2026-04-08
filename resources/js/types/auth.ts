export type User = {
    id: string; // UUID
    name?: string; // Optional/legacy
    email: string;
    nik?: string;
    phone?: string;
    avatar?: string;
    is_active: boolean;
    email_verified_at: string | null;
    phone_verified_at?: string | null;
    two_factor_enabled?: boolean;
    profil?: {
        nama_lengkap: string;
        alamat?: string;
        pekerjaan?: string;
        url_foto_profil?: string;
    };
    peran?: Array<{
        peran: 'admin' | 'warga';
        is_active: boolean;
    }>;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
