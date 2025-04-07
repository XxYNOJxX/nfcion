// pages/admin-restaurante/agregar-empleado.tsx
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/router"

export default function AgregarEmpleado() {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nfc, setNfc] = useState("")
  const [mensaje, setMensaje] = useState("")
  const router = useRouter()

  useEffect(() => {
    const checkAccess = async () => {
      const { data: session } = await supabase.auth.getUser()
      const userId = session?.user?.id
      if (!userId) return router.push("/login")

      const { data: usuario } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("id", userId)
        .single()

      if (usuario?.rol !== "admin_restaurante") router.push("/login")
    }

    checkAccess()
  }, [router])

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setMensaje("")

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!nombre || !email || !password || !nfc || !user) {
      return setMensaje("Faltan campos requeridos")
    }

    const res = await fetch("/api/crear-empleado", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombre,
        email,
        password,
        nfc_code: nfc,
        admin_id: user.id
      })
    })

    const json = await res.json()
    if (res.ok) {
      setNombre("")
      setEmail("")
      setPassword("")
      setNfc("")
      setMensaje(json.message)
    } else {
      setMensaje(json.error || "Error desconocido")
    }
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "#b8c7bf"
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "#e7ece9",
        padding: 32,
        borderRadius: 12,
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        width: 300
      }}>
        <h2 style={{ textAlign: "center", color: "#2c3e50" }}>Agregar nuevo empleado</h2>

        <label style={labelStyle}>Nombre</label>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} style={inputStyle} />

        <label style={labelStyle}>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />

        <label style={labelStyle}>Contraseña</label>
        <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} style={inputStyle} />

        <label style={labelStyle}>Código NFC</label>
        <input value={nfc} onChange={(e) => setNfc(e.target.value)} style={inputStyle} />

        <button type="submit" style={buttonStyle}>
          Crear empleado
        </button>

        {mensaje && <p style={{ color: "#2c3e50", marginTop: 12, textAlign: "center" }}>{mensaje}</p>}
      </form>
    </div>
  )
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "8px 0 16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "16px",
  color: "#2c3e50"
}

const buttonStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#617068",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold"
}

const labelStyle = {
  color: "#2c3e50",
  fontWeight: "bold",
  marginBottom: "4px",
  display: "block"
}
