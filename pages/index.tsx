import { useRouter } from "next/router"

export default function Home() {
  const router = useRouter()

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#b8c7bf",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px",
      textAlign: "center" as const
    },
    card: {
      backgroundColor: "#e7ece9",
      padding: "40px",
      borderRadius: "16px",
      boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
      maxWidth: "500px",
      width: "100%"
    },
    title: {
      fontSize: "32px",
      color: "#2c3e50",
      marginBottom: "24px"
    },
    button: {
      backgroundColor: "#617068",
      color: "#fff",
      padding: "12px 20px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      margin: "8px",
      minWidth: "140px"
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Bienvenido a NFCión</h1>
        <p style={{ color: "#2c3e50", marginBottom: "24px" }}>
          Gestión inteligente de empleados y reseñas vía NFC
        </p>
        <div>
          <button style={styles.button} onClick={() => router.push("/login")}>
            Login
          </button>
          <button style={styles.button} onClick={() => router.push("/contacto")}>
            Contacto
          </button>
        </div>
      </div>
    </div>
  )
}
