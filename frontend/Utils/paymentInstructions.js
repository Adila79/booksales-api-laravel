export const bankList = [
  { id: "bca", name: "BCA Virtual Account", code: "bca" },
  { id: "bni", name: "BNI Virtual Account", code: "bni" },
  { id: "bri", name: "BRI Virtual Account (BRIVA)", code: "bri" },
  { id: "mandiri", name: "Mandiri Bill Payment", code: "mandiri" },
  { id: "permata", name: "Permata Virtual Account", code: "permata" },
  { id: "cimb", name: "CIMB Niaga Virtual Account", code: "cimb" },
];

export const paymentInstructions = {
  bca: {
    bankName: "Bank Central Asia (BCA)",
    channels: [
      {
        channel: "m-BCA (BCA mobile)",
        steps: [
          "Buka aplikasi BCA mobile dan pilih m-BCA.",
          "Masukkan Kode Akses Anda.",
          "Pilih menu m-Transfer > BCA Virtual Account.",
          "Masukkan nomor Virtual Account yang tertera di atas.",
          "Masukkan PIN m-BCA Anda dan konfirmasi pembayaran.",
          "Simpan bukti transaksi pembayaran Anda.",
        ],
      },
      {
        channel: "myBCA",
        steps: [
          "Buka aplikasi myBCA dan login.",
          "Pilih menu Transfer > Virtual Account.",
          "Pilih rekening sumber dana dan masukkan nomor Virtual Account.",
          "Pastikan detail nama dan total tagihan sesuai.",
          "Masukkan PIN myBCA Anda untuk menyelesaikan transaksi.",
        ],
      },
      {
        channel: "ATM BCA",
        steps: [
          "Masukkan kartu ATM BCA dan PIN Anda.",
          "Pilih menu Transaksi Lainnya > Transfer > Ke Rekening BCA Virtual Account.",
          "Masukkan nomor BCA Virtual Account yang tertera.",
          "Pastikan data transaksi (nama dan total bayar) sudah benar.",
          "Pilih 'Ya' untuk memproses pembayaran.",
        ],
      },
    ],
  },
  bni: {
    bankName: "Bank Negara Indonesia (BNI)",
    channels: [
      {
        channel: "BNI Mobile Banking",
        steps: [
          "Buka aplikasi BNI Mobile Banking dan login.",
          "Pilih menu Pembayaran > Pembayaran Tagihan > Virtual Account Billing.",
          "Pilih rekening debet, lalu masukkan nomor Virtual Account.",
          "Tagihan akan muncul pada layar, periksa detailnya.",
          "Masukkan Password Transaksi Anda dan klik Lanjut.",
        ],
      },
      {
        channel: "ATM BNI",
        steps: [
          "Masukkan kartu ATM BNI dan PIN.",
          "Pilih menu Menu Lainnya > Transfer > Virtual Account Billing.",
          "Masukkan nomor Virtual Account Anda.",
          "Konfirmasi rincian pembayaran pada layar ATM.",
          "Selesaikan pembayaran dan simpan struk transaksi.",
        ],
      },
      {
        channel: "BNI Internet Banking",
        steps: [
          "Kunjungi situs BNI Internet Banking dan login.",
          "Pilih Transaksi > Info & Administrasi Transfer > Atur Rekening Tujuan.",
          "Pilih Tambah Rekening Tujuan dan masukkan nomor Virtual Account.",
          "Konfirmasi pembayaran dengan memasukkan respon token.",
        ],
      },
    ],
  },
  bri: {
    bankName: "Bank Rakyat Indonesia (BRI)",
    channels: [
      {
        channel: "BRImo",
        steps: [
          "Buka aplikasi BRImo dan login dengan akun Anda.",
          "Pilih menu Tagihan > BRIVA (BRI Virtual Account).",
          "Pilih Tambah Transaksi Baru, lalu masukkan nomor BRIVA.",
          "Pastikan rincian tagihan dan nama merchant sudah sesuai.",
          "Pilih Konfirmasi, lalu masukkan PIN BRImo Anda.",
        ],
      },
      {
        channel: "ATM BRI",
        steps: [
          "Masukkan kartu ATM BRI dan PIN Anda.",
          "Pilih menu Transaksi Lain > Pembayaran > Lain-lain > BRIVA.",
          "Masukkan nomor BRIVA yang tertera.",
          "Pilih 'Ya' untuk melanjutkan pembayaran.",
          "Ambil dan simpan struk pembayaran Anda.",
        ],
      },
    ],
  },
  mandiri: {
    bankName: "Bank Mandiri (Bill Payment)",
    isMandiriBill: true,
    channels: [
      {
        channel: "Livin' by Mandiri (Kuning)",
        steps: [
          "Buka aplikasi Livin' by Mandiri dan login.",
          "Pilih menu Bayar > Buat Pembayaran Baru.",
          "Ketik dan pilih penyedia jasa / Biller Code (misal: Midtrans / 70012).",
          "Masukkan Kode Pembayaran (Bill Key) yang tertera di atas.",
          "Pastikan detail nama merchant dan nominal sesuai.",
          "Konfirmasi pembayaran dan masukkan PIN Livin' Anda.",
        ],
      },
      {
        channel: "ATM Mandiri",
        steps: [
          "Masukkan kartu ATM Mandiri dan PIN Anda.",
          "Pilih menu Bayar/Beli > Lainnya > Multi Payment.",
          "Masukkan Kode Perusahaan (Biller Code) yang tertera di atas.",
          "Masukkan Nomor Pembayaran / Bill Key.",
          "Pilih item tagihan yang sesuai dan tekan 'Ya'.",
          "Simpan struk ATM sebagai bukti transaksi pembayaran.",
        ],
      },
    ],
  },
  permata: {
    bankName: "Permata Bank",
    channels: [
      {
        channel: "PermataMobile X",
        steps: [
          "Buka aplikasi PermataMobile X dan login.",
          "Pilih menu Bayar Tagihan > Virtual Account.",
          "Masukkan nomor Permata Virtual Account.",
          "Periksa rincian pembayaran pada layar konfirmasi.",
          "Masukkan respon token / otentikasi transaksi untuk menyelesaikan.",
        ],
      },
      {
        channel: "ATM Permata / ATM Bersama",
        steps: [
          "Masukkan kartu ATM dan PIN Anda.",
          "Pilih menu Pembayaran > Pembayaran Lainnya > Virtual Account.",
          "Masukkan nomor Permata Virtual Account yang tertera.",
          "Konfirmasi detail transaksi dan selesaikan pembayaran.",
        ],
      },
    ],
  },
  cimb: {
    bankName: "CIMB Niaga",
    channels: [
      {
        channel: "OCTO Mobile",
        steps: [
          "Buka aplikasi OCTO Mobile dan login.",
          "Pilih menu Bayar Tagihan > Virtual Account.",
          "Pilih rekening sumber dana dan masukkan nomor Virtual Account.",
          "Konfirmasi nominal tagihan dan masukkan PIN OCTO Mobile.",
        ],
      },
      {
        channel: "ATM CIMB Niaga",
        steps: [
          "Masukkan kartu ATM CIMB Niaga dan PIN.",
          "Pilih menu Pembayaran > Lanjut > Virtual Account.",
          "Masukkan nomor Virtual Account CIMB yang tertera.",
          "Konfirmasi pembayaran dan simpan struk transaksi.",
        ],
      },
    ],
  },
};
