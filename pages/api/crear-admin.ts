// pages/api/crear-admin.ts
import { createClient } from "@supabase/supabase-js"
import type { NextApiRequest, NextApiResponse } from "next"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Faltan variables de entorno de Supabase")
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña requeridos" })
  }

  try {
    const { data, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError || !data?.user?.id) {
      return res.status(400).json({
        error: "Error al crear en Auth",
        details: authError?.message || "No se obtuvo ID del usuario",
      })
    }

    const userId = data.user.id

    const { error: dbError } = await supabaseAdmin.from("usuarios").insert([
      {
        id: userId,
        email,
        rol: "admin_restaurante",
        restaurante_id: null,
      },
    ])

    if (dbError) {
      return res.status(400).json({
        error: "Error al insertar en usuarios",
        details: dbError.message,
      })
    }

    return res.status(200).json({ message: "✅ Admin restaurante creado correctamente" })
  } catch (err) {
    console.error("Error en /api/crear-admin:", err)
    return res.status(500).json({ error: "Error inesperado del servidor" })
  }
}
