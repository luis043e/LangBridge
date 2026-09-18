# Política de retención y eliminación de datos de LangBridge

## Control del documento

- Producto: LangBridge
- Responsable del documento: Luis Enrique Nuñez Minaya
- Tipo de documento: Política interna de retención y eliminación
- Estado: Borrador interno
- Versión: 0.1
- Fecha de preparación: 9 de septiembre de 2026
- Fecha de entrada en vigor: [PENDIENTE]
- Última actualización: 9 de septiembre de 2026

> Este documento no debe publicarse como política definitiva hasta implementar y probar la eliminación efectiva de cuentas, aprobar los períodos de conservación y realizar una revisión jurídica.

## 1. Propósito

Esta Política establece los criterios internos que LangBridge utilizará para conservar, eliminar o anonimizar datos personales y técnicos.

Sus objetivos son:

- Evitar la conservación indefinida de información sin una finalidad válida.
- Definir qué debe ocurrir cuando una persona solicita eliminar su cuenta.
- Mantener coherencia entre Firebase Authentication, Cloud Firestore, Firebase Storage y el almacenamiento local.
- Establecer criterios para conversaciones, mensajes, conexiones, bloqueos, reportes y registros administrativos.
- Preparar el cumplimiento de los requisitos de Google Play relacionados con eliminación de cuentas y datos.
- Servir de base para la Política de privacidad y la página pública de eliminación.

Esta política es interna y no sustituye la información pública que LangBridge deberá ofrecer a las personas usuarias.

## 2. Alcance

Esta Política se aplica a:

- Cuentas de Firebase Authentication.
- Documentos de perfiles en Cloud Firestore.
- Perfiles personales y lingüísticos.
- Solicitudes de conexión.
- Conversaciones.
- Mensajes.
- Listas de usuarios bloqueados.
- Reportes técnicos o de seguridad.
- Solicitudes de eliminación.
- Fotografías de perfil almacenadas actualmente o en el futuro.
- Datos futuros de aprendizaje y gamificación.
- Registros administrativos necesarios para seguridad y cumplimiento.
- Preferencias almacenadas localmente en el dispositivo.

## 3. Principios de conservación

LangBridge aplicará los siguientes principios:

### 3.1. Minimización

Solo se conservarán los datos necesarios para proporcionar las funciones, proteger la plataforma, atender solicitudes o cumplir obligaciones aplicables.

### 3.2. Limitación de finalidad

Los datos no deberán conservarse ni utilizarse para finalidades incompatibles con aquellas para las que fueron recopilados.

### 3.3. Conservación limitada

Los datos deberán eliminarse o anonimizarse cuando:

- La cuenta sea eliminada.
- La información deje de ser necesaria.
- Termine el período de conservación aprobado.
- No exista una razón válida para mantenerla.
- La persona solicite su eliminación y no exista una excepción legítima.

### 3.4. Seguridad

Los datos conservados deberán mantenerse protegidos mediante controles técnicos y administrativos adecuados.

### 3.5. Trazabilidad mínima

Cuando sea necesario demostrar que una solicitud fue procesada, LangBridge podrá conservar un registro mínimo que no contenga más información de la necesaria.

### 3.6. Coherencia

La eliminación deberá considerar todas las ubicaciones donde existan datos asociados:

- Firebase Authentication.
- Cloud Firestore.
- Firebase Storage.
- Almacenamiento local.
- Registros administrativos.
- Futuros proveedores o servicios.

## 4. Estados del proceso de eliminación

Las solicitudes de eliminación podrán utilizar los siguientes estados internos:

- `pending`: solicitud recibida y pendiente de verificación.
- `verified`: identidad y control de la cuenta verificados mediante un procedimiento seguro.
- `processing`: eliminación efectiva en proceso o pendiente de completar después de un fallo parcial.
- `completed`: todas las operaciones previstas concluyeron correctamente y se creó el recibo técnico mínimo aprobado mediante DEL-S2.
- `rejected`: solicitud rechazada porque no fue posible verificar la identidad, el control de la cuenta o algún requisito necesario.
- `cancelled`: solicitud cancelada válidamente después de verificar nuevamente la identidad y antes de alcanzar el punto técnico de no retorno.

### Reglas de transición

- `pending` podrá pasar a `verified`, `rejected` o `cancelled`.
- `verified` podrá pasar a `processing`, `rejected` o `cancelled`.
- `processing` podrá pasar a `completed`.
- `processing` solo podrá pasar a `cancelled` si el backend confirma que todavía no se alcanzó el punto técnico de no retorno.
- `completed`, `rejected` y `cancelled` serán estados terminales para esa solicitud.
- Un fallo parcial no cambiará la solicitud a `completed`; permanecerá en `processing` y admitirá reintentos seguros e idempotentes.
- La existencia temporal del recibo técnico DEL-S2 no requerirá un estado alternativo como `partially_retained`.

### Administración segura

- Los estados deberán administrarse desde un entorno servidor o administrativo autorizado.
- El cliente móvil no podrá establecer directamente `verified`, `processing`, `completed`, `rejected` o `cancelled`.
- El estado `completed` solo podrá establecerse después de terminar todas las operaciones previstas y crear correctamente DEL-S2.
- La solicitud identificable original deberá sustituirse por el recibo técnico DEL-S2 después de completar la eliminación.
- Cualquier conservación excepcional legítima deberá documentarse y comunicarse de manera general cuando corresponda, sin utilizar `partially_retained` como estado operativo.

## 5. Situación técnica actual

La implementación actual permite:

- Registrar una solicitud en `accountDeletionRequests`.
- Guardar el UID de la persona solicitante.
- Guardar el correo asociado.
- Establecer el estado inicial `pending`.
- Registrar fechas de creación y actualización.
- Ocultar el perfil mediante `isProfileVisible: false`.
- Marcar `deletionRequested: true`.
- Registrar `deletionRequestedAt`.

La implementación actual todavía no realiza automáticamente:

- La eliminación de Firebase Authentication.
- La eliminación del documento de `users`.
- La eliminación de solicitudes de conexión.
- La eliminación completa de las conversaciones relacionadas, conforme a DEL-A.
- La eliminación completa de los mensajes relacionados, conforme a DEL-A.
- La limpieza de las referencias de la cuenta en las listas de bloqueo, conforme a DEL-A.
- La eliminación de todos los reportes enviados por la cuenta, conforme a DEL-R1.
- La eliminación de fotografías de Firebase Storage.
- La eliminación de futuros datos de aprendizaje.
- La limpieza local dentro del dispositivo.
- La confirmación final de que el proceso terminó.

Por esta razón, el bloque de eliminación efectiva permanece pendiente.

## 6. Inicio de una solicitud

La solicitud podrá iniciarse mediante:

- La ruta disponible dentro de la aplicación.
- Una página web pública de eliminación.
- Un correo oficial de privacidad o soporte, cuando corresponda.
- Un procedimiento administrativo autorizado.

La página pública deberá estar disponible sin necesidad de iniciar sesión en la aplicación.

## 7. Verificación de identidad

Antes de eliminar una cuenta, LangBridge deberá verificar razonablemente que la solicitud procede de la persona que controla la cuenta.

Los métodos podrán incluir:

- Inicio de sesión reciente.
- Reautenticación mediante correo y contraseña.
- Reautenticación mediante Google Sign-In.
- Confirmación enviada al correo asociado.
- Verificación administrativa limitada cuando la persona no tenga acceso a la aplicación.

LangBridge no deberá solicitar documentos de identidad oficiales salvo que exista una razón necesaria, proporcionada y jurídicamente revisada.

No se deben solicitar contraseñas por correo electrónico, formularios públicos ni mensajes de soporte.

## 8. Protección temporal durante el proceso

Cuando se reciba una solicitud válida, LangBridge podrá:

- Ocultar el perfil.
- Impedir nuevas solicitudes de conexión.
- Limitar nuevas conversaciones.
- Marcar la cuenta como pendiente de eliminación.
- Mantener temporalmente la sesión necesaria para completar la verificación.
- Evitar modificaciones que interfieran con el proceso.

Estas medidas no sustituyen la eliminación efectiva.

## 9. Cuenta de Firebase Authentication

Tratamiento previsto:

- Verificar que la identidad y el UID correspondan a la solicitud.
- Procesar primero los datos asociados que requieran el UID.
- Eliminar la cuenta de Firebase Authentication al final del procedimiento técnico.
- Revocar el acceso posterior.
- Evitar dejar datos personales sin una cuenta responsable asociada.

La eliminación no debe depender exclusivamente de una operación ejecutada desde el cliente móvil si esa operación no puede eliminar de forma segura todos los datos relacionados.

La solución final deberá utilizar un entorno administrativo o servidor seguro con permisos controlados.

## 10. Perfil de usuario

Ruta principal:

- `users/{uid}`

Datos asociados:

- UID.
- Nombre.
- Correo.
- País.
- Ciudad histórica.
- Biografía.
- Fotografía.
- Idiomas.
- Nivel.
- Visibilidad.
- Lista de bloqueos.
- Estado de solicitud de eliminación.
- Fechas y campos técnicos.

Tratamiento previsto:

- Eliminar el documento cuando ya no sea necesario para completar el proceso.
- Limpiar referencias del UID en otros documentos.
- Eliminar o desvincular la fotografía.
- Evitar conservar nombre, correo o biografía después de completar la eliminación.
- Mantener únicamente información mínima cuando exista una razón legítima expresamente documentada.

## 11. Preferencia local de idioma y sesión

LangBridge utiliza AsyncStorage para:

- Persistencia de Firebase Authentication.
- Preferencia `appLanguage`.

Al completar la eliminación de cuenta, la aplicación deberá:

- Cerrar la sesión.
- Eliminar la persistencia de autenticación relacionada cuando sea técnicamente aplicable.
- Evitar que la cuenta eliminada vuelva a mostrarse como autenticada.

La preferencia de idioma no identifica necesariamente a una persona y podrá conservarse para permitir que la aplicación continúe abriéndose en el idioma seleccionado.

Si se determina que la preferencia debe eliminarse, la aplicación deberá borrar la clave `appLanguage` durante el proceso.

## 12. Solicitudes de conexión

Colección:

- `connectionRequests`

Datos relacionados:

- Remitente.
- Destinatario.
- Nombres mostrados.
- Estado.
- Fechas.

Tratamiento aprobado mediante DEL-A:

- Se eliminarán todas las solicitudes de conexión donde la cuenta aparezca como remitente o destinataria.
- Se eliminarán las solicitudes con estado `pending`, `accepted` o `rejected`.
- La eliminación incluirá los nombres, UID, estados y fechas almacenados dentro de esos documentos.
- Las conversaciones relacionadas se procesarán y eliminarán antes de eliminar las solicitudes aceptadas que les dieron origen.
- No se conservarán relaciones aceptadas mediante referencias anonimizadas en la primera versión del procedimiento.
- Otra cuenta no podrá aceptar ni responder una solicitud perteneciente a una cuenta eliminada.
- Si la persona vuelve a LangBridge con una cuenta nueva, no recuperará solicitudes ni conexiones anteriores.

Estado de implementación:

- Decisión aprobada mediante DEL-A.
- Implementación técnica pendiente.
- Pruebas con Firebase Emulator Suite y datos simulados pendientes.

## 13. Conversaciones

Colección:

- `conversations`

Datos principales:

- Identificador de conexión.
- Identificadores de participantes.
- Fechas.

La eliminación de una cuenta afectará también el historial compartido disponible para las demás personas participantes.

Tratamiento aprobado mediante DEL-A:

- Al eliminar una cuenta, se eliminarán permanentemente todas las conversaciones donde su UID aparezca dentro de participants.
- Antes de eliminar cada conversación, se eliminarán todos los mensajes de su subcolección.
- No se conservará una copia anonimizada de la conversación en la primera versión.
- La eliminación será irreversible.
- Si la persona vuelve a LangBridge, comenzará desde cero.

Orden técnico aprobado:

- Localizar todas las conversaciones donde el UID de la cuenta aparezca dentro de participants.

- Eliminar todos los mensajes almacenados en la subcolección de cada conversación.

- Confirmar que los mensajes hayan sido procesados.

- Eliminar el documento principal de cada conversación.

- Registrar cualquier fallo parcial para permitir un reintento seguro.

Esta decisión reduce la conservación de información, evita referencias huérfanas, libera almacenamiento e impide recuperar el historial eliminado.

## 14. Mensajes

Subcolección:

- `conversations/{conversationId}/messages`

Datos almacenados:

- UID del remitente.
- Texto.
- Fecha de creación.
- Fecha de lectura.

Tratamiento aprobado mediante DEL-A:



- Se eliminarán permanentemente todos los mensajes de las conversaciones relacionadas con la cuenta eliminada.

- Se eliminarán los mensajes enviados por la cuenta eliminada y los enviados por las demás personas dentro de esas conversaciones.

- No se conservarán el texto, el UID del remitente, la fecha de creación ni la fecha de lectura.

- No se utilizará anonimización en la primera versión del procedimiento.

- Los mensajes deberán eliminarse antes de eliminar el documento principal de la conversación.

- Los mensajes eliminados no podrán recuperarse mediante las funciones ordinarias de LangBridge.

- Si la persona vuelve a LangBridge, comenzará sin mensajes anteriores.

### Razones

- Evitar subcolecciones huérfanas.

- Eliminar identificadores almacenados en senderId.

- Reducir la información conservada.

- Liberar almacenamiento.

- Simplificar las comprobaciones del proceso de eliminación.

### Advertencia obligatoria
Antes de confirmar la eliminación, LangBridge deberá informar que los mensajes también desaparecerán para las demás personas participantes y que la acción será irreversible.

## 15. Usuarios bloqueados

Los UID bloqueados pueden encontrarse en `blockedUserIds` dentro de documentos de otras personas.

Tratamiento aprobado mediante DEL-A:

- La lista blockedUserIds de la cuenta desaparecerá cuando se elimine su documento users/{uid}.
- El UID de la cuenta eliminada se retirará de las listas blockedUserIds de las demás cuentas.
- No se conservará una referencia ordinaria de bloqueo vinculada con la cuenta eliminada.
- La operación deberá poder repetirse sin eliminar otros bloqueos ni afectar cuentas ajenas.
- Si la persona vuelve a LangBridge con una cuenta nueva, comenzará sin su lista anterior de bloqueos.

Esta limpieza evitará referencias huérfanas y conservará intactos los demás bloqueos almacenados por cada cuenta.

## 16. Reportes

Colección:

- `reports`

Datos actuales:

- UID de la persona que reporta.
- Correo.
- Categoría.
- Descripción.
- Estado.
- Fechas.

Tratamiento aprobado mediante DEL-R1:

- Al eliminar una cuenta, se eliminarán todos los reportes enviados por esa cuenta.
- Los reportes se localizarán mediante el campo reporterId.
- La eliminación incluirá el UID, correo electrónico, categoría, descripción, estado y fechas.
- No se conservará una copia anonimizada de los reportes en la primera versión del procedimiento.
- El modelo actual no almacena reportedUserId ni reportedMessageId.
- No se aplicará una retención especial de reportes de seguridad en el modelo actual.
- Los reportes deberán eliminarse antes de eliminar el perfil y la cuenta de Firebase Authentication.
- Si la persona vuelve a LangBridge, no recuperará los reportes anteriores.

### Revisión futura

Si LangBridge incorpora denuncias específicas contra usuarios o mensajes, el tratamiento de esos reportes deberá revisarse antes de activar la función. La revisión deberá considerar seguridad, acceso restringido, minimización y un período definido de conservación.

## 17. Solicitudes de eliminación

Colección original:

- `accountDeletionRequests`

La solicitud identificable original contiene actualmente:

- UID.
- Correo electrónico.
- Estado del procedimiento.
- Fechas de creación y actualización.

### Tratamiento aprobado mediante DEL-S2

Después de completar satisfactoriamente la eliminación de la cuenta y sus datos:

- La solicitud identificable original será eliminada.
- El UID y el correo electrónico no se conservarán en el recibo técnico.
- La solicitud original será sustituida por un recibo técnico mínimo y no identificable.
- El recibo técnico se conservará durante 30 días contados desde la fecha de finalización del procedimiento.
- El recibo técnico será eliminado al vencer su fecha de expiración.
- El recibo no permitirá reconstruir la identidad de la cuenta ni recuperar los datos eliminados.
- El proceso deberá poder repetirse sin duplicar recibos ni afectar datos ajenos.

### Datos permitidos en el recibo técnico

- Identificador aleatorio no reutilizable.
- Fecha de recepción de la solicitud.
- Fecha de finalización del procedimiento.
- Estado general `completed`.
- Versión del procedimiento de eliminación.
- Conteos generales de documentos eliminados por categoría.
- Fecha de expiración del recibo.

### Datos prohibidos en el recibo técnico

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

### Finalidad y limitaciones

La conservación temporal del recibo tendrá únicamente las siguientes finalidades:

- Comprobar la finalización general del procedimiento.
- Facilitar la revisión de fallos técnicos.
- Permitir reintentos seguros cuando correspondan.
- Registrar conteos generales de los documentos eliminados.

El recibo técnico no se utilizará para identificar a la persona, restaurar la cuenta, recuperar contenido eliminado ni crear un historial permanente de cuentas eliminadas.

### Estado de implementación

- Decisión aprobada.
- Implementación técnica pendiente.
- Pruebas con Firebase Emulator Suite y datos simulados pendientes.
- Publicación condicionada a que la creación y la expiración del recibo funcionen correctamente.

## 18. Fotografías de perfil

Estado actual:

- La carga permanente desde galería mediante Firebase Storage no está implementada.

Tratamiento futuro:

- Guardar cada fotografía en una ruta asociada al UID.
- Mantener como máximo los archivos necesarios.
- Eliminar fotografías sustituidas.
- Evitar archivos huérfanos.
- Eliminar la fotografía activa cuando se elimine la cuenta.
- Eliminar la URL correspondiente del documento de usuario.
- Verificar que la operación finalizó correctamente.

Antes de activar esta función deberán existir:

- Reglas de Firebase Storage.
- Convención segura de rutas.
- Validación de tipos y tamaño.
- Proceso de sustitución atómica.
- Procedimiento de eliminación.
- Pruebas de seguridad.
- Actualización de los documentos legales.
- Actualización de Seguridad de los datos en Google Play.

## 19. Aprendizaje y gamificación

Estado actual:

- Funcionalidad prevista, todavía no completada.

Datos futuros posibles:

- Progreso.
- Lecciones.
- Respuestas.
- Resultados.
- Puntos.
- Vidas.
- Rachas.
- Unidades.
- Fechas de práctica.
- Nivel.

Tratamiento previsto al eliminar una cuenta:

- Eliminar el progreso asociado.
- Eliminar resultados identificables.
- Eliminar puntos, vidas y rachas.
- Eliminar metas o configuraciones personales.
- Conservar únicamente estadísticas agregadas que no permitan identificar a la persona.

Antes de implementar la función deberá definirse la estructura exacta y probarse su eliminación.

## 20. Datos de diagnóstico y analítica

Según la revisión actual no se identificaron integraciones activas de:

- Firebase Analytics.
- Firebase Crashlytics.
- Publicidad.
- Seguimiento publicitario.
- Grabación de sesiones.

Si estos servicios se incorporan, esta política deberá ampliarse para definir:

- Datos recopilados.
- Finalidad.
- Proveedor.
- Vinculación con la identidad.
- Período de conservación.
- Eliminación.
- Configuración de consentimiento cuando corresponda.

## 21. Plazos de conservación

Los plazos definitivos están pendientes de aprobación.

La siguiente estructura deberá completarse antes de la publicación:

### Cuenta activa

- Conservación: mientras la cuenta permanezca activa y la información sea necesaria.
- Revisión por inactividad: [PENDIENTE].
- Aviso antes de eliminar por inactividad: [PENDIENTE].

### Solicitud de eliminación

- Inicio del procesamiento: después de verificar la identidad de la persona y confirmar una sesión reciente.
- Ejecución ordinaria: tan pronto como sea técnicamente posible.
- Plazo operativo objetivo: 7 días calendario desde la verificación de identidad.
- Plazo máximo informado: 30 días calendario desde la verificación de identidad.
- Fallos parciales: la solicitud permanecerá en estado `processing` y admitirá reintentos seguros.
- Finalización: la solicitud solo pasará a `completed` cuando hayan concluido correctamente todas las operaciones previstas.
- Relación con DEL-S2: los 30 días de conservación del recibo técnico comenzarán desde la fecha efectiva de finalización y no desde la presentación de la solicitud.
- Estado técnico: implementación y pruebas pendientes.

### Solicitudes de conexión pendientes

- Conservación sin respuesta: [PENDIENTE].

### Conversaciones y mensajes

- Mientras exista la cuenta: [PENDIENTE].
- Después de eliminar una cuenta: [PENDIENTE].
- Cuando exista un reporte de seguridad: [PENDIENTE].

### Reportes técnicos

- Después de resolución: [PENDIENTE].

### Reportes de seguridad

- Después de resolución: [PENDIENTE].

### Recibo técnico mínimo de eliminación

- Conservación: 30 días desde la fecha de finalización del procedimiento.
- Eliminación: al vencer la fecha de expiración.
- Contenido: exclusivamente los datos no identificables aprobados mediante DEL-S2.
- Estado técnico: implementación y pruebas pendientes.

### Fotografías sustituidas

- Eliminación técnica: [PENDIENTE].

### Copias de seguridad administradas por proveedores

- Estado actual: no se identificaron respaldos propios, exportaciones automáticas ni procedimientos propios de restauración configurados en el repositorio.
- Verificación externa: pendiente de comprobar en Firebase Console y Google Cloud Console que no exista una configuración activa creada fuera del repositorio.
- Ciclo de eliminación actual: no aplica mientras no existan respaldos propios o externos confirmados.
- Respaldos futuros: cualquier frecuencia, período de retención, ciclo de eliminación y procedimiento de restauración deberán aprobarse antes de activar el servicio.
- Facturación: LEG-017 no autoriza la activación del plan Blaze, servicios de pago ni facturación.
- Restauraciones futuras: los datos restaurados deberán permanecer aislados hasta comprobar que no reaparezcan cuentas ni datos eliminados.

No deberá publicarse un plazo de retención o eliminación de copias hasta completar la verificación externa o aprobar una futura configuración de respaldos.

## 22. Excepciones limitadas

LangBridge podrá conservar información limitada después de una solicitud cuando sea necesario para:

- Prevenir fraude.
- Proteger la seguridad.
- Investigar abuso.
- Resolver disputas.
- Cumplir una obligación legal.
- Defender derechos.
- Evitar la creación reiterada de cuentas utilizadas para causar daño.

Toda excepción deberá:

- Tener una finalidad documentada.
- Limitarse a la información necesaria.
- Restringir el acceso.
- Tener una fecha de revisión o eliminación.
- No utilizarse para finalidades comerciales incompatibles.
- Explicarse públicamente cuando corresponda.

## 23. Copias de seguridad

### Tratamiento aprobado para el modelo actual mediante LEG-017

La configuración y el repositorio actuales de LangBridge no contienen mecanismos propios de respaldo o restauración de Cloud Firestore.

En el modelo actual:

- No existen copias programadas propias configuradas desde el repositorio.
- No existen exportaciones automáticas propias.
- No existen scripts propios de importación o restauración.
- `firebase.json` solamente configura reglas, índices de Cloud Firestore y Firebase Hosting.
- `package.json` no contiene comandos de respaldo, exportación, importación o restauración.
- No se identificaron comandos `gcloud` ni usos de `exportDocuments`, `importDocuments`, `backupSchedules` o recuperación en un momento determinado.
- La eliminación efectiva deberá ejecutarse sobre los datos activos administrados por LangBridge.
- Esta decisión no activa respaldos, exportaciones, restauraciones, servicios de pago ni facturación.
- La activación del plan Blaze no está autorizada mediante LEG-017.

### Verificación externa pendiente

Antes de publicar la política definitiva, LangBridge deberá comprobar que no exista una configuración externa activa creada fuera del repositorio.

La revisión deberá verificar, mediante acceso de solo lectura cuando sea posible:

- Programaciones de respaldos de Cloud Firestore.
- Exportaciones configuradas desde Google Cloud.
- Recuperación en un momento determinado.
- Copias manuales conocidas.
- Ubicaciones de almacenamiento utilizadas.
- Períodos de retención configurados.
- Personas o cuentas de servicio con acceso.
- Procedimientos existentes de restauración.

Esta revisión no deberá activar el plan Blaze ni crear una copia nueva.

### Requisitos para respaldos futuros

Antes de habilitar respaldos, LangBridge deberá aprobar:

- Proveedor y servicio exactos.
- Finalidad.
- Datos incluidos.
- Frecuencia.
- Ubicación.
- Acceso autorizado.
- Costo y plan de facturación.
- Período máximo de retención.
- Eliminación de las copias.
- Procedimiento de restauración.
- Tratamiento de cuentas y datos eliminados.
- Pruebas de recuperación y eliminación posterior.

También deberán actualizarse el inventario de datos, las políticas aplicables y la información correspondiente de Google Play antes de activar el servicio.

### Protección frente a restauraciones

Una futura restauración no podrá reactivar cuentas ni volver a poner en uso ordinario datos eliminados.

Antes de permitir que la aplicación utilice datos restaurados, el procedimiento deberá:

1. Ejecutar la restauración en un entorno aislado o administrativo controlado.
2. Identificar la fecha efectiva de la copia utilizada.
3. Identificar las eliminaciones completadas después de esa fecha.
4. Volver a aplicar las eliminaciones correspondientes.
5. Comprobar que no reaparezcan perfiles eliminados.
6. Comprobar que no reaparezcan solicitudes de conexión eliminadas.
7. Comprobar que no reaparezcan conversaciones ni mensajes eliminados.
8. Comprobar que no reaparezcan referencias de bloqueo eliminadas.
9. Comprobar que no reaparezcan reportes eliminados.
10. Evitar la recreación de cuentas eliminadas de Firebase Authentication.
11. Completar las pruebas antes de permitir el acceso ordinario.

### Relación con DEL-S2

El recibo técnico DEL-S2 no identifica a la persona y se elimina después de 30 días. No deberá utilizarse para reconstruir la identidad de una cuenta eliminada.

Antes de habilitar respaldos, LangBridge deberá diseñar y aprobar un mecanismo compatible con la minimización de datos que permita respetar las eliminaciones después de una restauración.

Ese mecanismo podrá considerar:

- Limitar la antigüedad y rotación de las copias.
- Restaurar copias únicamente dentro de un período controlado.
- Mantener los datos restaurados aislados hasta volver a aplicar las eliminaciones vigentes.
- Utilizar controles técnicos temporales y protegidos.
- Evitar la conservación indefinida de perfiles o datos personales completos.
- Impedir que DEL-S2 se utilice para reconstruir identidades eliminadas.

### Estado de implementación

- Decisión aprobada para el modelo actual mediante LEG-017.
- Verificación externa en Firebase Console y Google Cloud Console pendiente.
- Respaldos propios no configurados.
- Exportaciones automáticas no configuradas.
- Procedimiento de restauración no implementado.
- Activación del plan Blaze no autorizada mediante esta decisión.
- Diseño para impedir la reaparición de datos eliminados pendiente.
- Pruebas de restauración pendientes para una futura implementación.
- Publicación definitiva pendiente de validación técnica y revisión jurídica.

## 24. Proceso técnico recomendado

La eliminación efectiva deberá ejecutarse desde un entorno servidor o administrativo autorizado.

Orden técnico recomendado:

1. Verificar nuevamente la identidad y confirmar una sesión reciente.
2. Consultar el estado real de la solicitud.
3. Comprobar si existe una cancelación válida antes del punto técnico de no retorno.
4. Obtener y validar temporalmente el correo necesario para las comunicaciones aprobadas mediante LEG-019.
5. Marcar la solicitud como `processing`.
6. Impedir nuevas interacciones con la cuenta.
7. Obtener las referencias necesarias para localizar todos los datos relacionados.
8. Alcanzar el punto técnico de no retorno inmediatamente antes de comenzar la primera operación irreversible.
9. Eliminar los mensajes de las conversaciones relacionadas.
10. Eliminar los documentos principales de las conversaciones.
11. Eliminar todas las solicitudes de conexión relacionadas.
12. Retirar el UID de la cuenta eliminada de las listas `blockedUserIds` ajenas.
13. Eliminar todos los reportes enviados por la cuenta conforme a DEL-R1.
14. Eliminar futuros datos de aprendizaje y gamificación cuando existan.
15. Eliminar fotografías y archivos asociados cuando Firebase Storage sea implementado.
16. Eliminar el documento `users/{uid}`.
17. Eliminar la cuenta de Firebase Authentication.
18. Crear el recibo técnico mínimo y no identificable aprobado mediante DEL-S2.
19. Sustituir y eliminar la solicitud identificable original.
20. Marcar el procedimiento como `completed` únicamente después de concluir correctamente todas las operaciones.
21. Enviar la confirmación final aprobada mediante LEG-019.
22. Limpiar de forma segura la sesión y los datos locales cuando corresponda.
23. Eliminar automáticamente el recibo DEL-S2 al vencer su período de 30 días.

Reglas obligatorias:

- No se aplicará anonimización a solicitudes, conexiones, conversaciones, mensajes o reportes en la primera versión.
- Un fallo parcial mantendrá el procedimiento en estado `processing`.
- Las operaciones deberán ser idempotentes y admitir reintentos seguros.
- No se eliminarán datos exclusivos de otras cuentas.
- No se establecerá `completed` antes de crear correctamente DEL-S2.
- Un fallo al enviar la confirmación no restaurará la cuenta ni cambiará el estado `completed`.
- El correo utilizado temporalmente para la confirmación no formará parte de DEL-S2.
- La eliminación de Firebase Authentication no deberá ocurrir antes de obtener todas las referencias necesarias y preparar la comunicación final.

## 25. Fallos parciales y reintentos

El procedimiento deberá poder manejar fallos parciales.

Si una operación falla:

- La solicitud no deberá marcarse como completada.
- Se registrará la etapa pendiente.
- Se evitarán duplicaciones dañinas.
- El proceso podrá reintentarse con seguridad.
- No se restaurarán datos ya eliminados sin una razón válida.
- Se notificará al administrador cuando se requiera intervención.

Las operaciones deben diseñarse para ser idempotentes cuando sea posible.

## 26. Confirmación a la persona solicitante

### Tratamiento aprobado mediante LEG-019

LangBridge enviará comunicaciones diferenciadas sobre el procedimiento al correo asociado con la solicitud y validado antes de eliminar la cuenta de Firebase Authentication.

### Canal principal

- El canal principal será el correo electrónico asociado con la solicitud.
- La dirección deberá obtenerse y validarse antes de eliminar Firebase Authentication.
- No se enviará información a una dirección alternativa sin verificarla previamente.
- El correo utilizado para la comunicación no se conservará dentro del recibo técnico DEL-S2.

### Tipos de comunicación

LangBridge podrá enviar comunicaciones distintas para:

- Confirmar la recepción de una solicitud.
- Confirmar una cancelación válida.
- Informar que la cancelación ya no es posible porque se alcanzó el punto técnico de no retorno.
- Confirmar la finalización efectiva de la eliminación.

Cada comunicación deberá reflejar el estado real del procedimiento.

Una solicitud en estado `processing` no recibirá una confirmación que afirme que la cuenta ya fue eliminada.

### Momento de la confirmación final

La confirmación final solamente se enviará cuando:

- Todas las operaciones previstas hayan concluido correctamente.
- La solicitud haya alcanzado el estado `completed`.
- No exista ningún fallo parcial pendiente.
- Se haya creado correctamente el recibo técnico mínimo y no identificable aprobado mediante DEL-S2.

No se enviará una confirmación falsa o anticipada de finalización.

### Contenido permitido

La confirmación final podrá incluir:

- Confirmación general de que la cuenta fue eliminada.
- Fecha efectiva de finalización.
- Categorías generales de datos eliminadas.
- Indicación de que la eliminación es irreversible.
- Explicación de que, si la persona vuelve a LangBridge, comenzará desde cero con una cuenta nueva.
- Información general sobre el recibo técnico DEL-S2.
- Indicación de que el recibo técnico no identifica a la persona.
- Período de conservación de 30 días del recibo técnico.
- Fecha prevista de eliminación del recibo, cuando esté disponible.
- Canal oficial para consultas.
- Número de referencia no identificable, únicamente cuando resulte necesario para soporte.

### Información prohibida

La confirmación no incluirá:

- UID de Firebase Authentication.
- Identificadores de documentos eliminados.
- Identificadores de conversaciones.
- Identificadores de solicitudes de conexión.
- Contenido o fragmentos de mensajes.
- Contenido o descripciones de reportes.
- Nombres o información de otras personas.
- Contraseñas.
- Credenciales.
- Tokens.
- Copias de los datos eliminados.
- Información que permita identificar o reconstruir la cuenta eliminada.

### Confirmación de una cancelación válida

Cuando una solicitud sea cancelada antes del punto técnico de no retorno, la comunicación correspondiente podrá indicar:

- Que la solicitud fue cancelada.
- Que la cuenta continúa activa.
- Que no comenzó ninguna operación irreversible.
- Que la configuración anterior del perfil fue restaurada.
- Que no se creó un recibo técnico DEL-S2.

La comunicación no afirmará que se recuperaron datos, porque una cancelación válida deberá completarse antes de eliminar información de forma irreversible.

### Aviso posterior al punto de no retorno

Si la persona intenta cancelar después de alcanzar el punto técnico de no retorno, LangBridge deberá comunicar de forma general que:

- La cancelación ya no puede completarse.
- Comenzaron operaciones irreversibles.
- No se garantiza la recuperación de información.
- El procedimiento continuará de forma segura hasta finalizar.
- Se enviará una confirmación diferente cuando la eliminación termine.

La comunicación no detallará innecesariamente qué documentos específicos fueron eliminados.

### Correo no disponible o no verificable

Si el correo no está disponible o no puede verificarse:

- No se enviará la confirmación a otra dirección sin verificarla.
- Podrá ofrecerse un canal oficial de consulta.
- Cualquier dirección alternativa deberá verificarse antes de utilizarse.
- La imposibilidad de entregar el mensaje no revertirá una eliminación completada.
- No se conservarán indefinidamente datos personales para continuar intentando entregar la confirmación.

### Fallo de entrega

Si falla el envío después de completar la eliminación:

- La eliminación continuará considerándose completada.
- La cuenta no será restaurada.
- Podrán realizarse reintentos limitados, seguros e idempotentes.
- El recibo técnico podrá registrar únicamente el resultado general del envío.
- El recibo técnico no almacenará nuevamente el correo.
- Los reintentos deberán finalizar al vencer el período autorizado o alcanzar el límite técnico aprobado.
- El fallo de entrega no cambiará el estado `completed`.

### Relación con DEL-S2

- DEL-S2 deberá crearse correctamente antes de emitir la confirmación final.
- El correo no formará parte del recibo técnico.
- La confirmación podrá explicar que el recibo se conservará durante 30 días y después se eliminará.
- La comunicación no permitirá relacionar públicamente el recibo con la identidad eliminada.

### Estado de implementación

- Decisión aprobada mediante LEG-019.
- Servicio de envío de correo pendiente de selección e implementación.
- Plantillas y traducciones pendientes.
- Gestión de reintentos pendiente.
- Canal alternativo pendiente de definición.
- Pruebas automáticas y manuales pendientes.
- Publicación definitiva pendiente de validación técnica y revisión jurídica.

## 27. Cancelación de una solicitud

### Tratamiento aprobado mediante LEG-018

LangBridge permitirá cancelar una solicitud de eliminación después de verificar nuevamente la identidad de la persona, siempre que no haya comenzado ninguna operación irreversible.

### Estados que permiten solicitar la cancelación

- En estado `pending`, la cancelación estará permitida después de verificar nuevamente la identidad.
- En estado `verified`, la cancelación estará permitida si todavía no comenzó ninguna operación irreversible.
- En estado `processing`, la cancelación solo estará permitida si el backend confirma que todavía no se alcanzó el punto técnico de no retorno.
- En estado `completed`, la cancelación no estará permitida.
- Una solicitud en estado `rejected` no requerirá cancelación.
- Una solicitud en estado `cancelled` ya se considerará cancelada.

### Verificación requerida

Antes de completar una cancelación, el procedimiento deberá:

1. Comprobar que la persona continúa autenticada.
2. Verificar nuevamente su identidad mediante una sesión reciente.
3. Obtener el UID exclusivamente desde Firebase Authentication.
4. Consultar el estado real de la solicitud desde un entorno seguro.
5. Confirmar que aún no se ejecutó ninguna operación irreversible.
6. Evitar que el cliente móvil pueda marcar directamente la solicitud como `cancelled`.

### Punto técnico de no retorno

El futuro backend deberá mantener un indicador inequívoco para determinar si la cancelación todavía es posible.

El punto de no retorno se considerará alcanzado cuando comience cualquiera de estas operaciones:

- Eliminación de mensajes.
- Eliminación de conversaciones.
- Eliminación de solicitudes de conexión.
- Eliminación de referencias en listas `blockedUserIds` ajenas.
- Eliminación de reportes.
- Eliminación del documento `users/{uid}`.
- Eliminación de la cuenta de Firebase Authentication.

Después de alcanzar el punto de no retorno:

- La cancelación será rechazada.
- La solicitud permanecerá en estado `processing`.
- No se prometerá recuperar información eliminada.
- El procedimiento continuará de forma idempotente hasta completar las operaciones restantes.
- La persona deberá recibir una explicación clara de que la eliminación ya no puede detenerse.

### Efectos de una cancelación válida

Cuando la solicitud se cancele antes del punto de no retorno:

- La solicitud pasará al estado `cancelled`.
- La cuenta continuará activa.
- No se eliminarán los datos asociados con la cuenta.
- Se retirará `deletionRequested`.
- Se limpiará `deletionRequestedAt`.
- Se restaurará la configuración de visibilidad existente antes de enviar la solicitud.
- La persona podrá continuar utilizando LangBridge.
- No se creará el recibo técnico aprobado mediante DEL-S2.

### Restauración de la configuración anterior

El procedimiento no establecerá automáticamente `isProfileVisible: true`, porque el perfil podría haber estado oculto voluntariamente antes de solicitar la eliminación.

Antes de ocultar el perfil por una solicitud, LangBridge deberá conservar temporalmente solo el valor necesario para restaurar la configuración anterior en caso de cancelación.

Este valor temporal:

- No se utilizará para otras finalidades.
- Se eliminará cuando deje de ser necesario.
- No se conservará en el recibo técnico DEL-S2.

### Conservación de una solicitud cancelada

Mientras la cuenta continúe existiendo, la solicitud cancelada podrá conservar temporalmente:

- Estado `cancelled`.
- Fecha de cancelación.
- Versión del procedimiento.
- Método general de verificación.
- Razón técnica general, cuando corresponda.

No se añadirá información personal innecesaria.

El período definitivo de conservación de una solicitud cancelada continúa pendiente de aprobación y deberá definirse antes de publicar la política definitiva.

### Relación con DEL-S2

- DEL-S2 se aplicará únicamente después de completar efectivamente una eliminación.
- Una solicitud cancelada no generará un recibo técnico DEL-S2.
- El período de 30 días de DEL-S2 no comenzará para una solicitud cancelada.

### Estado de implementación

- Decisión aprobada mediante LEG-018.
- Implementación técnica pendiente.
- Indicador del punto de no retorno pendiente.
- Pruebas automáticas y manuales pendientes.
- Textos visibles y traducciones de cancelación pendientes.
- Publicación definitiva pendiente de validación técnica y revisión jurídica.

## 28. Eliminación iniciada fuera de la aplicación

La página web pública deberá permitir iniciar una solicitud sin instalar o abrir LangBridge.

El procedimiento deberá:

- Solicitar la información mínima.
- Explicar qué se eliminará.
- Explicar cualquier retención aplicable.
- Permitir verificar la identidad.
- Proteger el formulario contra abuso.
- Evitar publicar correos, UID u otros datos.
- Confirmar la recepción.
- Ofrecer un medio de seguimiento razonable.

La URL deberá ser pública, estable y accesible para Google Play.

## 29. Roles y responsabilidades

Antes de publicar deberán definirse:

### Responsable de privacidad

- Recibe consultas.
- Revisa solicitudes.
- Mantiene la documentación.
- Coordina actualizaciones.

### Responsable técnico

- Mantiene el procedimiento de eliminación.
- Revisa fallos.
- Protege credenciales administrativas.
- Verifica Firebase Authentication, Firestore y Storage.

### Responsable de moderación

- Clasifica reportes.
- Define retenciones de seguridad.
- Autoriza cierres de investigaciones.
- Evita accesos no autorizados.

Una misma persona podrá desempeñar varios roles durante la etapa inicial, pero las funciones deberán estar documentadas.

## 30. Pruebas obligatorias

Antes de activar la eliminación efectiva deberán probarse como mínimo:

- Solicitud creada por la cuenta correcta.
- Otra cuenta no puede leer la solicitud.
- Otra cuenta no puede modificarla.
- El cliente no puede marcarla como completada.
- El perfil queda oculto.
- Las solicitudes pendientes se procesan.
- Las referencias de bloqueo se limpian.
- Las conversaciones siguen el criterio aprobado.
- Los mensajes siguen el criterio aprobado.
- Los reportes siguen su política de retención.
- Las fotografías se eliminan.
- Los datos de aprendizaje se eliminan.
- El documento de usuario se elimina.
- Firebase Authentication se elimina.
- Los reintentos no dañan datos ajenos.
- Un fallo parcial no produce un estado falso de finalización.
- La confirmación no expone información sensible.

No se debe probar la eliminación inicial con una cuenta real que contenga información importante.

## 31. Revisión periódica

Esta Política deberá revisarse:

- Antes de cada publicación importante.
- Cuando se añada una colección.
- Cuando se añada Firebase Storage.
- Cuando se incorpore aprendizaje gamificado.
- Cuando se añada analítica o diagnóstico.
- Cuando cambie el proveedor.
- Cuando cambien las obligaciones legales.
- Cuando Google Play modifique sus requisitos.
- Después de un incidente.
- Cuando una prueba detecte datos huérfanos.

## 32. Información pendiente

Esta Política todavía no está lista para aprobarse o publicarse como documento definitivo.

### Decisiones ya aprobadas

Las siguientes decisiones ya no están pendientes:

- DEL-A: eliminación del perfil, solicitudes de conexión, conversaciones, mensajes y referencias relacionadas en listas de bloqueo.
- DEL-R1: eliminación de todos los reportes enviados por la cuenta en el modelo actual.
- DEL-S2: sustitución de la solicitud identificable por un recibo técnico mínimo y no identificable.
- Conservación del recibo técnico DEL-S2 durante 30 días desde la finalización efectiva.
- LEG-009: objetivo operativo de 7 días calendario y plazo máximo informado de 30 días calendario.
- LEG-017: tratamiento de copias de seguridad aprobado para el modelo actual.
- LEG-018: cancelación permitida después de verificar nuevamente la identidad y antes del punto técnico de no retorno.
- LEG-019: comunicaciones diferenciadas mediante el correo asociado y validado.

### Decisiones que continúan pendientes

Todavía deben definirse o aprobarse:

- Edad mínima y público objetivo.
- Períodos de conservación de las cuentas inactivas.
- Conservación sin respuesta de las solicitudes de conexión.
- Períodos aplicables a conversaciones y mensajes mientras la cuenta permanezca activa.
- Retención de reportes técnicos y de seguridad después de su resolución.
- Período de conservación de las solicitudes de eliminación canceladas.
- Tratamiento técnico de fotografías sustituidas cuando Firebase Storage sea implementado.
- Cualquier excepción legal específica de conservación.
- Canal alternativo cuando el correo asociado no esté disponible o no pueda verificarse.
- Procedimiento de moderación.
- Revisión jurídica final.

### Información institucional y pública pendiente

Antes de la publicación definitiva deberán completarse o verificarse:

- Correo oficial de privacidad.
- Correo oficial de soporte.
- URL pública de eliminación.
- Datos de contacto.
- Fecha de entrada en vigor.
- Versión definitiva de las políticas.
- Coherencia con la información declarada en Google Play.

### Implementación técnica pendiente

Todavía debe implementarse y verificarse:

- Reautenticación o verificación segura de identidad.
- Procesamiento seguro de `accountDeletionRequests`.
- Entorno servidor o administrativo autorizado.
- Eliminación efectiva de Firebase Authentication.
- Eliminación efectiva de los datos relacionados en Cloud Firestore.
- Eliminación futura de fotografías en Firebase Storage.
- Eliminación futura de datos de aprendizaje y gamificación.
- Creación y expiración automática del recibo técnico DEL-S2.
- Cancelación segura antes del punto técnico de no retorno.
- Restauración de la configuración anterior del perfil después de una cancelación válida.
- Envío de las comunicaciones aprobadas mediante LEG-019.
- Gestión limitada y segura de reintentos.
- Prevención de la reaparición de datos eliminados después de una futura restauración.

### Verificaciones y pruebas pendientes

Antes de declarar completo el bloque deberán realizarse:

- Verificación externa de respaldos en Firebase Console y Google Cloud Console.
- Pruebas automáticas mediante Firebase Emulator Suite.
- Pruebas manuales con cuentas y datos simulados.
- Pruebas de reautenticación.
- Pruebas de eliminación integral.
- Pruebas de fallos parciales y reintentos idempotentes.
- Pruebas del punto técnico de no retorno.
- Pruebas de cancelación en `pending`, `verified` y `processing`.
- Pruebas de creación y expiración del recibo DEL-S2.
- Pruebas de envío y fallo de las comunicaciones de LEG-019.
- Pruebas que comprueben que no se eliminan datos exclusivos de otras cuentas.
- Pruebas que comprueben que una restauración futura no reactive datos eliminados.
- Revisión de coherencia entre la aplicación, las políticas públicas y Google Play.

## 33. Condiciones para declarar el bloque completado

La retención y eliminación de datos solo podrá considerarse al 100 % cuando:

- Los períodos estén aprobados.
- La Política de privacidad coincida con esta Política.
- La ruta interna funcione.
- La página web pública funcione.
- La identidad pueda verificarse.
- Authentication pueda eliminarse.
- Firestore pueda limpiarse.
- Storage pueda limpiarse.
- Los mensajes tengan un tratamiento aprobado.
- Los reportes tengan un tratamiento aprobado.
- Existan pruebas automáticas.
- Existan pruebas manuales.
- No queden datos huérfanos.
- Google Play reciba información coherente.
- La revisión jurídica final haya concluido.