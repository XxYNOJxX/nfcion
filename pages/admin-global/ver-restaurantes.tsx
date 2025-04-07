// pages/admin-global/ver-restaurantes.tsx
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/router"

export default function VerRestaurantes() {
  const [restaurantes, setRestaurantes] = useState<any[]>([])
  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAccess = async () => {
      const { data: session } = await supabase.auth.getUser()
      const userId = session?.user?.id

      if (!userId) return router.push("/login")

      const { data: usuario } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("id", userId)
        .single()

      if (usuario?.rol !== "admin_global") router.push("/login")
    }

    const fetchData = async () => {
      const { data: restData } = await supabase.from("restaurante").select("*")
      const { data: adminData } = await supabase
        .from("usuarios")
        .select("id, email, restaurante_id")
        .eq("rol", "admin_restaurante")

      setRestaurantes(restData || [])
      setAdmins(adminData || [])
      setLoading(false)
    }

    checkAccess().then(fetchData)
  }, [router])

  const asignarAdmin = async (restauranteId: string, adminId: string) => {
    await supabase.from("usuarios").update({ restaurante_id: restauranteId }).eq("id", adminId)
    alert("✅ Admin asignado")
    location.reload()
  }

  const eliminarRestaurante = async (id: string) => {
    const confirm = window.confirm("¿Eliminar restaurante y su admin?")
    if (!confirm) return

    const admin = admins.find((a) => a.restaurante_id === id)

    if (admin) {
      await supabase.from("usuarios").delete().eq("id", admin.id)
      await supabase.auth.admin.deleteUser(admin.id)
    }

    await supabase.from("restaurante").delete().eq("id", id)
    alert("✅ Restaurante y admin eliminados")
    location.reload()
  }

  return (
    <div style={{ padding: 32, minHeight: "100vh", background: "#c3cfc8" }}>
      <div
        style={{
          background: "#f1f5f3",
          maxWidth: 600,
          margin: "0 auto",
          padding: 32,
          borderRadius: 16,
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: "#1c1c1c" }}>
          Lista de restaurantes
        </h1>

        {loading ? (
          <p style={{ color: "#1c1c1c" }}>Cargando...</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {restaurantes.map((rest) => {
              const admin = admins.find((a) => a.restaurante_id === rest.id)

              return (
                <li
                  key={rest.id}
                  style={{
                    marginBottom: "24px",
                    padding: "16px",
                    borderRadius: "12px",
                    background: "#f0f4f1",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                    color: "#1c1c1c",
                  }}
                >
                  <p style={{ fontWeight: 600 }}>
                    <strong>🍽 Restaurante:</strong> {rest.nombre}
                  </p>
                  <p>
                    <strong>👤 Admin:</strong>{" "}
                    {admin ? admin.email : "No asignado"}
                  </p>

                  {!admin && (
                    <select
                      onChange={(e) => asignarAdmin(rest.id, e.target.value)}
                      defaultValue=""
                      style={{
                        marginTop: 8,
                        padding: 8,
                        width: "100%",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                      }}
                    >
                      <option value="" disabled>
                        Asignar admin existente
                      </option>
                      {admins
                        .filter((a) => !a.restaurante_id)
                        .map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.email}
                          </option>
                        ))}
                    </select>
                  )}

                  <button
                    onClick={() => eliminarRestaurante(rest.id)}
                    style={{
                      marginTop: 12,
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: "#b73232",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    🗑 Eliminar restaurante
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
