# Registro maestro de decisiones legales de LangBridge

## Control del documento

- Producto: LangBridge
- Responsable del documento: Luis Enrique Nuñez Minaya
- Tipo de documento: Registro interno de decisiones legales, técnicas y operativas
- Estado: En desarrollo
- Versión: 0.1
- Fecha de preparación: 9 de septiembre de 2026
- Última actualización: 9 de septiembre de 2026
- Rama de trabajo: feat/account-deletion-compliance
- Commit base del registro: a6a4764

> Una decisión no debe incorporarse a los documentos públicos hasta que esté aprobada y LangBridge pueda cumplirla técnica y operativamente.

## 1. Propósito

Este registro centraliza las decisiones legales pendientes para:

- Evitar contradicciones entre documentos.
- Relacionar decisiones con funciones técnicas.
- Registrar alternativas y valores aprobados.
- Controlar implementación, validación y publicación.
- Mantener coherencia con Google Play.

## 2. Estados permitidos

- `Pendiente`
- `En análisis`
- `Propuesta`
- `Aprobada`
- `En implementación`
- `Implementada`
- `Validada`
- `Publicable`
- `Bloqueada`
- `Descartada`

## 3. Regla de aprobación

Una decisión solamente será publicable cuando:

- Esté documentada y aprobada.
- Sea coherente con el funcionamiento real.
- Pueda cumplirse técnicamente.
- Se hayan actualizado los documentos afectados.
- Se hayan completado las pruebas necesarias.
- No contradiga otras decisiones.
- Haya recibido revisión jurídica cuando corresponda.

## 4. Documentos afectados

- `docs/legal/account-deletion-policy.md`
- `docs/legal/community-guidelines.md`
- `docs/legal/data-inventory.md`
- `docs/legal/data-retention-deletion-policy.md`
- `docs/legal/google-play-data-safety.md`
- `docs/legal/privacy-policy.md`
- `docs/legal/terms-of-service.md`

## 5. Decisión LEG-001: nombre legal o comercial

### Estado

- Aprobada.

### Decisión

LangBridge operará inicialmente bajo el nombre personal completo de su responsable, debido a que actualmente no posee una empresa constituida ni un nombre comercial registrado.

### Nombre aprobado

- Luis Enrique Nuñez Minaya

### Alcance

Este nombre se utilizará para identificar públicamente al responsable inicial de LangBridge en:

- Política de privacidad.
- Términos y condiciones.
- Política pública de eliminación de cuenta.
- Información de soporte y privacidad.
- Sitio web oficial.
- Información aplicable de Google Play.

### Condición de revisión

Esta decisión deberá revisarse si LangBridge registra posteriormente un nombre comercial, constituye una empresa o transfiere formalmente la responsabilidad del servicio a otra entidad.

### Estado de implementación

- Pendiente de incorporar en los documentos públicos.

## 6. Decisión LEG-002: país y medio oficial de contacto

### Estado

- Aprobada.

### Decisión

LangBridge utilizará República Dominicana como país de operación principal y ofrecerá contacto público mediante canales electrónicos oficiales.

### Valores aprobados

- País: República Dominicana.
- Medio oficial: correo electrónico y futuro sitio web de LangBridge.
- Dirección residencial: no se publicará.
- Dirección comercial: no disponible actualmente.

### Justificación

La publicación de un domicilio residencial no resulta necesaria en esta etapa y podría crear riesgos de privacidad y seguridad para el responsable.

### Condición de revisión

Esta decisión deberá revisarse si LangBridge establece una oficina, dirección comercial, apartado postal o entidad legal que requiera publicar una dirección diferente.

### Estado de implementación

- Pendiente de incorporar en los documentos públicos.

## 7. Decisión LEG-003: correo oficial de soporte

### Estado

- Aprobada provisionalmente.

### Correo aprobado

- bridgelang00@gmail.com

### Finalidades

Este correo se utilizará provisionalmente para:

- Consultas de funcionamiento.
- Problemas de acceso.
- Soporte de cuentas.
- Reportes generales.
- Comunicaciones relacionadas con eliminación.
- Consultas sobre LangBridge.

### Requisitos operativos

- Activar autenticación multifactor.
- Mantener métodos seguros de recuperación.
- Revisar el correo regularmente.
- No compartir la contraseña.
- No utilizarlo para almacenar credenciales administrativas.
- Evitar enviar información personal innecesaria.
- Mantener un registro controlado de solicitudes importantes.

### Condición de revisión

El correo deberá evaluarse nuevamente cuando LangBridge disponga de un dominio oficial. En ese momento podrá sustituirse por una dirección profesional dedicada al soporte.

### Estado de implementación

- Pendiente de incorporar en los documentos públicos.

## 8. Decisión LEG-004: correo oficial de privacidad

### Estado

- Aprobada provisionalmente.

### Correo aprobado

- bridgelang00@gmail.com

### Finalidades

Este correo se utilizará provisionalmente para:

- Consultas sobre información personal.
- Solicitudes de acceso.
- Solicitudes de corrección.
- Solicitudes de eliminación.
- Consultas sobre retención.
- Comunicaciones relacionadas con privacidad.
- Seguimiento de solicitudes verificadas.

### Separación futura

Actualmente el mismo correo se utilizará para soporte y privacidad debido a la etapa inicial de LangBridge.

Cuando exista un dominio oficial y capacidad operativa suficiente, se recomienda separar ambos canales.

### Requisitos operativos

- Activar autenticación multifactor.
- Restringir el acceso.
- Evitar reenviar datos personales innecesariamente.
- Verificar la identidad antes de procesar solicitudes sensibles.
- No solicitar contraseñas.
- Mantener control de solicitudes y respuestas.
- Eliminar correos o adjuntos cuando dejen de ser necesarios, conforme a la política de retención.

### Condición de revisión

El correo deberá revisarse cuando LangBridge implemente su sitio web o adopte un dominio oficial.

### Estado de implementación

- Pendiente de incorporar en los documentos públicos.

## 9. Decisión LEG-005: sitio web oficial

### Estado

- Aprobada provisionalmente.

### Decisión

LangBridge utilizará inicialmente Firebase Hosting dentro del proyecto `langbridge-d048f` para publicar su sitio web oficial y la documentación legal accesible al público.

### URL base aprobada

- https://langbridge-d048f.web.app

### Plataforma

- Firebase Hosting.
- Proyecto: `langbridge-d048f`.
- Salida web: `dist`.
- Generación web: exportación estática mediante Expo Router.

### Contenido previsto

El sitio deberá publicar:

- Política de privacidad.
- Términos y condiciones.
- Normas de la comunidad.
- Página de eliminación de cuenta y datos.
- Información de soporte.
- Datos de contacto.
- Fecha y versión de los documentos.

### Requisitos

- Acceso sin iniciar sesión.
- Conexión HTTPS.
- Compatibilidad con teléfonos.
- Rutas estables.
- Navegación clara.
- Documentos coherentes con la aplicación.
- Pruebas antes del despliegue.
- Posibilidad de incorporar un dominio personalizado en el futuro.

### Condición de revisión

La URL podrá sustituirse o complementarse con un dominio personalizado cuando LangBridge registre y configure un dominio oficial.

### Estado de implementación

- Sitio de Firebase Hosting disponible.
- Páginas legales pendientes de creación.
- Configuración de Hosting en `firebase.json` pendiente.
- Exportación web pendiente.
- Despliegue pendiente.


## 10. Decisión LEG-006: URL pública de eliminación

### Estado

- Aprobada provisionalmente.

### URL prevista

- https://langbridge-d048f.web.app/account-deletion

### Finalidad

Esta página permitirá que una persona consulte el procedimiento y solicite la eliminación de su cuenta y de los datos asociados sin necesidad de instalar o abrir LangBridge.

### Requisitos

- Ser pública.
- Estar disponible sin iniciar sesión.
- Identificar claramente a LangBridge.
- Explicar qué datos se eliminan.
- Explicar cualquier retención limitada.
- No solicitar contraseñas.
- Permitir verificación segura.
- Ofrecer el correo `bridgelang00@gmail.com` como contacto provisional.
- Ser compatible con los requisitos de Google Play.
- Mantener coherencia con la ruta interna de eliminación.

### Dependencias

- Crear la página `/account-deletion`.
- Definir el procedimiento de verificación.
- Implementar la eliminación efectiva.
- Definir el plazo de procesamiento.
- Definir el tratamiento de mensajes y reportes.
- Configurar Firebase Hosting.
- Exportar y probar el sitio.
- Realizar el despliegue.
- Confirmar que la URL responde públicamente.

### Condición de revisión

La URL podrá migrarse a un dominio personalizado manteniendo una redirección o una ruta pública estable.

### Estado de implementación

- Ruta documental definida.
- Página web pendiente de creación.
- Formulario o mecanismo de solicitud pendiente.
- Despliegue pendiente.
- Validación pública pendiente.

## 11. Decisión LEG-007: edad mínima

### Estado

- En análisis.

### Riesgos

- Perfiles visibles.
- Fotografías y biografías.
- Comunicación directa.
- Contacto entre distintas ubicaciones.
- Contenido generado por usuarios.
- Moderación y reportes.
- Verificación de edad.

### Alternativas

- Solo personas adultas.
- Edad mínima general con restricciones.
- Experiencia diferenciada por edades.
- Exclusión temporal de menores.

### Recomendación preliminar

Evaluar limitar la primera publicación a personas adultas hasta contar con controles especializados de protección de menores.

### Decisión aprobada

- [PENDIENTE]

### Implementación necesaria

- Confirmación de edad.
- Restricción de registro.
- Aceptación de Términos.
- Configuración en Play Console.
- Traducciones y pruebas.

## 12. Decisión LEG-008: público objetivo en Google Play

### Estado

- Bloqueada por LEG-007.

### Regla

El público seleccionado deberá coincidir con:

- La edad mínima.
- Las funciones sociales.
- Los controles de seguridad.
- La moderación.
- La clasificación de contenido.
- Los Términos y la Política de privacidad.

### Valor aprobado

- [PENDIENTE]

## 13. Decisión LEG-009: plazo de eliminación

### Estado

- Aprobada.

### Decisión aprobada

- El procesamiento comenzará después de verificar la identidad de la persona y confirmar una sesión reciente.
- LangBridge intentará completar la eliminación tan pronto como sea técnicamente posible.
- El plazo operativo objetivo será de 7 días calendario desde la verificación de identidad.
- El plazo máximo informado será de 30 días calendario desde la verificación de identidad.
- El objetivo de 7 días no impedirá que la eliminación se complete antes cuando todos los servicios estén disponibles.
- El plazo máximo permitirá gestionar fallos temporales, verificaciones y reintentos seguros.
- La eliminación no se marcará como `completed` hasta que hayan concluido todas las operaciones previstas.

### Fallos parciales y reintentos

Si alguna operación falla:

- La solicitud permanecerá en estado `processing`.
- No se mostrará una confirmación falsa de finalización.
- El procedimiento registrará de forma limitada la etapa pendiente.
- Se permitirán reintentos idempotentes.
- No se repetirán de manera perjudicial las operaciones ya completadas.
- No se eliminarán datos exclusivos de otras cuentas.
- La solicitud solo pasará a `completed` después de completar correctamente todas las operaciones.

### Relación con DEL-S2

- El período de conservación del recibo técnico DEL-S2 no comenzará cuando se envíe la solicitud.
- El período de 30 días de DEL-S2 comenzará desde la fecha efectiva de finalización del procedimiento.
- El recibo técnico se eliminará cuando venza su propia fecha de expiración.
- El plazo máximo de procesamiento y el plazo de conservación del recibo técnico son períodos separados.

### Condiciones de publicación

- Los plazos no deberán publicarse como definitivos hasta comprobar que pueden cumplirse técnicamente.
- La implementación deberá probarse con Firebase Emulator Suite y datos simulados.
- La política definitiva permanecerá sujeta a revisión jurídica.
- Cualquier cambio en la capacidad técnica o en los requisitos aplicables deberá motivar una revisión de esta decisión.

### Estado de implementación

- Decisión aprobada.
- Implementación técnica pendiente.
- Pruebas automáticas y manuales pendientes.
- Publicación definitiva pendiente de validación técnica y revisión jurídica.

## 14. Decisión LEG-010: tratamiento de conversaciones

### Estado

- Aprobada.

### Alternativas

- Eliminar la conversación completa.
- Conservarla para la otra persona y anonimizar la cuenta eliminada.
- Eliminar conversaciones sin mensajes.
- Conservar temporalmente conversaciones asociadas con reportes.

### Recomendación preliminar

- Conversación sin mensajes: eliminar.
- Conversación con mensajes: evaluar conservación con identidad anonimizada.
- Conversación con reporte activo: conservar evidencia administrativa limitada.
- Revocar todo acceso de la cuenta eliminada.

### Decisión aprobada

- Se adopta DEL-A: al eliminar una cuenta, se eliminarán permanentemente todas las conversaciones en las que participe.
- Antes de eliminar cada conversación, se eliminarán todos los mensajes almacenados en su subcolección.
- La eliminación también afectará el historial compartido disponible para las demás personas participantes.
- La eliminación será irreversible y, si la persona vuelve a LangBridge, comenzará desde cero.
- Esta decisión reduce datos almacenados y evita referencias asociadas con cuentas eliminadas.

## 15. Decisión LEG-011: tratamiento de mensajes

### Estado

- Aprobada.

### Alternativas

- Eliminación completa.
- Anonimización del remitente.
- Conservación para el otro participante.
- Conservación temporal por seguridad.
- Tratamiento combinado según el contexto.

### Recomendación preliminar

- Sustituir el UID por una referencia neutral cuando el mensaje deba permanecer.
- Conservar evidencia separada y limitada para reportes activos.
- Eliminar mensajes cuando no exista necesidad funcional o de seguridad.

### Decisión aprobada

- Se adopta DEL-A: se eliminarán permanentemente todos los mensajes de las conversaciones relacionadas con la cuenta eliminada.
- Se eliminarán los mensajes enviados por la cuenta eliminada y los enviados por las demás personas dentro de esas conversaciones.
- No se conservarán el texto, el UID del remitente, la fecha de creación ni la fecha de lectura.
- No se aplicará anonimización en la primera versión del procedimiento.
- Los mensajes se eliminarán antes de eliminar el documento principal de la conversación.

## 16. Decisión LEG-012: solicitudes de conexión

### Estado

- Aprobada.

### Propuesta

- Eliminar solicitudes pendientes enviadas.
- Eliminar solicitudes pendientes recibidas.
- Eliminar solicitudes rechazadas o canceladas según el período aprobado.
- Transformar o eliminar solicitudes aceptadas cuando exista conversación.
- Eliminar nombres personales innecesarios.

### Decisión aprobada

- Al eliminar una cuenta, se eliminarán todas las solicitudes de conexión donde la cuenta aparezca como senderId o recipientId.
- Se eliminarán las solicitudes con estado pending, accepted o rejected.
- Se eliminarán los nombres, UID, estados y fechas almacenados dentro de esos documentos.
- Las conversaciones relacionadas se procesarán y eliminarán antes de eliminar las solicitudes aceptadas que les dieron origen.
- Si la persona vuelve a LangBridge, no recuperará solicitudes ni conexiones anteriores.
- Esta decisión forma parte de DEL-A.

## 17. Decisión LEG-013: listas de bloqueo

### Estado

- Aprobada.

### Propuesta

- Eliminar la lista personal del perfil eliminado.
- Limpiar su UID de listas de otras personas.
- Evitar referencias huérfanas.
- Conservar separadamente una referencia mínima cuando exista una medida administrativa justificada.

### Decisión aprobada

- La lista blockedUserIds almacenada en el perfil eliminado desaparecerá al eliminar el documento users/{uid}.
- El UID de la cuenta eliminada se retirará de las listas blockedUserIds de las demás cuentas.
- No se conservará una referencia ordinaria de bloqueo vinculada con la cuenta eliminada.
- La limpieza deberá evitar referencias huérfanas y deberá poder repetirse sin afectar otros bloqueos.
- Si la persona vuelve a LangBridge con una cuenta nueva, comenzará sin su lista anterior de bloqueos.
- Esta decisión forma parte de DEL-A.

## 18. Decisión LEG-014: reportes técnicos

### Estado

- Aprobada.

### Propuesta

- Resolver el reporte.
- Eliminar o anonimizar UID y correo cuando dejen de ser necesarios.
- Conservar solamente información técnica no identificable que resulte útil.
- Eliminar descripciones con datos personales innecesarios.
- Aplicar revisión periódica.

### Decisión aprobada

- Se adopta DEL-R1: al eliminar una cuenta, se eliminarán todos los reportes enviados por esa cuenta.
- La eliminación incluirá el UID, correo electrónico, categoría, descripción, estado y fechas del reporte.
- No se conservará una copia anonimizada de esos reportes en la primera versión del procedimiento.
- Los reportes se localizarán mediante el campo reporterId antes de eliminar el perfil y la cuenta de Authentication.
- Si la persona vuelve a LangBridge, no recuperará los reportes anteriores.
- Esta decisión reduce datos almacenados y mantiene coherencia con DEL-A.

## 19. Decisión LEG-015: reportes de seguridad

### Estado

- Aprobada para el modelo actual.

### Criterios

- Gravedad.
- Estado de la investigación.
- Riesgo para otras personas.
- Reincidencia.
- Posibilidad de revisión.
- Obligación legal.
- Minimización.
- Acceso restringido.

### Decisión aprobada

- El modelo actual de reportes no almacena reportedUserId ni reportedMessageId.
- Los reportes actuales identifican solamente a la cuenta que los envía mediante reporterId y reporterEmail.
- En esta primera versión, esos reportes también se eliminarán al eliminar la cuenta que los envió.
- No se aplicará una retención especial de reportes de seguridad en el modelo actual.
- Si LangBridge incorpora denuncias específicas contra usuarios o mensajes, esta decisión deberá revisarse antes de activar esa función.
- La decisión vigente corresponde a DEL-R1.

### Regla

No se utilizará una retención de seguridad para conservar indefinidamente el perfil completo.

## 20. Decisión LEG-016: registro mínimo de eliminación

### Estado

- Aprobada.

### Decisión aprobada

- Se adopta DEL-S2.
- Después de completar la eliminación de una cuenta, la solicitud identificable original será eliminada y sustituida por un recibo técnico mínimo y no identificable.
- El recibo técnico se conservará durante 30 días contados desde la fecha de finalización del procedimiento.
- Al vencer el período de 30 días, el recibo técnico deberá eliminarse.
- El recibo no se utilizará para reconstruir la identidad de la cuenta ni para recuperar los datos eliminados.
- La conservación temporal tendrá como finalidad comprobar la finalización general del procedimiento, facilitar la revisión de fallos técnicos y permitir reintentos seguros cuando correspondan.
- Esta decisión deberá implementarse mediante un proceso que pueda repetirse sin duplicar recibos ni afectar datos ajenos.

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

### Período aprobado

- 30 días desde la fecha de finalización del procedimiento.
- Eliminación del recibo técnico al vencer su fecha de expiración.

### Estado de implementación

- Pendiente de implementación técnica.
- Pendiente de pruebas con Firebase Emulator Suite y datos simulados.
- Pendiente de incorporación coherente en las políticas internas y públicas correspondientes.
- No se considerará publicable hasta que el proceso de creación y expiración del recibo haya sido implementado y probado.

## 21. Decisión LEG-017: copias de seguridad

### Estado

- Aprobada para el modelo actual.

### Resultado de la auditoría actual

La configuración y el repositorio actuales de LangBridge no contienen mecanismos propios de respaldo o restauración de Cloud Firestore.

En particular:

- No existen copias programadas configuradas desde el repositorio.
- No existen exportaciones automáticas configuradas.
- No existen scripts propios de importación o restauración.
- `firebase.json` solamente configura las reglas, los índices de Cloud Firestore y Firebase Hosting.
- `package.json` no contiene comandos de respaldo, exportación, importación o restauración.
- No se identificaron comandos `gcloud` ni usos de `exportDocuments`, `importDocuments`, `backupSchedules` o recuperación en un momento determinado.
- LangBridge no ha autorizado la activación del plan Blaze con la finalidad de crear respaldos.

### Decisión aprobada para el modelo actual

- LangBridge no mantiene actualmente copias programadas propias de Cloud Firestore.
- LangBridge no mantiene actualmente exportaciones automáticas propias.
- LangBridge no dispone actualmente de un procedimiento propio de restauración.
- La eliminación efectiva deberá ejecutarse sobre los datos activos administrados por LangBridge.
- Esta decisión documental no activará copias, exportaciones, restauraciones, servicios de pago ni facturación.
- Antes de publicar la política definitiva deberá verificarse que no exista una configuración externa activa creada fuera del repositorio.

### Alcance de la verificación pendiente

La revisión externa deberá comprobar, mediante acceso de solo lectura cuando sea posible:

- Programaciones de respaldos de Cloud Firestore.
- Exportaciones configuradas desde Google Cloud.
- Recuperación en un momento determinado.
- Copias manuales conocidas.
- Ubicaciones de almacenamiento utilizadas.
- Períodos de retención configurados.
- Personas o cuentas de servicio con acceso.
- Procedimientos existentes de restauración.

La revisión no deberá activar el plan Blaze ni crear una copia nueva.

### Requisitos antes de habilitar respaldos

Si LangBridge decide utilizar respaldos en el futuro, deberá aprobar previamente:

- Proveedor y servicio exactos.
- Finalidad del respaldo.
- Datos incluidos.
- Frecuencia.
- Ubicación.
- Acceso autorizado.
- Costo y plan de facturación.
- Período máximo de retención.
- Eliminación de las copias.
- Procedimiento de restauración.
- Tratamiento de los datos correspondientes a cuentas eliminadas.
- Pruebas de recuperación y de eliminación posterior.

Ningún respaldo deberá activarse antes de actualizar el inventario de datos, las políticas aplicables y la información correspondiente de Google Play.

### Protección frente a restauraciones

Una futura restauración no podrá reactivar cuentas ni volver a poner en uso ordinario datos que ya hayan sido eliminados.

Antes de permitir que la aplicación utilice datos restaurados, el procedimiento deberá:

1. Ejecutar la restauración en un entorno aislado o administrativo controlado.
2. Identificar la fecha efectiva de la copia utilizada.
3. Identificar las eliminaciones completadas después de esa fecha.
4. Volver a aplicar las eliminaciones correspondientes sobre los datos restaurados.
5. Comprobar que no reaparezcan perfiles eliminados.
6. Comprobar que no reaparezcan solicitudes de conexión eliminadas.
7. Comprobar que no reaparezcan conversaciones ni mensajes eliminados.
8. Comprobar que no reaparezcan referencias en listas de bloqueo.
9. Comprobar que no reaparezcan reportes eliminados.
10. Evitar la recreación de cuentas eliminadas de Firebase Authentication.
11. Completar pruebas automáticas y manuales antes de permitir el acceso ordinario.

### Relación con DEL-S2

El recibo técnico DEL-S2 no identifica a la persona y se elimina después de 30 días. Por sí solo, no debe utilizarse para reconstruir la identidad de una cuenta eliminada.

Antes de habilitar respaldos, LangBridge deberá diseñar un mecanismo compatible con la minimización de datos que permita respetar las eliminaciones después de una restauración.

Ese mecanismo podrá considerar:

- Limitar la antigüedad y el período de rotación de las copias.
- Restaurar copias únicamente dentro de un período controlado.
- Mantener los datos restaurados aislados hasta volver a aplicar las eliminaciones vigentes.
- Utilizar controles técnicos temporales y protegidos que no conserven indefinidamente perfiles ni datos personales completos.
- Impedir que una restauración utilice DEL-S2 para reconstruir una identidad eliminada.

El diseño definitivo deberá aprobarse antes de activar respaldos.

### Estado de implementación

- Decisión aprobada para el modelo actual mediante LEG-017.
- Verificación externa en Firebase Console y Google Cloud Console pendiente.
- Respaldos propios no configurados.
- Exportaciones automáticas no configuradas.
- Procedimiento de restauración no implementado.
- Activación del plan Blaze no autorizada por esta decisión.
- Diseño para impedir la reaparición de datos eliminados pendiente antes de habilitar respaldos.
- Pruebas de restauración pendientes para una futura implementación.
- Publicación definitiva pendiente de validación técnica y revisión jurídica.

## 22. Decisión LEG-018: cancelación de solicitudes

### Estado

- Aprobada.

### Decisión aprobada

LangBridge permitirá cancelar una solicitud de eliminación después de verificar nuevamente la identidad de la persona, siempre que no haya comenzado ninguna operación irreversible.

### Estados en los que podrá solicitarse la cancelación

- En estado `pending`, la cancelación estará permitida después de verificar nuevamente la identidad.
- En estado `verified`, la cancelación estará permitida si todavía no ha comenzado ninguna operación irreversible.
- En estado `processing`, la cancelación solo estará permitida si el backend confirma que todavía no se alcanzó el punto técnico de no retorno.
- En estado `completed`, la cancelación no estará permitida.
- Una solicitud en estado `rejected` no requerirá cancelación.
- Una solicitud en estado `cancelled` ya se considerará cancelada.

### Verificación requerida

Antes de cancelar, el procedimiento deberá:

1. Comprobar que la persona continúa autenticada.
2. Verificar nuevamente su identidad mediante una sesión reciente.
3. Obtener el UID exclusivamente desde Firebase Authentication.
4. Consultar el estado real de la solicitud desde un entorno seguro.
5. Confirmar que todavía no se ejecutó ninguna operación irreversible.
6. Evitar que el cliente móvil pueda declarar directamente que una solicitud fue cancelada.

### Punto técnico de no retorno

El backend deberá mantener un indicador inequívoco que permita determinar si la cancelación todavía es posible.

Se considerará alcanzado el punto de no retorno cuando comience cualquiera de las operaciones irreversibles aprobadas, incluyendo:

- La eliminación de mensajes.
- La eliminación de una conversación.
- La eliminación de solicitudes de conexión.
- La eliminación de referencias en listas `blockedUserIds` ajenas.
- La eliminación de reportes.
- La eliminación del documento `users/{uid}`.
- La eliminación de la cuenta de Firebase Authentication.

Después de alcanzar ese punto, la cancelación será rechazada y el proceso continuará de forma segura hasta finalizar.

### Efectos de una cancelación válida

Cuando la cancelación se complete antes del punto de no retorno:

- La solicitud pasará al estado `cancelled`.
- La cuenta continuará activa.
- No se eliminarán los datos asociados con la cuenta.
- Se retirará el estado `deletionRequested`.
- Se limpiará `deletionRequestedAt`.
- Se restaurará la configuración de visibilidad que existía antes de enviar la solicitud.
- La persona podrá continuar utilizando LangBridge.
- No se creará el recibo técnico aprobado mediante DEL-S2.

### Restauración de la configuración anterior

El procedimiento no deberá cambiar automáticamente `isProfileVisible` a `true`, porque el perfil podría haber estado oculto voluntariamente antes de presentar la solicitud.

Antes de ocultar el perfil por una solicitud de eliminación, LangBridge deberá conservar temporalmente la configuración anterior necesaria para restaurarla de forma segura si la solicitud se cancela.

Esta información temporal:

- Se limitará al valor necesario para restaurar la configuración anterior.
- No se utilizará para otras finalidades.
- Se eliminará cuando deje de ser necesaria.
- No se conservará dentro del recibo técnico DEL-S2.

### Cancelación rechazada

Si ya comenzó una operación irreversible:

- La cancelación será rechazada.
- No se prometerá recuperar información ya eliminada.
- La solicitud permanecerá en estado `processing`.
- El procedimiento continuará de forma idempotente hasta completar las operaciones restantes.
- La persona deberá recibir un mensaje claro indicando que el proceso ya alcanzó el punto de no retorno.

### Registro mínimo de una cancelación

Mientras la cuenta continúe existiendo, la solicitud cancelada podrá conservar temporalmente:

- Estado `cancelled`.
- Fecha de cancelación.
- Versión del procedimiento.
- Método general de verificación.
- Razón técnica general, cuando corresponda.

No se añadirá información personal innecesaria. El período definitivo de conservación de una solicitud cancelada deberá establecerse en la política de retención antes de la publicación definitiva.

### Relación con DEL-S2

- DEL-S2 se aplica únicamente después de completar efectivamente una eliminación.
- Una solicitud cancelada no producirá un recibo técnico DEL-S2.
- El plazo de 30 días de DEL-S2 no comenzará para una solicitud cancelada.

### Estado de implementación

- Decisión aprobada mediante LEG-018.
- Implementación técnica pendiente.
- Definición del indicador de punto de no retorno pendiente.
- Pruebas automáticas y manuales pendientes.
- Textos visibles y traducciones de cancelación pendientes.
- Publicación definitiva pendiente de validación técnica y revisión jurídica.

## 23. Decisión LEG-019: confirmación de eliminación

### Estado

- Aprobada.

### Decisión aprobada

LangBridge enviará comunicaciones diferenciadas sobre el estado del procedimiento al correo asociado con la solicitud y validado antes de eliminar la cuenta de Firebase Authentication.

### Canal principal

- Correo electrónico asociado con la solicitud.
- La dirección deberá obtenerse y validarse antes de eliminar Firebase Authentication.
- No se enviará información a un correo alternativo sin verificarlo previamente.
- El correo utilizado para la comunicación no se conservará dentro del recibo técnico DEL-S2.

### Tipos de comunicación

LangBridge podrá enviar comunicaciones distintas para:

- Confirmar la recepción de una solicitud.
- Confirmar una cancelación válida.
- Informar que la cancelación ya no es posible porque se alcanzó el punto técnico de no retorno.
- Confirmar la finalización efectiva de la eliminación.

Cada comunicación deberá identificar claramente el estado real del procedimiento y no deberá afirmar que la eliminación terminó mientras existan operaciones pendientes.

### Momento de la confirmación final

La confirmación final de eliminación solamente se enviará cuando:

- Todas las operaciones previstas hayan concluido correctamente.
- La solicitud haya alcanzado el estado `completed`.
- No exista ningún fallo parcial pendiente.
- Se haya creado correctamente el recibo técnico mínimo y no identificable aprobado mediante DEL-S2.

Una solicitud en estado `processing` no recibirá una confirmación que afirme que la cuenta ya fue eliminada.

### Contenido permitido en la confirmación final

La comunicación podrá incluir:

- Confirmación general de que la cuenta fue eliminada.
- Fecha efectiva de finalización.
- Categorías generales de datos eliminadas.
- Indicación de que la eliminación es irreversible.
- Explicación de que, si la persona vuelve a LangBridge, comenzará desde cero con una cuenta nueva.
- Información general sobre el recibo técnico DEL-S2.
- Indicación de que el recibo técnico no identifica a la persona.
- Período de conservación de 30 días del recibo técnico.
- Fecha prevista de eliminación del recibo, cuando resulte técnicamente disponible.
- Canal oficial para consultas.
- Número de referencia no identificable, únicamente cuando resulte necesario para soporte.

### Información prohibida

La comunicación no incluirá:

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
- Información técnica que permita reconstruir la cuenta eliminada.

### Confirmación de una cancelación válida

Cuando una solicitud sea cancelada antes del punto técnico de no retorno, la comunicación correspondiente podrá indicar:

- Que la solicitud fue cancelada.
- Que la cuenta continúa activa.
- Que no comenzó ninguna operación irreversible.
- Que la configuración anterior del perfil fue restaurada.
- Que no se creó un recibo técnico DEL-S2.

La comunicación no afirmará que se recuperaron datos, porque una cancelación válida deberá producirse antes de eliminar información de forma irreversible.

### Aviso posterior al punto de no retorno

Si la persona intenta cancelar después de alcanzar el punto técnico de no retorno, LangBridge deberá comunicar de manera general que:

- La cancelación ya no puede completarse.
- Comenzaron operaciones irreversibles.
- No se garantiza la recuperación de información.
- El procedimiento continuará de forma segura hasta finalizar.
- Se enviará una confirmación distinta cuando la eliminación termine.

El aviso no detallará innecesariamente qué documentos específicos fueron eliminados.

### Correo no disponible o no verificable

Si la cuenta no tiene un correo utilizable o el correo no puede verificarse:

- LangBridge no enviará la confirmación a otra dirección sin verificarla.
- Podrá ofrecerse un canal oficial de consulta.
- Cualquier dirección alternativa deberá verificarse antes de utilizarse.
- La imposibilidad de entregar el mensaje no revertirá una eliminación completada.
- No se conservarán indefinidamente datos personales con la única finalidad de seguir intentando entregar la confirmación.

### Fallo al enviar la confirmación

Si falla el envío después de completar la eliminación:

- La eliminación continuará considerándose completada.
- La cuenta no será restaurada.
- Podrán realizarse reintentos limitados, seguros e idempotentes.
- El recibo técnico podrá registrar únicamente el resultado general del envío, sin volver a almacenar el correo.
- Los reintentos deberán finalizar al vencer el período autorizado o al alcanzar el límite técnico aprobado.
- El fallo de entrega no cambiará el estado `completed` de la eliminación.

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

## 24. Decisión LEG-020: fotografías de perfil

### Estado

- Propuesta técnica pendiente de implementación.

### Decisión funcional confirmada

LangBridge tiene previsto permitir seleccionar una fotografía desde el dispositivo y almacenarla permanentemente mediante Firebase Storage.

### Requisitos

- Selector limitado a imágenes.
- Permiso mínimo.
- Selección voluntaria.
- Límites de tamaño y formato.
- Reglas de Firebase Storage.
- Ruta asociada con UID.
- Sustitución segura.
- Eliminación de la fotografía anterior.
- Eliminación al cerrar la cuenta.
- Prevención de archivos huérfanos.
- Reporte y moderación.
- Actualización legal.
- Actualización de Play Console.

### Cámara

- No se declarará ni solicitará permiso de cámara si la función final solamente selecciona fotografías existentes.

### Decisión aprobada

- [PENDIENTE]

## 25. Decisión LEG-021: datos de aprendizaje

### Estado

- En análisis técnico futuro.

### Datos previstos

- Lecciones.
- Resultados.
- Progreso.
- Puntos.
- Vidas.
- Rachas.
- Niveles.
- Fechas de práctica.
- Metas.

### Principio propuesto

- Recopilar únicamente lo necesario.
- Evitar conservar respuestas individuales cuando no sean necesarias.
- Eliminar datos identificables con la cuenta.
- Conservar estadísticas agregadas no identificables cuando corresponda.

### Decisión aprobada

- [PENDIENTE]

## 26. Decisión LEG-022: aceptación de documentos

### Estado

- Pendiente de implementación.

### Documentos que podrían requerir aceptación

- Términos y condiciones.
- Normas de la comunidad.
- Política de privacidad como información disponible.
- Cambios relevantes.

### Datos de aceptación propuestos

- UID.
- Versión de Términos.
- Versión de Normas.
- Fecha del servidor.
- Estado de aceptación.

### Requisitos

- Aceptación antes de publicar contenido.
- Bloqueo de funciones si no existe aceptación válida.
- Nueva aceptación cuando existan cambios relevantes.
- Registro protegido.
- Reglas de Firestore.
- Traducciones.

### Decisión aprobada

- [PENDIENTE]

## 27. Decisión LEG-023: procedimiento de moderación

### Estado

- Pendiente.

### Requisitos

- Clasificación de reportes.
- Herramienta administrativa.
- Acceso autorizado.
- Estados.
- Medidas.
- Notas internas mínimas.
- Evidencia.
- Revisión.
- Retención.
- Confirmación.
- Protección de la persona que reporta.

### Estados administrativos propuestos

- `pending`
- `under_review`
- `action_required`
- `resolved`
- `dismissed`
- `retained_for_safety`

### Decisión aprobada

- [PENDIENTE]

## 28. Decisión LEG-024: canal de revisión de moderación

### Estado

- Pendiente.

### Requisitos

- Canal oficial.
- Verificación de cuenta.
- Plazo para solicitar revisión.
- Plazo operativo de respuesta.
- Protección contra abuso.
- Registro de decisión.
- Acceso restringido.

### Valores aprobados

- Canal: [PENDIENTE]
- Plazo para solicitar revisión: [PENDIENTE]
- Plazo de respuesta: [PENDIENTE]

## 29. Decisión LEG-025: propiedad intelectual

### Estado

- Pendiente.

### Requisitos

- Canal oficial para reclamaciones.
- Identificación del contenido.
- Evidencia razonable de titularidad.
- Información de contacto.
- Declaración de buena fe.
- Procedimiento de revisión.
- Respuesta.
- Tratamiento de reclamaciones abusivas.

### Canal aprobado

- [PENDIENTE]

## 30. Decisión LEG-026: jurisdicción y legislación

### Estado

- Pendiente de revisión jurídica.

### Información preliminar

- Operación principal: República Dominicana.
- Marco dominicano de protección de datos a considerar: Ley núm. 172-13.
- Distribución prevista: Google Play.
- Posibles personas usuarias de distintos países.

### Preguntas

- Legislación aplicable.
- Jurisdicción competente.
- Derechos obligatorios de consumidores.
- Tratamiento internacional.
- Resolución de conflictos.
- Reclamaciones.
- Limitaciones contractuales permitidas.

### Valor aprobado

- [PENDIENTE]

## 31. Decisión LEG-027: proveedores y subencargados

### Estado

- En análisis.

### Proveedores identificados

- Google Firebase.
- Google Sign-In.
- Expo.
- Servicios relacionados con React Native.
- Futuro Firebase Storage.

### Información pendiente

- Nombre legal del proveedor.
- Servicio exacto.
- Finalidad.
- Datos tratados.
- Ubicación o mecanismo de tratamiento.
- Retención.
- Eliminación.
- Medidas de seguridad.
- Enlaces públicos aplicables.

### Decisión aprobada

- [PENDIENTE]

## 32. Decisión LEG-028: analítica y diagnóstico

### Estado

- No utilizados actualmente.

### Regla

Antes de incorporar Analytics, Crashlytics u otro SDK se deberá:

- Revisar datos.
- Revisar identificadores.
- Revisar finalidad.
- Revisar retención.
- Revisar consentimiento.
- Actualizar Play Console.
- Actualizar las políticas.
- Auditar dependencias y permisos.

### Decisión futura

- [PENDIENTE]

## 33. Decisión LEG-029: notificaciones

### Estado

- No implementadas actualmente.

### Datos futuros posibles

- Token de notificación.
- Identificador de instalación.
- Preferencias.
- Estado de entrega.
- Contenido de notificación.

### Regla

No activar notificaciones sin actualizar:

- Inventario de datos.
- Política de privacidad.
- Play Console.
- Procedimiento de eliminación.
- Controles de preferencias.

### Decisión futura

- [PENDIENTE]

## 34. Decisión LEG-030: fecha de entrada en vigor

### Estado

- Bloqueada.

### Dependencias

- Textos finales.
- Datos institucionales.
- Edad mínima.
- Contactos.
- URL públicas.
- Eliminación efectiva.
- Moderación.
- Revisión jurídica.
- Fecha prevista de publicación.

### Fecha aprobada

- [PENDIENTE]

## 35. Orden recomendado para resolver decisiones

El orden recomendado es:

- Nombre del responsable.
- Correos oficiales.
- Sitio web.
- Edad mínima.
- Público objetivo.
- Tratamiento de conversaciones.
- Tratamiento de mensajes.
- Plazos de reportes.
- Plazo de eliminación.
- Registro mínimo.
- Cancelación.
- Moderación.
- Revisión.
- Jurisdicción.
- Proveedores.
- URL públicas.
- Fecha de entrada en vigor.

## 36. Regla para actualizar documentos

Cuando una decisión alcance el estado `Aprobada`:

- Identificar todos los archivos afectados.
- Reemplazar solamente el campo correspondiente.
- Evitar reemplazos globales no revisados.
- Ejecutar búsqueda de contradicciones.
- Validar Markdown.
- Ejecutar `git diff --check`.
- Revisar el contenido.
- Crear commit específico.
- No marcarla como `Publicable` hasta completar la implementación necesaria.

## 37. Condiciones para cerrar este registro

Este registro solamente podrá considerarse completado cuando:

- Todas las decisiones críticas estén aprobadas.
- Las decisiones técnicas estén implementadas.
- Las pruebas estén aprobadas.
- Los documentos públicos estén actualizados.
- No existan campos críticos sin resolver.
- Las URL públicas funcionen.
- Google Play tenga información coherente.
- La revisión jurídica final haya concluido.
