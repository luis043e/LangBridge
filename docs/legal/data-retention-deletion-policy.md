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

- `pending`: solicitud recibida y pendiente de revisión.
- `verified`: identidad o control de la cuenta verificado.
- `processing`: eliminación o anonimización en proceso.
- `completed`: proceso principal completado.
- `rejected`: solicitud rechazada por no poder verificarse o por otra razón documentada.
- `cancelled`: solicitud cancelada de manera válida antes de ejecutarse.
- `partially_retained`: eliminación completada, con conservación limitada de información expresamente justificada.

Estos estados deberán ser administrados desde un entorno seguro. El cliente móvil no debe poder marcar directamente una solicitud como completada.

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
- La eliminación o anonimización de conversaciones.
- La eliminación o anonimización de mensajes.
- La limpieza de listas de bloqueo.
- La eliminación o retención controlada de reportes.
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

Tratamiento previsto al eliminar una cuenta:

- Eliminar las solicitudes pendientes enviadas por la cuenta.
- Eliminar las solicitudes pendientes recibidas por la cuenta.
- Evaluar las solicitudes aceptadas que funcionen como relación histórica.
- Eliminar nombres personales que ya no sean necesarios.
- Evitar que otra cuenta pueda aceptar o responder una solicitud perteneciente a una cuenta eliminada.

Criterio inicial recomendado:

- Solicitudes pendientes: eliminación.
- Solicitudes rechazadas o canceladas: eliminación después del período operativo aprobado.
- Relaciones aceptadas: eliminación o sustitución por una referencia anonimizada si resulta necesaria para conservar la integridad de una conversación.

El criterio final deberá probarse técnicamente antes de aprobarlo.

## 13. Conversaciones

Colección:

- `conversations`

Datos principales:

- Identificador de conexión.
- Identificadores de participantes.
- Fechas.

La eliminación de una cuenta puede afectar a otra persona que participa en la conversación.

Antes de implementar la eliminación se deberá decidir entre:

- Eliminar por completo la conversación.
- Conservar la conversación para la otra persona y anonimizar a la cuenta eliminada.
- Conservar temporalmente una conversación asociada con un reporte de seguridad.

Criterio recomendado para evaluación:

- Si no existen mensajes ni reportes, eliminar la conversación.
- Si existen mensajes y la conversación debe permanecer visible para la otra persona, sustituir la identidad eliminada por una referencia neutral.
- Si existe un reporte activo, conservar una copia administrativa limitada durante el período aprobado.
- Eliminar identificadores personales que no sean necesarios.

La solución final no deberá permitir que la cuenta eliminada recupere acceso.

## 14. Mensajes

Subcolección:

- `conversations/{conversationId}/messages`

Datos almacenados:

- UID del remitente.
- Texto.
- Fecha de creación.
- Fecha de lectura.

La decisión definitiva sobre mensajes está pendiente.

Las opciones evaluadas son:

### Eliminación completa

Ventajas:

- Reduce la información conservada.
- Facilita el cumplimiento de la solicitud.

Riesgos:

- Elimina parte del historial perteneciente también a la otra persona.
- Puede afectar investigaciones de seguridad o reportes activos.

### Anonimización

Tratamiento posible:

- Sustituir el UID del remitente.
- Eliminar el vínculo con el perfil.
- Mostrar una etiqueta neutral como `Usuario eliminado`.
- Conservar el texto únicamente cuando sea necesario para la continuidad de la conversación.

### Conservación temporal por seguridad

Podrá aplicarse cuando:

- Exista un reporte activo.
- Sea necesario investigar abuso, fraude o amenazas.
- Exista una disputa pendiente.
- Una obligación aplicable requiera conservación limitada.

Decisión pendiente:

- Aprobar la opción principal.
- Definir el período de conservación.
- Diseñar la estructura de anonimización.
- Crear pruebas automáticas.
- Explicarlo en la Política de privacidad y los Términos.

## 15. Usuarios bloqueados

Los UID bloqueados pueden encontrarse en `blockedUserIds` dentro de documentos de otras personas.

Al eliminar una cuenta deberá:

- Eliminarse la lista de bloqueos del perfil eliminado.
- Buscarse y eliminarse el UID eliminado de las listas de otras personas, cuando sea técnicamente razonable.
- Evitar que una referencia huérfana produzca errores.
- Mantener, si fuera necesario, una protección administrativa separada contra cuentas abusivas reincidentes.

Una lista administrativa de seguridad no debe reutilizar la lista ordinaria de bloqueos del perfil.

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

Los reportes pueden contener información necesaria para soporte o seguridad.

Tratamiento recomendado:

### Reportes técnicos ordinarios

- Eliminar o anonimizar después de resolverlos y cumplir el período operativo aprobado.
- Eliminar correos y UID cuando ya no sean necesarios.
- Conservar información técnica no identificable solamente si aporta valor legítimo.

### Reportes de abuso o seguridad

- Conservar durante un período limitado aprobado.
- Restringir el acceso al personal autorizado.
- Mantener solamente los datos necesarios.
- Documentar la razón de conservación.
- Eliminar o anonimizar cuando finalice la necesidad.

### Reportes pendientes al eliminar una cuenta

- No eliminarlos automáticamente si la eliminación impide investigar un riesgo para otras personas.
- Eliminar o anonimizar información que no sea necesaria.
- Marcar internamente la relación con una cuenta eliminada.
- Informar en la Política pública que determinados registros de seguridad pueden conservarse temporalmente.

## 17. Solicitudes de eliminación

Colección:

- `accountDeletionRequests`

La solicitud original contiene:

- UID.
- Correo.
- Estado.
- Fechas.

Después de completar la eliminación, LangBridge deberá evitar conservar indefinidamente el UID y el correo completos.

Registro mínimo recomendado:

- Identificador interno no reutilizable.
- Fecha de recepción.
- Fecha de finalización.
- Resultado general.
- Categoría de datos retenidos, si existe.
- Fecha prevista para eliminar cualquier retención.
- Motivo general de retención.

El correo y el UID deberán eliminarse, transformarse o limitarse una vez que dejen de ser necesarios para demostrar que la solicitud fue atendida.

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

- Inicio del procesamiento: [PENDIENTE].
- Plazo operativo objetivo: [PENDIENTE].
- Plazo máximo informado: [PENDIENTE].

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

### Registro mínimo de eliminación

- Conservación: [PENDIENTE].

### Fotografías sustituidas

- Eliminación técnica: [PENDIENTE].

### Copias de seguridad administradas por proveedores

- Tratamiento y ciclo de eliminación: [PENDIENTE].

Ningún plazo deberá publicarse hasta comprobar que puede cumplirse técnicamente.

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

Antes de publicar se deberá confirmar:

- Si Firebase o cualquier proveedor mantiene copias de seguridad.
- El período de rotación.
- Si es posible eliminar registros individuales inmediatamente.
- Cuándo desaparecen los datos de las copias.
- Qué medidas impiden restaurar permanentemente una cuenta eliminada.

Si la eliminación de copias no puede ser inmediata, la Política pública deberá explicar que los datos pueden permanecer temporalmente en copias protegidas hasta completar el ciclo normal de eliminación.

## 24. Proceso técnico recomendado

La eliminación efectiva deberá ejecutarse desde un entorno seguro.

Orden preliminar recomendado:

- Verificar la solicitud.
- Marcar la cuenta como en procesamiento.
- Impedir nuevas interacciones.
- Obtener las referencias necesarias.
- Eliminar o anonimizar solicitudes de conexión.
- Eliminar o anonimizar conversaciones y mensajes.
- Limpiar referencias de bloqueo.
- Procesar reportes según su categoría.
- Eliminar futuros datos de aprendizaje.
- Eliminar fotografías y archivos asociados.
- Eliminar el documento de usuario.
- Eliminar o reducir el registro de solicitud.
- Eliminar Firebase Authentication.
- Registrar el resultado mínimo.
- Confirmar la finalización.

El orden definitivo deberá evitar que la eliminación temprana de Authentication impida identificar o limpiar los datos asociados.

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

Cuando el proceso finalice, LangBridge deberá proporcionar una confirmación mediante un canal seguro.

La confirmación podrá indicar:

- Que la cuenta fue eliminada.
- La fecha de finalización.
- Si alguna categoría limitada se conserva temporalmente.
- La razón general de la conservación.
- El período o criterio aplicable.
- Cómo contactar a LangBridge si existe una duda.

La confirmación no debe exponer información sensible.

## 27. Cancelación de una solicitud

La posibilidad de cancelar una solicitud deberá definirse antes de publicar.

Si se permite cancelar:

- Solo será posible antes de iniciar la eliminación irreversible.
- La identidad deberá verificarse.
- La cancelación deberá registrarse.
- El perfil podrá restaurarse solamente si los datos todavía existen.
- No se prometerá recuperar información ya eliminada.

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

Antes de aprobar esta Política se debe definir:

- Edad mínima y público objetivo.
- Períodos exactos de conservación.
- Tratamiento definitivo de mensajes.
- Tratamiento definitivo de conversaciones.
- Retención de reportes técnicos.
- Retención de reportes de seguridad.
- Conservación del registro mínimo de eliminación.
- Tratamiento de copias de seguridad.
- Posibilidad de cancelar una solicitud.
- Correo oficial de privacidad.
- Correo oficial de soporte.
- URL pública de eliminación.
- Procedimiento administrativo.
- Entorno servidor o administrativo.
- Método de confirmación.
- Revisión jurídica final.

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