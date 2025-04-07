export default function Contacto() {
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
        fontSize: "28px",
        color: "#2c3e50",
        marginBottom: "24px"
      },
      info: {
        fontSize: "16px",
        color: "#2c3e50",
        marginBottom: "16px"
      },
      highlight: {
        fontWeight: "bold" as const,
        color: "#617068"
      }
    }
  
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Contacto</h1>
  
          <p style={styles.info}>
            ¿Tienes dudas o quieres formar parte de <span style={styles.highlight}>NFCión</span>?
          </p>
  
          <p style={styles.info}>
            📞 Teléfono: <span style={styles.highlight}>+34 612 345 678</span>
          </p>
  
          <p style={styles.info}>
            📧 Correo: <span style={styles.highlight}>contacto@nfcion.com</span>
          </p>
  
          <p style={styles.info}>
            Estaremos encantados de ayudarte 🤝
          </p>
        </div>
      </div>
    )
  }
  