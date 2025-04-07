import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

type Resena = {
  id: string
  texto: string
  puntuacion: number
  created_at: string
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

      // Verificar rol
      const { data: usuario, error } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("id", user.id)
        .single()

      if (error || usuario?.rol !== "empleado") {
        return router.push("/login")
      }

      // Obtener reseñas del empleado
      const { data: resenaData } = await supabase
        .from("resenas")
        .select("id, texto, puntuacion, created_at")
        .eq("empleado_id", user.id)
        .order("created_at", { ascending: false })

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
                <strong>{new Date(resena.created_at).toLocaleDateString()}</strong>
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

const styles = {
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
    textAlign: "center" as const,
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
