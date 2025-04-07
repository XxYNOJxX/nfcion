// pages/empleado/index.tsx
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

type Resena = {
  id: string
  texto: string
  puntuacion: number
  created_at: string
  numero_mesa?: number
}

export default function EmpleadoHome() {
  const [resenas, setResenas] = useState<Resena[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchResenas = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) return router.push("/login")

      const { data: usuario, error: usuarioError } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("id", user.id)
        .single()

      if (usuarioError || usuario?.rol !== "empleado") {
        return router.push("/login")
      }

      const { data: resenaData, error: resenaError } = await supabase
        .from("resenas")
        .select("id, texto, puntuacion, created_at, numero_mesa")
        .eq("empleado_id", user.id)
        .order("created_at", { ascending: false })

      if (resenaError) {
        alert("❌ Error al cargar reseñas")
        return
      }

      setResenas(resenaData ?? [])
      setLoading(false)
    }

    fetchResenas()
  }, [router])

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Mis Reseñas</h1>

        {loading ? (
          <p style={styles.text}>Cargando reseñas...</p>
        ) : resenas.length === 0 ? (
          <p style={styles.text}>No tienes reseñas aún.</p>
        ) : (
          resenas.map((resena) => (
            <div key={resena.id} style={styles.reviewCard}>
              <div style={styles.header}>
                <strong>Mesa {resena.numero_mesa ?? "-"}</strong>
                <span>{new Date(resena.created_at).toLocaleDateString()}</span>
              </div>
              <p style={styles.text}>{resena.texto}</p>
              <div style={styles.stars}>
                {"★".repeat(resena.puntuacion)}
                {"☆".repeat(5 - resena.puntuacion)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "#b8c7bf",
    minHeight: "100vh",
    padding: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  card: {
    backgroundColor: "#e7ece9",
    padding: "32px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "700px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.15)"
  },
  title: {
    marginBottom: "24px",
    textAlign: "center",
    color: "#2c3e50"
  },
  reviewCard: {
    backgroundColor: "#f9fbfa",
    border: "1px solid #d9e1dd",
    padding: "16px",
    borderRadius: "12px",
    marginBottom: "16px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "14px",
    color: "#617068"
  },
  stars: {
    color: "#617068",
    fontSize: "18px",
    marginTop: "6px"
  },
  text: {
    color: "#2c3e50",
    fontSize: "15px"
  }
}
