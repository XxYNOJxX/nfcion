// pages/admin-restaurante/comprar-qr.tsx
import { useEffect } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function ComprarQR() {
  const router = useRouter()

  useEffect(() => {
    const checkAccess = async () => {
      const { data: session } = await supabase.auth.getUser()
      const userId = session?.user?.id

      if (!userId) return router.push("/login")

      const { data: usuario, error } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("id", userId)
        .single()

      if (error || usuario?.rol !== "admin_restaurante") {
        router.push("/login")
      }
    }

    checkAccess()
  }, [])

  const opciones = [
    { label: "1 QR - €9.99", value: "1" },
    { label: "5 QRs - €49.99", value: "5" },
    { label: "10 QRs - €89.99", value: "10" }
  ]

  const handleClick = (value: string) => {
    alert(`Redirigiendo al pago de ${value} QR(s)...`)
    // router.push(`/pago?qrs=${value}`)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Compra códigos QR</h1>
        <p style={styles.description}>Un QR para cada empleado. ¡Aumenta las reseñas y haz que te recuerden!</p>
        {opciones.map((op) => (
          <button key={op.value} style={styles.button} onClick={() => handleClick(op.value)}>
            {op.label}
          </button>
        ))}
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
  title: {
    textAlign: "center" as const,
    marginBottom: "16px",
    fontSize: "24px",
    color: "#2c3e50"
  },
  description: {
    fontSize: "15px",
    marginBottom: "24px",
    textAlign: "center" as const,
    color: "#2c3e50"
  },
  button: {
    backgroundColor: "#617068",
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "12px",
    width: "100%",
    cursor: "pointer"
  }
}
