// pages/resena.tsx

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

type Empleado = {
  id: string
  nombre: string
  restaurante_id: string
}

export default function CrearResena() {
  const router = useRouter()
  const { nfc } = router.query

  const [empleado, setEmpleado] = useState<Empleado | null>(null)
  const [texto, setTexto] = useState("")
  const [puntuacion, setPuntuacion] = useState(0)
  const [mesa, setMesa] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEmpleado = async () => {
      if (!nfc || typeof nfc !== "string") return

      const { data, error } = await supabase
        .from("empleados")
        .select("id, nombre, restaurante_id")
        .eq("nfc_code", nfc)
        .single()

      if (error || !data) {
        alert("Empleado no encontrado.")
      } else {
        setEmpleado(data)
      }
      setLoading(false)
    }

    fetchEmpleado()
  }, [nfc])

  const handleSubmit = async () => {
    if (!empleado) return alert("Empleado no válido.")
    if (puntuacion < 1 || puntuacion > 5) return alert("Selecciona una puntuación válida.")
    if (!mesa.trim()) return alert("Introduce tu número de mesa.")

    const { error } = await supabase.from("resenas").insert([
      {
        texto,
        puntuacion,
        numero_mesa: mesa,
        empleado_id: empleado.id,
        restaurante_id: empleado.restaurante_id
      }
    ])

    if (error) {
      alert("Error al guardar la reseña.")
    } else {
      alert("¡Gracias por tu reseña!")
      setTexto("")
      setPuntuacion(0)
      setMesa("")
    }
  }

  if (loading) return <p style={{ textAlign: "center", marginTop: 40 }}>Cargando...</p>

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Deja tu reseña</h1>
        <p style={styles.subtitle}>
          Estás dejando una reseña para: <strong>{empleado?.nombre}</strong>
        </p>

        <label style={styles.label}>Número de mesa</label>
        <input
          value={mesa}
          onChange={(e) => setMesa(e.target.value)}
          placeholder="Ej: 5"
          style={styles.input}
        />

        <label style={styles.label}>Tu reseña</label>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe tu opinión"
          rows={4}
          style={{ ...styles.input, resize: "none" }}
        />

        <label style={styles.label}>Puntuación</label>
        <div style={styles.stars}>
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              onClick={() => setPuntuacion(num)}
              style={{
                fontSize: 32,
                cursor: "pointer",
                color: num <= puntuacion ? "#f5c518" : "#ccc"
              }}
            >
              ★
            </span>
          ))}
        </div>

        <button onClick={handleSubmit} style={styles.button}>
          Enviar reseña
        </button>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "#b8c7bf",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 24
  },
  card: {
    backgroundColor: "#e7ece9",
    padding: 32,
    borderRadius: 16,
    width: "100%",
    maxWidth: 500,
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
  },
  title: {
    fontSize: 24,
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 16
  },
  subtitle: {
    textAlign: "center",
    color: "#2c3e50",
    marginBottom: 24
  },
  label: {
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
    display: "block"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    color: "#2c3e50",
    backgroundColor: "#f0f4f1"
  },
  stars: {
    display: "flex",
    gap: 8,
    marginBottom: 24,
    justifyContent: "center"
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#5C665D",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px"
  }
}
