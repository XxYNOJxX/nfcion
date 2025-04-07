// pages/admin-global/anadir-restaurante.tsx
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function AnadirRestaurante() {
  const [nombre, setNombre] = useState("")

  const handleCrear = async () => {
    if (!nombre.trim()) return alert("Introduce un nombre")

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

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #D6DED9, #A9B9AF)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 24
    }}>
      <div style={{
        background: "#ffffffcc",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        minWidth: "360px",
        textAlign: "center"
      }}>
        <h1 style={{ marginBottom: 24, color: "#1c1c1c" }}>Crear nuevo restaurante</h1>

        <input
          placeholder="Nombre del restaurante"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            padding: 12,
            width: "100%",
            marginBottom: 16,
            borderRadius: 8,
            border: "1px solid #999",
            outline: "none",
            fontSize: 16,
            color: "#1c1c1c",
            background: "#f0f4f1"
          }}
        />

        <button
          onClick={handleCrear}
          style={{
            padding: "12px 20px",
            backgroundColor: "#5C665D",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            width: "100%"
          }}
        >
          Crear restaurante
        </button>
      </div>
    </div>
  )
}