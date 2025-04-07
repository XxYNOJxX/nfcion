// pages/api/eliminar-restaurante.ts
import { createClient } from "@supabase/supabase-js"
import type { NextApiRequest, NextApiResponse } from "next"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const { restauranteId } = req.body

  if (!restauranteId) {
    return res.status(400).json({ error: "ID del restaurante requerido" })
  }

  try {
    // 1. Buscar usuarios con ese restaurante_id
    const { data: usuarios, error: usuariosError } = await supabaseAdmin
      .from("usuarios")
      .select("id")
      .eq("restaurante_id", restauranteId)

    if (usuariosError) throw usuariosError

    // 2. Eliminar usuarios de tabla y de Auth
    for (const usuario of usuarios) {
      await supabaseAdmin.from("usuarios").delete().eq("id", usuario.id)
      await supabaseAdmin.auth.admin.deleteUser(usuario.id)
    }

    // 3. Eliminar el restaurante
    const { error: restError } = await supabaseAdmin
      .from("restaurante")
      .delete()
      .eq("id", restauranteId)

    if (restError) throw restError

    return res.status(200).json({ message: "✅ Restaurante y usuarios eliminados correctamente" })
  } catch (err) {
    console.error("❌ Error al eliminar restaurante:", err)
    return res.status(500).json({ error: "Error al eliminar restaurante y usuarios" })
  }
}
