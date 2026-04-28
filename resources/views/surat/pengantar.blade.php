<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Surat Pengantar RT - {{ $dokumen->nomor_dokumen }}</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
            margin: 0;
            padding: 30px;
        }
        .header {
            text-align: center;
            border-bottom: 3px double #000;
            margin-bottom: 20px;
            padding-bottom: 10px;
        }
        .header h2 {
            margin: 0;
            text-transform: uppercase;
        }
        .header p {
            margin: 0;
            font-size: 10pt;
        }
        .content {
            margin-top: 20px;
        }
        .ref-number {
            text-align: center;
            margin-bottom: 30px;
        }
        .ref-number p {
            margin: 0;
            font-weight: bold;
        }
        .info-table {
            width: 100%;
            margin-bottom: 20px;
        }
        .info-table td {
            vertical-align: top;
            padding: 2px 0;
        }
        .info-table td:first-child {
            width: 180px;
        }
        .signature-area {
            margin-top: 50px;
            float: right;
            width: 250px;
            text-align: center;
        }
        .signature-space {
            height: 80px;
        }
        .footer {
            margin-top: 50px;
            font-size: 9pt;
            color: #666;
            clear: both;
        }
        @page {
            size: A4;
            margin: 2cm;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>Pemerintah Kota / Kabupaten</h2>
        <h2>Kecamatan Contoh • Nagari Contoh</h2>
        <p>Alamat Kantor Nagari, Kode Pos 00000 • Telp: (0123) 456789</p>
    </div>

    <div class="ref-number">
        <p style="text-decoration: underline;">SURAT PENGANTAR</p>
        <p>Nomor: {{ $dokumen->nomor_dokumen }}</p>
    </div>

    <div class="content">
        <p>Yang bertanda tangan di bawah ini, Wali Nagari / Ketua RT setempat menerangkan bahwa:</p>
        
        <table class="info-table">
            <tr>
                <td>Nama Lengkap</td>
                <td>: {{ $dokumen->nama_pemohon }}</td>
            </tr>
            <tr>
                <td>NIK</td>
                <td>: {{ $dokumen->nik_pemohon }}</td>
            </tr>
            <tr>
                <td>Alamat</td>
                <td>: {{ $dokumen->alamat_pemohon }}</td>
            </tr>
            @if($dokumen->data_form)
                @foreach($dokumen->data_form as $key => $value)
                    @if(!in_array($key, ['nama_pemohon', 'nik_pemohon', 'alamat_pemohon', 'telepon_pemohon']))
                    <tr>
                        <td style="text-transform: capitalize;">{{ str_replace('_', ' ', $key) }}</td>
                        <td>: {{ $value }}</td>
                    </tr>
                    @endif
                @endforeach
            @endif
        </table>

        <p>Orang tersebut di atas adalah benar warga kami yang berdomisili di alamat tersebut. Surat pengantar ini diberikan untuk keperluan:</p>
        <p style="font-weight: bold; text-align: center; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            {{ $dokumen->jenisDokumen->nama_tampilan }}
        </p>

        <p>Demikian surat pengantar ini dibuat untuk dapat dipergunakan sebagaimana mestinya. Atas perhatian dan kerjasamanya kami ucapkan terima kasih.</p>
    </div>

    <div class="signature-area">
        <p>Nagari Contoh, {{ now()->translatedFormat('d F Y') }}</p>
        <p>Wali Nagari,</p>
        <div class="signature-space" style="border: 1px solid #000; padding: 10px; margin: 10px 0; background-color: #f9f9f9; width: 220px; position: relative;">
            <p style="font-size: 8pt; color: #000; margin: 0; line-height: 1.2;">
                TANDA TANGAN ELEKTRONIK<br>
                <strong>DT. WALI NAGARI</strong><br>
                <span style="font-size: 7pt;">Sistem Informasi Nagari (SINGG)<br>
                ID: {{ substr($dokumen->id, 0, 8) }}</span>
            </p>
            <div style="position: absolute; right: 10px; top: 10px; opacity: 0.1;">
                <!-- Simulated QR Code or Stamp -->
                <div style="width: 40px; height: 40px; border: 2px solid #000;"></div>
            </div>
        </div>
        <p><strong>{{ $dokumen->approvedBy->profil->nama_lengkap ?? 'Dt. Wali Nagari' }}</strong></p>
    </div>

    <div class="footer">
        <p>* Dokumen ini dihasilkan secara otomatis oleh Sistem Informasi Nagari Guguak (SINGG).</p>
        <p>* Keaslian dokumen dapat dikonfirmasi melalui portal resmi Nagari.</p>
    </div>
</body>
</html>
