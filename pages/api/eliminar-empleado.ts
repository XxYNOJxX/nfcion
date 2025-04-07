// pages/api/eliminar-empleado.ts
import { createClient } from "@supabase/supabase-js"
import type { NextApiRequest, NextApiResponse } from "next"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { autoRefreshToken: false, persistSession: false }
  }
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Método no permitido")

  const { id } = req.body
  if (!id) return res.status(400).json({ error: "ID requerido" })

  try {
    // 1. Eliminar de empleados
    await supabase.from("empleados").delete().eq("id", id)

    // 2. Eliminar de usuarios
    await supabase.from("usuarios").delete().eq("id", id)

    // 3. Eliminar del Auth
    const adminAuthClient = supabase.auth.admin
    await adminAuthClient.deleteUser(id)

    return res.status(200).json({ message: "Empleado eliminado" })
  } catch (error) {
    console.error("Error al eliminar empleado:", error)
    return res.status(500).json({ error: "Error eliminando al empleado" })
  }
}
