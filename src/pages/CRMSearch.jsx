import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CRMSearch(){
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const navigate = useNavigate()

  async function search(){
    try{
      const res = await fetch((import.meta.env.VITE_API_BASE||'http://localhost:3000') + '/api/customers?q=' + encodeURIComponent(q))
      const data = await res.json()
      setResults(data)
    }catch(e){
      console.error(e)
    }
  }

  return (
    <div className="page">
      <h2>بحث في سجلات العملاء</h2>
      <div>
        <input placeholder="اسم أو رقم هاتف" value={q} onChange={e=>setQ(e.target.value)} />
        <button onClick={search}>بحث</button>
      </div>
      <ul>
        {results.map(c => (
          <li key={c.id} style={{ border:'1px solid #eee', padding:8, marginTop:8 }}>
            <div><strong>{c.name}</strong></div>
            <div>{c.phone}</div>
            <div><button onClick={()=>navigate('/crm/'+c.id)}>عرض الملف</button></div>
          </li>
        ))}
      </ul>
    </div>
  )
}
