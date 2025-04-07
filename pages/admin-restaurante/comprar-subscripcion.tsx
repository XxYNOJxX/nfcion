// pages/admin-restaurante/comprar-suscripciones.tsx
import { useEffect } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function ComprarSubscripciones() {
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

  const planes = [
    { nombre: "3 meses", precio: "€39.99", id: "3m" },
    { nombre: "6 meses", precio: "€79.99", id: "6m" },
    { nombre: "12 meses", precio: "€109.99", id: "12m" }
  ]

  const handleSeleccion = (planId: string) => {
    alert(`👉 Próximamente: redirigir a pago del plan ${planId}`)
    // Aquí luego redirigirás a pasarela o backend
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Comprar suscripciones</h1>
        {planes.map((plan) => (
          <div key={plan.id} style={styles.planCard}>
            <div style={styles.info}>
              <h3 style={{ margin: 0 }}>{plan.nombre}</h3>
              <p style={{ margin: 0 }}>{plan.precio}</p>
            </div>
            <button onClick={() => handleSeleccion(plan.id)} style={styles.button}>
              Seleccionar
            </button>
          </div>
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
    marginBottom: "24px",
    fontSize: "24px",
    color: "#2c3e50"
  },
  planCard: {
    backgroundColor: "#f9fbfa",
    border: "1px solid #d9e1dd",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "16px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  info: {
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
  }
}
