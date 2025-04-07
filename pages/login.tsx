// pages/login.tsx
import { useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    setError("")

    if (!email || !password) {
      setError("Completa todos los campos.")
      return
    }

    setLoading(true)

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (loginError || !data.user) {
      setError("❌ Email o contraseña incorrectos.")
      setLoading(false)
      return
    }

    const userId = data.user.id

    const { data: perfil, error: perfilError } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("id", userId)
      .single()

    if (perfilError || !perfil) {
      setError("❌ No se pudo obtener el perfil del usuario.")
      setLoading(false)
      return
    }

    switch (perfil.rol) {
      case "admin_global":
        router.push("/admin-global")
        break
      case "admin_restaurante":
        router.push("/admin-restaurante")
        break
      case "empleado":
        router.push("/empleado")
        break
      default:
        setError("❌ Rol no reconocido.")
    }

    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Iniciar sesión</h1>

        {error && <p style={styles.error}>{error}</p>}

        <label style={styles.label}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={styles.input}
        />

        <label style={styles.label}>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={styles.input}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#b8c7bf",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px"
  },
  card: {
    backgroundColor: "#e7ece9",
    padding: "32px",
    borderRadius: "16px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px"
  },
  title: {
    textAlign: "center" as const,
    color: "#2c3e50",
    marginBottom: "24px"
  },
  label: {
    color: "#2c3e50",
    fontWeight: "bold" as const,
    marginBottom: "8px",
    display: "block"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#f3f6f4",
    color: "#2c3e50",
    fontSize: "15px"
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#617068",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold" as const,
    fontSize: "16px"
  },
  error: {
    color: "red",
    textAlign: "center" as const,
    marginBottom: "16px"
  }
}

