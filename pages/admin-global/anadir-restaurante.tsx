// pages/admin-global/anadir-restaurante.tsx
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function AnadirRestaurante() {
  const [nombre, setNombre] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAccess = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getUser()
      const userId = sessionData?.user?.id

      if (!userId || sessionError) {
        router.push("/login")
        return
      }

      const { data: usuario, error: usuarioError } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("id", userId)
        .single()

      if (usuarioError || usuario?.rol !== "admin_global") {
        router.push("/login")
      } else {
        setLoading(false)
      }
    }

    checkAccess()
  }, [router])

  const handleCrear = async () => {
    if (!nombre.trim()) return alert("Introduce un nombre válido")

    const { error } = await supabase.from("restaurante").insert([{ nombre }])

    if (error) {
      alert("❌ Error al crear restaurante")
      console.error(error)
    } else {
      alert("✅ Restaurante creado correctamente")
      setNombre("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCrear()
  }

  if (loading) return <p style={{ padding: 32, textAlign: "center" }}>Cargando...</p>

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Crear nuevo restaurante</h1>

        <input
          placeholder="Nombre del restaurante"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onKeyDown={handleKeyDown}
          style={styles.input}
        />

        <button onClick={handleCrear} style={styles.button}>
          Crear restaurante
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #D6DED9, #A9B9AF)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    background: "#ffffffcc",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    minWidth: "360px",
    textAlign: "center" as const,
  },
  title: {
    marginBottom: 24,
    color: "#1c1c1c",
    fontSize: "22px",
    fontWeight: "bold" as const,
  },
  input: {
    padding: 12,
    width: "100%",
    marginBottom: 16,
    borderRadius: 8,
    border: "1px solid #999",
    outline: "none",
    fontSize: 16,
    color: "#1c1c1c",
    background: "#f0f4f1",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#5C665D",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold" as const,
    cursor: "pointer",
    width: "100%",
  },
}
