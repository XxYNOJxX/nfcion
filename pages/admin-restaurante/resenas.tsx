// pages/admin-restaurante/resenas.tsx
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/router"

type Resena = {
  id: string
  texto: string
  puntuacion: number
  created_at: string
  empleado_id: string
  numero_mesa?: string
  nombre_empleado?: string
}

export default function Resenas() {
  const [resenas, setResenas] = useState<Resena[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData, error: userError } = await supabase.auth.getUser()
      const userId = sessionData?.user?.id
      if (!userId || userError) return router.push("/login")

      const { data: usuario, error: usuarioError } = await supabase
        .from("usuarios")
        .select("rol, restaurante_id")
        .eq("id", userId)
        .single()

      if (
        usuarioError ||
        !usuario?.restaurante_id ||
        usuario.rol !== "admin_restaurante"
      ) return router.push("/login")

      const { data: resenasData, error: resenasError } = await supabase
        .from("resenas")
        .select("*")
        .eq("restaurante_id", usuario.restaurante_id)
        .order("created_at", { ascending: false })

      if (resenasError) {
        alert("❌ Error cargando reseñas")
        return
      }

      const { data: empleadosData } = await supabase
        .from("empleados")
        .select("id, nombre")
        .eq("restaurante_id", usuario.restaurante_id)

      const resenasConNombre = resenasData.map((resena) => {
        const empleado = empleadosData?.find((e) => e.id === resena.empleado_id)
        return {
          ...resena,
          nombre_empleado: empleado?.nombre ?? "Empleado desconocido"
        }
      })

      setResenas(resenasConNombre)
      setLoading(false)
    }

    fetchData()
  }, [router])

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Reseñas del restaurante</h1>

        {loading ? (
          <p style={styles.text}>Cargando...</p>
        ) : resenas.length === 0 ? (
          <p style={styles.text}>Aún no hay reseñas.</p>
        ) : (
          resenas.map((resena) => (
            <div key={resena.id} style={styles.reviewCard}>
              <div style={styles.header}>
                <strong>{resena.nombre_empleado}</strong>
                <span>{new Date(resena.created_at).toLocaleDateString()}</span>
              </div>
              <p style={styles.text}><strong>Mesa:</strong> {resena.numero_mesa || "Desconocida"}</p>
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
    fontSize: "15px",
    marginBottom: "6px"
  }
}
