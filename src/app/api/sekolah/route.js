// pages/api/sekolah/index.js atau app/api/sekolah/route.js (untuk App Router)
import { NextResponse } from 'next/server';

// Database connection (ganti dengan konfigurasi database Anda)
// import mysql from 'mysql2/promise';
// atau menggunakan Prisma, Mongoose, dll.

// Simulasi database connection
const dbQuery = async (query, params = []) => {
  // Implementasi koneksi database di sini
  // Contoh dengan MySQL:
  /*
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  
  try {
    const [results] = await connection.execute(query, params);
    return results;
  } finally {
    await connection.end();
  }
  */
  
  // Untuk development, return mock data
  console.log('Query:', query);
  console.log('Params:', params);
  return { insertId: Math.floor(Math.random() * 1000) + 1 };
};

// GET - Fetch all sekolah data
export async function GET(request) {
  try {
    const query = `
      SELECT ds.*, k.nama_kecamatan, ss.status as status_sekolah_nama
      FROM data_sekolah ds
      LEFT JOIN kecamatan k ON ds.kecamatan_id = k.id
      LEFT JOIN status_sekolah ss ON ds.status_sekolah_id = ss.id
      ORDER BY ds.created_at DESC
    `;
    
    const sekolahData = await dbQuery(query);
    
    return NextResponse.json({
      success: true,
      data: sekolahData
    });
  } catch (error) {
    console.error('Error fetching sekolah data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch sekolah data'
    }, { status: 500 });
  }
}

// POST - Create new sekolah data
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validasi data required
    if (!data.npsn || !data.nama_sekolah || !data.status_sekolah_id) {
      return NextResponse.json({
        success: false,
        error: 'NPSN, Nama Sekolah, dan Status Sekolah wajib diisi'
      }, { status: 400 });
    }

    // Insert query
    const insertQuery = `
      INSERT INTO data_sekolah (
        no_urut, no_urut_sekolah_kecamatan, kecamatan_id, npsn, nama_sekolah, status_sekolah_id,
        siswa_kelas1_l, siswa_kelas2_l, siswa_kelas3_l, siswa_kelas4_l, siswa_kelas5_l, siswa_kelas6_l,
        siswa_kelas1_p, siswa_kelas2_p, siswa_kelas3_p, siswa_kelas4_p, siswa_kelas5_p, siswa_kelas6_p,
        jumlah_rombel,
        ruang_kelas_jumlah, ruang_kelas_baik, ruang_kelas_rusak_ringan, ruang_kelas_rusak_sedang, 
        ruang_kelas_rusak_berat, ruang_kelas_kelebihan_tidak_terawat, ruang_kelas_kurang_rkb, ruang_kelas_lahan,
        perpustakaan_jumlah, perpustakaan_baik, perpustakaan_rusak_ringan, perpustakaan_rusak_sedang, perpustakaan_rusak_berat,
        laboratorium_jumlah, laboratorium_baik, laboratorium_rusak_ringan, laboratorium_rusak_sedang, laboratorium_rusak_berat,
        ruang_guru_jumlah, ruang_guru_baik, ruang_guru_rusak_ringan, ruang_guru_rusak_sedang, ruang_guru_rusak_berat,
        ruang_uks_jumlah, ruang_uks_baik, ruang_uks_rusak_ringan, ruang_uks_rusak_sedang, ruang_uks_rusak_berat,
        toilet_jumlah, toilet_baik, toilet_rusak_ringan, toilet_rusak_sedang, toilet_rusak_berat,
        rumah_dinas_jumlah, rumah_dinas_baik, rumah_dinas_rusak_ringan, rumah_dinas_rusak_sedang, rumah_dinas_rusak_berat,
        meja_jumlah, meja_baik, meja_rusak_ringan, meja_rusak_sedang, meja_rusak_berat,
        kursi_jumlah, kursi_baik, kursi_rusak_ringan, kursi_rusak_sedang, kursi_rusak_berat,
        jumlah_chromebook,
        jumlah_guru, guru_pns, guru_pppk, guru_non_asn, keterangan_guru
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      data.no_urut || 0,
      data.no_urut_sekolah_kecamatan || '',
      data.kecamatan_id || null,
      data.npsn,
      data.nama_sekolah,
      data.status_sekolah_id,
      
      // Data siswa laki-laki per kelas
      data.siswa_kelas1_l || 0, data.siswa_kelas2_l || 0, data.siswa_kelas3_l || 0,
      data.siswa_kelas4_l || 0, data.siswa_kelas5_l || 0, data.siswa_kelas6_l || 0,
      
      // Data siswa perempuan per kelas
      data.siswa_kelas1_p || 0, data.siswa_kelas2_p || 0, data.siswa_kelas3_p || 0,
      data.siswa_kelas4_p || 0, data.siswa_kelas5_p || 0, data.siswa_kelas6_p || 0,
      
      data.jumlah_rombel || 0,
      
      // Ruang kelas
      data.ruang_kelas_jumlah || 0, data.ruang_kelas_baik || 0, data.ruang_kelas_rusak_ringan || 0,
      data.ruang_kelas_rusak_sedang || 0, data.ruang_kelas_rusak_berat || 0,
      data.ruang_kelas_kelebihan_tidak_terawat || 0, data.ruang_kelas_kurang_rkb || 0,
      data.ruang_kelas_lahan || 'Tidak',
      
      // Perpustakaan
      data.perpustakaan_jumlah || 0, data.perpustakaan_baik || 0, data.perpustakaan_rusak_ringan || 0,
      data.perpustakaan_rusak_sedang || 0, data.perpustakaan_rusak_berat || 0,
      
      // Laboratorium
      data.laboratorium_jumlah || 0, data.laboratorium_baik || 0, data.laboratorium_rusak_ringan || 0,
      data.laboratorium_rusak_sedang || 0, data.laboratorium_rusak_berat || 0,
      
      // Ruang guru
      data.ruang_guru_jumlah || 0, data.ruang_guru_baik || 0, data.ruang_guru_rusak_ringan || 0,
      data.ruang_guru_rusak_sedang || 0, data.ruang_guru_rusak_berat || 0,
      
      // Ruang UKS
      data.ruang_uks_jumlah || 0, data.ruang_uks_baik || 0, data.ruang_uks_rusak_ringan || 0,
      data.ruang_uks_rusak_sedang || 0, data.ruang_uks_rusak_berat || 0,
      
      // Toilet
      data.toilet_jumlah || 0, data.toilet_baik || 0, data.toilet_rusak_ringan || 0,
      data.toilet_rusak_sedang || 0, data.toilet_rusak_berat || 0,
      
      // Rumah dinas
      data.rumah_dinas_jumlah || 0, data.rumah_dinas_baik || 0, data.rumah_dinas_rusak_ringan || 0,
      data.rumah_dinas_rusak_sedang || 0, data.rumah_dinas_rusak_berat || 0,
      
      // Meja
      data.meja_jumlah || 0, data.meja_baik || 0, data.meja_rusak_ringan || 0,
      data.meja_rusak_sedang || 0, data.meja_rusak_berat || 0,
      
      // Kursi
      data.kursi_jumlah || 0, data.kursi_baik || 0, data.kursi_rusak_ringan || 0,
      data.kursi_rusak_sedang || 0, data.kursi_rusak_berat || 0,
      
      // Fasilitas lain
      data.jumlah_chromebook || 0,
      
      // Data guru
      data.jumlah_guru || 0, data.guru_pns || 0, data.guru_pppk || 0,
      data.guru_non_asn || 0, data.keterangan_guru || ''
    ];

    const result = await dbQuery(insertQuery, params);

    return NextResponse.json({
      success: true,
      message: 'Data sekolah berhasil disimpan',
      data: { id: result.insertId }
    });

  } catch (error) {
    console.error('Error saving sekolah data:', error);
    return NextResponse.json({
      success: false,
      error: 'Gagal menyimpan data sekolah'
    }, { status: 500 });
  }
}

// PUT - Update existing sekolah data
export async function PUT(request) {
  try {
    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json({
        success: false,
        error: 'ID sekolah wajib disertakan untuk update'
      }, { status: 400 });
    }

    // Update query - contoh untuk beberapa field utama
    const updateQuery = `
      UPDATE data_sekolah SET 
        no_urut = ?, nama_sekolah = ?, npsn = ?, status_sekolah_id = ?, 
        kecamatan_id = ?, jumlah_guru = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const params = [
      data.no_urut, data.nama_sekolah, data.npsn, data.status_sekolah_id,
      data.kecamatan_id, data.jumlah_guru, data.id
    ];

    await dbQuery(updateQuery, params);

    return NextResponse.json({
      success: true,
      message: 'Data sekolah berhasil diupdate'
    });

  } catch (error) {
    console.error('Error updating sekolah data:', error);
    return NextResponse.json({
      success: false,
      error: 'Gagal mengupdate data sekolah'
    }, { status: 500 });
  }
}

// DELETE - Delete sekolah data
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID sekolah wajib disertakan untuk delete'
      }, { status: 400 });
    }

    const deleteQuery = 'DELETE FROM data_sekolah WHERE id = ?';
    await dbQuery(deleteQuery, [id]);

    return NextResponse.json({
      success: true,
      message: 'Data sekolah berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleting sekolah data:', error);
    return NextResponse.json({
      success: false,
      error: 'Gagal menghapus data sekolah'
    }, { status: 500 });
  }
}

// pages/api/kecamatan/index.js
// API untuk mendapatkan data kecamatan
export async function GET_KECAMATAN(request) {
  try {
    const query = 'SELECT id, nama_kecamatan FROM kecamatan ORDER BY nama_kecamatan';
    const kecamatanData = await dbQuery(query);
    
    return NextResponse.json({
      success: true,
      data: kecamatanData
    });
  } catch (error) {
    console.error('Error fetching kecamatan data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch kecamatan data'
    }, { status: 500 });
  }
}

// pages/api/sekolah/[id].js
// API untuk mendapatkan data sekolah berdasarkan ID
export async function GET_BY_ID(request, { params }) {
  try {
    const { id } = params;
    
    const query = `
      SELECT ds.*, k.nama_kecamatan, ss.status as status_sekolah_nama
      FROM data_sekolah ds
      LEFT JOIN kecamatan k ON ds.kecamatan_id = k.id
      LEFT JOIN status_sekolah ss ON ds.status_sekolah_id = ss.id
      WHERE ds.id = ?
    `;
    
    const sekolahData = await dbQuery(query, [id]);
    
    if (!sekolahData || sekolahData.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Data sekolah tidak ditemukan'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: sekolahData[0]
    });
  } catch (error) {
    console.error('Error fetching sekolah data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch sekolah data'
    }, { status: 500 });
  }
}

// Utility function untuk validasi data
export const validateSekolahData = (data) => {
  const errors = [];
  
  if (!data.npsn) errors.push('NPSN wajib diisi');
  if (!data.nama_sekolah) errors.push('Nama sekolah wajib diisi');
  if (!data.status_sekolah_id) errors.push('Status sekolah wajib dipilih');
  
  // Validasi NPSN format (8 digit)
  if (data.npsn && !/^\d{8}$/.test(data.npsn)) {
    errors.push('NPSN harus terdiri dari 8 digit angka');
  }
  
  // Validasi jumlah vs kondisi ruangan
  const ruangTypes = ['ruang_kelas', 'perpustakaan', 'laboratorium', 'ruang_guru', 'ruang_uks', 'toilet', 'rumah_dinas'];
  
  ruangTypes.forEach(type => {
    const jumlah = parseInt(data[`${type}_jumlah`] || 0);
    const total_kondisi = ['baik', 'rusak_ringan', 'rusak_sedang', 'rusak_berat']
      .reduce((sum, kondisi) => sum + parseInt(data[`${type}_${kondisi}`] || 0), 0);
    
    if (total_kondisi > jumlah) {
      errors.push(`Total kondisi ${type.replace('_', ' ')} tidak boleh melebihi jumlah ${type.replace('_', ' ')}`);
    }
  });
  
  return errors;
};