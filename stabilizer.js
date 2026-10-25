// stabilizer.js
const os = require('os');
const originalNetworkInterfaces = os.networkInterfaces;

os.networkInterfaces = function () {
  try {
    const interfaces = originalNetworkInterfaces.call(os);
    // Jika berhasil, kita tetap pakai data aslinya (jika aman)
    if (interfaces) return interfaces;
  } catch (e) {
    // Jika error (karena Android), kita abaikan dan pakai data palsu
  }
  
  // Data palsu (hanya localhost) agar Next.js tidak crash
  return {
    lo: [{
      address: '127.0.0.1',
      netmask: '255.0.0.0',
      family: 'IPv4',
      mac: '00:00:00:00:00:00',
      internal: true,
      cidr: '127.0.0.1/8'
    }]
  };
};