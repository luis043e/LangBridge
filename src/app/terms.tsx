import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function TermsScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.brand}>LangBridge</Text>
        <Text style={styles.title}>Términos y condiciones</Text>
        <Text style={styles.subtitle}>Reglas generales para crear una cuenta y utilizar LangBridge.</Text>
        <Text style={styles.date}>Borrador público en preparación</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.notice}>Estos términos todavía están en proceso de revisión. Las condiciones pendientes se completarán antes de la publicación definitiva de LangBridge.</Text>

        <Text style={styles.heading}>Aceptación</Text>
        <Text style={styles.paragraph}>Al crear una cuenta y utilizar LangBridge, la persona deberá aceptar los Términos y condiciones, las Normas de la comunidad y reconocer haber leído la Política de privacidad.</Text>

        <Text style={styles.heading}>Responsable</Text>
        <Text style={styles.paragraph}>LangBridge opera inicialmente bajo la responsabilidad de Luis Enrique Nuñez Minaya, en República Dominicana.</Text>

        <Text style={styles.heading}>Finalidad del servicio</Text>
        <Text style={styles.paragraph}>LangBridge permite aprender y practicar idiomas, configurar un perfil lingüístico, explorar perfiles, crear conexiones y mantener conversaciones con participantes autorizados.</Text>

        <Text style={styles.heading}>Cuenta y seguridad</Text>
        <Text style={styles.paragraph}>Cada persona es responsable de mantener seguras sus credenciales, proporcionar información razonablemente exacta y comunicar cualquier acceso no autorizado. LangBridge nunca solicitará contraseñas completas por correo electrónico.</Text>

        <Text style={styles.heading}>Perfiles y contenido</Text>
        <Text style={styles.paragraph}>Las personas son responsables de los nombres, biografías, fotografías, mensajes y demás contenido que publiquen. No deberán compartir contenido ilegal, engañoso, dañino o que vulnere derechos de terceros.</Text>

        <Text style={styles.heading}>Conductas prohibidas</Text>
        <Text style={styles.paragraph}>No está permitido acosar, amenazar, suplantar, cometer fraude, enviar spam, evadir bloqueos, intentar acceder a cuentas ajenas, distribuir enlaces maliciosos ni utilizar LangBridge para actividades ilegales.</Text>

        <Text style={styles.heading}>Mensajes y conexiones</Text>
        <Text style={styles.paragraph}>Las solicitudes de conexión y los mensajes deben utilizarse de forma respetuosa. Las personas podrán bloquear cuentas y enviar reportes cuando detecten conductas no deseadas o posibles incumplimientos.</Text>

        <Text style={styles.heading}>Moderación</Text>
        <Text style={styles.paragraph}>LangBridge podrá advertir, restringir funciones, ocultar contenido, suspender o cerrar cuentas cuando exista una infracción, un riesgo de seguridad o una obligación aplicable.</Text>

        <Text style={styles.heading}>Edad mínima</Text>
        <Text style={styles.paragraph}>La edad mínima y el público objetivo todavía están pendientes de decisión formal. LangBridge no se presentará como un servicio dirigido específicamente a menores hasta completar los controles necesarios.</Text>

        <Text style={styles.heading}>Eliminación de cuenta</Text>
        <Text style={styles.paragraph}>Las personas podrán solicitar la eliminación de su cuenta desde la aplicación y mediante una futura página web pública. LangBridge está completando el procedimiento efectivo para eliminar o anonimizar los datos asociados.</Text>

        <Text style={styles.heading}>Funciones educativas</Text>
        <Text style={styles.paragraph}>Las futuras lecciones, puntuaciones, vidas, rachas y niveles tendrán fines educativos generales. Estas funciones no garantizan certificación, dominio de un idioma ni resultados académicos específicos.</Text>

        <Text style={styles.heading}>Disponibilidad</Text>
        <Text style={styles.paragraph}>LangBridge puede experimentar mantenimiento, interrupciones, cambios o errores. Las funciones podrán modificarse cuando sea necesario por seguridad, cumplimiento o evolución del producto.</Text>

        <Text style={styles.heading}>Contacto</Text>
        <Text style={styles.paragraph}>Para consultas sobre estos términos, soporte, privacidad o eliminación de cuenta puedes escribir provisionalmente a:</Text>
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
