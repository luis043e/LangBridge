import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function CommunityGuidelinesScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.brand}>LangBridge</Text>
        <Text style={styles.title}>Normas de la comunidad</Text>
        <Text style={styles.subtitle}>Reglas para mantener un espacio respetuoso, seguro y útil para practicar idiomas.</Text>
        <Text style={styles.date}>Borrador público en preparación</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.notice}>Estas normas todavía están en proceso de revisión. LangBridge completará el procedimiento administrativo de moderación antes de su publicación definitiva.</Text>

        <Text style={styles.heading}>Respeto entre personas</Text>
        <Text style={styles.paragraph}>Las interacciones deben ser respetuosas. No se permite acosar, intimidar, amenazar, perseguir, humillar, presionar para obtener respuestas ni continuar una interacción después de un bloqueo.</Text>

        <Text style={styles.heading}>Finalidad de la comunidad</Text>
        <Text style={styles.paragraph}>LangBridge está orientado al aprendizaje y al intercambio de idiomas. Las solicitudes de conexión, perfiles y conversaciones deben utilizarse de forma legítima y coherente con esa finalidad.</Text>

        <Text style={styles.heading}>Información personal</Text>
        <Text style={styles.paragraph}>No compartas contraseñas, códigos de acceso, documentos de identidad, información financiera, direcciones privadas ni datos personales de otras personas sin autorización.</Text>

        <Text style={styles.heading}>Perfiles auténticos</Text>
        <Text style={styles.paragraph}>No está permitido suplantar a otra persona, utilizar información engañosa, fingir representar a LangBridge ni crear cuentas para confundir, defraudar o evadir medidas de seguridad.</Text>

        <Text style={styles.heading}>Contenido prohibido</Text>
        <Text style={styles.paragraph}>No se permite contenido ilegal, amenazante, discriminatorio, fraudulento, malicioso o destinado a causar daño. Tampoco se permite publicar información privada ajena ni contenido que vulnere derechos de terceros.</Text>

        <Text style={styles.heading}>Spam y fraude</Text>
        <Text style={styles.paragraph}>No se permite enviar mensajes o solicitudes repetitivas, distribuir enlaces maliciosos, solicitar dinero mediante engaño, obtener credenciales, crear cuentas automatizadas ni utilizar LangBridge para publicidad no autorizada.</Text>

        <Text style={styles.heading}>Solicitudes y mensajes</Text>
        <Text style={styles.paragraph}>Respeta los rechazos y bloqueos. No envíes solicitudes repetidas, no utilices otras cuentas para continuar un contacto no deseado y no presiones a una persona para que comparta información.</Text>

        <Text style={styles.heading}>Fotografías de perfil</Text>
        <Text style={styles.paragraph}>Las fotografías deberán utilizarse con autorización, respetar la privacidad y cumplir estas normas. La futura carga desde la galería incluirá validación, almacenamiento seguro, reporte y eliminación.</Text>

        <Text style={styles.heading}>Bloqueos</Text>
        <Text style={styles.paragraph}>Las personas pueden bloquear cuentas para limitar interacciones. No está permitido crear otra cuenta, utilizar una cuenta ajena ni pedir a terceros que ayuden a evadir un bloqueo.</Text>

        <Text style={styles.heading}>Reportes</Text>
        <Text style={styles.paragraph}>Los reportes deben realizarse de buena fe e incluir solamente la información necesaria. No se permite utilizar el sistema para presentar acusaciones deliberadamente falsas, acosar o tomar represalias.</Text>

        <Text style={styles.heading}>Moderación</Text>
        <Text style={styles.paragraph}>LangBridge podrá advertir, eliminar o limitar contenido, restringir funciones, ocultar perfiles, suspender cuentas o cerrarlas cuando exista una infracción, reincidencia o riesgo para otras personas.</Text>

        <Text style={styles.heading}>Evasión de medidas</Text>
        <Text style={styles.paragraph}>No se permite crear nuevas cuentas, utilizar cuentas ajenas, cambiar datos identificativos ni emplear automatización para evadir un bloqueo, restricción, suspensión o cierre.</Text>

        <Text style={styles.heading}>Seguridad de la cuenta</Text>
        <Text style={styles.paragraph}>Protege tus credenciales, evita enlaces sospechosos y reporta accesos no autorizados. LangBridge nunca solicitará contraseñas completas mediante correo electrónico o mensajes de soporte.</Text>

        <Text style={styles.heading}>Revisión de medidas</Text>
        <Text style={styles.paragraph}>LangBridge establecerá un canal para solicitar la revisión de determinadas medidas de moderación. La presentación de una solicitud no garantiza que la decisión sea modificada.</Text>

        <Text style={styles.heading}>Contacto</Text>
        <Text style={styles.paragraph}>Para consultas, soporte o reportes relacionados con estas normas puedes escribir provisionalmente a:</Text>
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
