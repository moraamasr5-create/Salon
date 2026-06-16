import { spawn } from 'child_process'
import 'dotenv/config'

const PRINT_METHOD = process.env.PRINT_METHOD || 'lp' // 'lp' or 'qz'
const PRINTER_NAME = process.env.PRINTER_NAME || ''

function esc(cmd) {
  return typeof cmd === 'string' ? Buffer.from(cmd, 'utf8') : Buffer.from(cmd)
}

const ESC = 0x1b
const GS = 0x1d

function boldOn() { return Buffer.from([ESC, 0x45, 1]) }
function boldOff() { return Buffer.from([ESC, 0x45, 0]) }
function alignLeft() { return Buffer.from([ESC, 0x61, 0]) }
function alignCenter() { return Buffer.from([ESC, 0x61, 1]) }
function alignRight() { return Buffer.from([ESC, 0x61, 2]) }
function feed(n=1) { return Buffer.from([0x0a]).repeat(n) }
function cut() { return Buffer.from([GS, 0x56, 0x00]) }

function formatLine(left, right, width = 32) {
  const leftStr = String(left || '')
  const rightStr = String(right || '')
  const space = Math.max(1, width - leftStr.length - rightStr.length)
  return leftStr + ' '.repeat(space) + rightStr
}

function qrCode(text) {
  const data = Buffer.from(text, 'utf8')
  const length = data.length + 3
  const pL = length & 0xff
  const pH = (length >> 8) & 0xff
  return Buffer.concat([
    Buffer.from([GS, 0x28, 0x6B, 4, 0, 0x31, 0x41, 0x32, 0]),
    Buffer.from([GS, 0x28, 0x6B, 3, 0, 0x31, 0x43, 0x08]),
    Buffer.from([GS, 0x28, 0x6B, 3, 0, 0x31, 0x45, 0x30]),
    Buffer.from([GS, 0x28, 0x6B, pL, pH, 0x31, 0x50, 0x30]),
    data,
    Buffer.from([GS, 0x28, 0x6B, 3, 0, 0x31, 0x51, 0x30])
  ])
}

export function buildReceipt({ salonName, ticket, customerName, services = [], employeeName = '', note = '', reviewLink = '', currency = 'EGP' }) {
  const parts = []
  parts.push(esc(Buffer.from([ESC, 0x40]))) // init
  parts.push(alignCenter())
  parts.push(boldOn())
  parts.push(esc(salonName + '\n'))
  parts.push(boldOff())
  parts.push(feed(1))

  parts.push(alignLeft())
  parts.push(esc('رقم العميل: ' + ticket + '\n'))
  parts.push(esc('الاسم: ' + (customerName || '-') + '\n'))
  parts.push(feed(1))

  let total = 0
  for (const s of services) {
    const name = s.name || 'خدمة'
    const price = Number(s.price || 0)
    total += price
    const dur = s.duration_minutes ? `${s.duration_minutes}m` : ''
    parts.push(esc(formatLine(name + (dur ? ' ('+dur+')' : ''), price + ' ' + currency + '\n')))
  }
  parts.push(feed(1))
  parts.push(esc(formatLine('المجموع', total + ' ' + currency + '\n')))
  if (employeeName) parts.push(esc('الحلاق: ' + employeeName + '\n'))
  if (note) parts.push(esc('ملاحظة: ' + note + '\n'))
  parts.push(feed(1))
  if (reviewLink) {
    parts.push(alignCenter())
    parts.push(boldOn())
    parts.push(esc('قيم خدمتنا\n'))
    parts.push(boldOff())
    parts.push(esc('مسح الكود أو استخدم الرابط\n'))
    parts.push(feed(1))
    parts.push(qrCode(reviewLink))
    parts.push(feed(1))
    parts.push(esc(reviewLink + '\n'))
    parts.push(feed(1))
  }
  parts.push(alignCenter())
  parts.push(esc('شكراً لزيارتك\n'))
  parts.push(feed(2))
  parts.push(cut())

  return Buffer.concat(parts)
}

export async function sendToPrinter(buffer) {
  if (PRINT_METHOD === 'qz') {
    // return base64 data for QZ-Tray to handle on client
    return { method: 'qz', data: buffer.toString('base64') }
  }

  // default: use lp (CUPS) to send raw bytes to printer
  return new Promise((resolve, reject) => {
    const args = []
    if (PRINTER_NAME) { args.push('-d', PRINTER_NAME) }
    args.push('-o', 'raw')
    const lp = spawn('lp', args)
    lp.on('error', (err) => reject(err))
    lp.on('close', (code) => {
      if (code === 0) resolve({ method: 'lp', code })
      else reject(new Error('lp exit ' + code))
    })
    lp.stdin.write(buffer)
    lp.stdin.end()
  })
}

export default { buildReceipt, sendToPrinter }
