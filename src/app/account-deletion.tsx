import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function AccountDeletionScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.brand}>LangBridge</Text>
        <Text style={styles.title}>Eliminación de cuenta y datos</Text>
        <Text style={styles.subtitle}>Información para solicitar la eliminación de una cuenta de LangBridge.</Text>
        <Text style={styles.date}>Procedimiento público en preparación</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.notice}>LangBridge está completando el procedimiento efectivo de eliminación. La función actual permite registrar la solicitud y ocultar el perfil, pero todavía no elimina automáticamente todos los datos asociados.</Text>

        <Text style={styles.heading}>Quién puede solicitarla</Text>
        <Text style={styles.paragraph}>La eliminación puede ser solicitada por la persona que controla la cuenta. LangBridge podrá verificar razonablemente la identidad antes de ejecutar operaciones irreversibles.</Text>

        <Text style={styles.heading}>Desde la aplicación</Text>
        <Text style={styles.paragraph}>Una persona autenticada puede abrir Configuración, entrar en Privacidad y seguridad y seleccionar la opción para eliminar la cuenta. La ubicación exacta se verificará nuevamente antes de publicar.</Text>

        <Text style={styles.heading}>Solicitud mediante la web</Text>
        <Text style={styles.paragraph}>La versión definitiva de esta página permitirá iniciar una solicitud sin instalar ni abrir la aplicación. El mecanismo público todavía está pendiente de implementación.</Text>

        <Text style={styles.heading}>Solicitud provisional por correo</Text>
        <Text style={styles.paragraph}>Mientras se completa el mecanismo público, las consultas sobre eliminación pueden enviarse desde el correo asociado a la cuenta a:</Text>
        <Text style={styles.email}>bridgelang00@gmail.com</Text>

        <Text style={styles.heading}>Información que debes proporcionar</Text>
        <Text style={styles.paragraph}>La solicitud deberá identificar el correo asociado a la cuenta y expresar claramente que se desea eliminar la cuenta de LangBridge. No envíes contraseñas, códigos de acceso, credenciales de Google ni información financiera.</Text>

        <Text style={styles.heading}>Verificación de identidad</Text>
        <Text style={styles.paragraph}>La verificación podrá realizarse mediante una sesión reciente, reautenticación, confirmación enviada al correo asociado u otro método seguro y proporcionado.</Text>

        <Text style={styles.heading}>Qué ocurre actualmente</Text>
        <Text style={styles.paragraph}>La solicitud se registra con estado pendiente, el perfil se oculta y se marca como pendiente de eliminación. Ocultar el perfil no equivale a eliminar completamente la cuenta.</Text>

        <Text style={styles.heading}>Datos previstos para eliminación</Text>
        <Text style={styles.paragraph}>El procedimiento final incluirá la cuenta de autenticación, el perfil, nombre, correo, biografía, país, idiomas, nivel, preferencias, conexiones pendientes, fotografías almacenadas y futuros datos de aprendizaje.</Text>

        <Text style={styles.heading}>Conversaciones y mensajes</Text>
        <Text style={styles.paragraph}>El tratamiento definitivo de conversaciones y mensajes está pendiente. LangBridge evaluará su eliminación o anonimización, considerando también los derechos de otros participantes y los reportes activos.</Text>

        <Text style={styles.heading}>Reportes y seguridad</Text>
        <Text style={styles.paragraph}>Cierta información limitada podrá conservarse temporalmente cuando sea necesaria para investigar abuso, prevenir fraude, proteger a otras personas, resolver disputas o cumplir una obligación aplicable.</Text>

        <Text style={styles.heading}>Fotografías y progreso</Text>
        <Text style={styles.paragraph}>Cuando se activen Firebase Storage y el aprendizaje gamificado, la eliminación incluirá las fotografías almacenadas, las URL asociadas, las lecciones, los resultados, los puntos, las vidas y las rachas.</Text>

        <Text style={styles.heading}>Plazo de procesamiento</Text>
        <Text style={styles.paragraph}>El plazo definitivo todavía está pendiente de aprobación y pruebas. LangBridge no publicará un plazo que no pueda cumplir técnica y operativamente.</Text>

        <Text style={styles.heading}>Eliminar la aplicación no elimina la cuenta</Text>
        <Text style={styles.paragraph}>Desinstalar LangBridge o cerrar sesión no elimina la cuenta, el perfil, los mensajes ni los datos almacenados. Para iniciar la eliminación debe utilizarse el procedimiento correspondiente.</Text>

        <Text style={styles.heading}>Confirmación</Text>
        <Text style={styles.paragraph}>Cuando el procedimiento final esté implementado, LangBridge enviará una confirmación segura indicando la finalización y cualquier conservación temporal limitada que corresponda.</Text>

        <Text style={styles.heading}>Contacto</Text>
        <Text style={styles.paragraph}>Para consultas sobre eliminación de cuenta, privacidad o soporte puedes escribir provisionalmente a:</Text>
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
  notice: { color: "#7C2D12", backgroundColor: "#FFF7ED", borderRadius: 12, padding: 16, fontSize: 15, lineHeight: 23, marginBottom: 26 },
  heading: { color: "#111827", fontSize: 21, lineHeight: 28, fontWeight: "800", marginTop: 8, marginBottom: 8 },
  paragraph: { color: "#334155", fontSize: 16, lineHeight: 26, marginBottom: 20 },
  email: { color: "#4338CA", fontSize: 16, fontWeight: "800", marginBottom: 20 },
  footer: { color: "#94A3B8", fontSize: 13, textAlign: "center", paddingVertical: 24 },
});
