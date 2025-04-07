// pages/admin-restaurante/empleados.tsx
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/router"

type Empleado = {
  id: string
  nombre: string | null
  nfc_code: string | null
}

export default function Empleados() {
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchEmpleados = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getUser()
      const userId = sessionData?.user?.id

      if (sessionError || !userId) {
        router.push("/login")
        return
      }

      const { data: usuario, error: usuarioError } = await supabase
        .from("usuarios")
        .select("rol, restaurante_id")
        .eq("id", userId)
        .single()

      if (
        usuarioError ||
        !usuario?.restaurante_id ||
        usuario.rol !== "admin_restaurante"
      ) {
        router.push("/login")
        return
      }

      const { data: empleadosData, error: empleadosError } = await supabase
        .from("empleados")
        .select("id, nombre, nfc_code")
        .eq("restaurante_id", usuario.restaurante_id)

      if (empleadosError) {
        alert("Error al obtener empleados")
        return
      }

      setEmpleados(empleadosData ?? [])
      setLoading(false)
    }

    fetchEmpleados()
  }, [router])

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este empleado?")) return

    const res = await fetch("/api/eliminar-empleado", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })

    if (!res.ok) {
      alert("❌ Error eliminando al empleado")
      return
    }

    alert("✅ Empleado eliminado")
    setEmpleados((prev) => prev.filter((emp) => emp.id !== id))
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Empleados del restaurante</h2>

        {loading ? (
          <p style={styles.text}>Cargando empleados...</p>
        ) : empleados.length === 0 ? (
          <p style={styles.text}>No hay empleados aún.</p>
        ) : (
          <ul style={{ padding: 0 }}>
            {empleados.map((emp) => (
              <li key={emp.id} style={styles.item}>
                <span>
                  <strong>{emp.nombre || "Sin nombre"}</strong> – {emp.nfc_code || "Sin NFC"}
                </span>
                <button onClick={() => handleDelete(emp.id)} style={styles.deleteButton}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#b8c7bf",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 24
  },
  card: {
    background: "#f1f4f1",
    padding: 32,
    borderRadius: 12,
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: 600
  },
  title: {
    textAlign: "center" as const,
    color: "#2c3e50",
    marginBottom: 24
  },
  text: {
    color: "#2c3e50",
    textAlign: "center" as const
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#e7ece9",
    borderRadius: 8,
    padding: "12px 16px",
    marginBottom: 12,
    color: "#2c3e50"
  },
  deleteButton: {
    backgroundColor: "#b23b3b",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer"
  }
}
