import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    BarChart3,
    BookOpen,
    CheckCircle,
    ClipboardList,
    Clock,
    FileText,
    FolderGit2,
    HelpCircle,
    History,
    LayoutGrid,
    List,
    Megaphone,
    MessageSquare,
    MessagesSquare,
    PlusCircle,
    Star,
    UserCircle,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';
import warga from '@/routes/warga';
import { edit } from '@/routes/profile';
import type { NavItem, Auth } from '@/types';



const pengaduanNavItems: NavItem[] = [
    {
        title: 'Buat Pengaduan Baru',
        href: warga.pengaduan.create().url,
        icon: PlusCircle,
    },
    {
        title: 'Daftar Pengaduan',
        href: warga.pengaduan.index().url,
        icon: List,
    },
    {
        title: 'Pengaduan Selesai',
        href: warga.pengaduan.index({ query: { status: 'selesai' } }).url,
        icon: CheckCircle,
    },
];

const layananNavItems: NavItem[] = [
    {
        title: 'Ajukan Permohonan',
        href: '#',
        icon: FileText,
    },
    {
        title: 'Lacak Permohonan',
        href: '#',
        icon: ClipboardList,
    },
    {
        title: 'Riwayat Dokumen',
        href: '#',
        icon: History,
    },
];

const pesanNavItems: NavItem[] = [
    {
        title: 'Inbox',
        href: '#',
        icon: MessageSquare,
    },
    {
        title: 'Hubungi Admin',
        href: '#',
        icon: UserCircle,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Bantuan (FAQ)',
        href: '/bantuan',
        icon: HelpCircle,
    },
];

const adminIntiNavItems: NavItem[] = [
    {
        title: 'Statistik Pelayanan',
        href: admin.statistik().url,
        icon: BarChart3,
    },
];

const adminModerasiNavItems: NavItem[] = [
    {
        title: 'Manajemen Pengaduan',
        href: admin.pengaduan.index().url,
        icon: ClipboardList,
    },
    {
        title: 'Riwayat Pengaduan',
        href: admin.pengaduan.riwayat().url,
        icon: History,
    },
];

const adminLayananNavItems: NavItem[] = [
    {
        title: 'Proses Permohonan',
        href: admin.layanan.index().url,
        icon: FileText,
    },
    {
        title: 'Manajemen Antrean',
        href: admin.antrean.index().url,
        icon: Clock,
    },
    {
        title: 'Katalog Layanan',
        href: admin.katalog.index().url,
        icon: BookOpen,
    },
];

const adminKomunikasiNavItems: NavItem[] = [
    {
        title: 'Pusat Pesan (Chat)',
        href: admin.pesan.index().url,
        icon: MessagesSquare,
    },
    {
        title: 'Berita & Pengumuman',
        href: admin.pengumuman.index().url,
        icon: Megaphone,
    },
    {
        title: 'Manajemen FAQ',
        href: admin.faq.index().url,
        icon: HelpCircle,
    },
];

const adminKependudukanNavItems: NavItem[] = [
    {
        title: 'Data Warga (NIK)',
        href: admin.warga.index().url,
        icon: Users,
    },
];

const adminFeedbackNavItems: NavItem[] = [
    {
        title: 'Ulasan & Rating',
        href: '#',
        icon: Star,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as unknown as { auth: Auth };
    const user = auth.user;
    const isAdmin = user.peran?.some((p) => p.peran === 'admin');

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={isAdmin ? admin.dashboard().url : dashboard().url} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={[
                    {
                        title: 'Dashboard',
                        href: isAdmin ? admin.dashboard().url : dashboard().url,
                        icon: LayoutGrid,
                    },
                ]} />

                {isAdmin ? (
                    <>
                        <NavMain title="Inti & Statistik" items={adminIntiNavItems} />
                        <NavMain title="Moderasi Pengaduan" items={adminModerasiNavItems} />
                        <NavMain title="Layanan Administrasi" items={adminLayananNavItems} />
                        <NavMain title="Komunikasi & Konten" items={adminKomunikasiNavItems} />
                        <NavMain title="Kependudukan" items={adminKependudukanNavItems} />
                        <NavMain title="Ulasan & Feedback" items={adminFeedbackNavItems} />
                    </>
                ) : (
                    <>
                        <NavMain title="Pengaduan" items={pengaduanNavItems} />
                        <NavMain title="Layanan Administrasi" items={layananNavItems} />
                        <NavMain title="Pesan & Diskusi" items={pesanNavItems} />
                    </>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

