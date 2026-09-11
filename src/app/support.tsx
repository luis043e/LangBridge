import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SUPPORT_EMAIL = "bridgelang00@gmail.com";

export default function SupportScreen() {
  const openEmail = async () => {
    const url = `mailto:${SUPPORT_EMAIL}?subject=Soporte%20de%20LangBridge`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error("Error opening support email:", error);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.brand}>LangBridge</Text>
        <Text style={styles.title}>Soporte y contacto</Text>
        <Text style={styles.subtitle}>Información para solicitar ayuda, comunicar problemas y realizar consultas sobre privacidad.</Text>
        <Text style={styles.date}>Canal provisional de atención</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.notice}>LangBridge utiliza provisionalmente un único correo para soporte, privacidad y consultas relacionadas con la eliminación de cuentas.</Text>

        <Text style={styles.heading}>Correo de soporte</Text>
        <Text style={styles.paragraph}>Puedes comunicarte con LangBridge mediante el siguiente correo electrónico:</Text>
        <TouchableOpacity style={styles.emailButton} onPress={openEmail} activeOpacity={0.8} accessibilityRole="link" accessibilityLabel={`Enviar correo a ${SUPPORT_EMAIL}`}>
          <Text style={styles.email}>{SUPPORT_EMAIL}</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Problemas de acceso</Text>
        <Text style={styles.paragraph}>Si no puedes acceder a tu cuenta, utiliza primero la opción de recuperación de contraseña disponible en la pantalla de inicio de sesión. Nunca envíes tu contraseña por correo.</Text>

        <Text style={styles.heading}>Problemas técnicos</Text>
        <Text style={styles.paragraph}>Describe el problema, la pantalla donde ocurrió y los pasos realizados. No incluyas contraseñas, códigos de acceso, datos financieros ni información personal innecesaria.</Text>

        <Text style={styles.heading}>Privacidad</Text>
        <Text style={styles.paragraph}>Puedes utilizar este canal para realizar consultas sobre tus datos, solicitar información, pedir una corrección o consultar el estado de una solicitud de eliminación.</Text>

        <Text style={styles.heading}>Eliminación de cuenta</Text>
        <Text style={styles.paragraph}>Las consultas provisionales sobre eliminación deben enviarse desde el correo asociado a la cuenta. Indica claramente que deseas solicitar la eliminación de tu cuenta de LangBridge.</Text>

        <Text style={styles.heading}>Reportes dentro de la aplicación</Text>
        <Text style={styles.paragraph}>Cuando tengas acceso a LangBridge, utiliza las funciones internas de reporte y bloqueo para comunicar conductas no deseadas o posibles incumplimientos.</Text>

        <Text style={styles.heading}>Información útil</Text>
        <Text style={styles.paragraph}>Incluye solamente la información necesaria para identificar el problema. Si corresponde, indica la versión de la aplicación, el dispositivo y una descripción clara de lo ocurrido.</Text>

        <Text style={styles.heading}>Seguridad</Text>
        <Text style={styles.paragraph}>LangBridge no solicitará contraseñas completas, credenciales de Google, códigos permanentes, documentos de identidad ni información financiera mediante el correo de soporte.</Text>

        <Text style={styles.heading}>Tiempo de respuesta</Text>
        <Text style={styles.paragraph}>El plazo operativo de respuesta todavía está pendiente de aprobación. LangBridge procurará revisar las solicitudes mediante el canal disponible y priorizar los asuntos de seguridad.</Text>

        <Text style={styles.heading}>Ubicación del responsable</Text>
        <Text style={styles.paragraph}>LangBridge opera inicialmente desde República Dominicana bajo la responsabilidad de Luis Enrique Nuñez Minaya.</Text>
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
  emailButton: { alignSelf: "flex-start", backgroundColor: "#EEF2FF", borderColor: "#6366F1", borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 24 },
  email: { color: "#4338CA", fontSize: 16, fontWeight: "800" },
  footer: { color: "#94A3B8", fontSize: 13, textAlign: "center", paddingVertical: 24 },
});
