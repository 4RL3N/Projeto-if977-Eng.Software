import nodemailer from 'nodemailer'
import sendgridTransport from 'nodemailer-sendgrid-transport'

// Configura o transportador usando a API Key do SendGrid
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SENDGRID_API_KEY // Variável de ambiente com sua API Key
  }
}))

// Função para enviar email
const sendMail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: 'partufpe@gmail.com', // De onde o email será enviado (precisa ser um email verificado no SendGrid)
      to,
      subject,
      text
    })
    console.log('Email enviado com sucesso')
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    throw error
  }
}

export default sendMail
