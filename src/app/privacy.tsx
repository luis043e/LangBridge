import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function PrivacyScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.brand}>LangBridge</Text>
        <Text style={styles.title}>Política de privacidad</Text>
        <Text style={styles.subtitle}>Información sobre el uso y la protección de tus datos.</Text>
        <Text style={styles.date}>Borrador público en preparación</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.notice}>Esta política todavía está en proceso de revisión. LangBridge completará las decisiones pendientes antes de su publicación definitiva.</Text>

        <Text style={styles.heading}>Responsable</Text>
        <Text style={styles.paragraph}>LangBridge opera inicialmente bajo la responsabilidad de Luis Enrique Nuñez Minaya, en República Dominicana.</Text>

        <Text style={styles.heading}>Datos que utilizamos</Text>
        <Text style={styles.paragraph}>LangBridge puede procesar nombre, correo electrónico, identificador de cuenta, país, biografía, fotografía de perfil, idiomas, nivel, conexiones, mensajes, bloqueos, reportes y solicitudes de eliminación.</Text>

        <Text style={styles.heading}>Finalidades</Text>
        <Text style={styles.paragraph}>Utilizamos la información para crear y proteger cuentas, mostrar perfiles, facilitar conexiones, permitir conversaciones, personalizar la experiencia lingüística, atender reportes y procesar solicitudes.</Text>

        <Text style={styles.heading}>Visibilidad</Text>
        <Text style={styles.paragraph}>Parte del perfil puede mostrarse a otras personas autenticadas. El correo, las credenciales, los reportes, las listas de bloqueo y las solicitudes de eliminación no están destinados a mostrarse públicamente.</Text>

        <Text style={styles.heading}>Proveedores</Text>
        <Text style={styles.paragraph}>LangBridge utiliza servicios de Google Firebase para autenticación y almacenamiento, y permite el acceso opcional mediante Google Sign-In.</Text>

        <Text style={styles.heading}>Mensajes y seguridad</Text>
        <Text style={styles.paragraph}>Las conversaciones se limitan a participantes autorizados. LangBridge dispone de funciones de bloqueo y reporte para ayudar a proteger la experiencia social.</Text>

        <Text style={styles.heading}>Eliminación de cuenta</Text>
        <Text style={styles.paragraph}>Actualmente puedes solicitar la eliminación desde la aplicación. LangBridge está completando el procedimiento efectivo para eliminar o anonimizar la cuenta y los datos asociados.</Text>

        <Text style={styles.heading}>Funciones futuras</Text>
        <Text style={styles.paragraph}>Antes de activar fotografías desde la galería, Firebase Storage, aprendizaje gamificado, analítica, notificaciones u otras funciones nuevas, actualizaremos esta política y las declaraciones correspondientes.</Text>

        <Text style={styles.heading}>Contacto</Text>
        <Text style={styles.paragraph}>Para consultas sobre soporte, privacidad o eliminación de cuenta puedes escribir provisionalmente a:</Text>
        <Text style={styles.email}>bridgelang00@gmail.com</Text>
      </View>

      <Text style={styles.footer}>© LangBridge · República Dominicana</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#050B24" },
  content: { width: "100%", maxWidth: 900, alignSelf: "center", padding: 20, paddingBottom: 40 },
  header: { backgroundColor: "#0C1738", borderColor: "#26365F", borderWidth: 1, borderRadius: 22, padding: 24, marginBottom: 18 },
  brand: { color: "#22D3EE", fontSize: 18, fontWeight: "800", marginBottom: 14 },
  title: { color: "#FFFFFF", fontSize: 32, lineHeight: 40, fontWeight: "800", marginBottom: 10 },
  subtitle: { color: "#C7D2FE", fontSize: 17, lineHeight: 25 },
  date: { color: "#94A3B8", fontSize: 13, marginTop: 16 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 22, padding: 24 },
  notice: { color: "#312E81", backgroundColor: "#EEF2FF", borderRadius: 12, padding: 16, fontSize: 15, lineHeight: 23, marginBottom: 26 },
  heading: { color: "#111827", fontSize: 21, lineHeight: 28, fontWeight: "800", marginTop: 8, marginBottom: 8 },
  paragraph: { color: "#334155", fontSize: 16, lineHeight: 26, marginBottom: 20 },
  email: { color: "#4338CA", fontSize: 16, fontWeight: "800", marginBottom: 8 },
  footer: { color: "#94A3B8", fontSize: 13, textAlign: "center", paddingVertical: 24 },
});
