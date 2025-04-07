// pages/api/crear-empleado.ts
import { createClient } from "@supabase/supabase-js"
import type { NextApiRequest, NextApiResponse } from "next"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" })
  }

  const { nombre, email, password, nfc_code, admin_id } = req.body

  if (!nombre || !email || !password || !nfc_code || !admin_id) {
    return res.status(400).json({ error: "Faltan campos requeridos" })
  }

  try {
    const { data: adminUsuario, error: adminError } = await supabase
      .from("usuarios")
      .select("restaurante_id")
      .eq("id", admin_id)
      .single()

    if (adminError || !adminUsuario?.restaurante_id) {
      return res.status(400).json({ error: "No se pudo obtener el restaurante del admin." })
    }

    const restaurante_id = adminUsuario.restaurante_id

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (authError || !authData?.user?.id) {
      return res.status(400).json({
        error: "Error al crear el usuario en Auth",
        details: authError?.message || "No se obtuvo el ID del usuario"
      })
    }

    const userId = authData.user.id

    const { error: usuarioError } = await supabase.from("usuarios").insert([
      {
        id: userId,
        email,
        rol: "empleado",
        restaurante_id
      }
    ])

    if (usuarioError) {
      return res.status(400).json({ error: "Error al insertar en usuarios", details: usuarioError.message })
    }

    const { error: empleadoError } = await supabase.from("empleados").insert([
      {
        id: userId,
        nombre,
        nfc_code,
        restaurante_id
      }
    ])

    if (empleadoError) {
      return res.status(400).json({ error: "Error al insertar en empleados", details: empleadoError.message })
    }

    return res.status(200).json({ message: "✅ Empleado creado correctamente" })
  } catch (err) {
    console.error("Error inesperado en crear-empleado:", err)
    return res.status(500).json({ error: "Error interno del servidor" })
  }
}
