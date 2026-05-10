"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase'; 

// --- DATA TETAP LALUAN ---
const PREDEFINED_ROUTES = [
    { id: 'R1', label: 'ICQS Mengkalap ➔ ICQS Pandaruan ➔ ICQS Tedungan ➔ ICQS Sungai Tujuh', stations: ['ICQS Mengkalap', 'ICQS Pandaruan', 'ICQS Tedungan', 'ICQS Sungai Tujuh'] },
    { id: 'R2', label: 'ICQS Sungai Tujuh ➔ ICQS Tedungan ➔ ICQS Pandaruan ➔ ICQS Mengkalap', stations: ['ICQS Sungai Tujuh', 'ICQS Tedungan', 'ICQS Pandaruan', 'ICQS Mengkalap'] },
    { id: 'R3', label: 'ICQS Mengkalap ➔ ICQS Pandaruan', stations: ['ICQS Mengkalap', 'ICQS Pandaruan'] },
    { id: 'R4', label: 'ICQS Pandaruan ➔ ICQS Mengkalap', stations: ['ICQS Pandaruan', 'ICQS Mengkalap'] },
    { id: 'R5', label: 'ICQS Sungai Tujuh ➔ ICQS Tedungan', stations: ['ICQS Sungai Tujuh', 'ICQS Tedungan'] },
    { id: 'R6', label: 'ICQS Tedungan ➔ ICQS Sungai Tujuh', stations: ['ICQS Tedungan', 'ICQS Sungai Tujuh'] },
    { id: 'R7', label: 'ICQS Mengkalap ➔ ICQS Sungai Tujuh', stations: ['ICQS Mengkalap', 'ICQS Sungai Tujuh'] },
    { id: 'R8', label: 'ICQS Sungai Tujuh ➔ ICQS Mengkalap', stations: ['ICQS Sungai Tujuh', 'ICQS Mengkalap'] }
];

// --- ICONS (SVG) ---
const IconUser = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconFile = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
const IconPrinter = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>;
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconLogOut = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconActivity = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const IconTrash = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const IconCancel = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>;
const IconChart = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconScan = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>;
const IconSearch = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IconShieldAlert = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IconKey = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>;
const IconRefresh = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.5l1.25 1.93"/></svg>;
const IconMail = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;

// --- KOMPONEN LOGO (Kalis Pecah & Tempatan) ---
const LogoKastam = ({ className }: { className?: string }) => (
    <img 
        src="/logo.png" 
        alt="Logo Kastam Diraja Malaysia" 
        className={className} 
        onError={(e) => {
            e.currentTarget.style.display = 'none';
        }} 
    />
);

// --- FUNGSI MAPPING SUPABASE <-> UI ---
const mapDBtoUI = (dbRec: any) => ({
    id: dbRec.id,
    noPendaftaranRasmi: dbRec.no_pendaftaran_rasmi,
    status: dbRec.status,
    routeId: dbRec.route_id,
    routeParams: dbRec.route_params || [],
    companyId: dbRec.company_id,
    companyName: dbRec.company_name,
    dateSubmitted: dbRec.date_submitted,
    stesenPenghantar: dbRec.stesen_penghantar,
    stesenPenerima: dbRec.stesen_penerima,
    konsainor: dbRec.konsainor,
    konsainee: dbRec.konsainee,
    destinasiAsal: dbRec.destinasi_asal,
    destinasiAkhir: dbRec.destinasi_akhir,
    noDaftarKenderaan: dbRec.no_daftar_kenderaan,
    jenisKenderaan: dbRec.jenis_kenderaan,
    noKontena: dbRec.no_kontena,
    namaPemandu: dbRec.nama_pemandu,
    dokumenDisertakan: dbRec.dokumen_disertakan || { invoice: false, packingList: false, deliveryOrder: false },
    invoiceNo: dbRec.invoice_no,
    packingListNo: dbRec.packing_list_no,
    deliveryOrderNo: dbRec.delivery_order_no,
    jumlahBungkusan: dbRec.jumlah_bungkusan,
    ukuran: dbRec.ukuran,
    beratKasar: dbRec.berat_kasar,
    namaPembuatAkaun: dbRec.nama_pembuat_akaun,
    jawatan: dbRec.jawatan,
    noPengenalan: dbRec.no_pengenalan,
    items: (dbRec.items || []).sort((a:any, b:any) => a.bil - b.bil).map((i:any) => ({
        bil: i.bil, diskripsi: i.diskripsi, kuantiti: i.kuantiti, nilai: i.nilai, noInvois: i.no_invois, destinasi: i.destinasi
    })),
    transitLogs: (dbRec.transit_logs || []).sort((a:any, b:any) => a.id - b.id).map((l:any) => ({
        id: l.id, tarikhMasa: l.tarikh_masa, stesen: l.stesen, pegawai: l.pegawai, tindakan: l.tindakan
    }))
});

const mapUItoDB = (uiRec: any) => ({
    id: uiRec.id,
    no_pendaftaran_rasmi: uiRec.noPendaftaranRasmi || null,
    status: uiRec.status,
    route_id: uiRec.routeId,
    route_params: uiRec.routeParams,
    company_id: uiRec.companyId,
    company_name: uiRec.companyName,
    date_submitted: uiRec.dateSubmitted,
    stesen_penghantar: uiRec.stesenPenghantar,
    stesen_penerima: uiRec.stesenPenerima,
    konsainor: uiRec.konsainor,
    konsainee: uiRec.konsainee,
    destinasi_asal: uiRec.destinasiAsal,
    destinasi_akhir: uiRec.destinasiAkhir,
    no_daftar_kenderaan: uiRec.noDaftarKenderaan,
    jenis_kenderaan: uiRec.jenisKenderaan,
    no_kontena: uiRec.noKontena,
    nama_pemandu: uiRec.namaPemandu,
    dokumen_disertakan: uiRec.dokumenDisertakan,
    invoice_no: uiRec.invoiceNo,
    packing_list_no: uiRec.packingListNo,
    delivery_order_no: uiRec.deliveryOrderNo,
    jumlah_bungkusan: uiRec.jumlahBungkusan ? Number(uiRec.jumlahBungkusan) : null,
    ukuran: uiRec.ukuran ? Number(uiRec.ukuran) : null,
    berat_kasar: uiRec.beratKasar ? Number(uiRec.beratKasar) : null,
    nama_pembuat_akaun: uiRec.namaPembuatAkaun,
    jawatan: uiRec.jawatan,
    no_pengenalan: uiRec.no_pengenalan
});

// ==========================================
// KOMPONEN UTAMA APP
// ==========================================
export default function App() {
    const [usersList, setUsersList] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [view, setView] = useState('login'); 
    const [records, setRecords] = useState<any[]>([]);
    const [currentRecord, setCurrentRecord] = useState<any>(null);
    const [sysLogs, setSysLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- PENGAMBILAN DATA DARI SUPABASE PADA PERMULAAN ---
    const fetchData = async () => {
        try {
            const { data: profilesData } = await supabase.from('profiles').select('*');
            if (profilesData) setUsersList(profilesData);

            const { data: logsData } = await supabase.from('system_logs').select('*').order('id', { ascending: false });
            if (logsData) setSysLogs(logsData);

            const { data: declData } = await supabase.from('declarations')
                .select('*, items(*), transit_logs(*)')
                .order('date_submitted', { ascending: false });
            
            if (declData) {
                setRecords(declData.map(mapDBtoUI));
            }
        } catch (err) {
            console.error("Ralat menyambung ke Supabase:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        
        // --- SEMAK SESI LOGIN LALU DARI LOCALSTORAGE ---
        const savedSession = localStorage.getItem('eTransitSession');
        if (savedSession) {
            try {
                const parsedUser = JSON.parse(savedSession);
                if (parsedUser && parsedUser.id) {
                    setUser(parsedUser);
                    setView('dashboard');
                }
            } catch (e) {
                localStorage.removeItem('eTransitSession');
            }
        }
    }, []);

    // --- FUNGSI MENYIMPAN LOG KE PANGKALAN DATA ---
    const addSystemLog = async (jenis: string, tindakan: string, actingUser = user) => {
        if(!actingUser) return;
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        const dateTimeStr = `${pad(now.getDate())}/${pad(now.getMonth()+1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
        
        const newLog = {
            tarikh_masa: dateTimeStr,
            jenis: jenis, 
            user_id: actingUser.id,
            user_name: actingUser.name,
            tindakan: tindakan
        };
        
        await supabase.from('system_logs').insert([newLog]);
        
        // Refresh log senarai di UI
        const { data: logsData } = await supabase.from('system_logs').select('*').order('id', { ascending: false });
        if (logsData) setSysLogs(logsData);
    };

    const handleRequestReset = async (userName: string) => {
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        const dateTimeStr = `${pad(now.getDate())}/${pad(now.getMonth()+1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
        
        const newLog = {
            tarikh_masa: dateTimeStr,
            jenis: 'Permintaan Reset', 
            user_id: null,
            user_name: userName,
            tindakan: 'Memohon reset kata laluan'
        };
        
        try {
            await supabase.from('system_logs').insert([newLog]);
            await fetchData(); 
        } catch(e) {
            console.error("Gagal menghantar permohonan:", e);
        }
    };

    // --- NAVIGATION ---
    const handleLogin = (selectedUser: any) => {
        setUser(selectedUser);
        setView('dashboard');
        // --- SIMPAN SESI KE LOCALSTORAGE ---
        localStorage.setItem('eTransitSession', JSON.stringify(selectedUser));
        addSystemLog('Sistem', `Log Masuk (Login) berjaya.`, selectedUser);
    };

    const handleLogout = () => {
        addSystemLog('Sistem', `Log Keluar (Logout) sistem.`);
        setUser(null);
        setView('login');
        // --- PADAM SESI DARI LOCALSTORAGE ---
        localStorage.removeItem('eTransitSession');
    };

    // --- SIMPAN BORANG (INSERT/UPDATE KE SUPABASE) ---
    const saveRecord = async (newRecord: any) => {
        try {
            const isEdit = currentRecord && view === 'form';
            const isTracking = currentRecord && view !== 'form';

            if (isTracking) {
                // 1. UPDATE Status Deklarasi
                const { error: trackErr } = await supabase.from('declarations').update({
                    status: newRecord.status,
                    no_pendaftaran_rasmi: newRecord.noPendaftaranRasmi
                }).eq('id', newRecord.id);
                
                if (trackErr) throw trackErr;

                // 2. INSERT Log Pergerakan Terkini
                const latestLog = newRecord.transitLogs[newRecord.transitLogs.length - 1];
                const { error: logErr } = await supabase.from('transit_logs').insert([{
                    declaration_id: newRecord.id,
                    tarikh_masa: latestLog.tarikhMasa,
                    stesen: latestLog.stesen,
                    pegawai: latestLog.pegawai,
                    tindakan: latestLog.tindakan
                }]);
                
                if (logErr) throw logErr;
                
                await addSystemLog('Operasi', `Kemaskini status / laluan bagi borang ${newRecord.id} (${newRecord.noDaftarKenderaan})`);
            } else {
                // 1. Sediakan Payload Borang Keseluruhan
                const declPayload = mapUItoDB(newRecord);

                if (isEdit) {
                    const { error: updErr } = await supabase.from('declarations').update(declPayload).eq('id', newRecord.id);
                    if (updErr) throw updErr;
                    // Buang barang lama untuk ganti yang baru
                    await supabase.from('items').delete().eq('declaration_id', newRecord.id);
                } else {
                    const { error: insErr } = await supabase.from('declarations').insert([declPayload]);
                    if (insErr) throw insErr;
                }

                // 2. Sediakan Payload Barang-barang
                const itemsPayload = newRecord.items.map((item: any) => ({
                    declaration_id: newRecord.id,
                    bil: item.bil,
                    diskripsi: item.diskripsi,
                    kuantiti: item.kuantiti ? Number(item.kuantiti) : null,
                    nilai: item.nilai ? Number(item.nilai) : null,
                    no_invois: item.noInvois,
                    destinasi: item.destinasi
                }));

                // 3. Masukkan senarai barang ke Database
                if(itemsPayload.length > 0) {
                    const { error: itemsErr } = await supabase.from('items').insert(itemsPayload);
                    if (itemsErr) throw itemsErr;
                }

                await addSystemLog('Borang', isEdit ? `Menyunting (Edit) borang ${newRecord.id} (${newRecord.noDaftarKenderaan})` : `Mendaftar borang deklarasi baru: ${newRecord.id} (${newRecord.noDaftarKenderaan})`);
            }

            // Selepas simpan, Tarik semula data untuk pastikan ia sync 100%
            await fetchData();
            
            // POPUP NOTIFIKASI BERJAYA APABILA BORANG DIHANTAR
            if (view === 'form') {
                alert(`✅ BERJAYA!\n\nBorang deklarasi transit anda telah berjaya disimpan ke pangkalan data.\nSedia untuk diambil tindakan oleh Pegawai Kastam yang bertugas.`);
            }

            // Kemaskini rekod semasa supaya PrintView mendapat data terkini
            const updatedRecord = records.find(r => r.id === newRecord.id) || newRecord;
            setCurrentRecord(updatedRecord);
            
            return true;

        } catch (error: any) {
            console.error("Ralat menyimpan data:", error);
            alert(`Ralat sistem: Tidak dapat menyimpan rekod ke Pangkalan Data.\nSebab: ${error.message || 'Sila cuba lagi.'}`);
            return false;
        }
    };

    // --- BATALKAN BORANG (UPDATE KE SUPABASE) ---
    const cancelRecord = async (id: string, reason: string) => {
        try {
            const now = new Date();
            const pad = (n: number) => n.toString().padStart(2, '0');
            const dateTimeStr = `${pad(now.getDate())}/${pad(now.getMonth()+1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

            await supabase.from('declarations').update({ status: 'Dibatalkan' }).eq('id', id);

            await supabase.from('transit_logs').insert([{
                declaration_id: id,
                tarikh_masa: dateTimeStr,
                stesen: user.stesen || 'Sistem (Admin)',
                pegawai: user.name,
                tindakan: `DIBATALKAN: ${reason}`
            }]);

            await addSystemLog('Borang', `Membatalkan borang ${id}. Sebab: ${reason}`);
            await fetchData();

        } catch (error) {
            console.error("Ralat membatalkan borang:", error);
        }
    };

    // --- PADAM SEPENUHNYA (HARD DELETE) ---
    const hardDeleteRecord = async (id: string) => {
        try {
            await supabase.from('transit_logs').delete().eq('declaration_id', id);
            await supabase.from('items').delete().eq('declaration_id', id);
            await supabase.from('declarations').delete().eq('id', id);
            
            await addSystemLog('Borang', `PADAM SEPENUHNYA (Hard Delete) borang ${id} dari pangkalan data.`);
            await fetchData();
        } catch (error) {
            console.error("Ralat Hard Delete:", error);
            alert("Ralat memadam rekod.");
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-800 text-white font-bold">Menyambung ke Pangkalan Data Supabase...</div>;
    
    if (view === 'login') return <LoginScreen users={usersList} onLogin={handleLogin} onRequestReset={handleRequestReset} />;
    
    const pendingResets = sysLogs.filter((l:any) => l.jenis === 'Permintaan Reset').length;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    @page { size: A4 portrait; margin: 0; }
                    body { background: white; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
                    .no-print { display: none !important; }
                    .print-border { border-color: black !important; }
                    .print-text { color: black !important; }
                    .print-area { position: absolute; left: 0; top: 0; width: 100%; min-height: 100%; background: white; padding: 15mm; }
                }
            `}} />

            <header className="bg-slate-900 text-white p-4 shadow-md print:hidden no-print">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center h-11 w-11 overflow-hidden">
                            <LogoKastam className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight">e-Transit Kastam</h1>
                            <p className="text-xs text-slate-300 mt-0.5">
                                <span className="font-bold text-white uppercase">{user.name}</span> • <span className="capitalize">{user.role}</span>
                                {user.stesen ? ` • ${user.stesen}` : (user.role === 'admin' ? ' • Pusat (HQ)' : '')}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 md:space-x-4 bg-slate-800 p-1 rounded-lg flex-wrap justify-center">
                        <button onClick={() => setView('dashboard')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${view === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                            <IconFile /><span className="ml-1 hidden sm:inline">Borang</span>
                        </button>
                        {(user.role === 'pegawai' || user.role === 'admin') && (
                            <button onClick={() => setView('report')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${view === 'report' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                                <IconChart /><span className="ml-1 hidden sm:inline">Laporan</span>
                            </button>
                        )}
                        {user.role === 'admin' && (
                            <>
                                <button onClick={() => setView('inbox')} className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${view === 'inbox' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                                    <IconMail />
                                    {pendingResets > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-slate-900">{pendingResets}</span>}
                                    <span className="ml-1 hidden sm:inline">Peti Masuk</span>
                                </button>
                                <button onClick={() => setView('users')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${view === 'users' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                                    <IconUsers /><span className="ml-1 hidden sm:inline">Pengguna</span>
                                </button>
                                <button onClick={() => setView('systemLogs')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${view === 'systemLogs' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                                    <IconShieldAlert /><span className="ml-1 hidden sm:inline">Log Audit</span>
                                </button>
                            </>
                        )}
                        <div className="w-px h-6 bg-slate-600 mx-1"></div>
                        <button onClick={() => setView('changePassword')} className="px-3 py-2 rounded-md text-sm font-medium text-amber-400 hover:bg-slate-700 flex items-center">
                            <IconKey /><span className="ml-1 hidden sm:inline">Kata Laluan</span>
                        </button>
                        <button onClick={handleLogout} className="px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-slate-700 hover:text-red-300 flex items-center">
                            <IconLogOut /><span className="ml-1 hidden sm:inline">Keluar</span>
                        </button>
                    </div>
                </div>
            </header>

            {view === 'dashboard' && <Dashboard user={user} records={records} onDelete={cancelRecord} onHardDelete={hardDeleteRecord} onOpenForm={(r:any) => {setCurrentRecord(r); setView('form')}} onPrint={(r:any) => {setCurrentRecord(r); setView('print')}} onTrack={(r:any) => {setCurrentRecord(r); setView('tracking')}} />}
            {view === 'form' && <FormView user={user} usersList={usersList} record={currentRecord} onSave={async (rec:any) => { setCurrentRecord(rec); const ok = await saveRecord(rec); if(ok) setView('print'); }} onCancel={() => setView('dashboard')} />}
            {view === 'print' && <PrintView record={currentRecord} onBack={() => setView('dashboard')} />}
            {view === 'tracking' && <TrackingView user={user} record={currentRecord} onSave={async (rec:any) => { const ok = await saveRecord(rec); if(ok) setView('dashboard'); }} onBack={() => setView('dashboard')} />}
            {view === 'report' && <ReportView user={user} records={records} />}
            {view === 'users' && <UsersMgmtView currentUser={user} usersList={usersList} fetchData={fetchData} logAction={addSystemLog} />}
            {view === 'systemLogs' && <SystemLogsView sysLogs={sysLogs} logAction={addSystemLog} fetchData={fetchData} />}
            {view === 'inbox' && <InboxView sysLogs={sysLogs} usersList={usersList} fetchData={fetchData} logAction={addSystemLog} />}
            {view === 'changePassword' && <ChangePasswordView user={user} onBack={() => setView('dashboard')} logAction={addSystemLog} setUser={setUser} />}
        </div>
    );
}

// ==========================================
// KOMPONEN PETI MASUK SUPERADMIN
// ==========================================
const InboxView = ({ sysLogs, usersList, fetchData, logAction }: any) => {
    const pendingResets = sysLogs.filter((l: any) => l.jenis === 'Permintaan Reset');

    const handleReset = async (log: any) => {
        const targetUser = usersList.find((u: any) => u.name === log.user_name);
        if (!targetUser) {
            alert("Ralat: Pengguna tidak dijumpai. Mungkin telah dipadam dari pangkalan data.");
            await supabase.from('system_logs').update({ jenis: 'Reset Selesai', tindakan: 'Gagal (User Tiada)' }).eq('id', log.id);
            fetchData();
            return;
        }

        try {
            const tempPassword = 'password123';
            const { error } = await supabase.from('profiles').update({ password: tempPassword }).eq('id', targetUser.id);
            if (error) throw error;

            await supabase.from('system_logs').update({ jenis: 'Reset Selesai', tindakan: 'Telah di-reset kepada password123' }).eq('id', log.id);
            await logAction('Sistem', `Kata laluan untuk ${targetUser.name} telah di-reset kepada password123`);
            
            alert(`Berjaya! Kata laluan sementara untuk ${targetUser.name} ialah: ${tempPassword}\nSila maklumkan kepada pengguna.`);
            fetchData();
        } catch(e: any) {
            alert("Ralat reset kata laluan: " + e.message);
        }
    };

    const handleReject = async (log: any) => {
        try {
            await supabase.from('system_logs').update({ jenis: 'Reset Selesai', tindakan: 'Permohonan Ditolak' }).eq('id', log.id);
            fetchData();
        } catch(e: any) {
            alert("Ralat: " + e.message);
        }
    };

    return (
        <div className="flex-grow p-4 md:p-8 max-w-5xl mx-auto w-full no-print">
            <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center"><IconMail /><span className="ml-2">Peti Masuk Superadmin</span></h2>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
                <h3 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">Permohonan Lupa Kata Laluan</h3>
                
                {pendingResets.length === 0 ? (
                    <div className="text-center p-8 text-slate-500 italic bg-slate-50 rounded border border-dashed">Tiada mesej atau permohonan baru.</div>
                ) : (
                    <div className="space-y-4">
                        {pendingResets.map((log: any) => (
                            <div key={log.id} className="p-4 border border-blue-200 bg-blue-50 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <div className="text-xs font-bold text-slate-500 mb-1">{log.tarikh_masa}</div>
                                    <div className="font-semibold text-slate-800">Nama Pengguna: <span className="text-blue-700 uppercase text-lg">{log.user_name}</span></div>
                                    <div className="text-sm text-slate-600 mt-1">{log.tindakan}</div>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <button onClick={() => handleReject(log)} className="flex-1 md:flex-none px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-200 rounded font-bold shadow-sm text-sm">Abaikan</button>
                                    <button onClick={() => handleReset(log)} className="flex-1 md:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold shadow-sm text-sm flex items-center justify-center"><IconKey /> <span className="ml-1">Tukar ke 'password123'</span></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// ==========================================
// 0. KOMPONEN TUKAR KATA LALUAN
// ==========================================
const ChangePasswordView = ({ user, onBack, logAction, setUser }: any) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChange = async (e: any) => {
        e.preventDefault();
        if (oldPassword !== user.password) return alert("Kata Laluan Lama tidak tepat.");
        if (newPassword !== confirmPassword) return alert("Pengesahan Kata Laluan Baru tidak sepadan.");
        if (newPassword.length < 6) return alert("Kata Laluan Baru mesti sekurang-kurangnya 6 aksara.");

        try {
            const { error } = await supabase.from('profiles').update({ password: newPassword }).eq('id', user.id);
            if (error) throw error;
            
            alert("Kata Laluan berjaya ditukar.");
            setUser({...user, password: newPassword});
            logAction('Sistem', `Menukar kata laluan.`);
            onBack();
        } catch (err: any) {
            alert("Ralat menukar kata laluan: " + err.message);
        }
    };

    return (
        <div className="flex-grow p-4 md:p-8 max-w-md mx-auto w-full">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center"><IconKey /><span className="ml-2">Tukar Kata Laluan</span></h2>
            <form onSubmit={handleChange} className="bg-white p-6 rounded-xl shadow border border-slate-200 space-y-4">
                <div><label className="block text-sm mb-1 font-bold">Kata Laluan Lama</label><input type="password" required value={oldPassword} onChange={e=>setOldPassword(e.target.value)} className="w-full p-2 border rounded outline-none focus:border-blue-500" /></div>
                <div><label className="block text-sm mb-1 font-bold">Kata Laluan Baru</label><input type="password" required value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="w-full p-2 border rounded outline-none focus:border-blue-500" /></div>
                <div><label className="block text-sm mb-1 font-bold">Sahkan Kata Laluan Baru</label><input type="password" required value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="w-full p-2 border rounded outline-none focus:border-blue-500" /></div>
                <div className="flex space-x-2 pt-2">
                    <button type="button" onClick={onBack} className="w-full py-2 border rounded font-bold text-slate-600 hover:bg-slate-50">Batal</button>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 shadow-sm">Simpan</button>
                </div>
            </form>
        </div>
    );
};

// ==========================================
// 1. KOMPONEN LOG MASUK (KOTAK INPUT PENUH DROPDOWN NAMA)
// ==========================================
const LoginScreen = ({ users, onLogin, onRequestReset }: any) => {
    const [viewForgot, setViewForgot] = useState(false);
    const [roleInput, setRoleInput] = useState('syarikat');
    const [nameInput, setNameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    const availableUsers = users.filter((u: any) => u.role === roleInput);

    useEffect(() => {
        if (availableUsers.length > 0) {
            setNameInput(availableUsers[0].name);
        } else {
            setNameInput('');
        }
    }, [roleInput, users]);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const found = users.find((u: any) => u.name === nameInput && u.password === passwordInput && u.role === roleInput);
        if (found) {
            onLogin(found);
        } else {
            alert("Ralat Log Masuk: Kata Laluan tidak tepat atau pengguna tidak dijumpai.");
        }
    };

    const handleForgotSubmit = async (e: any) => {
        e.preventDefault();
        if(!nameInput) return;
        await onRequestReset(nameInput);
        alert("Permohonan reset kata laluan telah berjaya dihantar ke Peti Masuk Superadmin. Sila tunggu tindakan selanjutnya.");
        setViewForgot(false);
    };

    if (viewForgot) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-800 p-4">
                <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center mb-6 h-32 w-32">
                            <LogoKastam className="w-full h-full object-contain" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Lupa Kata Laluan</h2>
                        <p className="text-gray-500 text-sm mt-1">Pilih nama pengguna anda untuk memohon reset kata laluan daripada Superadmin.</p>
                    </div>
                    <form onSubmit={handleForgotSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Peranan</label>
                            <select value={roleInput} onChange={e=>setRoleInput(e.target.value)} className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                                <option value="syarikat">Syarikat Logistik</option>
                                <option value="pegawai">Pegawai Kastam</option>
                                <option value="admin">Superadmin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nama Pengguna</label>
                            <select required value={nameInput} onChange={e=>setNameInput(e.target.value)} className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium uppercase">
                                {availableUsers.length === 0 && <option value="">(Tiada Pengguna Didaftarkan)</option>}
                                {availableUsers.map((u: any) => (
                                    <option key={u.id} value={u.name}>
                                        {u.name} {u.role === 'pegawai' && u.stesen ? ` - ${u.stesen}` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-amber-500 text-amber-950 font-bold py-3 rounded-lg shadow hover:bg-amber-400 transition-colors mt-2">Hantar Permohonan</button>
                        <button type="button" onClick={() => setViewForgot(false)} className="w-full text-slate-500 font-bold py-3 hover:text-slate-700 transition-colors">Batal & Kembali</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-800 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-6 h-32 w-32">
                        <LogoKastam className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Sistem e-Transit</h1>
                    <p className="text-gray-500 text-sm">Jabatan Kastam Diraja Malaysia</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Peranan</label>
                        <select value={roleInput} onChange={e=>setRoleInput(e.target.value)} className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                            <option value="syarikat">Syarikat Logistik</option>
                            <option value="pegawai">Pegawai Kastam</option>
                            <option value="admin">Superadmin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nama Pengguna</label>
                        <select required value={nameInput} onChange={e=>setNameInput(e.target.value)} className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium uppercase">
                            {availableUsers.length === 0 && <option value="">(Tiada Pengguna Didaftarkan)</option>}
                            {availableUsers.map((u: any) => (
                                <option key={u.id} value={u.name}>
                                    {u.name} {u.role === 'pegawai' && u.stesen ? ` - ${u.stesen}` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Kata Laluan</label>
                        <input type="password" required value={passwordInput} onChange={e=>setPasswordInput(e.target.value)} className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukkan Kata Laluan" />
                        <div className="text-right mt-1">
                            <button type="button" onClick={() => setViewForgot(true)} className="text-xs text-blue-600 font-semibold hover:underline">Lupa Kata Laluan?</button>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow hover:bg-blue-700 transition-colors mt-2">Log Masuk</button>
                </form>
            </div>
        </div>
    );
};

// ==========================================
// UI BANTUAN: MODAL PENGESAHAN PADAM
// ==========================================
const DeleteModal = ({ isOpen, onClose, onConfirm, title }: any) => {
    const [reason, setReason] = useState('');
    
    useEffect(() => {
        if (isOpen) setReason('');
    }, [isOpen]);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center">
                <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4"><IconCancel /></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sahkan Pembatalan</h3>
                <p className="text-gray-500 mb-4 text-sm">{title}</p>
                
                <div className="mb-6 text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catatan / Sebab Batal <span className="text-red-500">*</span></label>
                    <textarea 
                        required
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                        rows={3}
                        placeholder="Sila nyatakan sebab..."
                    ></textarea>
                </div>

                <div className="flex justify-center space-x-3">
                    <button onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Batal</button>
                    <button 
                        onClick={() => onConfirm(reason)} 
                        disabled={!reason.trim()}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:bg-red-300 disabled:cursor-not-allowed"
                    >
                        Ya, Teruskan
                    </button>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 2. KOMPONEN PAPARAN UTAMA (DASHBOARD)
// ==========================================
const Dashboard = ({ user, records, onDelete, onHardDelete, onOpenForm, onPrint, onTrack }: any) => {
    const [deleteTarget, setDeleteTarget] = useState<any>(null);
    const [scanTerm, setScanTerm] = useState('');
    const [scanError, setScanError] = useState('');
    const [filterTerm, setFilterTerm] = useState('');

    const getStatusBadge = (status: string) => {
        if (status === 'Selesai') return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">Selesai</span>;
        if (status === 'Dalam Transit') return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-semibold">Dalam Transit</span>;
        if (status === 'Dibatalkan') return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">Dibatalkan</span>;
        return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-semibold">Menunggu Pelepasan</span>;
    };

    const handleScanSearch = (e: any) => {
        e.preventDefault();
        setScanError('');
        if (!scanTerm.trim()) return;
        const foundRecord = records.find((r: any) => (r.id||'').toUpperCase() === scanTerm.toUpperCase().trim() || (r.noDaftarKenderaan||'').replace(/\s/g,'') === scanTerm.toUpperCase().replace(/\s/g,''));
        if (foundRecord) {
            setScanTerm(''); 
            onTrack(foundRecord); 
        } else {
            setScanError(`Rekod tidak dijumpai.`);
            setTimeout(() => setScanError(''), 3000);
        }
    };

    // SYARIKAT HANYA MELIHAT REKODNYA SENDIRI
    let filteredRecords = user.role === 'syarikat' ? records.filter((r: any) => r.companyId === user.id) : records;
    
    if (filterTerm.trim()) {
        const q = filterTerm.toLowerCase();
        filteredRecords = filteredRecords.filter((r: any) => 
            (r.id||'').toLowerCase().includes(q) ||
            (r.companyName||'').toLowerCase().includes(q) ||
            (r.noDaftarKenderaan||'').toLowerCase().includes(q) ||
            (r.namaPemandu||'').toLowerCase().includes(q) ||
            (r.konsainor||'').toLowerCase().includes(q) ||
            (r.konsainee||'').toLowerCase().includes(q) ||
            (r.noPendaftaranRasmi && r.noPendaftaranRasmi.toLowerCase().includes(q))
        );
    }

    return (
        <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full no-print">
            <DeleteModal 
                isOpen={!!deleteTarget} 
                onClose={() => setDeleteTarget(null)} 
                onConfirm={(reason: string) => { onDelete(deleteTarget, reason); setDeleteTarget(null); }} 
                title="Borang yang dibatalkan tidak boleh dikembalikan. Sila nyatakan sebab untuk rekod rujukan." 
            />

            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {(user.role === 'pegawai' || user.role === 'admin') && (
                    <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-200">
                        <label className="block text-base font-bold text-blue-900 mb-2 flex items-center uppercase">
                            <div className="bg-blue-600 text-white p-1.5 rounded mr-2"><IconScan /></div>
                            Tindakan Operasi (Imbas QR)
                        </label>
                        <p className="text-xs text-blue-700 mb-4 font-medium">Imbas QR atau taip ID Sistem untuk terus membuka paparan log pengesahan laluan.</p>
                        <form onSubmit={handleScanSearch} className="flex gap-2">
                            <input
                                type="text"
                                value={scanTerm}
                                onChange={(e) => setScanTerm(e.target.value)}
                                placeholder="Cth: TR-2026..."
                                className="flex-grow p-3 border-2 border-blue-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none uppercase font-mono text-sm shadow-inner bg-white"
                            />
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center whitespace-nowrap">
                                Cari & Sahkan
                            </button>
                        </form>
                        {scanError && (
                            <div className="mt-3 text-red-600 bg-red-50 p-2 rounded border border-red-100 text-xs font-semibold flex items-center">
                                <span className="mr-2">⚠️</span> {scanError}
                            </div>
                        )}
                    </div>
                )}

                <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 ${user.role === 'syarikat' ? 'col-span-1 md:col-span-2' : ''}`}>
                    <label className="block text-base font-bold text-slate-800 mb-2 flex items-center uppercase">
                        <div className="bg-slate-800 text-white p-1.5 rounded mr-2"><IconSearch /></div>
                        Carian Senarai Borang
                    </label>
                    <p className="text-xs text-slate-500 mb-4">Taip sebarang kata kunci (No Pendaftaran, ID, Syarikat, No Lori) untuk menapis jadual.</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={filterTerm}
                            onChange={(e) => setFilterTerm(e.target.value)}
                            placeholder="Cari borang untuk dicetak atau dikaji..."
                            className="flex-grow p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-400 outline-none text-sm uppercase"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6 border-t border-slate-200 pt-6">
                <h2 className="text-2xl font-bold text-gray-800">Senarai Deklarasi Transit</h2>
                <button onClick={() => onOpenForm()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-sm transition-colors">
                    <IconPlus /> <span>{user.role === 'syarikat' ? 'Borang Baru' : 'Isi Borang Baru (Bagi Syarikat)'}</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                                <th className="p-4 font-semibold">ID / Status</th>
                                {user.role !== 'syarikat' && <th className="p-4 font-semibold">Syarikat</th>}
                                <th className="p-4 font-semibold">Laluan Dirancang</th>
                                <th className="p-4 font-semibold">Kenderaan & Pemandu</th>
                                <th className="p-4 font-semibold text-right">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Tiada rekod dijumpai.</td></tr>
                            ) : filteredRecords.map((record: any, idx: number) => (
                                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="font-medium text-blue-600" title="ID Sistem (QR)">{record.id}</div>
                                        {record.noPendaftaranRasmi && (
                                            <div className="text-xs font-bold text-slate-700 mt-0.5">Daftar: {record.noPendaftaranRasmi}</div>
                                        )}
                                        <div className="mt-1">{getStatusBadge(record.status)}</div>
                                    </td>
                                    {user.role !== 'syarikat' && <td className="p-4 text-sm text-gray-800">{record.companyName}</td>}
                                    <td className="p-4 text-sm text-gray-600">
                                        <div className="font-medium text-xs text-blue-800 bg-blue-50 inline-block px-2 py-0.5 rounded border border-blue-100 mb-1 max-w-[200px] sm:max-w-xs whitespace-normal break-words">
                                            {record.routeParams && record.routeParams.length > 0 
                                                ? record.routeParams.map((s: string) => s.replace('ICQS ', '').toUpperCase()).join(' ➔ ')
                                                : 'LALUAN TIDAK DIKETAHUI'}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-800">
                                        <div className="font-semibold uppercase">{record.noDaftarKenderaan}</div>
                                        <div className="text-xs text-gray-500 uppercase">{record.namaPemandu}</div>
                                    </td>
                                    <td className="p-4 text-right space-x-1 whitespace-nowrap">
                                        {(user.role === 'pegawai' || user.role === 'admin') && (
                                            <button onClick={() => onTrack(record)} className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 p-2 rounded inline-flex items-center text-sm font-medium border border-emerald-200 shadow-sm" title="Log / Sahkan">
                                                <IconActivity />
                                            </button>
                                        )}
                                        <button onClick={() => onPrint(record)} className="text-slate-600 hover:bg-slate-100 p-2 rounded inline-flex items-center border border-slate-200" title="Papar Dokumen / Cetak">
                                            <IconFile />
                                        </button>
                                        
                                        {/* HAK PEMBATALAN (PEGAWAI / ADMIN SAHAJA) */}
                                        {record.status !== 'Dibatalkan' && (user.role === 'pegawai' || user.role === 'admin') && (
                                            <button onClick={() => setDeleteTarget(record.id)} className="text-amber-500 hover:bg-amber-50 p-2 rounded inline-flex items-center border border-amber-200" title="Batal Borang">
                                                <IconCancel />
                                            </button>
                                        )}

                                        {/* BUTANG HARD DELETE (HANYA SUPERADMIN) */}
                                        {user.role === 'admin' && (
                                            <button onClick={() => {
                                                if(window.confirm(`AMARAN TERTINGGI:\n\nAdakah anda pasti ingin memadam rekod ${record.id} SEPENUHNYA?\n\nRekod ini akan dipadam terus dari sistem dan tidak boleh dikembalikan!`)) {
                                                    onHardDelete(record.id);
                                                }
                                            }} className="text-red-600 hover:bg-red-100 p-2 rounded inline-flex items-center border border-red-200" title="Padam Terus (Hard Delete)">
                                                <IconTrash />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

// ==========================================
// 3. KOMPONEN BORANG ASAL (27 PERKARA + NO DAFTAR AUTO)
// ==========================================
const FormView = ({ user, usersList, record, onSave, onCancel }: any) => {
    const isEdit = !!record;
    const syarikatList = usersList.filter((u: any) => u.role === 'syarikat');

    const [formData, setFormData] = useState(record || {
        status: 'Menunggu Pelepasan', transitLogs: [], noPendaftaranRasmi: '',
        routeId: '', routeParams: [], companyId: user.role === 'syarikat' ? user.id : '', companyName: user.role === 'syarikat' ? user.name : '',
        stesenPenghantar: '', stesenPenerima: '', konsainor: '', konsainee: '', destinasiAsal: '', destinasiAkhir: '',
        noDaftarKenderaan: '', jenisKenderaan: '', noKontena: '-', namaPemandu: '',
        dokumenDisertakan: { invoice: false, packingList: false, deliveryOrder: false },
        invoiceNo: '', packingListNo: '', deliveryOrderNo: '',
        items: [{ bil: 1, diskripsi: '', kuantiti: '', nilai: '', noInvois: '', destinasi: '' }],
        jumlahBungkusan: '', ukuran: '', beratKasar: '', namaPembuatAkaun: user.name, jawatan: '', noPengenalan: ''
    });

    const handleChange = (e: any) => {
        const { name, value, checked } = e.target;
        
        if (name === 'routeId') {
            const selectedRoute = PREDEFINED_ROUTES.find(r => r.id === value);
            if(selectedRoute) {
                setFormData((prev: any) => ({ 
                    ...prev, 
                    routeId: value, 
                    routeParams: selectedRoute.stations,
                    stesenPenghantar: selectedRoute.stations[0],
                    stesenPenerima: selectedRoute.stations[selectedRoute.stations.length - 1]
                }));
            } else {
                setFormData((prev: any) => ({ ...prev, routeId: '', routeParams: [], stesenPenghantar: '', stesenPenerima: '' }));
            }
        } else if (name === 'companyIdSelector') {
            const selectedSyarikat = syarikatList.find((s: any) => s.id === value);
            setFormData((prev: any) => ({
                ...prev,
                companyId: selectedSyarikat ? selectedSyarikat.id : '',
                companyName: selectedSyarikat ? selectedSyarikat.name : ''
            }));
        } else if (name.startsWith('doc_')) {
            const docType = name.replace('doc_', '');
            setFormData((prev: any) => ({ ...prev, dokumenDisertakan: { ...prev.dokumenDisertakan, [docType]: checked } }));
        } else {
            setFormData((prev: any) => ({ ...prev, [name]: value }));
        }
    };
    const handleItemChange = (index: number, field: string, value: string) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData((prev: any) => ({ ...prev, items: newItems }));
    };
    const addItemRow = () => setFormData((prev: any) => ({ ...prev, items: [...prev.items, { bil: prev.items.length + 1, diskripsi: '', kuantiti: '', nilai: '', noInvois: '', destinasi: '' }] }));
    const removeItemRow = (index: number) => {
        if (formData.items.length > 1) {
            const newItems = formData.items.filter((_: any, i: number) => i !== index).map((item: any, i: number) => ({ ...item, bil: i + 1 }));
            setFormData((prev: any) => ({ ...prev, items: newItems }));
        }
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if(!formData.routeId) return alert("Sila pilih laluan perjalanan.");
        if((user.role === 'pegawai' || user.role === 'admin') && !formData.companyId) return alert("Sila pilih Syarikat Pemohon.");

        let totalQty = formData.items.reduce((sum: number, item: any) => sum + (parseFloat(item.kuantiti) || 0), 0);
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        const dateString = `${pad(now.getDate())}/${pad(now.getMonth()+1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
        
        let generatedNoDaftar = formData.noPendaftaranRasmi;
        if (!isEdit && !generatedNoDaftar) {
            const mm = pad(now.getMonth() + 1);
            const yy = now.getFullYear().toString().slice(-2);
            const randomNum = Math.floor(100000 + Math.random() * 900000).toString();
            
            let prefix = 'SYS';
            if ((formData.stesenPenghantar||'').includes('Mengkalap')) prefix = 'Y4S';
            else if ((formData.stesenPenghantar||'').includes('Sungai Tujuh')) prefix = 'STJ';
            else if ((formData.stesenPenghantar||'').includes('Pandaruan')) prefix = 'PND';
            else if ((formData.stesenPenghantar||'').includes('Tedungan')) prefix = 'TDG';
            
            generatedNoDaftar = `${prefix}-${mm}-${randomNum}/${yy}`;
        }

        const finalRecord = {
            ...formData,
            id: isEdit ? formData.id : `TR-${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            dateSubmitted: isEdit ? formData.dateSubmitted : dateString,
            jumlahBungkusan: formData.jumlahBungkusan || totalQty,
            noPendaftaranRasmi: generatedNoDaftar
        };
        onSave(finalRecord);
    };

    return (
        <div className="flex-grow p-4 md:p-8 pb-20 no-print">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{isEdit ? 'Sunting Deklarasi' : 'Borang Deklarasi Transit Baru'}</h2>
                    <button type="button" onClick={onCancel} className="text-slate-500 hover:text-slate-800 font-medium">Batal & Kembali</button>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                    
                    {(user.role === 'pegawai' || user.role === 'admin') && !isEdit && (
                        <div className="p-4 bg-amber-50 border-b border-amber-200">
                            <label className="block text-sm font-bold text-amber-800 mb-1">MENGISI BAGI PIHAK SYARIKAT (PILIH SYARIKAT):</label>
                            <select name="companyIdSelector" required value={formData.companyId} onChange={handleChange} className="w-full p-2 border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 outline-none bg-white">
                                <option value="">-- Sila Pilih Syarikat --</option>
                                {syarikatList.map((s: any) => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="p-6 border-b border-slate-100 bg-slate-50">
                        <h3 className="font-semibold text-slate-700 mb-4 flex items-center"><span className="bg-blue-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs mr-2">1</span>Laluan Perjalanan (Wajib)</h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Laluan <span className="text-red-500">*</span></label>
                            <select name="routeId" required value={formData.routeId} onChange={handleChange} className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-blue-900">
                                <option value="">-- Pilih Laluan Tetap --</option>
                                {PREDEFINED_ROUTES.map(r => (
                                    <option key={r.id} value={r.id}>{r.label}</option>
                                ))}
                            </select>
                            {formData.routeId && (
                                <p className="mt-2 text-xs text-gray-500">Stesen Terlibat: {formData.routeParams.join(' ➔ ')}</p>
                            )}
                        </div>
                    </div>

                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-semibold text-slate-700 mb-4 flex items-center"><span className="bg-blue-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs mr-2">2</span>Maklumat Entiti & Pengangkutan</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div><label className="block text-sm mb-1">3. Konsainor</label><textarea name="konsainor" required rows={2} value={formData.konsainor} onChange={handleChange} className="w-full p-2 border rounded border-slate-300"></textarea></div>
                            <div><label className="block text-sm mb-1">4. Konsainee</label><textarea name="konsainee" required rows={2} value={formData.konsainee} onChange={handleChange} className="w-full p-2 border rounded border-slate-300"></textarea></div>
                            <div><label className="block text-sm mb-1">8. Destinasi Asal</label><input type="text" name="destinasiAsal" value={formData.destinasiAsal} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded" /></div>
                            <div><label className="block text-sm mb-1">9. Destinasi Akhir</label><input type="text" name="destinasiAkhir" value={formData.destinasiAkhir} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded" /></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div><label className="block text-sm mb-1">10. No. Daftar Kenderaan</label><input type="text" name="noDaftarKenderaan" required value={formData.noDaftarKenderaan} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded uppercase" /></div>
                            <div><label className="block text-sm mb-1">11. Jenis Kenderaan</label><input type="text" name="jenisKenderaan" value={formData.jenisKenderaan} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded" /></div>
                            <div><label className="block text-sm mb-1">12. No. Kontena</label><input type="text" name="noKontena" value={formData.noKontena} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded" /></div>
                            <div><label className="block text-sm mb-1">13. Nama Pemandu</label><input type="text" name="namaPemandu" required value={formData.namaPemandu} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded uppercase" /></div>
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">14. Dokumen Yang Disertakan</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex items-center space-x-2"><input type="checkbox" name="doc_invoice" checked={formData.dokumenDisertakan.invoice} onChange={handleChange} className="w-4 h-4" /><label className="text-sm">Invoices No:</label><input type="text" name="invoiceNo" value={formData.invoiceNo} onChange={handleChange} disabled={!formData.dokumenDisertakan.invoice} className="flex-1 p-1 border-b border-slate-300 text-sm outline-none" /></div>
                                <div className="flex items-center space-x-2"><input type="checkbox" name="doc_packingList" checked={formData.dokumenDisertakan.packingList} onChange={handleChange} className="w-4 h-4" /><label className="text-sm">Packing List:</label><input type="text" name="packingListNo" value={formData.packingListNo} onChange={handleChange} disabled={!formData.dokumenDisertakan.packingList} className="flex-1 p-1 border-b border-slate-300 text-sm outline-none" /></div>
                                <div className="flex items-center space-x-2"><input type="checkbox" name="doc_deliveryOrder" checked={formData.dokumenDisertakan.deliveryOrder} onChange={handleChange} className="w-4 h-4" /><label className="text-sm">Delivery Order:</label><input type="text" name="deliveryOrderNo" value={formData.deliveryOrderNo} onChange={handleChange} disabled={!formData.dokumenDisertakan.deliveryOrder} className="flex-1 p-1 border-b border-slate-300 text-sm outline-none" /></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-b border-slate-100 bg-slate-50">
                        <h3 className="font-semibold text-slate-700 mb-4 flex items-center"><span className="bg-blue-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs mr-2">3</span>Senarai Barang</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border bg-white border-slate-300">
                                <thead className="bg-slate-200">
                                    <tr><th className="p-2 border border-slate-300">Diskripsi</th><th className="p-2 border border-slate-300 w-24">Kuantiti</th><th className="p-2 border border-slate-300 w-32">Nilai (RM)</th><th className="p-2 border border-slate-300 w-12"></th></tr>
                                </thead>
                                <tbody>
                                    {formData.items.map((item: any, index: number) => (
                                        <tr key={index}>
                                            <td className="p-0 border border-slate-300"><input type="text" required value={item.diskripsi} onChange={(e) => handleItemChange(index, 'diskripsi', e.target.value)} className="w-full p-2 outline-none" /></td>
                                            <td className="p-0 border border-slate-300"><input type="number" required value={item.kuantiti} onChange={(e) => handleItemChange(index, 'kuantiti', e.target.value)} className="w-full p-2 outline-none text-center" /></td>
                                            <td className="p-0 border border-slate-300"><input type="number" step="0.01" value={item.nilai} onChange={(e) => handleItemChange(index, 'nilai', e.target.value)} className="w-full p-2 outline-none text-right" /></td>
                                            <td className="p-1 text-center border border-slate-300"><button type="button" onClick={() => removeItemRow(index)} className="text-red-500 font-bold" disabled={formData.items.length === 1}>&times;</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button type="button" onClick={addItemRow} className="text-sm text-blue-600 font-medium mt-2 flex items-center"><IconPlus/><span className="ml-1">Tambah Barisan</span></button>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-200">
                            <div><label className="block text-sm mb-1">22. Jumlah Bungkusan</label><input type="number" name="jumlahBungkusan" value={formData.jumlahBungkusan} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded" /></div>
                            <div><label className="block text-sm mb-1">23. Ukuran (m3)</label><input type="number" step="0.01" name="ukuran" value={formData.ukuran} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded" /></div>
                            <div><label className="block text-sm mb-1">24. Berat kasar (kg)</label><input type="number" step="0.01" name="beratKasar" value={formData.beratKasar} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded" /></div>
                        </div>
                    </div>

                    <div className="p-6">
                        <h3 className="font-semibold text-slate-700 mb-4 flex items-center"><span className="bg-blue-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs mr-2">4</span>Pengesahan</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div><label className="block text-sm mb-1">25. Nama Pembuat Akaun</label><input type="text" name="namaPembuatAkaun" required value={formData.namaPembuatAkaun} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded uppercase" /></div>
                            <div><label className="block text-sm mb-1">26. Jawatan</label><input type="text" name="jawatan" value={formData.jawatan} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded" /></div>
                            <div><label className="block text-sm mb-1">No. NRIC / Passport</label><input type="text" name="noPengenalan" required value={formData.noPengenalan} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded" /></div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-200 flex justify-end space-x-3 bg-white sticky bottom-0">
                        <button type="button" onClick={onCancel} className="px-6 py-2 border rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Batal</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow flex items-center">
                            Hantar & Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ==========================================
// 4. KOMPONEN KEMASKINI STATUS / LOG (LALUAN KETAT)
// ==========================================
const TrackingView = ({ user, record, onSave, onBack }: any) => {
    const isCompleted = record.status === 'Selesai';
    const isCancelled = record.status === 'Dibatalkan';
    
    const myStationIndex = record.routeParams.indexOf(user.stesen);
    const myStationName = user.stesen || 'Admin';
    const isMyStationInRoute = myStationIndex !== -1 || user.role === 'admin';
    
    let lastValidatedIndex = -1;
    // Semakan berurutan (Strict sequence check)
    for (let i = 0; i < record.routeParams.length; i++) {
        if (record.transitLogs.some((log: any) => log.stesen === record.routeParams[i])) {
            lastValidatedIndex = i;
        } else {
            break;
        }
    }

    const expectedNextIndex = lastValidatedIndex + 1;
    const isMyTurn = (myStationIndex === expectedNextIndex) || user.role === 'admin';

    let statusMessage = "";
    if (isCancelled) {
        statusMessage = "Borang ini telah dibatalkan.";
    } else if (!isMyStationInRoute) {
        statusMessage = "Lori ini tidak melalui stesen anda.";
    } else if (isCompleted) {
        statusMessage = "Perjalanan lori ini telah disahkan selesai.";
    } else if (record.transitLogs.some((log: any) => log.stesen === user.stesen) && user.role !== 'admin') {
         statusMessage = "Anda telah mengesahkan perjalanan lori ini di stesen anda.";
    } else if (!isMyTurn) {
        statusMessage = `DITOLAK: Sistem memerlukan pengesahan dari ${record.routeParams[expectedNextIndex] || 'Stesen Terdahulu'} terlebih dahulu mengikut laluan yang didaftarkan.`;
    }

    const canVerify = isMyStationInRoute && isMyTurn && !isCompleted && !isCancelled && !(record.transitLogs.some((log: any) => log.stesen === user.stesen) && user.role !== 'admin');

    const handleUpdateStatus = () => {
        if (!canVerify) return;

        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        const dateTimeStr = `${pad(now.getDate())}/${pad(now.getMonth()+1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

        const isPenerimaAkhir = (myStationIndex === record.routeParams.length - 1);
        
        let newStatus = (isPenerimaAkhir || user.role === 'admin') ? 'Selesai' : 'Dalam Transit';
        let actionDesc = myStationIndex === 0 ? 'Pelepasan Stesen Asal' : (isPenerimaAkhir ? 'Tiba di Stesen Penerima (Selesai)' : 'Transit / Singgah');

        if(user.role === 'admin') actionDesc = 'Semakan Selesai (Force Close) oleh Superadmin';

        const newLog = {
            id: Date.now(),
            tarikhMasa: dateTimeStr,
            stesen: user.stesen || 'Admin (HQ)',
            pegawai: user.name,
            tindakan: actionDesc
        };

        const updatedRecord = {
            ...record,
            status: newStatus,
            transitLogs: [...record.transitLogs, newLog]
        };

        onSave(updatedRecord);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 no-print">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Garis Masa Perjalanan (Route Sequence)</h2>
                    <button onClick={onBack} className="text-slate-500 hover:text-slate-800 border px-3 py-1 rounded bg-white font-medium">Kembali</button>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-6">
                    <div className="p-4 bg-slate-900 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="text-xs text-slate-400">ID Rujukan Sistem (QR)</div>
                            <div className="font-mono text-lg font-bold text-slate-100">{record.id}</div>
                            {record.noPendaftaranRasmi && (
                                <div className="text-sm mt-1 text-blue-300">
                                    No. Pendaftaran Rasmi: <span className="text-white font-bold">{record.noPendaftaranRasmi}</span>
                                </div>
                            )}
                        </div>
                        <div className="md:text-right">
                            <div className="text-xs text-slate-400">Status Semasa</div>
                            <div className={`font-bold ${record.status === 'Selesai' ? 'text-green-400' : 'text-amber-400'}`}>{record.status}</div>
                        </div>
                    </div>
                    
                    <div className="p-6 bg-blue-50 border-b border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-2">Laluan Dideklarasikan:</h3>
                        <div className="flex items-center space-x-2 text-sm text-blue-800 overflow-x-auto pb-2 whitespace-nowrap">
                            {record.routeParams.map((stn: string, idx: number) => (
                                <React.Fragment key={idx}>
                                    <span className={`px-2 py-1 rounded border ${record.transitLogs.some((l: any) => l.stesen === stn) ? 'bg-green-100 border-green-300 text-green-800 font-semibold' : 'bg-white border-blue-200'}`}>
                                        {stn}
                                    </span>
                                    {idx < record.routeParams.length - 1 && <span>➔</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50">
                        <h3 className="font-semibold text-slate-700 mb-4 flex items-center"><IconActivity /> <span className="ml-2">Log Pergerakan Sebenar</span></h3>
                        
                        {record.transitLogs.length === 0 ? (
                            <div className="text-center text-gray-500 py-4 italic border border-dashed rounded-lg bg-white">Lori belum dilepaskan dari stesen pertama.</div>
                        ) : (
                            <div className="space-y-4">
                                {record.transitLogs.map((log: any, index: number) => (
                                    <div key={log.id} className="flex relative">
                                        {index !== record.transitLogs.length - 1 && <div className="absolute top-6 bottom-[-16px] left-3 w-0.5 bg-gray-200"></div>}
                                        <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ring-4 ring-slate-50 text-white ${log.tindakan.startsWith('DIBATALKAN') ? 'bg-red-500' : 'bg-green-500'}`}>
                                            {log.tindakan.startsWith('DIBATALKAN') ? <span className="font-bold text-xs">X</span> : <IconCheck />}
                                        </div>
                                        <div className="ml-4 bg-white p-3 border rounded-lg shadow-sm flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="font-bold text-slate-800">{log.stesen}</div>
                                                <div className="text-xs text-slate-500">{log.tarikhMasa}</div>
                                            </div>
                                            <div className={`text-sm font-medium ${log.tindakan.startsWith('DIBATALKAN') ? 'text-red-600' : 'text-blue-600'}`}>{log.tindakan}</div>
                                            <div className="text-xs text-gray-500 mt-1">Oleh: {log.pegawai}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-6 text-center border-t border-slate-200 bg-white">
                        {canVerify ? (
                            <>
                                <p className="mb-4 text-sm text-gray-600">Tekan butang di bawah untuk mengesahkan bahawa kenderaan ini telah tiba/melalui stesen anda <b>({myStationName})</b>.</p>
                                <button onClick={handleUpdateStatus} className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all font-bold text-lg flex justify-center items-center mx-auto">
                                    <IconCheck /> <span className="ml-2">Sahkan Transaksi di {myStationName}</span>
                                </button>
                            </>
                        ) : (
                            <div className={`p-4 rounded-lg text-sm font-medium ${isCancelled ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                                {statusMessage}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 5. KOMPONEN PAPARAN CETAK / PDF (A4 KETAT)
// ==========================================
const PrintView = ({ record, onBack }: any) => {
    if (!record) return null;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(record.id)}`;
    
    const getLogForStation = (stationKey: string) => {
        const searchKeyword = stationKey === 'Sg. Tujoh' ? 'sungai tujuh' : stationKey.toLowerCase();
        return record.transitLogs.find((log: any) => (log.stesen||'').toLowerCase().includes(searchKeyword));
    };

    return (
        <div className="flex-grow bg-gray-200 py-8 print:bg-white print:py-0 print:m-0 print:absolute print:inset-0 print:w-screen print:h-screen z-50 overflow-visible">
            <div className="max-w-[210mm] mx-auto mb-4 flex justify-between items-center no-print px-4">
                <button onClick={onBack} className="bg-white px-4 py-2 rounded-lg shadow font-medium text-gray-700 hover:bg-gray-50">&larr; Kembali</button>
                <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow font-medium flex items-center space-x-2 hover:bg-blue-700">
                    <IconPrinter /> <span>Cetak Borang</span>
                </button>
            </div>

            <div className="print-area bg-white mx-auto shadow-2xl print:shadow-none relative outline outline-[1px] outline-slate-200" style={{ width: '210mm', minHeight: '297mm', padding: '15mm', boxSizing: 'border-box' }}>
                {record.status === 'Selesai' && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0 no-print-bg">
                        <div className="text-[150px] font-bold text-green-600 transform -rotate-45">SELESAI</div>
                    </div>
                )}
                {record.status === 'Dibatalkan' && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0 no-print-bg">
                        <div className="text-[110px] font-bold text-red-600 transform -rotate-45 border-[8px] border-red-600 px-8 py-4">DIBATALKAN</div>
                    </div>
                )}

                <div className="text-center mb-6 flex justify-between items-center">
                    <div className="w-24 flex items-center justify-center">
                        {/* LOGO KASTAM DI PDF (SEBELAH KIRI - DITENGAHKAN SECARA MENDATAR) */}
                        <LogoKastam className="w-20 h-20 object-contain grayscale print:grayscale-0" />
                    </div>
                    <div className="flex-1 font-serif">
                        <h1 className="font-bold text-sm">JABATAN KASTAM DIRAJA MALAYSIA</h1>
                        <h2 className="font-semibold text-xs">(ROYAL MALAYSIAN CUSTOMS DEPARTMENT)</h2>
                        <h3 className="font-bold text-sm mt-2">PERMOHONAN KEBENARAN UNTUK MEMINDAHKAN DAGANGAN TEMPATAN</h3>
                        <p className="text-[10px]">(APPLICATION FOR APPROVAL TO REMOVE GOODS)</p>
                    </div>
                    <div className="w-24 flex flex-col items-center justify-center">
                        <img src={qrCodeUrl} alt="QR Code" className="w-20 h-20 border border-gray-300 p-1" />
                        <div className="text-[9px] mt-1 text-center w-full font-mono font-bold">{record.id}</div>
                    </div>
                </div>

                <div className="border-2 print-border border-black flex flex-col text-[11px] print-text relative z-10 bg-white/90 print:bg-transparent">
                    <div className="flex border-b border-black">
                        <div className="w-1/2 border-r border-black flex flex-col">
                            <div className="p-1.5 min-h-[50px] border-b border-black"><div className="font-bold">1. Stesen Penghantar <span className="font-normal italic">/ Sending Station</span></div><div className="mt-1 font-semibold pl-2">{record.stesenPenghantar}</div></div>
                            <div className="p-1.5 min-h-[50px]"><div className="font-bold">2. Stesen Penerima Terakhir <span className="font-normal italic">/ Last Receiving Station</span></div><div className="mt-1 font-semibold pl-2">{record.stesenPenerima}</div></div>
                        </div>
                        <div className="w-1/2 flex flex-col bg-gray-100 print:bg-gray-100">
                            <div className="p-1 text-center border-b border-black font-bold uppercase">UNTUK KEGUNAAN RASMI / FOR OFFICIAL USE</div>
                            <div className="flex border-b border-black flex-1">
                                <div className="w-1/2 p-1.5 border-r border-black"><div className="font-bold">5. Tarikh Waktu Terima</div><div className="mt-2 text-center font-mono font-bold">{(record.dateSubmitted || '').split(' ')[0]}</div></div>
                                <div className="w-1/2 p-1.5"><div className="font-bold">6. No. Pendaftaran</div><div className="mt-2 text-center font-mono text-sm font-bold text-blue-900 print:text-black">{record.noPendaftaranRasmi || '-'}</div></div>
                            </div>
                            <div className="p-1 flex-1 flex flex-col justify-between">
                                <div><div className="font-bold">7. Pegawai Kastam Yang Hak</div></div>
                                <div className="mt-1 text-center text-[9px]"><div className="inline-block border-t border-black w-24 mt-6">Tandatangan Cop Rasmi</div></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex border-b border-black">
                        <div className="w-1/2 p-1.5 border-r border-black min-h-[50px]"><div className="font-bold">3. Konsainor (Pengirim)</div><div className="mt-1 pl-2 whitespace-pre-wrap">{record.konsainor}</div></div>
                        <div className="w-1/2 flex flex-col">
                            <div className="p-1.5 border-b border-black min-h-[25px]"><div className="font-bold">8. Destinasi asal</div><div className="pl-2">{record.destinasiAsal || '-'}</div></div>
                            <div className="p-1.5 min-h-[25px]"><div className="font-bold">9. Destinasi akhir</div><div className="pl-2">{record.destinasiAkhir || '-'}</div></div>
                        </div>
                    </div>

                    <div className="flex border-b border-black">
                        <div className="w-1/2 p-1.5 border-r border-black min-h-[50px]"><div className="font-bold">4. Konsainee (Penerima)</div><div className="mt-1 pl-2 whitespace-pre-wrap">{record.konsainee}</div></div>
                        <div className="w-1/2 flex flex-col">
                            <div className="flex border-b border-black flex-1">
                                <div className="w-1/2 p-1.5 border-r border-black"><div className="font-bold">10. No. Kenderaan</div><div className="font-bold uppercase text-center mt-1">{record.noDaftarKenderaan}</div></div>
                                <div className="w-1/2 p-1.5"><div className="font-bold">11. Jenis</div><div className="text-center mt-1">{record.jenisKenderaan || '-'}</div></div>
                            </div>
                            <div className="flex flex-1">
                                <div className="w-1/2 p-1.5 border-r border-black"><div className="font-bold">12. No. Kontena</div><div className="text-center mt-1">{record.noKontena || '-'}</div></div>
                                <div className="w-1/2 p-1.5"><div className="font-bold">13. Nama Pemandu</div><div className="uppercase text-center mt-1 font-bold">{record.namaPemandu}</div></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-1.5 border-b border-black bg-gray-50 print:bg-gray-50">
                        <div className="font-bold">14. Dokumen yang disertakan</div>
                        <div className="flex space-x-6 mt-1 ml-4 pb-1">
                            <div className="flex items-center space-x-1">
                                <div className="w-3 h-3 border border-black flex items-center justify-center text-[9px] bg-white">{record.dokumenDisertakan?.invoice ? '✓' : ''}</div>
                                <span>Invoices No: <b>{record.invoiceNo}</b></span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="w-3 h-3 border border-black flex items-center justify-center text-[9px] bg-white">{record.dokumenDisertakan?.packingList ? '✓' : ''}</div>
                                <span>Packing List No: <b>{record.packingListNo}</b></span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="w-3 h-3 border border-black flex items-center justify-center text-[9px] bg-white">{record.dokumenDisertakan?.deliveryOrder ? '✓' : ''}</div>
                                <span>Delivery Order No: <b>{record.deliveryOrderNo}</b></span>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-black min-h-[80px] flex flex-col">
                        <div className="flex border-b border-black font-bold text-center items-center bg-gray-50 print:bg-gray-50">
                            <div className="w-8 p-1 border-r border-black">15. Bil</div>
                            <div className="flex-1 p-1 border-r border-black">16. Diskripsi</div>
                            <div className="w-14 p-1 border-r border-black">17. Kuantiti</div>
                            <div className="w-20 p-1 border-r border-black">18. Nilai (RM)</div>
                            <div className="w-20 p-1 border-r border-black">19. No. Invois</div>
                            <div className="w-24 p-1">20. Destinasi</div>
                        </div>
                        {(record.items||[]).map((item: any, idx: number) => (
                            <div key={idx} className="flex border-b border-dotted border-gray-400 last:border-b-0 flex-1">
                                <div className="w-8 p-1 border-r border-black text-center">{item.bil}</div>
                                <div className="flex-1 p-1 border-r border-black pl-1">{item.diskripsi}</div>
                                <div className="w-14 p-1 border-r border-black text-center">{item.kuantiti}</div>
                                <div className="w-20 p-1 border-r border-black text-right pr-1">{parseFloat(item.nilai || 0).toFixed(2)}</div>
                                <div className="w-20 p-1 border-r border-black text-center">{item.noInvois}</div>
                                <div className="w-24 p-1 text-center">{item.destinasi}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex border-b border-black">
                        <div className="w-3/5 p-1.5 border-r border-black">
                            <div className="flex justify-between font-bold mb-2 w-11/12 mx-auto">
                                <span>22. Jumlah bungkusan: {record.jumlahBungkusan}</span>
                                <span>23. Ukuran (m3): {record.ukuran || '-'}</span>
                                <span>24. Berat kasar (kg): {record.beratKasar || '-'}</span>
                            </div>
                            <div className="border-t border-black pt-1.5">
                                <div className="font-bold">25. Nama Pembuat Akaun: <span className="font-normal uppercase">{record.namaPembuatAkaun}</span></div>
                                <div className="flex justify-between mt-1 w-11/12">
                                    <div className="font-bold">26. Jawatan: <span className="font-normal">{record.jawatan || '-'}</span></div>
                                    <div className="font-bold">No. NRIC / Passport: <span className="font-normal">{record.noPengenalan}</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="w-2/5 p-1.5 relative">
                            <div className="font-bold text-[9px] leading-tight">27. Pengesahan ikrar</div>
                            <div className="absolute bottom-2 right-2 text-center">
                                <div className="border-b border-black w-24 mb-1 inline-block italic text-blue-800 font-bold print:text-black">Disahkan Digital ✔</div>
                                <div className="text-[9px]">Tarikh: {record.dateSubmitted}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-100 print:bg-gray-100 p-1 border-b border-black text-center font-bold">
                        UNTUK KEGUNAAN STESEN KASTAM PENERIMA / FOR OFFICIAL USE OF RECEIVING CUSTOMS STATION<br/>
                        <span className="font-normal italic text-[10px]">Pengesahan Penerimaan Barang-barang Transit / Received Vertifications Of Goods In-Transit</span>
                    </div>

                    <div className="flex min-h-[80px]">
                        {['Sg. Tujoh', 'Pandaruan', 'Tedungan', 'Mengkalap'].map((stationKey, idx) => {
                            const stesenLog = getLogForStation(stationKey);
                            
                            return (
                                <div key={idx} className="w-1/4 p-1.5 border-r border-black last:border-r-0 flex flex-col justify-between relative">
                                    <div className="font-bold text-[9px] uppercase">28. {stationKey}</div>
                                    
                                    {stesenLog ? (
                                        <div className="mt-1 text-[8px] space-y-1 z-10 print-text bg-white/80 print:bg-transparent">
                                            <div className="border-b border-black w-full pb-0.5 font-bold italic text-blue-800 print:text-black flex items-center"><IconCheck/> Disahkan Digital</div>
                                            <div>Pegawai:<br/><b className="text-[9px] uppercase">{stesenLog.pegawai}</b></div>
                                            <div>Masa:<br/><b>{stesenLog.tarikhMasa}</b></div>
                                        </div>
                                    ) : (
                                        <div className="mt-2 text-[8px] space-y-1">
                                            <div className="border-b border-dotted border-black w-full pb-0.5 text-transparent">-</div>
                                            <div>Pegawai:</div>
                                            <div>Tarikh:</div>
                                            <div className="text-center mt-1 border border-black w-10 h-10 mx-auto rounded-full flex items-center justify-center text-[7px] text-gray-400">Cop Rasmi</div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div className="mt-2 text-[9px] italic text-justify leading-tight flex justify-between">
                    <span>Nota: Sekiranya terdapat barang-barang dipunggah sebahagiannya, pemandu hendaklah memaklumkan kepada pegawai pemeriksa.</span>
                    <span className="font-semibold text-gray-500">Dijana secara digital oleh Sistem e-Transit Kastam</span>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 6. KOMPONEN LAPORAN & PENGURUSAN
// ==========================================
const ReportView = ({ user, records }: any) => {
    const [activeTab, setActiveTab] = useState('Selesai'); 
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStesen, setFilterStesen] = useState(user?.stesen || 'Semua Stesen');
    
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const formatDateForInput = (date: Date) => `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`;
    const [startDate, setStartDate] = useState(formatDateForInput(firstDayOfMonth));
    const [endDate, setEndDate] = useState(formatDateForInput(today));
    
    const defaultCatConfig = `BERAS : beras, rice\nSPARE PART & ALAT GANTI : spare part, alat ganti, komponen, auto part\nMINYAK MASAK : minyak masak, cooking oil\nTAYAR : tayar, tire, tyre\nBESI & KELULI : besi, keluli, logam, steel\nSAYUR & BUAH-BUAHAN : sayur, sayuran, buah, buahan, fruit, veg`;
    const [focusCategories, setFocusCategories] = useState(defaultCatConfig);

    const parseRecDate = (dateStr: string) => {
        if (!dateStr) return new Date(0);
        const parts = dateStr.split(' ');
        const dateParts = parts[0].split('/');
        if(dateParts.length !== 3) return new Date(0);
        return new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${parts[1] || '00:00'}:00`);
    };

    const sDate = startDate ? new Date(startDate + 'T00:00:00') : new Date(0);
    const eDate = endDate ? new Date(endDate + 'T23:59:59') : new Date();

    const filteredRecords = records.filter((r: any) => {
        if (activeTab === 'Selesai' && r.status !== 'Selesai') return false;
        if (activeTab === 'Dibatalkan' && r.status !== 'Dibatalkan') return false;
        if (activeTab === 'Pending' && (r.status === 'Selesai' || r.status === 'Dibatalkan')) return false;
        const rDate = parseRecDate(r.dateSubmitted);
        if (rDate < sDate || rDate > eDate) return false;
        if (filterStesen !== 'Semua Stesen' && r.stesenPenghantar !== filterStesen) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const isMatch = (r.companyName||'').toLowerCase().includes(q) || (r.konsainor||'').toLowerCase().includes(q) || (r.konsainee||'').toLowerCase().includes(q) || (r.noDaftarKenderaan||'').toLowerCase().includes(q) || (r.id||'').toLowerCase().includes(q) || (r.noPendaftaranRasmi && r.noPendaftaranRasmi.toLowerCase().includes(q));
            if (!isMatch) return false;
        }
        return true;
    });

    let totalValue = 0;
    let totalBeratTan = 0;
    const routeSummary: any = {};
    const categorySummary: any = {};
    const categoryMap: any[] = [];
    focusCategories.split('\n').forEach(line => {
        if (!line.trim()) return;
        const parts = line.split(':');
        const mainCat = parts[0].trim().toUpperCase();
        let kws: string[] = parts.length > 1 ? parts[1].split(',').map(k => k.trim().toUpperCase()).filter(k => k) : [mainCat];
        if (mainCat) categoryMap.push({ mainCat, keywords: kws });
    });

    filteredRecords.forEach((rec: any) => {
        const loriBeratTan = parseFloat(rec.beratKasar || 0) / 1000;
        totalBeratTan += loriBeratTan;
        
        // PAPARAN SEMUA STESEN YANG TERLIBAT (Bukan mula & akhir sahaja)
        const routeName = rec.routeParams && rec.routeParams.length > 0 
            ? rec.routeParams.map((s: string) => s.replace('ICQS ', '')).join(' ➔ ') 
            : 'Laluan Tidak Ditetapkan';
        
        if (!routeSummary[routeName]) routeSummary[routeName] = 0;
        routeSummary[routeName]++;
        
        let recTotalValue = 0;
        const detectedCategories = new Set();
        (rec.items||[]).forEach((item: any) => {
            const itemValue = parseFloat(item.nilai || 0);
            recTotalValue += itemValue;
            totalValue += itemValue;
            const desc = (item.diskripsi || '').toUpperCase();
            let matchedCategory = 'GENERAL CARGO'; 
            for (let catObj of categoryMap) {
                if (catObj.keywords.some(kw => desc.includes(kw))) { matchedCategory = catObj.mainCat; break; }
            }
            detectedCategories.add(matchedCategory);
        });
        let finalLorryCategory = 'GENERAL CARGO';
        if (detectedCategories.size === 1) finalLorryCategory = [...detectedCategories][0] as string; 
        if (!categorySummary[finalLorryCategory]) categorySummary[finalLorryCategory] = { lori: 0, beratTan: 0, val: 0 };
        categorySummary[finalLorryCategory].lori += 1;
        categorySummary[finalLorryCategory].beratTan += loriBeratTan;
        categorySummary[finalLorryCategory].val += recTotalValue;
    });

    return (
        <div className="flex-grow bg-slate-50 print:bg-white w-full no-print">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center"><IconChart /><span className="ml-2">Laporan & Analisis Transit</span></h2>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center"><IconSearch/> <span className="ml-1">Carian Terperinci</span></label>
                            <input type="text" placeholder="Cari ID, No Daftar, Syarikat, Pemandu..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div className="md:w-56">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center">Stesen Asal</label>
                            <select value={filterStesen} onChange={e => setFilterStesen(e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700">
                                <option value="Semua Stesen">Semua Stesen</option>
                                <option value="ICQS Mengkalap">ICQS Mengkalap</option>
                                <option value="ICQS Pandaruan">ICQS Pandaruan</option>
                                <option value="ICQS Tedungan">ICQS Tedungan</option>
                                <option value="ICQS Sungai Tujuh">ICQS Sungai Tujuh</option>
                            </select>
                        </div>
                        <div className="md:w-48"><label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center"><IconCalendar/> <span className="ml-1">Dari Tarikh</span></label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                        <div className="md:w-48"><label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center"><IconCalendar/> <span className="ml-1">Hingga Tarikh</span></label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row gap-6">
                        <div className="flex-1"><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pemetaan Kategori Barangan Tumpuan (Kategori Utama : Sinonim 1, Sinonim 2)</label><textarea value={focusCategories} onChange={e => setFocusCategories(e.target.value)} className="w-full p-3 border border-blue-200 bg-blue-50 rounded focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm text-blue-900" rows={6} spellCheck={false}></textarea></div>
                        <div className="md:w-1/3 bg-slate-100 p-4 rounded-lg text-xs text-slate-600 leading-relaxed border border-slate-200"><strong className="text-slate-800 block mb-2">Peringatan Pengiraan Analisis:</strong><ul className="list-disc pl-4 space-y-1 mt-1"><li>Laporan ini berasaskan <b>Berat Kasar Lori (Tan)</b> & Nilai RM Keseluruhan.</li><li>Jika 1 lori bawa <i>beras</i> sahaja, lori = <b>BERAS</b>.</li><li>Jika lori bawa barang berlainan kategori, disatukan menjadi <b>GENERAL CARGO</b>.</li><li>Gunakan titik bertindih (:) untuk sinonim.</li></ul></div>
                    </div>
                </div>

                <div className="flex border-b border-slate-300 mb-2 overflow-x-auto">
                    <button onClick={() => setActiveTab('Selesai')} className={`px-6 py-3 font-bold text-sm outline-none transition-colors border-b-4 whitespace-nowrap ${activeTab === 'Selesai' ? 'border-green-500 text-green-700 bg-green-50' : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>BORANG SELESAI</button>
                    <button onClick={() => setActiveTab('Pending')} className={`px-6 py-3 font-bold text-sm outline-none transition-colors border-b-4 whitespace-nowrap ${activeTab === 'Pending' ? 'border-amber-500 text-amber-700 bg-amber-50' : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>DALAM TRANSIT (PENDING)</button>
                    <button onClick={() => setActiveTab('Dibatalkan')} className={`px-6 py-3 font-bold text-sm outline-none transition-colors border-b-4 whitespace-nowrap ${activeTab === 'Dibatalkan' ? 'border-red-500 text-red-700 bg-red-50' : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>BORANG DIBATALKAN</button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 md:p-8 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow border border-slate-200"><div className="text-xs text-slate-500 font-bold mb-1 uppercase">Jumlah Lori / Transaksi</div><div className="text-2xl font-black text-blue-800">{filteredRecords.length}</div></div>
                    <div className="bg-white p-4 rounded-xl shadow border border-slate-200"><div className="text-xs text-slate-500 font-bold mb-1 uppercase">Jum. Berat Kasar (Tan)</div><div className="text-2xl font-black text-green-800">{totalBeratTan.toFixed(2)} <span className="text-sm font-medium text-slate-500">Tan</span></div></div>
                    <div className="bg-white p-4 rounded-xl shadow border border-slate-200"><div className="text-xs text-slate-500 font-bold mb-1 uppercase">Nilai Keseluruhan (RM)</div><div className="text-2xl font-black text-purple-800">RM {totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</div></div>
                </div>

                {filteredRecords.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow border border-slate-200"><div className="p-3 bg-slate-100 border-b border-slate-200 font-bold text-sm">RUMUSAN LALUAN LORI</div><div className="p-4 grid grid-cols-1 gap-2">{Object.entries(routeSummary).map(([route, count]: any, idx: number) => (<div key={idx} className="flex justify-between items-center border-b border-dashed border-slate-200 pb-2"><span className="text-sm font-medium text-slate-700">{route}</span><span className="font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm">{count} Lori</span></div>))}</div></div>
                        <div className="bg-white rounded-xl shadow border border-slate-200"><div className="p-3 bg-slate-100 border-b border-slate-200 font-bold text-sm">PECAHAN MUATAN LORI MENGIKUT KATEGORI</div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-200"><th className="p-3 font-semibold text-slate-700">Kategori</th><th className="p-3 font-semibold text-slate-700 text-center">Bil. Lori</th><th className="p-3 font-semibold text-slate-700 text-right">Berat (Tan)</th><th className="p-3 font-semibold text-slate-700 text-right">Nilai (RM)</th></tr></thead><tbody>{Object.entries(categorySummary).sort((a:any,b:any) => b[1].val - a[1].val).map(([category, data]: any, idx: number) => (<tr key={idx} className="border-b border-dashed border-slate-200"><td className={`p-3 font-bold ${category.includes('GENERAL CARGO') ? 'text-gray-500' : 'text-blue-800'}`}>{category}</td><td className="p-3 text-center">{data.lori}</td><td className="p-3 text-right">{data.beratTan.toFixed(2)}</td><td className="p-3 text-right">RM {data.val.toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>))}</tbody></table></div></div>
                    </div>
                )}
                <div>
                    <div className="flex justify-between items-end mb-4 border-b-2 border-slate-800 pb-2">
                        <h3 className="font-bold text-lg">PERINCIAN BORANG & MUATAN (JADUAL EKSTRAK EKSPORT)</h3>
                        <p className="text-xs text-slate-500">Tandakan (highlight) jadual ini dan salin (copy) ke dalam Excel.</p>
                    </div>
                    {filteredRecords.length === 0 ? <div className="text-center p-8 bg-white border border-dashed rounded-xl text-slate-500">Tiada rekod dijumpai untuk tarikh/carian ini.</div> : (
                        <div className="overflow-x-auto bg-white border border-slate-300 shadow-sm"><table className="w-full text-[11px] sm:text-xs text-left border-collapse"><thead className="bg-slate-800 text-white whitespace-nowrap"><tr><th className="border border-slate-300 p-2">No. Pendaftaran</th><th className="border border-slate-300 p-2">{activeTab === 'Selesai' ? 'Tarikh Selesai' : 'Tarikh Mohon'}</th><th className="border border-slate-300 p-2 text-center">Status</th><th className="border border-slate-300 p-2 bg-blue-900">Senarai Barangan Sebenar</th><th className="border border-slate-300 p-2">Syarikat Pengikrar</th><th className="border border-slate-300 p-2">Laluan Terperinci</th><th className="border border-slate-300 p-2">No. Kenderaan</th><th className="border border-slate-300 p-2">Konsainor (Pengirim)</th><th className="border border-slate-300 p-2">Konsainee (Penerima)</th><th className="border border-slate-300 p-2 text-right">Berat Lori (Tan)</th><th className="border border-slate-300 p-2 text-right">Nilai (RM)</th><th className="border border-slate-300 p-2">Catatan/Sebab Batal</th></tr></thead><tbody>{filteredRecords.map((rec: any) => {
                            const loriBeratTan = (parseFloat(rec.beratKasar || 0) / 1000).toFixed(2);
                            const senaraiBarang = rec.items && rec.items.length > 0 ? rec.items.map((i:any) => i.diskripsi).join(', ') : 'TIADA REKOD BARANG';
                            const totalNilai = rec.items ? rec.items.reduce((sum: number, item: any) => sum + (parseFloat(item.nilai) || 0), 0) : 0;
                            let displayDate = rec.dateSubmitted;
                            if (activeTab === 'Selesai') { const finishLog = (rec.transitLogs||[]).slice().reverse().find((l:any) => (l.tindakan||'').includes('Selesai')); if (finishLog) displayDate = finishLog.tarikhMasa; }
                            
                            // Papar semua stesen
                            const fullRouteString = rec.routeParams && rec.routeParams.length > 0 
                                ? rec.routeParams.map((s: string) => s.replace('ICQS ', '')).join(' ➔ ') 
                                : '-';

                            return (<tr key={rec.id} className="hover:bg-slate-50 border-b border-slate-300"><td className="border border-slate-300 p-2 font-bold font-mono whitespace-nowrap text-blue-800">{rec.noPendaftaranRasmi || '-'}<div className="text-[9px] font-normal text-slate-400">{rec.id}</div></td><td className="border border-slate-300 p-2 whitespace-nowrap">{displayDate}</td><td className="border border-slate-300 p-2 text-center whitespace-nowrap"><span className={`px-1.5 py-0.5 rounded font-bold ${rec.status === 'Selesai' ? 'bg-green-100 text-green-800' : rec.status === 'Dibatalkan' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>{rec.status}</span></td><td className="border border-slate-300 p-2 font-semibold bg-blue-50 min-w-[200px]">{senaraiBarang}</td><td className="border border-slate-300 p-2">{rec.companyName}</td><td className="border border-slate-300 p-2 font-medium">{fullRouteString}</td><td className="border border-slate-300 p-2 font-bold uppercase whitespace-nowrap">{rec.noDaftarKenderaan}</td><td className="border border-slate-300 p-2 min-w-[120px]" title={rec.konsainor}>{(rec.konsainor||'').split('\n')[0]}</td><td className="border border-slate-300 p-2 min-w-[120px]" title={rec.konsainee}>{(rec.konsainee||'').split('\n')[0]}</td><td className="border border-slate-300 p-2 text-right font-bold text-slate-700 bg-amber-50">{loriBeratTan}</td><td className="border border-slate-300 p-2 text-right bg-slate-50 whitespace-nowrap">{totalNilai.toFixed(2)}</td><td className="border border-slate-300 p-2 text-red-600 text-[10px] min-w-[150px]">{rec.status === 'Dibatalkan' ? ((rec.transitLogs||[]).slice().reverse().find((l:any) => (l.tindakan||'').startsWith('DIBATALKAN'))?.tindakan.replace('DIBATALKAN: ', '') || 'Dibatalkan') : '-'}</td></tr>);
                        })}</tbody></table></div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 7. KOMPONEN PENGURUSAN PENGGUNA (ADMIN SAHAJA)
// ==========================================
const UsersMgmtView = ({ currentUser, usersList, fetchData, logAction }: any) => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', password: '', role: 'syarikat', stesen: '' });

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const newId = crypto.randomUUID(); 

            const payload = { 
                id: newId,
                ...formData, 
                stesen: formData.role === 'pegawai' ? formData.stesen : '' 
            };
            
            const { error } = await supabase.from('profiles').insert([payload]);
            if (error) throw error;
            
            await logAction('Sistem', `Mendaftar pengguna baru: ${formData.name}`);
            alert("Pengguna berjaya didaftarkan!");
            setShowForm(false);
            setFormData({ name: '', password: '', role: 'syarikat', stesen: '' });
            fetchData();
        } catch (err: any) {
            alert("Ralat mendaftar pengguna: " + err.message);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Adakah anda pasti ingin memadam pengguna ${name}? Tindakan ini tidak boleh dipulihkan.`)) return;
        try {
            const { error } = await supabase.from('profiles').delete().eq('id', id);
            if (error) throw error;
            
            await logAction('Sistem', `Memadam pengguna: ${name}`);
            fetchData();
        } catch (err: any) {
            alert("Ralat memadam pengguna: " + err.message);
        }
    };

    const handleDirectReset = async (id: string, name: string) => {
        if (!window.confirm(`Adakah anda pasti ingin mereset kata laluan untuk ${name} kepada 'password123'?`)) return;
        try {
            const { error } = await supabase.from('profiles').update({ password: 'password123' }).eq('id', id);
            if (error) throw error;
            
            await logAction('Sistem', `Superadmin mereset kata laluan untuk: ${name} kepada lalai.`);
            alert(`Kata laluan untuk ${name} berjaya direset kepada 'password123'.`);
            fetchData();
        } catch (err: any) {
            alert("Ralat mereset kata laluan: " + err.message);
        }
    };

    return (
        <div className="flex-grow p-4 md:p-8 max-w-5xl mx-auto w-full no-print">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center"><IconUsers /><span className="ml-2">Pengurusan Pengguna</span></h2>
                <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-sm">
                    {showForm ? <IconCancel /> : <IconPlus />} <span>{showForm ? 'Batal' : 'Pengguna Baru'}</span>
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Peranan</label>
                        <select value={formData.role} onChange={e=>setFormData({...formData, role: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none">
                            <option value="syarikat">Syarikat Logistik</option>
                            <option value="pegawai">Pegawai Kastam</option>
                            <option value="admin">Superadmin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Nama Pengguna / Syarikat</label>
                        <input type="text" required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none uppercase" />
                    </div>
                    {formData.role === 'pegawai' && (
                        <div>
                            <label className="block text-sm font-bold mb-1">Stesen Bertugas</label>
                            <select value={formData.stesen} required onChange={e=>setFormData({...formData, stesen: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="">-- Pilih Stesen --</option>
                                <option value="ICQS Mengkalap">ICQS Mengkalap</option>
                                <option value="ICQS Pandaruan">ICQS Pandaruan</option>
                                <option value="ICQS Tedungan">ICQS Tedungan</option>
                                <option value="ICQS Sungai Tujuh">ICQS Sungai Tujuh</option>
                            </select>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-bold mb-1">Kata Laluan Sementara</label>
                        <input type="text" required value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Cth: password123" />
                    </div>
                    <div className="md:col-span-2 flex justify-end mt-2">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold shadow hover:bg-blue-700">Simpan Pengguna</button>
                    </div>
                </form>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                            <th className="p-4 font-semibold">Nama Pengguna</th>
                            <th className="p-4 font-semibold">Peranan</th>
                            <th className="p-4 font-semibold">Stesen / Info</th>
                            <th className="p-4 font-semibold text-right">Tindakan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersList.map((u: any) => (
                            <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="p-4 font-medium uppercase text-sm">{u.name}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : u.role === 'pegawai' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {u.role.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-600">{u.stesen || '-'}</td>
                                <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                    {/* BUTANG RESET PASSWORD TERUS */}
                                    <button onClick={() => handleDirectReset(u.id, u.name)} className="text-blue-500 hover:bg-blue-50 p-2 rounded border border-blue-200" title="Reset Kata Laluan (Tukar ke password123)">
                                        <IconKey />
                                    </button>
                                    
                                    {/* MENGHALANG ADMIN DARIPADA MEMADAM DIRI SENDIRI TETAPI BOLEH PADAM USER LAIN */}
                                    {u.id !== currentUser.id && (
                                        <button onClick={() => handleDelete(u.id, u.name)} className="text-red-500 hover:bg-red-50 p-2 rounded border border-red-200" title="Padam Pengguna">
                                            <IconTrash />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ==========================================
// 8. KOMPONEN LOG AUDIT SISTEM (ADMIN SAHAJA)
// ==========================================
const SystemLogsView = ({ sysLogs }: any) => {
    return (
        <div className="flex-grow p-4 md:p-8 max-w-6xl mx-auto w-full no-print">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-6"><IconShieldAlert /><span className="ml-2">Log Audit Sistem</span></h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto max-h-[70vh]">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-slate-800 text-white sticky top-0 z-10">
                            <tr>
                                <th className="p-3 font-semibold w-40">Tarikh / Masa</th>
                                <th className="p-3 font-semibold w-32">Kategori</th>
                                <th className="p-3 font-semibold w-48">Pengguna</th>
                                <th className="p-3 font-semibold">Tindakan / Aktiviti</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sysLogs.length === 0 ? (
                                <tr><td colSpan={4} className="p-6 text-center text-gray-500">Tiada log direkodkan.</td></tr>
                            ) : (
                                sysLogs.map((log: any) => (
                                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-3 whitespace-nowrap text-xs text-gray-500">{log.tarikh_masa}</td>
                                        <td className="p-3"><span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-[10px] font-bold uppercase">{log.jenis}</span></td>
                                        <td className="p-3 font-medium uppercase text-xs">{log.user_name}</td>
                                        <td className="p-3 text-gray-700">{log.tindakan}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};