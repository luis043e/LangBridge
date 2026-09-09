# Inventario de datos de LangBridge

## Control del documento

- Producto: LangBridge
- Responsable del documento: Luis Enrique Nuñez Minaya
- Tipo de documento: Inventario técnico y legal de datos
- Estado: Borrador interno
- Versión: 0.1
- Fecha de preparación: 9 de septiembre de 2026
- Rama de desarrollo: feat/account-deletion-compliance
- Aplicación Android: com.luis043e.langbridge

## 1. Propósito

Este documento identifica las categorías de datos personales y técnicos que LangBridge procesa actualmente o tiene previsto procesar antes de su publicación.

El inventario sirve como fuente técnica para preparar y mantener:

- La Política de privacidad.
- La Política de retención y eliminación de datos.
- Los Términos y condiciones de uso.
- Las Normas de la comunidad.
- La ficha Seguridad de los datos de Google Play.
- El proceso interno y público de eliminación de cuentas.
- Los procedimientos de moderación, soporte y seguridad.

Este documento es interno y no sustituye la Política de privacidad pública.

## 2. Criterios de clasificación

Cada tratamiento se clasifica en uno de estos estados:

### Activo

El dato es procesado por la versión actual de LangBridge.

### Previsto

El tratamiento corresponde a una función confirmada, pero todavía no está implementado o activado completamente.

### Condicional

El dato solamente se procesa cuando la persona utiliza voluntariamente una función determinada.

### No utilizado actualmente

No se ha identificado recopilación activa de esa categoría en el código o la configuración revisados.

Antes de activar una función prevista, se debe revisar y actualizar este inventario, la Política de privacidad y la declaración de Seguridad de los datos de Google Play.

## 3. Servicios y lugares de almacenamiento

### Firebase Authentication

Finalidad:

- Crear y administrar las cuentas.
- Iniciar y mantener sesiones.
- Autenticar mediante correo electrónico y contraseña.
- Autenticar mediante Google Sign-In.
- Enviar correos para restablecer contraseñas.

Datos relacionados:

- Identificador único de la cuenta.
- Correo electrónico.
- Nombre mostrado.
- Proveedor de autenticación.
- Metadatos de creación y acceso administrados por Firebase Authentication.

### Cloud Firestore

Finalidad:

- Almacenar perfiles.
- Mantener preferencias lingüísticas y de privacidad.
- Gestionar solicitudes de conexión.
- Mantener conversaciones y mensajes.
- Registrar bloqueos.
- Recibir reportes.
- Registrar solicitudes de eliminación de cuenta.

### AsyncStorage

Finalidad:

- Mantener localmente la persistencia de la sesión de Firebase Authentication.
- Guardar la preferencia de idioma de la interfaz mediante la clave `appLanguage`.

AsyncStorage se encuentra en el dispositivo. No debe utilizarse en el futuro para almacenar contraseñas, contenido sensible o secretos de acceso.

### Firebase Storage

Estado: previsto, no activo actualmente para fotografías seleccionadas desde el dispositivo.

Finalidad prevista:

- Almacenar permanentemente fotografías de perfil seleccionadas voluntariamente.
- Proporcionar una URL segura para mostrar la fotografía.
- Sustituir o eliminar fotografías anteriores.
- Eliminar los archivos asociados cuando corresponda procesar la eliminación de una cuenta.

## 4. Datos de cuenta y autenticación

Estado: activo.

Datos procesados:

- UID de Firebase Authentication.
- Nombre completo o nombre mostrado.
- Correo electrónico.
- Contraseña administrada por Firebase Authentication.
- Proveedor de autenticación.
- Fecha o metadatos de creación de la cuenta.
- Información necesaria para mantener la sesión autenticada.

Origen:

- Datos introducidos directamente durante el registro.
- Datos proporcionados por Google cuando se utiliza Google Sign-In.
- Metadatos generados por Firebase Authentication.

Finalidades:

- Crear la cuenta.
- Autenticar a la persona.
- Mantener la sesión.
- Recuperar el acceso.
- Asociar el perfil y la actividad con la cuenta correcta.
- Proteger el acceso a funciones privadas.

Almacenamiento:

- Firebase Authentication.
- Parte del nombre, correo, UID, proveedor y fechas puede almacenarse en el documento correspondiente de la colección `users`.
- Persistencia local de la sesión mediante AsyncStorage.

Visibilidad:

- El correo electrónico no debe mostrarse públicamente como parte normal del perfil.
- El nombre puede mostrarse a otras personas según el funcionamiento social de LangBridge.
- El UID se utiliza internamente.

Eliminación:

- La implementación actual registra una solicitud de eliminación y oculta el perfil.
- La eliminación efectiva de Firebase Authentication y de los datos asociados está pendiente de implementación.
- Este tratamiento no puede considerarse completamente eliminado hasta que exista un procedimiento seguro del lado servidor o administrativo.

## 5. Datos procedentes de Google Sign-In

Estado: condicional y activo.

Datos procesados cuando están disponibles:

- UID de la cuenta autenticada en Firebase.
- Nombre mostrado.
- Correo electrónico.
- URL de la fotografía de Google.
- Proveedor de autenticación identificado como `google`.

Finalidades:

- Permitir el acceso mediante Google.
- Crear o actualizar el perfil básico.
- Mostrar una fotografía de perfil cuando la cuenta de Google la proporciona.
- Evitar pedir nuevamente datos básicos disponibles mediante el proveedor.

El uso futuro de fotografías seleccionadas desde la galería será un tratamiento diferente y deberá documentarse antes de activarse.

## 6. Datos del perfil personal

Estado: activo.

Datos procesados:

- UID.
- Nombre completo.
- Correo electrónico.
- País o código de país.
- Nombre del país.
- Campo histórico `city`, cuando exista en perfiles anteriores.
- Biografía.
- URL de fotografía.
- URL de fotografía procedente de Google.
- Visibilidad del perfil.
- Estado de perfil completado.
- Fecha de creación.
- Fecha de actualización.
- Indicador técnico de conexión o estado `online`, actualmente guardado como falso en la creación o actualización del perfil lingüístico.
- Indicador de solicitud de eliminación.
- Fecha de solicitud de eliminación.

Finalidades:

- Crear el perfil.
- Presentar información relevante para el intercambio lingüístico.
- Permitir que otras personas encuentren perfiles compatibles.
- Mostrar país, biografía, nombre y fotografía.
- Aplicar controles de privacidad.
- Ocultar perfiles que hayan solicitado eliminación.

Visibilidad:

- Algunos datos del perfil pueden mostrarse a otras personas autenticadas.
- La visibilidad depende del control `isProfileVisible`.
- El correo electrónico no debe utilizarse como información pública ordinaria.
- El campo histórico `city` debe conservar compatibilidad técnica mientras existan perfiles que lo contengan.

Eliminación:

- El documento de `users` deberá eliminarse o anonimizarse según la política final.
- La fotografía almacenada en Firebase Storage deberá eliminarse cuando la función futura esté activa.
- Las referencias necesarias para prevenir abuso o cumplir obligaciones justificadas deberán definirse expresamente antes de publicar.

## 7. Datos del perfil lingüístico

Estado: activo.

Datos procesados:

- Idioma de la interfaz.
- Idioma nativo.
- Idioma de aprendizaje.
- Nivel seleccionado.
- Estado de perfil completado.

Finalidades:

- Personalizar la interfaz.
- Mostrar información lingüística.
- Facilitar coincidencias entre personas.
- Preparar experiencias de aprendizaje adecuadas.

Almacenamiento:

- Cloud Firestore, en el documento de la colección `users`.
- La preferencia `appLanguage` también se guarda localmente mediante AsyncStorage.

Eliminación:

- Los datos lingüísticos asociados a la cuenta deberán eliminarse junto con el perfil.
- La preferencia local puede permanecer en el dispositivo hasta que se borren los datos de la aplicación, se desinstale la aplicación o se implemente una limpieza local durante la eliminación.

## 8. Solicitudes de conexión

Estado: activo.

Datos procesados:

- Identificador del remitente.
- Identificador del destinatario.
- Nombre mostrado del remitente.
- Nombre mostrado del destinatario.
- Estado de la solicitud.
- Fecha de creación.
- Fecha de actualización.

Finalidades:

- Enviar, aceptar o rechazar solicitudes.
- Establecer conexiones entre personas.
- Evitar solicitudes duplicadas.
- Habilitar conversaciones únicamente entre participantes autorizados.

Visibilidad:

- Limitada a las personas participantes según las reglas de Firestore.

Eliminación:

- Debe definirse si las solicitudes se eliminan al cerrar una cuenta o si se conservan de forma anonimizada durante un período limitado.
- Como regla inicial, las solicitudes pendientes deben eliminarse cuando la cuenta correspondiente sea eliminada.

## 9. Conversaciones y mensajes

Estado: activo.

Datos de la conversación:

- Identificador de conexión.
- Identificadores de los participantes.
- Fecha de creación.
- Fecha de actualización.

Datos de los mensajes:

- Identificador del remitente.
- Texto del mensaje.
- Fecha de creación.
- Fecha de lectura o valor nulo mientras no se haya leído.

Finalidades:

- Permitir comunicación entre conexiones aceptadas.
- Mantener el historial.
- Mostrar mensajes no leídos.
- Registrar la lectura.
- Proteger el acceso para que solamente participen las cuentas autorizadas.

Visibilidad:

- Limitada a los participantes de la conversación mediante reglas de Firestore.

Eliminación:

- Debe definirse cómo se tratarán los mensajes cuando una cuenta sea eliminada.
- Las opciones que deben evaluarse son eliminación completa, anonimización del remitente o conservación limitada cuando resulte necesaria para investigar reportes o abuso.
- La decisión final deberá ser coherente con la Política de privacidad, las Normas de la comunidad y la funcionalidad de las conversaciones restantes.

## 10. Usuarios bloqueados

Estado: activo.

Datos procesados:

- Lista de UID de usuarios bloqueados almacenada en `blockedUserIds`.

Finalidades:

- Impedir interacciones no deseadas.
- Mostrar la lista personal de usuarios bloqueados.
- Permitir desbloquear usuarios.
- Reforzar la seguridad de la experiencia social.

Visibilidad:

- La lista debe ser privada para la cuenta que realizó el bloqueo.

Eliminación:

- La lista almacenada en el perfil debe eliminarse junto con el documento del usuario.
- Las referencias al UID eliminado presentes en listas de otras personas deberán limpiarse o dejar de tener efecto.

## 11. Reportes de problemas

Estado: activo.

Datos procesados:

- UID de la persona que reporta.
- Correo electrónico de la persona que reporta.
- Categoría.
- Descripción.
- Estado del reporte.
- Fecha de creación.
- Fecha de actualización.

Finalidades:

- Recibir problemas técnicos, de seguridad o de uso.
- Investigar reportes.
- Contactar a la persona cuando sea necesario.
- Mantener un estado de seguimiento.

Visibilidad:

- El cliente no debe leer, actualizar ni eliminar los reportes enviados.
- El acceso administrativo deberá estar estrictamente protegido.

Retención:

- El período exacto todavía debe definirse.
- Los reportes técnicos ordinarios no deben conservarse indefinidamente.
- Los reportes asociados con seguridad, fraude, abuso o disputas pueden requerir retención limitada y documentada.

Eliminación:

- Debe determinarse si un reporte se elimina, se anonimiza o se conserva temporalmente cuando la cuenta solicitante sea eliminada.
- No se debe prometer eliminación inmediata de reportes de seguridad hasta definir el procedimiento de retención legítima.

## 12. Solicitudes de eliminación de cuenta

Estado: activo como solicitud, pendiente como eliminación efectiva.

Datos procesados:

- UID de la persona solicitante.
- Correo electrónico.
- Estado de la solicitud.
- Fecha de creación.
- Fecha de actualización.

Efecto actual:

- Se crea un registro en `accountDeletionRequests`.
- El perfil se configura como no visible.
- Se marca `deletionRequested`.
- Se registra `deletionRequestedAt`.

Limitación actual:

- La cuenta de Firebase Authentication no se elimina automáticamente.
- El documento de usuario no se elimina automáticamente.
- Las conexiones, conversaciones, mensajes, bloqueos y reportes no se eliminan automáticamente.
- No existe todavía un proceso completo de eliminación desde un entorno administrativo o servidor seguro.
- La aplicación todavía necesita un recurso web público para solicitar eliminación.

Objetivo previsto:

- Verificar la identidad.
- Procesar la solicitud con seguridad.
- Eliminar o anonimizar los datos asociados.
- Eliminar Firebase Authentication.
- Eliminar fotografías almacenadas.
- Registrar únicamente la evidencia mínima necesaria de que la solicitud fue procesada.
- Informar claramente cualquier dato retenido, su finalidad y su período de conservación.

## 13. Fotografías de perfil seleccionadas desde el dispositivo

Estado: previsto.

La versión actual no solicita permisos explícitos de galería o cámara y no contiene una implementación completa de carga permanente mediante Firebase Storage.

Tratamiento previsto:

- Solicitar acceso al selector de fotografías cuando sea necesario.
- Permitir que la persona seleccione voluntariamente una imagen.
- Procesar temporalmente la ruta local.
- Subir la imagen a Firebase Storage.
- Guardar la URL correspondiente en Firestore.
- Mostrar la imagen en el perfil, exploración, conversaciones y chat.
- Sustituir o eliminar la imagen anterior.
- Eliminar el archivo cuando se elimine la cuenta.

Requisitos antes de activar:

- Instalar y configurar la biblioteca necesaria.
- Solicitar únicamente el permiso necesario.
- Explicar la finalidad antes del acceso.
- Permitir continuar utilizando la aplicación sin fotografía cuando sea posible.
- Crear reglas seguras de Firebase Storage.
- Limitar tipo, tamaño y formato de archivo.
- Evitar nombres de archivo que expongan información personal innecesaria.
- Actualizar la Política de privacidad.
- Actualizar la ficha Seguridad de los datos de Google Play.
- Incorporar la eliminación del archivo al procedimiento de eliminación de cuenta.

La cámara no debe declararse como utilizada si solamente se implementa el selector de fotografías y no se activa captura directa.

## 14. Datos de aprendizaje y gamificación

Estado: previsto.

Datos que probablemente serán necesarios:

- Lecciones iniciadas o completadas.
- Unidades o niveles alcanzados.
- Respuestas y resultados.
- Puntuaciones.
- Puntos.
- Vidas.
- Rachas.
- Fechas de práctica.
- Progreso acumulado.
- Metas de aprendizaje.
- Última actividad de aprendizaje.

Finalidades previstas:

- Guardar el progreso.
- Reanudar lecciones.
- Calcular resultados.
- Mostrar puntos, vidas y rachas.
- Personalizar la experiencia educativa.

Requisitos antes de activar:

- Confirmar los campos exactos.
- Definir si las respuestas individuales se conservan o solamente los resultados.
- Limitar la recopilación al mínimo necesario.
- Definir retención.
- Incorporar la eliminación de estos datos al cierre de cuenta.
- Actualizar este inventario y la Política de privacidad.

## 15. Moderación y seguridad social

Estado: parcialmente activo y previsto para ampliación.

Funciones activas:

- Bloqueo de usuarios.
- Reporte de problemas.
- Reglas de acceso de Firestore.
- Controles de visibilidad.
- Restricción del chat a participantes autorizados.

Datos previstos para una moderación administrativa completa:

- Identificador de la persona reportada.
- Identificador de la persona que reporta.
- Categoría de la infracción.
- Descripción.
- Referencia al contenido denunciado.
- Estado de revisión.
- Decisión administrativa.
- Medida aplicada.
- Fecha de revisión.
- Fecha de resolución.
- Historial mínimo de acciones de seguridad.

Requisitos:

- Restringir el acceso al personal autorizado.
- Evitar conservar contenido no necesario.
- Documentar los períodos de retención.
- Proteger la confidencialidad de quien reporta.
- Definir un procedimiento de revisión y respuesta.
- Incorporar las reglas correspondientes en las Normas de la comunidad.

## 16. Datos técnicos, diagnósticos y analítica

Estado: no utilizados actualmente según la revisión realizada.

No se identificaron dependencias o configuraciones activas para:

- Firebase Analytics.
- Firebase Crashlytics.
- Publicidad.
- Seguimiento publicitario.
- Ubicación precisa o aproximada.
- Cámara.
- Notificaciones.
- Grabación de audio.
- Contactos.
- Calendario.
- Archivos generales del dispositivo.

Antes de incorporar analítica, informes de fallos u otros SDK se debe:

- Revisar qué datos recopila el proveedor.
- Determinar si los datos se vinculan