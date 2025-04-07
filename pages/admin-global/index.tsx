import { useEffect } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function AdminGlobalHome() {
  const router = useRouter()

  useEffect(() => {
    const verificarAcceso = async () => {
      const { data: session } = await supabase.auth.getUser()
      const userId = session?.user?.id

      if (!userId) return router.push("/login")

      const { data: perfil } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("id", userId)
        .single()

      if (!perfil || perfil.rol !== "admin_global") {
        return router.push("/login")
      }
    }

    verificarAcceso()
  }, [router])

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
        <h1 style={{ marginBottom: 32, color: "#1c1c1c" }}>Panel de Admin Global</h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Link href="/admin-global/anadir-restaurante">
            <button style={buttonStyle}>➕ Añadir restaurante</button>
          </Link>

          <Link href="/admin-global/crear-admin">
            <button style={buttonStyle}>👤 Crear admin restaurante</button>
          </Link>

          <Link href="/admin-global/ver-restaurantes">
            <button style={buttonStyle}>📋 Ver restaurantes</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

const buttonStyle = {
  padding: "12px 20px",
  backgroundColor: "#5C665D",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.2s ease",
} as React.CSSProperties
