import multer from 'multer'

const handleUploadError = (err, req, res, next) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        
        return res.status(400).json({ error: 'Erro no upload: Tamanho do arquivo excedido ou outro erro relacionado.' })
      } else if (err.code === 'INVALID_FILE_TYPE') {
        return res.status(400).json({ error: err.message })
      } else {
        console.error('Erro de upload Multer:', err)
        return res.status(500).json({ error: 'Erro interno ao processar o upload. Tente novamente mais tarde.', details: err })
      }
    }
    next()
  }
  
  export { handleUploadError }
  