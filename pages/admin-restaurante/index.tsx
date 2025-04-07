// pages/admin-restaurante/index.tsx
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function AdminRestauranteHome() {
  const [restaurante, setRestaurante] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchRestaurante = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) return router.push("/login")

      // Verificar que sea admin_restaurante
      const { data: usuario, error } = await supabase
        .from("usuarios")
        .select("rol, restaurante_id")
        .eq("id", user.id)
        .single()

      if (error || usuario?.rol !== "admin_restaurante") {
        return router.push("/login")
      }

      if (!usuario?.restaurante_id) return

      const { data: restData } = await supabase
        .from("restaurante")
        .select("nombre")
        .eq("id", usuario.restaurante_id)
        .single()

      setRestaurante(restData)
      setLoading(false)
    }

    fetchRestaurante()
  }, [router])

  const handleRedirect = (path: string) => {
    router.push(`/admin-restaurante/${path}`)
  }

  if (loading) return <p>Cargando...</p>

  return (
    <div
      style={{
        background: "linear-gradient(to bottom right, #d9e1dc, #b1c2ba)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif"
      }}
    >
      <div
        style={{
          background: "#f0f4f0",
          padding: "40px 32px",
          borderRadius: 16,
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
          textAlign: "center",
          width: 360
        }}
      >
        <h2 style={{ marginBottom: 8 }}>Bienvenido a</h2>
        <h1
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 32,
            color: "#1c1c1c"
          }}
        >
          {restaurante?.nombre}
        </h1>

        <button
          onClick={() => handleRedirect("agregar-empleado")}
          style={buttonStyle}
        >
          Agregar empleados
        </button>

        <button
          onClick={() => handleRedirect("empleados")}
          style={buttonStyle}
        >
          Lista de empleados
        </button>

        <button
          onClick={() => handleRedirect("resenas")}
          style={buttonStyle}
        >
          Reseñas
        </button>

        <button
          onClick={() => handleRedirect("subscripciones")}
          style={buttonStyle}
        >
          Subscripciones
        </button>
      </div>
    </div>
  )
}

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 0",
  marginBottom: 12,
  backgroundColor: "#6b796e",
  color: "white",
  fontWeight: "bold",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 16
}
