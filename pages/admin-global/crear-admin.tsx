// pages/admin-global/crear-admin.tsx
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/router"

export default function CrearAdmin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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

      if (usuario?.rol !== "admin_global") router.push("/login")
    }

    checkAccess()
  }, [router])

  const handleCrear = async () => {
    if (!email || !password) return alert("Rellena todos los campos")

    const res = await fetch("/api/crear-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    const result = await res.json()

    if (!res.ok) {
      alert(`❌ ${result.error || "Error desconocido"}`)
      console.error(result.details)
    } else {
      alert("✅ Admin restaurante creado correctamente")
      setEmail("")
      setPassword("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCrear()
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #D6DED9, #A9B9AF)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 24
    }}>
      <div style={{
        background: "#ffffffcc",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        minWidth: "360px",
        textAlign: "center"
      }}>
        <h1 style={{ marginBottom: 24, color: "#1c1c1c" }}>Crear admin restaurante</h1>

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            padding: 12,
            width: "100%",
            marginBottom: 16,
            borderRadius: 8,
            border: "1px solid #999",
            outline: "none",
            fontSize: 16,
            color: "#1c1c1c",
            background: "#f0f4f1"
          }}
        />

        <input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            padding: 12,
            width: "100%",
            marginBottom: 16,
            borderRadius: 8,
            border: "1px solid #999",
            outline: "none",
            fontSize: 16,
            color: "#1c1c1c",
            background: "#f0f4f1"
          }}
        />

        <button
          onClick={handleCrear}
          style={{
            padding: "12px 20px",
            backgroundColor: "#5C665D",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            width: "100%"
          }}
        >
          Crear admin
        </button>
      </div>
    </div>
  )
}
