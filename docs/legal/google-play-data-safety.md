# Matriz de Seguridad de los datos de Google Play para LangBridge

## Control del documento

- Producto: LangBridge
- Responsable del documento: Luis Enrique Nuñez Minaya
- Tipo de documento: Matriz interna para Play Console
- Estado: Borrador interno, no enviado
- Versión: 0.1
- Fecha de preparación: 9 de septiembre de 2026
- Última actualización: 9 de septiembre de 2026
- Aplicación Android: com.luis043e.langbridge
- Versión revisada: 1.0.0
- Rama de revisión: feat/account-deletion-compliance
- Android App Bundle final auditado: No
- Fecha prevista de envío a Play Console: [PENDIENTE]

> Este documento no es la declaración enviada a Google Play. Las respuestas deberán verificarse nuevamente contra el Android App Bundle final, el manifiesto combinado, las dependencias, los SDK, las funciones activas y las políticas públicas vigentes antes de completar Play Console.

## 1. Propósito

Esta matriz organiza la información necesaria para completar la sección Seguridad de los datos de Google Play.

La matriz identifica:

- Datos recopilados.
- Datos compartidos.
- Finalidades.
- Datos obligatorios u opcionales.
- Tratamiento local.
- Cifrado en tránsito.
- Posibilidad de solicitar eliminación.
- Proveedores implicados.
- Funciones futuras que modificarán la declaración.
- Decisiones pendientes.
- Evidencia técnica disponible.

La declaración final deberá coincidir con:

- El comportamiento real de LangBridge.
- El Android App Bundle enviado.
- La Política de privacidad pública.
- La política pública de eliminación.
- Los Términos y condiciones.
- Las Normas de la comunidad.
- Los SDK y servicios de terceros.
- Los permisos del manifiesto Android final.

## 2. Regla principal de exactitud

No se debe afirmar que LangBridge no recopila datos.

LangBridge transmite información fuera del dispositivo mediante Firebase Authentication y Cloud Firestore.

Entre los datos confirmados se encuentran:

- Nombre.
- Correo electrónico.
- UID.
- Información del perfil.
- Preferencias lingüísticas.
- Solicitudes de conexión.
- Mensajes.
- Reportes.
- Solicitudes de eliminación.

Antes de enviar la declaración se deberá comprobar cualquier recopilación adicional realizada automáticamente por:

- Firebase.
- Google Sign-In.
- Expo.
- React Native.
- Plugins.
- Bibliotecas incluidas.
- Servicios de compilación o actualización utilizados en producción.

## 3. Respuestas generales preliminares

### ¿La aplicación recopila o comparte datos requeridos?

Respuesta preliminar:

- Recopila datos: Sí.
- Comparte datos: Pendiente de clasificación final según la definición de Google Play y las excepciones aplicables a proveedores de servicio.

LangBridge transmite datos a servicios de Google Firebase para autenticación, almacenamiento y funcionamiento.

La clasificación final entre recopilación y compartición deberá revisar:

- La función del proveedor.
- Las condiciones contractuales.
- La finalidad del tratamiento.
- Si el proveedor actúa exclusivamente como proveedor de servicio.
- Si existe uso independiente de los datos.
- Las instrucciones vigentes de Google Play.

### ¿Los datos se cifran en tránsito?

Respuesta preliminar:

- Sí, pendiente de verificación final.

Se deberá confirmar que todas las transmisiones de producción utilizan conexiones cifradas y que no existe ningún endpoint inseguro.

### ¿Las personas pueden solicitar eliminación?

Respuesta actual:

- Existe una ruta interna para registrar la solicitud.
- La eliminación efectiva integral todavía no está implementada.
- La página web pública todavía no está disponible.

Respuesta final para Play Console:

- No debe declararse cumplimiento completo hasta que funcionen la ruta interna, la URL pública y el procedimiento efectivo.

### ¿La aplicación permite crear una cuenta?

Respuesta:

- Sí.

Métodos confirmados:

- Correo electrónico y contraseña.
- Google Sign-In.

## 4. Estado de las medidas principales

### Política de privacidad pública

Estado:

- Borrador creado.
- Campos institucionales pendientes.
- URL pública pendiente.
- Revisión jurídica pendiente.

Archivo interno:

- `docs/legal/privacy-policy.md`

### Eliminación dentro de la aplicación

Estado:

- La solicitud puede registrarse.
- El perfil se oculta.
- La eliminación efectiva está pendiente.

Ruta relacionada:

- `src/app/delete-account.tsx`

### Recurso web público de eliminación

Estado:

- Pendiente.

Documento fuente:

- `docs/legal/account-deletion-policy.md`

### Cifrado en tránsito

Estado:

- Preliminarmente confirmado por el uso de servicios oficiales.
- Pendiente de auditoría de cualquier endpoint o servicio adicional.
- Pendiente de validación del paquete final.

### Revisión de seguridad independiente

Estado:

- No realizada.

No se deberá declarar una revisión de seguridad independiente salvo que exista una evaluación válida que cumpla los criterios aplicables.

## 5. Categoría: información personal

### 5.1. Nombre

Estado:

- Recopilado: Sí.
- Compartido: Pendiente de clasificación final.
- Procesamiento temporal: No.
- Obligatorio: Sí para el perfil social actual.
- Opcional: No en el flujo normal de creación y configuración.
- Eliminación disponible: Solicitud disponible, eliminación efectiva pendiente.

Origen:

- Registro manual.
- Google Sign-In.
- Actualización del perfil.

Almacenamiento:

- Firebase Authentication como nombre mostrado.
- Cloud Firestore, colección `users`.
- Solicitudes de conexión como nombres mostrados.

Finalidades preliminares:

- Administración de cuenta.
- Funcionalidad de la aplicación.
- Personalización.
- Comunicación entre personas.
- Prevención de fraude y seguridad.

Visibilidad:

- El nombre mostrado puede ser visible para otras personas autenticadas.

Acciones pendientes:

- Verificar si el nombre es estrictamente obligatorio en todos los métodos.
- Definir tratamiento al eliminar la cuenta.
- Evitar conservar nombres innecesarios en solicitudes antiguas.

### 5.2. Correo electrónico

Estado:

- Recopilado: Sí.
- Compartido: Pendiente de clasificación final.
- Procesamiento temporal: No.
- Obligatorio: Sí para cuentas actuales.
- Eliminación disponible: Solicitud disponible, eliminación efectiva pendiente.

Origen:

- Registro.
- Google Sign-In.
- Firebase Authentication.

Almacenamiento:

- Firebase Authentication.
- Documento `users`.
- Reportes.
- Solicitudes de eliminación.

Finalidades preliminares:

- Administración de cuenta.
- Autenticación.
- Recuperación de contraseña.
- Comunicación relacionada con seguridad o soporte.
- Prevención de fraude.
- Procesamiento de solicitudes de eliminación.

Visibilidad:

- No debe mostrarse públicamente como parte ordinaria del perfil.
- Puede utilizarse internamente en soporte y solicitudes.

Acciones pendientes:

- Reducir duplicación cuando no sea necesaria.
- Definir retención en reportes.
- Eliminar o transformar el correo en el registro final de eliminación.

### 5.3. Identificadores de usuario

Estado:

- Recopilado: Sí.
- Compartido: Pendiente de clasificación final.
- Procesamiento temporal: No.
- Obligatorio: Sí.
- Eliminación disponible: Pendiente de procedimiento efectivo.

Datos:

- UID de Firebase Authentication.
- Identificadores internos de documentos.
- Identificadores de participantes.

Finalidades preliminares:

- Administración de cuenta.
- Funcionalidad.
- Seguridad.
- Prevención de fraude.
- Asociación correcta de perfiles, mensajes y conexiones.

Almacenamiento:

- Firebase Authentication.
- `users`.
- `connectionRequests`.
- `conversations`.
- `messages`.
- `reports`.
- `accountDeletionRequests`.
- Listas de bloqueo.

Acciones pendientes:

- Definir anonimización.
- Limpiar referencias.
- Evitar UID huérfanos.
- Crear proceso seguro del lado servidor.

### 5.4. Dirección

Estado actual:

- No recopilada.

LangBridge almacena país y posiblemente un campo histórico de ciudad, pero no se ha identificado una dirección postal completa.

No deberá declararse dirección física como recopilada salvo que una función futura la solicite.

### 5.5. Número de teléfono

Estado actual:

- No recopilado.

No se ha identificado autenticación por teléfono ni almacenamiento de números telefónicos.

### 5.6. Raza, origen étnico, creencias u otra información sensible

Estado actual:

- No solicitada estructuradamente.

Riesgo:

- Una persona podría incluir voluntariamente información personal en la biografía o en mensajes.

Antes de enviar la declaración final se deberá revisar cómo Google Play clasifica contenido libre introducido por usuarios y si corresponde declarar la categoría según el comportamiento real de LangBridge.

## 6. Categoría: ubicación

### 6.1. Ubicación aproximada

Estado actual:

- No recopilada mediante sensores o permisos de ubicación.

LangBridge permite seleccionar o guardar un país en el perfil.

El país introducido o seleccionado por la persona es información de perfil, no lectura automática de la ubicación del dispositivo.

Decisión pendiente:

- Confirmar la categoría exacta de Google Play para el país del perfil.
- No declarar acceso a ubicación aproximada del dispositivo si la aplicación no solicita ni obtiene esa ubicación.

### 6.2. Ubicación precisa

Estado actual:

- No recopilada.

No se identificaron:

- Permisos de ubicación.
- API de ubicación.
- Coordenadas.
- Seguimiento geográfico.

El manifiesto final deberá confirmarlo.

## 7. Categoría: información financiera

Estado actual:

- No recopilada.

No se identificaron:

- Datos de tarjetas.
- Cuentas bancarias.
- Historial de compras.
- Información de crédito.
- Transferencias.
- Compras integradas.
- Suscripciones.

Si LangBridge incorpora pagos en el futuro, esta sección deberá actualizarse antes de activar la función.

## 8. Categoría: salud y actividad física

Estado actual:

- No recopilada.

No se identificaron funciones de:

- Salud.
- Diagnóstico.
- Actividad física.
- Ejercicio.
- Mediciones corporales.
- Datos médicos.

La biografía y los mensajes pueden contener información introducida voluntariamente. Las personas deberán ser advertidas de no publicar información altamente sensible innecesaria.

## 9. Categoría: mensajes

### 9.1. Otros mensajes dentro de la aplicación

Estado:

- Recopilado: Sí.
- Compartido: Visible para el destinatario o participantes por acción funcional de la persona; clasificación final pendiente.
- Procesamiento temporal: No.
- Obligatorio: No para crear una cuenta.
- Opcional: Sí, la persona decide utilizar el chat.
- Eliminación disponible: Solicitud disponible, tratamiento definitivo pendiente.

Datos:

- Texto del mensaje.
- UID del remitente.
- Fecha de creación.
- Fecha de lectura.
- Identificadores de participantes.

Finalidades preliminares:

- Funcionalidad de la aplicación.
- Comunicación entre personas.
- Seguridad y prevención de fraude.
- Moderación cuando exista un reporte.

Almacenamiento:

- `conversations/{conversationId}/messages`

Acciones pendientes:

- Definir eliminación o anonimización.
- Definir retención por reportes activos.
- Incorporar moderación administrativa.
- Confirmar la clasificación exacta en Play Console.

### 9.2. Correos electrónicos enviados por la persona dentro de la aplicación

Estado actual:

- No aplica como contenido de una función de correo.

La aplicación utiliza el correo para autenticación, recuperación, reportes y eliminación, pero no ofrece una bandeja de correo electrónico.

### 9.3. Mensajes SMS o MMS

Estado actual:

- No recopilados.

No se identificaron permisos o funciones de SMS.

## 10. Categoría: fotos y videos

### 10.1. Fotografías

Estado actual:

- La URL de fotografía de Google puede recopilarse.
- Puede almacenarse una URL en el perfil.
- La selección desde la galería no está implementada completamente.
- Firebase Storage no está activo para carga permanente de imágenes seleccionadas.

Clasificación preliminar actual:

- Recopilación de fotografía o URL de fotografía mediante Google Sign-In: Sí, cuando está disponible.
- Obligatoria: No.
- Opcional: Sí.
- Finalidad: Perfil, personalización y funcionalidad social.

Clasificación futura después de implementar galería:

- Fotografía seleccionada: Recopilada.
- Acceso: Iniciado voluntariamente por la persona.
- Almacenamiento: Firebase Storage.
- Finalidades: Funcionalidad de la aplicación y personalización.
- Eliminación: Debe incluirse en el cierre de cuenta.

Acciones obligatorias antes de activar la galería:

- Instalar y auditar Image Picker.
- Solicitar únicamente el permiso necesario.
- Configurar Firebase Storage.
- Crear reglas de seguridad.
- Establecer límites de tamaño y tipo.
- Eliminar fotografías anteriores.
- Evitar archivos huérfanos.
- Actualizar la Política de privacidad.
- Actualizar Play Console.

### 10.2. Videos

Estado actual:

- No recopilados.

La futura selección de fotografías no deberá permitir videos salvo que se diseñe, documente y declare esa función.

## 11. Categoría: archivos y documentos

Estado actual:

- No recopilados como categoría general.

LangBridge no ofrece actualmente carga de documentos.

Si el selector futuro permite solamente imágenes, deberá limitarse técnicamente para impedir seleccionar otros archivos.

## 12. Categoría: calendario

Estado actual:

- No recopilado.

No se identificaron permisos o acceso al calendario.

## 13. Categoría: contactos

Estado actual:

- No recopilados desde la libreta de contactos.

Las conexiones dentro de LangBridge no equivalen a leer los contactos del dispositivo.

No se deberá solicitar el permiso de contactos para las funciones actuales.

## 14. Categoría: actividad en la aplicación

### 14.1. Interacciones con la aplicación

Estado preliminar:

- Sí, en la medida en que LangBridge registra acciones necesarias para su funcionalidad.

Ejemplos:

- Creación y actualización del perfil.
- Solicitudes de conexión.
- Cambios de estado de solicitudes.
- Envío y lectura de mensajes.
- Bloqueos.
- Reportes.
- Solicitudes de eliminación.
- Preferencias de privacidad.

Finalidades:

- Funcionalidad.
- Administración de cuenta.
- Seguridad.
- Prevención de fraude.
- Comunicación.

No se identificó una plataforma externa de analítica dedicada.

Acciones pendientes:

- Revisar la clasificación exacta de Google Play.
- Diferenciar datos funcionales de analítica.
- Auditar cualquier telemetría automática de SDK.

### 14.2. Historial de búsqueda dentro de la aplicación

Estado preliminar:

- No almacenado de forma persistente según la revisión actual.

LangBridge permite búsquedas o filtros para explorar perfiles, pero no se ha confirmado almacenamiento de términos de búsqueda en Firebase.

Se deberá verificar nuevamente antes de enviar el formulario.

### 14.3. Aplicaciones instaladas

Estado actual:

- No recopiladas.

### 14.4. Otro contenido generado por usuarios

Estado:

- Recopilado: Sí.

Puede incluir:

- Biografía.
- Datos de perfil.
- Descripción de reportes.
- Mensajes.
- Futuras fotografías.
- Futuro contenido comunitario o educativo.

Finalidades:

- Funcionalidad.
- Comunicación.
- Personalización.
- Seguridad y moderación.
- Soporte.

Acciones pendientes:

- Confirmar cómo Play Console distribuye cada contenido entre categorías específicas.
- Evitar declarar dos veces el mismo tratamiento de manera contradictoria.

## 15. Categoría: navegación web

Estado actual:

- No recopilada como historial de navegación.

LangBridge puede abrir flujos web relacionados con autenticación, pero no se ha identificado almacenamiento de historial web de la persona.

Se deberá auditar `expo-web-browser` y el flujo final de Google Sign-In.

## 16. Categoría: información y rendimiento de la aplicación

### 16.1. Registros de fallos

Estado actual:

- No se identificó Firebase Crashlytics ni otro servicio externo de fallos.

No deberá declararse recopilación externa de registros de fallos sin verificar primero:

- Dependencias.
- Configuración nativa.
- Servicios de Expo usados en producción.
- Comportamiento del Android App Bundle.

### 16.2. Diagnóstico

Estado actual:

- No se identificó un servicio externo dedicado de diagnóstico.

Los mensajes de `console.error` encontrados durante desarrollo no prueban por sí mismos que exista una recopilación remota en producción.

### 16.3. Otros datos de rendimiento

Estado actual:

- No confirmado.

Pendiente:

- Auditar Expo.
- Auditar el paquete final.
- Verificar servicios de actualización.
- Revisar llamadas de red.

## 17. Categoría: identificadores de dispositivo u otros identificadores

Estado preliminar:

- UID de cuenta confirmado.
- Identificadores del dispositivo no confirmados.

Se deberá revisar si Firebase Authentication, Google Sign-In, Expo u otros componentes recopilan:

- Identificadores de instalación.
- Tokens de aplicación.
- Identificadores del dispositivo.
- Identificadores de instancia.
- Datos técnicos equivalentes.

No se deberá responder esta categoría definitivamente hasta revisar la documentación de cada SDK y el comportamiento final.

## 18. Datos tratados localmente

### Preferencia de idioma

Dato:

- `appLanguage`

Almacenamiento:

- AsyncStorage.

Transmisión:

- La preferencia también puede guardarse como `interfaceLanguage` en Firestore cuando existe una cuenta.

Clasificación:

- La copia exclusivamente local no constituye por sí misma transmisión fuera del dispositivo.
- La copia guardada en Firestore sí deberá considerarse recopilada.

Finalidad:

- Personalización y funcionalidad.

### Persistencia de sesión

Firebase Authentication utiliza AsyncStorage para mantener la sesión.

Pendiente:

- Confirmar qué tokens o metadatos se almacenan localmente.
- Confirmar su clasificación aplicable.
- Limpiar la sesión al eliminar la cuenta.

## 19. Obligatorio frente a opcional

### Datos necesarios para crear y administrar la cuenta

Preliminarmente obligatorios:

- Correo electrónico.
- Credencial de autenticación.
- UID.
- Nombre mostrado o nombre completo según el flujo actual.
- Información mínima de perfil lingüístico para completar el proceso actual.

### Datos opcionales o condicionales

Preliminarmente opcionales:

- Google Sign-In como método alternativo.
- Fotografía.
- Biografía.
- País, pendiente de confirmar según validaciones actuales.
- Mensajes.
- Solicitudes de conexión.
- Bloqueos.
- Reportes.
- Solicitud de eliminación como acción iniciada por la persona.

Antes de marcar un dato como opcional en Play Console deberá comprobarse que la persona puede utilizar razonablemente la aplicación sin proporcionarlo.

## 20. Finalidades preliminares por tipo de dato

### Funcionalidad de la aplicación

Incluye:

- Cuenta.
- Perfil.
- Idiomas.
- Conexiones.
- Conversaciones.
- Mensajes.
- Privacidad.
- Bloqueos.
- Reportes.
- Eliminación.

### Administración de cuenta

Incluye:

- UID.
- Nombre.
- Correo.
- Proveedor de autenticación.
- Fechas de cuenta.
- Estado de eliminación.

### Comunicación del desarrollador

Podrá incluir:

- Recuperación de contraseña.
- Respuesta a soporte.
- Confirmación de eliminación.
- Avisos esenciales de seguridad.

No se ha identificado mercadeo por correo.

### Personalización

Incluye:

- Idioma de interfaz.
- Idioma nativo.
- Idioma de aprendizaje.
- Nivel.
- Preferencias del perfil.
- Futura experiencia educativa.

### Seguridad, prevención de fraude y cumplimiento

Incluye:

- UID.
- Bloqueos.
- Reportes.
- Estados de solicitudes.
- Evidencia limitada de seguridad.
- Registros mínimos de eliminación.

### Analítica

Estado:

- No declararla como finalidad activa hasta confirmar una integración real.

### Publicidad o mercadeo

Estado actual:

- No utilizado.

## 21. Proveedores y SDK preliminares

### Google Firebase

Funciones utilizadas o previstas:

- Firebase Authentication.
- Cloud Firestore.
- Futuro Firebase Storage.

Datos relacionados:

- Cuenta.
- Perfil.
- Conexiones.
- Mensajes.
- Reportes.
- Solicitudes de eliminación.
- Futuras fotografías.
- Futuros datos de aprendizaje.

Acción pendiente:

- Revisar la guía oficial de Seguridad de los datos de cada producto.
- Confirmar papel del proveedor.
- Confirmar retención y eliminación.
- Confirmar transferencias.

### Google Sign-In

Función:

- Autenticación opcional.

Datos relacionados:

- Nombre.
- Correo.
- Fotografía.
- Credenciales o tokens necesarios para autenticación.

Acción pendiente:

- Revisar la documentación vigente.
- Confirmar campos y identificadores adicionales.
- Verificar el flujo de producción.

### Expo

Funciones confirmadas:

- Framework.
- Router.
- Splash screen.
- Font.
- Image.
- Status bar.
- Web browser.
- Servicios de compilación asociados con el proyecto.

Acción pendiente:

- Determinar qué servicios de Expo se utilizarán en producción.
- Revisar datos técnicos procesados.
- Auditar actualizaciones remotas si se activan.

### React Native

Función:

- Framework de aplicación.

Acción pendiente:

- Revisar bibliotecas nativas integradas en el paquete final.

## 22. Servicios no identificados actualmente

No se identificaron integraciones activas para:

- Firebase Analytics.
- Firebase Crashlytics.
- AdMob.
- Publicidad.
- Seguimiento publicitario.
- Ubicación.
- Cámara.
- Micrófono.
- Contactos.
- Calendario.
- SMS.
- Notificaciones.
- SecureStore.
- Carga general de archivos.

Esta conclusión deberá verificarse contra:

- `package.json`.
- `app.json`.
- Archivos nativos generados.
- Manifiesto combinado.
- Android App Bundle.
- Tráfico de red.
- Dependencias transitivas.

## 23. Funciones futuras que obligarán a actualizar Play Console

### Fotografías desde galería

Cambios posibles:

- Nueva recopilación de fotos.
- Nuevo permiso o selector.
- Firebase Storage.
- Nueva política de eliminación.

### Aprendizaje gamificado

Cambios posibles:

- Actividad en la aplicación.
- Progreso.
- Resultados.
- Puntos.
- Vidas.
- Rachas.
- Fechas de práctica.

### Moderación administrativa

Cambios posibles:

- Información vinculada con reportes.
- Contenido denunciado.
- Estado de revisión.
- Medidas aplicadas.
- Retención temporal.

### Analítica o diagnósticos

Cambios posibles:

- Identificadores.
- Interacciones.
- Registros de fallos.
- Diagnóstico.
- Rendimiento.

### Notificaciones

Cambios posibles:

- Tokens de notificación.
- Identificadores de instalación.
- Preferencias.
- Contenido de notificaciones.

Ninguna de estas funciones deberá activarse sin revisar la declaración.

## 24. Eliminación de datos

Estado vigente:

- La persona puede registrar una solicitud.
- El perfil se oculta.
- La eliminación integral está pendiente.
- La URL pública está pendiente.

Antes de responder afirmativamente que la aplicación permite eliminar datos se deberá validar:

- Ruta interna funcional.
- Página web pública funcional.
- Verificación de identidad.
- Eliminación de Authentication.
- Eliminación o anonimización de Firestore.
- Eliminación de Storage.
- Tratamiento de mensajes.
- Tratamiento de reportes.
- Limpieza de referencias.
- Confirmación a la persona.
- Pruebas de fallos parciales.

Documento relacionado:

- `docs/legal/account-deletion-policy.md`

## 25. Seguridad

Medidas confirmadas:

- Firebase Authentication.
- Reglas reforzadas de Firestore.
- Restricción de conversaciones a participantes.
- Restricción de mensajes a participantes.
- Validación de campos.
- Bloqueo global de rutas no autorizadas.
- Pruebas automáticas de reglas.
- Controles de visibilidad.
- Bloqueo de usuarios.
- Reportes protegidos contra lectura ordinaria desde el cliente.

Medidas pendientes:

- Eliminación del lado servidor.
- Reglas de Firebase Storage.
- Herramientas administrativas.
- Gestión segura de secretos.
- Respuesta a incidentes.
- Auditoría de permisos.
- Auditoría del Android App Bundle.
- Pruebas de volumen y rendimiento.
- Revisión jurídica.

## 26. Cifrado

Respuesta preliminar:

- Datos cifrados en tránsito: Sí, pendiente de validación final.

Antes de marcar la respuesta se deberá verificar:

- Todas las conexiones de producción.
- Servicios de terceros.
- Formularios web.
- Página de eliminación.
- Endpoints administrativos.
- Servicios futuros.

Cifrado en reposo:

- Pendiente de documentar por proveedor y servicio.
- No debe confundirse con la pregunta específica de cifrado en tránsito de Play Console.

## 27. Contenido generado por usuarios

LangBridge procesa contenido generado por usuarios, incluyendo:

- Perfil.
- Biografía.
- Mensajes.
- Reportes.
- Fotografías actuales o futuras.

Medidas actuales:

- Bloqueo.
- Reporte.
- Reglas de acceso.
- Visibilidad.

Medidas pendientes:

- Aceptación verificable de Términos.
- Moderación administrativa.
- Reporte específico de personas o contenido cuando corresponda.
- Escala de medidas.
- Revisión.
- Retención controlada.
- Protección del reportante.

Documentos relacionados:

- `docs/legal/terms-of-service.md`
- `docs/legal/community-guidelines.md`

## 28. Menores y público objetivo

Estado:

- Edad mínima pendiente.
- Público objetivo pendiente.
- Clasificación pendiente.

No se deberá completar definitivamente la sección relacionada con menores hasta decidir:

- Edad mínima.
- Disponibilidad para menores.
- Controles de chat.
- Moderación.
- Tratamiento del perfil.
- Clasificación de contenido.
- Configuración de Play Console.

## 29. Auditoría del Android App Bundle

Antes de enviar esta matriz a Play Console se deberá:

- Generar el AAB de producción.
- Inspeccionar el manifiesto combinado.
- Enumerar permisos.
- Enumerar SDK.
- Revisar dependencias transitivas.
- Revisar dominios y conexiones.
- Probar los flujos de cuenta.
- Probar Google Sign-In.
- Probar mensajes.
- Probar reportes.
- Probar eliminación.
- Comparar resultados con esta matriz.

AAB auditado: [PENDIENTE].

Versión auditada: [PENDIENTE].

Fecha de auditoría: [PENDIENTE].

Responsable de auditoría: [PENDIENTE].

## 30. Respuestas que no deben enviarse todavía

No se debe afirmar todavía que:

- La eliminación integral está completamente implementada.
- Existe una URL pública funcional.
- Todos los datos se eliminan dentro de un plazo específico.
- Firebase Storage elimina fotografías.
- Los mensajes tienen un tratamiento definitivo.
- Los reportes tienen un plazo definitivo.
- La aplicación no recopila datos.
- No existen identificadores técnicos de SDK.
- Se realizó una revisión independiente de seguridad.
- La aplicación está dirigida o no dirigida a menores.
- El manifiesto final no contiene permisos adicionales.

## 31. Lista de decisiones pendientes

- Nombre legal o comercial.
- Correos oficiales.
- Sitio web.
- URL pública de privacidad.
- URL pública de eliminación.
- Edad mínima.
- Público objetivo.
- Tratamiento de mensajes.
- Tratamiento de reportes.
- Plazos de conservación.
- Plazo de eliminación.
- Clasificación del país del perfil.
- Clasificación de proveedores.
- Clasificación de Google Sign-In.
- Identificadores técnicos de SDK.
- Servicios de Expo utilizados en producción.
- Auditoría del AAB.
- Cifrado en tránsito final.
- Implementación de eliminación efectiva.
- Revisión jurídica.

## 32. Lista de verificación previa al envío

- Política de privacidad publicada y accesible.
- Página pública de eliminación publicada.
- Ruta interna de eliminación funcional.
- Eliminación efectiva validada.
- Términos publicados.
- Normas de la comunidad publicadas.
- Aceptación de Términos implementada.
- Edad mínima definida.
- Público objetivo definido.
- Moderación administrativa funcional.
- Fotografías correctamente declaradas.
- Datos de aprendizaje correctamente declarados.
- SDK auditados.
- Permisos auditados.
- AAB auditado.
- Cifrado confirmado.
- Datos opcionales y obligatorios confirmados.
- Finalidades confirmadas.
- Compartición confirmada.
- Retención confirmada.
- Formulario comparado con las políticas públicas.
- Revisión jurídica completada.

## 33. Condiciones para considerar completada la ficha

La ficha Seguridad de los datos solo podrá considerarse al 100 % cuando:

- El comportamiento real de la aplicación esté auditado.
- El AAB final esté auditado.
- Los SDK estén auditados.
- Cada categoría de datos tenga una respuesta.
- Las finalidades correspondan con el código.
- Los datos opcionales y obligatorios estén confirmados.
- La compartición esté clasificada correctamente.
- El cifrado esté validado.
- La eliminación efectiva funcione.
- Las URL públicas funcionen.
- Las políticas sean coherentes.
- Play Console acepte la declaración.
- No existan discrepancias detectadas durante la revisión.