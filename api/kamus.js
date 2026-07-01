const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
 
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
   
    const filePath = path.join(process.cwd(), 'data', 'kamus.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const kamus = JSON.parse(fileData);

   
    const { search } = req.query;

    
    if (search) {
      const query = search.toLowerCase().trim();
      
      
      const hasilCari = kamus.filter(item => 
        item.bahasa_sasak.toLowerCase().includes(query) ||
        item.bahasa_indonesia.toLowerCase().includes(query)
      );
     
      const dataDibatasi = hasilCari.slice(0, 15);

      return res.status(200).json({
        status: "success",
        total_results: dataDibatasi.length,
        data: dataDibatasi
      });
    }

   
    return res.status(400).json({ 
      status: "error", 
      message: "Akses ditolak. Silakan masukkan kata kunci pencarian. Contoh: /api/kamus?search=Mangan" 
    });

  } catch (error) {
    return res.status(500).json({ status: "error", message: "Terjadi kesalahan sistem internal pada server." });
  }
}
