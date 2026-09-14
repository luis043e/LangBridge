# Eliminación de cuenta y datos de LangBridge

## Estado del documento

- Estado: Borrador pendiente de implementación y publicación
- Versión: 0.1
- Fecha de preparación: 9 de septiembre de 2026
- Fecha de entrada en vigor: [PENDIENTE]
- Última actualización: 9 de septiembre de 2026
- URL pública definitiva: [PENDIENTE]

> Este documento todavía no debe publicarse como procedimiento definitivo. LangBridge debe completar y probar la eliminación efectiva de Firebase Authentication, Cloud Firestore, futuras fotografías de Firebase Storage y demás datos asociados antes de publicar esta página.

## 1. Introducción

LangBridge permite que las personas soliciten la eliminación de su cuenta y de los datos personales asociados.

Esta página explica:

- Cómo presentar una solicitud.
- Cómo se verificará la identidad.
- Qué datos se eliminarán.
- Qué datos podrán anonimizarse.
- Qué información podría conservarse temporalmente.
- Qué ocurrirá con mensajes, reportes, fotografías y progreso.
- Cómo se comunicará la finalización del proceso.

La versión definitiva de esta página deberá estar disponible públicamente sin necesidad de iniciar sesión en LangBridge.

## 2. Responsable de LangBridge

- Producto: LangBridge
- Responsable: Luis Enrique Nuñez Minaya
- Nombre legal o comercial: [PENDIENTE]
- País de operación principal: República Dominicana
- Correo oficial de privacidad: [PENDIENTE]
- Correo oficial de soporte: [PENDIENTE]
- Sitio web oficial: [PENDIENTE]
- URL del formulario público de eliminación: [PENDIENTE]

Los datos de contacto deberán completarse antes de publicar esta página.

## 3. Quién puede solicitar la eliminación

Puede solicitar la eliminación la persona que controla la cuenta correspondiente.

LangBridge podrá solicitar una verificación razonable antes de ejecutar la eliminación, especialmente cuando la solicitud se presente fuera de la aplicación.

No se procesarán solicitudes realizadas en nombre de otra persona sin autorización suficiente o fundamento legal válido.

## 4. Cómo solicitar la eliminación desde la aplicación

La ruta interna disponible actualmente permite presentar una solicitud desde una sesión autenticada.

Ruta general prevista:

- Abrir LangBridge.
- Iniciar sesión en la cuenta.
- Acceder a Configuración.
- Entrar en Privacidad y seguridad.
- Seleccionar Eliminar cuenta.
- Revisar la información presentada.
- Confirmar la solicitud.

La ubicación y los nombres exactos deberán revisarse contra la versión final de la aplicación antes de publicar esta página.

## 5. Cómo solicitar la eliminación mediante la página web

LangBridge deberá proporcionar una página web pública para iniciar la solicitud sin necesidad de instalar o abrir la aplicación.

URL pública: [PENDIENTE].

El formulario público deberá solicitar únicamente la información mínima necesaria, que podrá incluir:

- Correo electrónico asociado con la cuenta.
- Confirmación de que se solicita eliminar la cuenta.
- Información necesaria para verificar el control de la cuenta.
- Medio seguro para responder a la solicitud.

El formulario no deberá solicitar:

- Contraseña.
- Código de acceso permanente.
- Credenciales de Google.
- Información financiera.
- Documentos de identidad, salvo que exista una necesidad excepcional, proporcionada y jurídicamente revisada.

LangBridge nunca solicitará una contraseña completa por correo electrónico o mediante el formulario público.

## 6. Situación técnica actual

La función actual de LangBridge permite:

- Crear una solicitud en `accountDeletionRequests`.
- Registrar el UID de la cuenta.
- Registrar el correo asociado.
- Establecer el estado inicial como `pending`.
- Registrar las fechas de creación y actualización.
- Ocultar el perfil.
- Marcar el perfil como pendiente de eliminación.
- Registrar la fecha de solicitud.

La implementación actual todavía no elimina automáticamente:

- La cuenta de Firebase Authentication.
- El documento principal de `users`.
- Las solicitudes de conexión.
- Las conversaciones.
- Los mensajes.
- Las referencias almacenadas en listas de bloqueo.
- Los reportes.
- Las futuras fotografías de Firebase Storage.
- Los futuros datos de aprendizaje y gamificación.

Por esta razón, el procedimiento todavía se considera en desarrollo y esta página no debe publicarse como procedimiento definitivo.

## 7. Verificación de identidad

Antes de eliminar una cuenta, LangBridge deberá verificar razonablemente que la solicitud procede de la persona que controla la cuenta.

La verificación podrá realizarse mediante:

- Sesión autenticada reciente.
- Reautenticación con correo y contraseña.
- Reautenticación mediante Google Sign-In.
- Mensaje enviado al correo asociado.
- Procedimiento administrativo limitado cuando no sea posible acceder a la aplicación.

La información utilizada para verificar la identidad se limitará a lo necesario.

Si la identidad no puede verificarse, LangBridge podrá solicitar información adicional razonable o rechazar temporalmente la solicitud.

## 8. Qué ocurre después de enviar la solicitud

Después de recibir una solicitud, LangBridge podrá:

- Registrar la solicitud como pendiente.
- Ocultar temporalmente el perfil.
- Evitar nuevas interacciones.
- Verificar la identidad.
- Revisar los datos asociados.
- Clasificar cualquier reporte o investigación pendiente.
- Iniciar la eliminación o anonimización.
- Confirmar la finalización mediante un canal seguro.

Ocultar el perfil no equivale a eliminar completamente la cuenta.

## 9. Estados de la solicitud

La solicitud podrá tener estados internos como:

- `pending`: solicitud recibida.
- `verified`: identidad verificada.
- `processing`: eliminación en proceso.
- `completed`: proceso principal completado.
- `rejected`: solicitud no procesada por una razón documentada.
- `cancelled`: solicitud cancelada antes de una operación irreversible.
- `partially_retained`: eliminación completada con conservación temporal limitada.

La aplicación móvil no deberá poder marcar directamente una solicitud como completada.

## 10. Datos que se eliminarán

### Tratamiento aprobado

Cuando el procedimiento efectivo esté implementado, LangBridge eliminará permanentemente los datos asociados con la cuenta conforme a DEL-A y DEL-R1.

La eliminación incluirá:

- La cuenta de Firebase Authentication.
- El documento de perfil `users/{uid}`.
- El UID, nombre, correo electrónico, país, biografía e información lingüística del perfil.
- El nivel lingüístico y las preferencias de visibilidad.
- La lista personal `blockedUserIds`.
- El UID de la cuenta eliminada almacenado en listas `blockedUserIds` de otras cuentas.
- Todas las solicitudes de conexión donde la cuenta aparezca como `senderId` o `recipientId`.
- Las solicitudes de conexión con estado `pending`, `accepted` o `rejected`.
- Todas las conversaciones donde el UID aparezca en `participants`.
- Todos los mensajes almacenados en las subcolecciones `messages` de esas conversaciones.
- Los mensajes enviados por la cuenta eliminada.
- Los mensajes enviados por las demás personas dentro del historial compartido que será eliminado.
- Todos los reportes cuyo campo `reporterId` corresponda al UID de la cuenta eliminada.
- El UID, correo, categoría, descripción, estado y fechas contenidos en esos reportes.
- La solicitud identificable original almacenada en `accountDeletionRequests`.
- La fotografía de perfil y su URL cuando el almacenamiento permanente mediante Firebase Storage esté implementado.
- Los futuros datos exclusivos de aprendizaje y gamificación cuando existan.
- El progreso, los resultados, los puntos, las vidas, las rachas y las configuraciones asociadas exclusivamente con la cuenta cuando esas funciones estén implementadas.
- Los datos locales relacionados con la sesión, cuando sea técnicamente aplicable.

### Recibo técnico temporal

Conforme a DEL-S2, la solicitud identificable original será sustituida, después de completar satisfactoriamente la eliminación, por un recibo técnico mínimo y no identificable.

Este recibo:

- No contendrá UID, correo, nombre, idiomas, mensajes, reportes ni identificadores relacionados.
- Se conservará durante 30 días desde la fecha de finalización.
- Se eliminará al vencer su fecha de expiración.
- No permitirá reconstruir la cuenta ni recuperar los datos eliminados.

### Verificación del alcance

Antes de procesar una eliminación, el procedimiento deberá verificar todas las colecciones, subcolecciones, servicios y ubicaciones de almacenamiento existentes.

Si LangBridge incorpora nuevas funciones o categorías de datos, estas deberán añadirse al inventario y al procedimiento de eliminación antes de activarse.

### Estado de implementación

- Tratamiento aprobado mediante DEL-A, DEL-R1 y DEL-S2.
- Implementación técnica pendiente.
- Verificación automatizada de colecciones y datos futuros pendiente.
- Pruebas integrales con Firebase Emulator Suite y datos simulados pendientes.

## 11. Cuenta de Firebase Authentication

LangBridge deberá eliminar la cuenta de Firebase Authentication al finalizar el procedimiento técnico.

Antes de eliminar Authentication deberán procesarse correctamente los datos que todavía necesiten el UID para ser localizados.

Después de eliminar Authentication:

- La cuenta no podrá volver a iniciar sesión.
- Las credenciales dejarán de proporcionar acceso a LangBridge.
- La persona podría tener que crear una cuenta nueva para utilizar nuevamente el servicio.
- No se garantiza la recuperación de datos eliminados.

La eliminación deberá ejecutarse desde un entorno seguro y no depender exclusivamente del cliente móvil.

## 12. Perfil personal y lingüístico

### Tratamiento aprobado mediante DEL-A

Al eliminar una cuenta, se eliminará permanentemente el documento `users/{uid}` correspondiente a la persona.

La eliminación incluirá los datos personales, lingüísticos y técnicos almacenados en ese documento, entre ellos:

- UID.
- Nombre.
- Correo electrónico.
- País.
- Ciudad histórica, cuando exista.
- Biografía.
- Fotografía o URL de fotografía almacenada.
- Idioma de interfaz.
- Idioma nativo.
- Idioma de aprendizaje.
- Nivel lingüístico.
- Preferencias de visibilidad.
- Lista personal `blockedUserIds`.
- Estado `deletionRequested`.
- Fecha `deletionRequestedAt`.
- Fechas y demás estados técnicos exclusivos del perfil.

### Condiciones del tratamiento

- No se conservará una versión anonimizada ordinaria del documento `users/{uid}`.
- No se conservarán el UID, el correo, el nombre, la biografía, los idiomas ni otros datos del perfil dentro del recibo técnico aprobado mediante DEL-S2.
- Los datos relacionados que se encuentren en otras colecciones deberán procesarse antes de eliminar `users/{uid}` cuando el UID sea necesario para localizarlos.
- La fotografía almacenada por LangBridge deberá eliminarse de Firebase Storage cuando esa función esté implementada.
- La eliminación del perfil será irreversible.
- Si la persona vuelve a LangBridge mediante una cuenta nueva, deberá crear un perfil nuevo y comenzará desde cero.

### Orden técnico obligatorio

El procedimiento deberá:

1. Obtener el UID exclusivamente desde Firebase Authentication.
2. Utilizar el UID para localizar y procesar los datos relacionados en otras colecciones.
3. Eliminar o desvincular la fotografía almacenada por LangBridge cuando exista.
4. Eliminar el documento `users/{uid}`.
5. Eliminar posteriormente la cuenta de Firebase Authentication.
6. Evitar conservar referencias huérfanas asociadas con el perfil eliminado.

### Estado de implementación

- Decisión aprobada mediante DEL-A.
- Implementación técnica pendiente.
- Eliminación en Firebase Storage pendiente hasta que la carga permanente de fotografías sea incorporada.
- Pruebas con Firebase Emulator Suite y datos simulados pendientes.
- Pruebas para comprobar que los perfiles de otras cuentas permanecen intactos pendientes.

## 13. Solicitudes de conexión

### Tratamiento aprobado mediante DEL-A

Al eliminar una cuenta:

- Se eliminarán todas las solicitudes de conexión donde la cuenta aparezca como `senderId` o `recipientId`.
- Se eliminarán las solicitudes con estado `pending`.
- Se eliminarán las solicitudes con estado `accepted`.
- Se eliminarán las solicitudes con estado `rejected`.
- La eliminación incluirá los UID, nombres, estados y fechas almacenados dentro de esos documentos.
- No se conservarán solicitudes de conexión anteriores asociadas con la cuenta eliminada.
- Si la persona vuelve a LangBridge mediante una cuenta nueva, no recuperará solicitudes ni conexiones anteriores y comenzará desde cero.

### Orden técnico obligatorio

El procedimiento deberá:

1. Localizar los documentos de `connectionRequests` donde el UID aparezca como `senderId`.
2. Localizar los documentos de `connectionRequests` donde el UID aparezca como `recipientId`.
3. Evitar procesar dos veces el mismo documento si aparece en más de un resultado.
4. Eliminar las conversaciones y sus mensajes antes de eliminar las solicitudes aceptadas que les dieron origen.
5. Eliminar completamente todas las solicitudes localizadas.
6. Permitir reintentos seguros sin eliminar solicitudes pertenecientes exclusivamente a otras cuentas.

### Estado de implementación

- Decisión aprobada mediante DEL-A.
- Implementación técnica pendiente.
- Pruebas con Firebase Emulator Suite y datos simulados pendientes.
- Pruebas para los estados `pending`, `accepted` y `rejected` pendientes.
- Pruebas para comprobar que las solicitudes de otras cuentas permanecen intactas pendientes.

## 14. Conversaciones y mensajes

### Tratamiento aprobado mediante DEL-A

Al eliminar una cuenta de LangBridge:

- Se eliminarán permanentemente todas las conversaciones en las que participe la cuenta.
- Antes de eliminar cada conversación, se eliminarán todos los mensajes almacenados en su subcolección `messages`.
- Se eliminarán los mensajes enviados por la cuenta eliminada.
- También se eliminarán los mensajes enviados por las demás personas dentro de esas conversaciones.
- Las demás personas participantes perderán el historial compartido correspondiente.
- No se conservarán el texto de los mensajes, el UID de quien los envió, la fecha de creación ni la fecha de lectura.
- No se aplicará anonimización ni se sustituirá la identidad por referencias como `Usuario eliminado` en la primera versión del procedimiento.
- Después de eliminar los mensajes, se eliminará el documento principal de cada conversación.
- La eliminación será irreversible.
- Si la persona vuelve a LangBridge mediante una cuenta nueva, no recuperará conversaciones ni mensajes anteriores y comenzará desde cero.

### Efectos para las demás personas participantes

La eliminación de una conversación afecta el historial compartido de todas las personas que participaron en ella. Por tanto:

- La otra persona dejará de ver la conversación eliminada.
- Los mensajes enviados por la otra persona dentro de ese historial también serán eliminados.
- LangBridge deberá informar claramente este efecto antes de que la persona confirme la eliminación de su cuenta.
- La confirmación deberá advertir que la eliminación del historial compartido no puede deshacerse.

### Orden técnico obligatorio

El procedimiento deberá:

1. Localizar las conversaciones donde el UID de la cuenta aparezca en `participants`.
2. Eliminar todos los documentos de cada subcolección `messages`.
3. Eliminar el documento principal de cada conversación.
4. Continuar con los demás datos relacionados con la cuenta.

Cloud Firestore no elimina automáticamente las subcolecciones cuando se elimina el documento principal. Por esta razón, los mensajes deberán eliminarse antes que la conversación.

### Estado de implementación

- Decisión aprobada mediante DEL-A.
- Implementación técnica pendiente.
- Pruebas con Firebase Emulator Suite y datos simulados pendientes.
- Textos de advertencia y confirmación en la aplicación pendientes.
- Publicación condicionada a que la eliminación integral pueda ejecutarse y repetirse de forma segura.

## 15. Usuarios bloqueados

### Tratamiento aprobado mediante DEL-A

Al eliminar una cuenta:

- La lista `blockedUserIds` almacenada en el perfil eliminado desaparecerá al eliminar el documento `users/{uid}`.
- El UID de la cuenta eliminada se retirará de las listas `blockedUserIds` de las demás cuentas.
- No se conservará una referencia ordinaria de bloqueo vinculada con la cuenta eliminada.
- Se evitarán referencias huérfanas en los perfiles de otras personas.
- La limpieza deberá poder repetirse sin afectar otros bloqueos ni eliminar UID diferentes.
- Si la persona vuelve a LangBridge mediante una cuenta nueva, comenzará sin su lista anterior de bloqueos.

### Alcance de la decisión

Esta decisión se aplica al modelo actual de listas personales de bloqueo. LangBridge no conservará el UID eliminado dentro de esas listas con la finalidad de prevenir abusos o mantener una medida administrativa.

Si en el futuro se implementa un sistema administrativo separado para prevenir fraude, abuso o evasión de medidas:

- Deberá diseñarse como una función independiente de `blockedUserIds`.
- Deberá aprobarse previamente su finalidad, base jurídica, información utilizada y período de conservación.
- No deberá reutilizar automáticamente el UID eliminado.
- No deberá conservar el perfil completo.
- Deberá incorporarse al inventario de datos, las políticas aplicables y el procedimiento de eliminación antes de activarse.

### Orden técnico obligatorio

El procedimiento deberá:

1. Localizar los perfiles ajenos que contengan el UID eliminado en `blockedUserIds`.
2. Retirar únicamente el UID de la cuenta eliminada.
3. Conservar intactos los demás UID bloqueados.
4. Eliminar posteriormente el documento `users/{uid}` de la cuenta.

### Estado de implementación

- Decisión aprobada mediante DEL-A.
- Implementación técnica pendiente.
- Pruebas de limpieza idempotente con Firebase Emulator Suite pendientes.
- Pruebas para comprobar que otros bloqueos permanecen intactos pendientes.

## 16. Reportes enviados por la cuenta

### Modelo de datos actual

La colección `reports` almacena actualmente reportes enviados por las personas usuarias.

Cada reporte puede contener:

- `reporterId`.
- `reporterEmail`.
- `category`.
- `description`.
- `status`.
- `createdAt`.
- `updatedAt`.

El modelo actual no contiene:

- `reportedUserId`.
- `reportedMessageId`.

Por tanto, los reportes actuales permiten identificar a la cuenta que envía el reporte, pero no están vinculados mediante campos específicos con una cuenta o un mensaje reportado.

### Tratamiento aprobado mediante DEL-R1

Al eliminar una cuenta:

- Se eliminarán todos los reportes cuyo campo `reporterId` corresponda al UID de la cuenta eliminada.
- La eliminación incluirá el UID almacenado en `reporterId`.
- La eliminación incluirá el correo almacenado en `reporterEmail`.
- También se eliminarán la categoría, la descripción, el estado y las fechas del reporte.
- No se conservará una copia anonimizada de esos reportes en la primera versión del procedimiento.
- No se aplicará un período especial de conservación a esos reportes.
- Si la persona vuelve a LangBridge mediante una cuenta nueva, no recuperará los reportes anteriores.

### Orden técnico obligatorio

El procedimiento deberá:

1. Obtener el UID exclusivamente desde Firebase Authentication.
2. Localizar los documentos de `reports` cuyo campo `reporterId` coincida con ese UID.
3. Eliminar completamente cada reporte localizado.
4. Completar esta operación antes de eliminar el perfil y la cuenta de Firebase Authentication.
5. Permitir reintentos seguros sin eliminar reportes enviados por otras cuentas.

### Estado de implementación

- Decisión aprobada mediante DEL-R1.
- Implementación técnica pendiente.
- Pruebas con Firebase Emulator Suite y datos simulados pendientes.
- Pruebas para comprobar que los reportes de otras cuentas permanecen intactos pendientes.

## 17. Reportes de seguridad y moderación

### Tratamiento aplicable al modelo actual

En el modelo actual, la colección `reports` no almacena `reportedUserId` ni `reportedMessageId`. Por esta razón:

- No existe actualmente una categoría técnica separada de evidencia vinculada con una cuenta o un mensaje reportado.
- Los reportes actuales también se eliminarán cuando `reporterId` corresponda a la cuenta eliminada.
- No se conservarán temporalmente reportes completos bajo una excepción general de seguridad o moderación.
- No se conservarán el UID, el correo, la descripción ni otros campos de esos reportes después de su eliminación.
- La decisión vigente corresponde a DEL-R1.

### Revisión obligatoria si cambia el modelo

Si LangBridge incorpora en el futuro reportes específicos contra personas, mensajes, conversaciones o contenido:

- Esta decisión deberá revisarse antes de activar esos nuevos campos o funciones.
- Deberá definirse si existe evidencia que necesite conservación limitada.
- Deberán aprobarse la finalidad, los datos utilizados, el acceso y el período de conservación.
- Deberán actualizarse el inventario de datos, las políticas aplicables, las reglas de seguridad y el procedimiento de eliminación.
- Deberán crearse pruebas específicas antes de utilizar el nuevo modelo en producción.

### Estado de implementación

- Decisión aprobada para el modelo actual mediante DEL-R1.
- La eliminación efectiva de reportes todavía no está implementada.
- Las pruebas automáticas y manuales permanecen pendientes.

## 18. Fotografías de perfil

La selección y carga permanente de fotografías desde el dispositivo todavía no está implementada por completo.

Cuando se active esta función, la eliminación de cuenta deberá incluir:

- Eliminación del archivo almacenado en Firebase Storage.
- Eliminación de la URL guardada en Firestore.
- Eliminación de versiones anteriores que todavía existan.
- Verificación de que no queden archivos huérfanos.
- Eliminación de archivos temporales administrados por LangBridge cuando corresponda.

Una fotografía procedente directamente de la cuenta de Google también podrá dejar de mostrarse después de eliminar el perfil y la cuenta de LangBridge.

La eliminación de una cuenta de LangBridge no elimina la cuenta de Google de la persona.

## 19. Datos de aprendizaje y gamificación

Cuando se activen las funciones educativas completas, la eliminación deberá incluir:

- Progreso.
- Resultados.
- Lecciones completadas.
- Puntos.
- Vidas.
- Rachas.
- Niveles.
- Fechas de práctica.
- Metas personales.
- Configuraciones asociadas.

LangBridge podrá conservar estadísticas agregadas que no identifiquen a la persona.

Antes de activar estas funciones, el procedimiento de eliminación deberá actualizarse y probarse.

## 20. Datos almacenados localmente

LangBridge utiliza AsyncStorage para:

- Mantener la persistencia de la sesión.
- Guardar la preferencia de idioma mediante `appLanguage`.

Al finalizar la eliminación:

- La sesión deberá cerrarse.
- La cuenta eliminada no deberá permanecer autenticada.
- Los datos locales relacionados con la sesión deberán limpiarse cuando sea técnicamente aplicable.

La preferencia de idioma podrá permanecer en el dispositivo porque permite abrir la aplicación en el idioma seleccionado y no necesariamente identifica a la persona.

La persona también puede eliminar datos locales:

- Borrando los datos de la aplicación.
- Desinstalando LangBridge.
- Utilizando controles del sistema operativo.

## 21. Datos que podrían conservarse temporalmente

LangBridge podrá conservar información limitada cuando sea necesaria para:

- Prevenir fraude.
- Investigar abuso.
- Proteger a otras personas.
- Cumplir obligaciones legales.
- Resolver disputas.
- Responder a solicitudes legalmente válidas.
- Evitar evasión de medidas.
- Demostrar que una solicitud fue procesada.

Cualquier conservación deberá:

- Estar documentada.
- Limitarse a lo necesario.
- Tener acceso restringido.
- Tener un plazo o criterio de eliminación.
- No utilizarse para publicidad.
- No utilizarse para mantener activo el perfil eliminado.

## 22. Recibo técnico mínimo de eliminación

Después de completar satisfactoriamente la eliminación de la cuenta y sus datos:

- La solicitud identificable original será eliminada.
- La solicitud original será sustituida por un recibo técnico mínimo y no identificable.
- El recibo técnico se conservará durante 30 días desde la fecha de finalización del procedimiento.
- El recibo técnico será eliminado al vencer su fecha de expiración.
- El recibo no permitirá reconstruir la identidad de la cuenta ni recuperar los datos eliminados.

El recibo técnico contendrá únicamente:

- Identificador aleatorio no reutilizable.
- Fecha de recepción de la solicitud.
- Fecha de finalización del procedimiento.
- Estado general `completed`.
- Versión del procedimiento de eliminación.
- Conteos generales de documentos eliminados por categoría.
- Fecha de expiración del recibo.

El recibo técnico no contendrá:

- UID de Firebase Authentication.
- Correo electrónico.
- Nombre.
- Biografía.
- Fotografía.
- País.
- Información lingüística.
- Contenido o fragmentos de mensajes.
- Descripciones o contenido de reportes.
- Identificadores de conversaciones.
- Identificadores de solicitudes de conexión.
- Identificadores de documentos eliminados.
- Cualquier otro dato que permita identificar, reconocer o reconstruir la cuenta eliminada.

La conservación temporal tendrá únicamente las siguientes finalidades:

- Comprobar la finalización general del procedimiento.
- Facilitar la revisión de fallos técnicos.
- Permitir reintentos seguros cuando correspondan.
- Registrar conteos generales de los documentos eliminados.

El recibo no se utilizará para identificar a la persona, restaurar la cuenta, recuperar contenido eliminado ni crear un historial permanente de cuentas eliminadas.

Período aprobado:

- Conservación durante 30 días desde la fecha de finalización.
- Eliminación al vencer la fecha de expiración.
- Implementación técnica y pruebas todavía pendientes.

## 23. Copias de seguridad

Los datos eliminados de los sistemas activos podrían permanecer temporalmente en copias de seguridad protegidas administradas por proveedores.

Antes de publicar esta página se deberá confirmar:

- Qué proveedores mantienen copias.
- Cuánto dura el ciclo de respaldo.
- Cuándo desaparecen los datos.
- Qué controles restringen el acceso.
- Cómo se evita la restauración permanente de una cuenta eliminada.

Los datos presentes en copias de seguridad no deberán utilizarse para proporcionar funciones ordinarias después de la eliminación.

Tratamiento definitivo de copias de seguridad: [PENDIENTE].

## 24. Plazo de procesamiento

LangBridge todavía debe aprobar y probar el plazo definitivo.

- Inicio operativo previsto: [PENDIENTE].
- Plazo objetivo: [PENDIENTE].
- Plazo máximo informado: [PENDIENTE].

No se publicará un plazo exacto hasta comprobar que puede cumplirse de forma fiable.

Cuando exista una retención legítima, LangBridge deberá informar el criterio aplicable sin afirmar que todos los datos fueron eliminados inmediatamente.

## 25. Fallos parciales

La eliminación puede requerir varias operaciones.

Si una operación falla:

- La solicitud no se marcará como completada.
- Se registrará la etapa pendiente.
- El proceso deberá poder reintentarse.
- Se evitará eliminar datos de otra cuenta.
- Se evitarán estados falsos de finalización.
- Podrá requerirse intervención administrativa.

El procedimiento deberá diseñarse para que los reintentos no produzcan duplicaciones o daños.

## 26. Cancelación de una solicitud

La posibilidad de cancelar una solicitud todavía debe definirse.

Si se permite:

- Solamente podrá cancelarse antes de iniciar operaciones irreversibles.
- Deberá verificarse la identidad.
- La cancelación deberá registrarse.
- No se garantizará recuperar información ya eliminada.
- El perfil podrá restaurarse solamente cuando los datos todavía existan.

Política definitiva de cancelación: [PENDIENTE].

## 27. Confirmación

Cuando el proceso finalice, LangBridge deberá enviar una confirmación mediante un canal seguro.

La confirmación podrá indicar:

- Que la cuenta fue eliminada.
- Fecha de finalización.
- Categorías eliminadas.
- Existencia de alguna conservación limitada.
- Razón general de la conservación.
- Período o criterio aplicable.
- Canal para consultas.

La confirmación no deberá incluir contraseñas, credenciales u otra información sensible.

Canal definitivo de confirmación: [PENDIENTE].

## 28. Efectos de la eliminación

Después de completar la eliminación:

- La cuenta no podrá iniciar sesión.
- El perfil dejará de estar disponible.
- Las conexiones dejarán de funcionar.
- Las funciones asociadas con la cuenta dejarán de estar disponibles.
- El progreso personal podrá perderse.
- Las fotografías almacenadas deberán eliminarse.
- Los datos eliminados no podrán recuperarse ordinariamente.
- Podrá ser necesario crear una cuenta nueva para volver a utilizar LangBridge.

LangBridge no garantiza que pueda restaurar una cuenta eliminada.

## 29. Diferencia entre eliminar la aplicación y eliminar la cuenta

Desinstalar LangBridge del dispositivo no elimina automáticamente:

- La cuenta.
- El perfil.
- Los mensajes.
- Las conexiones.
- Los reportes.
- Los datos almacenados en Firebase.

Para eliminar la cuenta, la persona debe utilizar el procedimiento de eliminación dentro de la aplicación o la página web pública.

## 30. Diferencia entre cerrar sesión y eliminar la cuenta

Cerrar sesión:

- Finaliza el acceso desde el dispositivo.
- No elimina la cuenta.
- No elimina el perfil.
- No elimina mensajes ni conexiones.

Eliminar la cuenta:

- Inicia un proceso para eliminar permanentemente la cuenta y los datos asociados conforme a DEL-A y DEL-R1.
- Requiere verificar que la solicitud procede de la persona que controla la cuenta.
- Es irreversible una vez iniciadas las operaciones que eliminan datos.
- Elimina el perfil, las solicitudes de conexión, las conversaciones, los mensajes, las referencias de bloqueo relacionadas y los reportes enviados por la cuenta.
- Si la persona vuelve a LangBridge mediante una cuenta nueva, comenzará desde cero.
- Después de completar satisfactoriamente la eliminación, la solicitud identificable original se sustituirá por el recibo técnico mínimo y no identificable aprobado mediante DEL-S2.
- El recibo técnico se conservará durante 30 días y se eliminará al vencer su fecha de expiración.

## 31. Solicitudes incompletas o no verificadas

LangBridge podrá no ejecutar una eliminación cuando:

- No pueda verificar la identidad.
- La información proporcionada no corresponda con una cuenta.
- La solicitud sea fraudulenta.
- La solicitud intente eliminar una cuenta ajena.
- Exista una restricción legal válida.
- Se necesite información mínima adicional.

LangBridge deberá explicar la razón general cuando sea posible y seguro hacerlo.

## 32. Contacto

Para consultas relacionadas con eliminación:

- Correo de privacidad: [PENDIENTE]
- Correo de soporte: [PENDIENTE]
- Formulario público: [PENDIENTE]
- Sitio web: [PENDIENTE]

LangBridge no debe publicar correos personales o domicilios particulares sin una evaluación previa de privacidad y seguridad.

## 33. Cambios en esta política

Esta política podrá actualizarse cuando:

- Cambie el procedimiento técnico.
- Se incorpore Firebase Storage.
- Se añadan datos de aprendizaje.
- Cambie el tratamiento de mensajes.
- Cambie la retención de reportes.
- Cambien los proveedores.
- Cambien los requisitos legales.
- Cambien los requisitos de Google Play.

La versión publicada deberá indicar la fecha de entrada en vigor y la última actualización.

## 34. Información pendiente antes de publicación

Esta política todavía no está lista para publicarse como procedimiento definitivo.

### Decisiones de tratamiento ya aprobadas

Las siguientes decisiones ya no están pendientes:

- DEL-A: eliminación del perfil, solicitudes de conexión, conversaciones, mensajes y referencias en listas de bloqueo.
- DEL-R1: eliminación de todos los reportes enviados por la cuenta en el modelo actual.
- DEL-S2: sustitución de la solicitud identificable original por un recibo técnico mínimo y no identificable.
- Conservación del recibo técnico durante 30 días desde la finalización.
- Eliminación del recibo técnico al vencer su fecha de expiración.

### Información institucional y pública pendiente

Antes de la publicación definitiva deben completarse o verificarse:

- Nombre legal o comercial definitivo.
- Correos oficiales.
- Sitio web oficial.
- URL pública de eliminación.
- Formulario público.
- Datos de contacto.
- Fecha de entrada en vigor.
- Versión definitiva de la política.

### Decisiones todavía pendientes

Todavía deben aprobarse o cerrarse:

- Plazo operativo objetivo para procesar una solicitud.
- Plazo máximo que se informará públicamente.
- Tratamiento de copias de seguridad.
- Política de cancelación.
- Canal de confirmación de la eliminación.
- Cualquier excepción legal específica de conservación.
- Revisión jurídica final.

### Implementación técnica pendiente

Todavía debe implementarse y verificarse:

- Reautenticación o verificación segura de identidad.
- Procesamiento seguro de `accountDeletionRequests`.
- Eliminación efectiva de Firebase Authentication.
- Eliminación efectiva de `users/{uid}`.
- Eliminación de solicitudes de conexión.
- Eliminación de conversaciones y sus subcolecciones `messages`.
- Limpieza del UID eliminado en listas `blockedUserIds` ajenas.
- Eliminación de reportes enviados por la cuenta.
- Creación del recibo técnico aprobado mediante DEL-S2.
- Eliminación del recibo técnico después de 30 días.
- Limpieza segura de la sesión local.
- Eliminación futura de fotografías en Firebase Storage.
- Eliminación futura de datos de aprendizaje y gamificación.
- Manejo de fallos parciales y reintentos idempotentes.

### Pruebas pendientes

Antes de publicar deberán completarse:

- Pruebas automáticas con Firebase Emulator Suite.
- Pruebas manuales con cuentas y datos simulados.
- Pruebas de reautenticación.
- Pruebas de eliminación integral.
- Pruebas de reintentos seguros.
- Pruebas que comprueben que no se eliminan datos exclusivos de otras cuentas.
- Pruebas de creación y expiración del recibo técnico.
- Revisión de coherencia entre la aplicación, las políticas públicas y la información de Google Play.

## 35. Condiciones para publicar esta página

Esta página solamente podrá publicarse como procedimiento definitivo cuando:

- La ruta interna funcione.
- La página web pública funcione.
- La identidad pueda verificarse.
- La cuenta de Authentication pueda eliminarse.
- Firestore pueda limpiarse o anonimizarse.
- Storage pueda limpiarse.
- Los mensajes tengan un tratamiento aprobado.
- Los reportes tengan un tratamiento aprobado.
- Los plazos puedan cumplirse.
- Los fallos parciales puedan reintentarse.
- La persona reciba una confirmación.
- No queden datos huérfanos.
- La Política de privacidad sea coherente.
- Los Términos sean coherentes.
- Google Play reciba información coherente.
- La revisión jurídica final haya concluido.