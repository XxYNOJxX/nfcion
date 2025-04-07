// pages/admin-restaurante/subscripciones.tsx
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { CreditCard, QrCode } from "lucide-react"
import { useRouter } from "next/router"

export default function Subscripciones() {
  const [plan, setPlan] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchPlan = async () => {
      const { data: session } = await supabase.auth.getUser()
      const userId = session?.user?.id
      if (!userId) return

      const { data: usuario } = await supabase
        .from("usuarios")
        .select("plan, rol")
        .eq("id", userId)
        .single()

      if (!usuario || usuario.rol !== "admin_restaurante") {
        router.push("/login")
        return
      }

      setPlan(usuario.plan || "")
    }

    fetchPlan()
  }, [])

  const goTo = (path: string) => {
    router.push(path)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Gestión de pagos</h1>

        <div style={styles.section}>
          <div style={styles.iconText}>
            <CreditCard size={20} />
            <span>Suscripción</span>
          </div>
          <p style={styles.description}>Plan actual: <strong>{plan || "Sin plan"}</strong></p>
          <button style={styles.button} onClick={() => goTo("/admin-restaurante/comprar-subscripciones")}>
            Suscribirse al plan premium
          </button>
        </div>

        <div style={styles.section}>
          <div style={styles.iconText}>
            <QrCode size={20} />
            <span>Comprar nuevo QR</span>
          </div>
          <p style={styles.description}>Un QR para cada empleado. ¡Aumenta las reseñas y haz que te recuerden!</p>
          <button style={styles.button} onClick={() => goTo("/admin-restaurante/comprar-qr")}>
            Comprar QR adicional
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: "#b8c7bf",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px"
  },
  card: {
    backgroundColor: "#e7ece9",
    padding: "32px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "600px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.15)"
  },
  section: {
    marginBottom: "32px"
  },
  iconText: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
    fontSize: "18px",
    color: "#2c3e50"
  },
  description: {
    fontSize: "15px",
    marginBottom: "12px",
    color: "#2c3e50"
  },
  button: {
    backgroundColor: "#617068",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  title: {
    textAlign: "center" as const,
    marginBottom: "24px",
    fontSize: "24px",
    color: "#2c3e50"
  }
}
