import React, { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { useNavigate } from 'react-router-dom'

export default function Scan() {
  const [error, setError] = useState(null)
  const [scanning, setScanning] = useState(false)
  const qrRegionRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    return () => {
      // cleanup handled by Html5Qrcode if started
    }
  }, [])

  async function startScan() {
    setError(null)
    setScanning(true)
    const html5QrCode = new Html5Qrcode('qr-reader')
    try {
      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        (decoded) => {
          html5QrCode.stop()
          // decoded text assumed to be a session link or code
          navigate(parseSessionLink(decoded))
        },
        (err) => {
          // ignore
        }
      )
    } catch (e) {
      setError('فشل الوصول للكاميرا — يمكنك إدخال الكود يدوياً')
      setScanning(false)
    }
  }

  function manual() {
    const code = prompt('أدخل كود الصالون أو session id')
    if (code) {
      navigate(parseSessionLink(code))
    }
  }

  function parseSessionLink(decoded) {
    try {
      const url = new URL(decoded, window.location.origin)
      if (url.pathname.endsWith('/review')) {
        return '/review' + url.search
      }
      if (url.searchParams.has('session')) {
        return '/form?session=' + encodeURIComponent(url.searchParams.get('session'))
      }
    } catch (e) {
      // not a full URL, fall through
    }
    return '/form?session=' + encodeURIComponent(decoded)
  }

  return (
    <div className="page">
      <h2>مسح QR</h2>
      <div id="qr-reader" ref={qrRegionRef} style={{ width: 300, height: 300 }} />
      {error && <p className="error">{error}</p>}
      <div className="controls">
        <button onClick={startScan} disabled={scanning}>ابدأ المسح</button>
        <button onClick={manual}>إدخال يدوي</button>
      </div>
    </div>
  )
}
