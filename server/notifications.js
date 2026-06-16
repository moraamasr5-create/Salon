import 'dotenv/config'

let client = null
const useTwilio = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM)
if (useTwilio) {
  const twilio = await import('twilio')
  client = twilio.default(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
}

export async function sendWhatsApp(toNumber, message) {
  if (!toNumber) return null
  if (useTwilio) {
    try {
      const from = process.env.TWILIO_WHATSAPP_FROM // e.g. 'whatsapp:+1415xxxxxxx'
      const to = toNumber.startsWith('whatsapp:') ? toNumber : `whatsapp:${toNumber}`
      const res = await client.messages.create({ from, to, body: message })
      return res
    } catch (e) {
      console.error('Twilio send error', e)
      return null
    }
  }

  // fallback: log to console
  console.log('[WhatsApp simulated]', toNumber, message)
  return { simulated: true }
}

export default { sendWhatsApp }
