# Política de privacidad de LangBridge

## Estado del documento

- Estado: Borrador pendiente de revisión y publicación
- Versión: 0.1
- Fecha de preparación: 9 de septiembre de 2026
- Fecha de entrada en vigor: [PENDIENTE]
- Última actualización: 9 de septiembre de 2026

> Este documento no debe publicarse hasta completar todos los campos marcados como pendientes, implementar el proceso de eliminación efectiva de cuentas y realizar una revisión jurídica final.

## 1. Introducción

LangBridge es una aplicación móvil orientada al aprendizaje de idiomas y al intercambio lingüístico entre personas.

Esta Política de privacidad explica qué información procesa LangBridge, por qué la utiliza, dónde puede almacenarse, con quién puede compartirse, durante cuánto tiempo puede conservarse y qué opciones tienen las personas usuarias respecto de su información.

LangBridge procura aplicar principios de transparencia, minimización, seguridad, limitación de finalidad y conservación responsable de los datos personales.

Al crear una cuenta o utilizar LangBridge, la persona usuaria reconoce haber tenido acceso a esta Política de privacidad.

Si una persona no está de acuerdo con esta Política, no debe crear una cuenta ni utilizar las funciones que requieren autenticación.

## 2. Responsable de LangBridge

La información necesaria para identificar y contactar al responsable debe completarse antes de publicar esta Política.

- Producto: LangBridge
- Responsable: Luis Enrique Nuñez Minaya
- Nombre legal o comercial: [PENDIENTE]
- País de operación principal: República Dominicana
- Dirección de contacto: [PENDIENTE]
- Correo electrónico de privacidad: [PENDIENTE]
- Correo electrónico de soporte: [PENDIENTE]
- Sitio web oficial: [PENDIENTE]
- URL pública para solicitudes de eliminación de cuenta: [PENDIENTE]

Las consultas sobre esta Política o sobre el tratamiento de información personal deberán enviarse al correo oficial de privacidad cuando dicho canal esté habilitado.

## 3. Alcance de esta Política

Esta Política se aplica a la información procesada mediante:

- La aplicación móvil LangBridge.
- Las funciones de registro e inicio de sesión.
- Los perfiles personales y lingüísticos.
- Las funciones de exploración y conexión.
- Las conversaciones y mensajes.
- Los controles de privacidad y bloqueo.
- Los reportes enviados desde la aplicación.
- Las solicitudes de eliminación de cuenta.
- Los servicios web oficiales que LangBridge publique posteriormente para soporte, privacidad o eliminación de datos.

Esta Política describe las funciones presentes en la versión vigente de LangBridge.

Cuando se incorporen nuevas funciones que cambien las categorías de datos, las finalidades, los permisos o los proveedores utilizados, esta Política deberá actualizarse antes de que dichas funciones sean activadas o publicadas.

## 4. Información que procesa LangBridge

LangBridge procesa distintas categorías de información según las funciones utilizadas.

### 4.1. Datos de registro y autenticación

Cuando una persona crea una cuenta o inicia sesión, LangBridge puede procesar:

- Identificador único de la cuenta.
- Nombre completo o nombre mostrado.
- Correo electrónico.
- Credenciales administradas mediante Firebase Authentication.
- Proveedor de autenticación utilizado.
- Fecha de creación de la cuenta.
- Información necesaria para mantener la sesión autenticada.

La contraseña es administrada por Firebase Authentication. LangBridge no debe almacenar contraseñas como texto legible en Cloud Firestore ni en los documentos ordinarios del perfil.

### 4.2. Datos proporcionados mediante Google Sign-In

Si una persona decide utilizar Google Sign-In, LangBridge puede recibir, según la información disponible en la cuenta y los permisos otorgados:

- Identificador de la cuenta autenticada.
- Nombre mostrado.
- Correo electrónico.
- URL de la fotografía de la cuenta de Google.
- Información que identifica a Google como proveedor de autenticación.

Esta información se utiliza para autenticar a la persona y crear o actualizar los datos básicos del perfil.

El uso de Google Sign-In es opcional cuando el registro mediante correo electrónico y contraseña se encuentre disponible.

### 4.3. Información del perfil personal

Cuando una persona configura o actualiza su perfil, LangBridge puede procesar:

- Identificador de usuario.
- Nombre completo o nombre mostrado.
- Correo electrónico asociado.
- País o código de país.
- Nombre del país.
- Ciudad, cuando exista en perfiles históricos.
- Biografía.
- URL de fotografía de perfil.
- URL de fotografía procedente de Google.
- Preferencia de visibilidad del perfil.
- Estado de perfil completado.
- Fechas de creación y actualización.
- Estado relacionado con una solicitud de eliminación de cuenta.

Parte de esta información puede mostrarse a otras personas autenticadas para facilitar el intercambio lingüístico.

El correo electrónico no está destinado a mostrarse públicamente como parte ordinaria del perfil.

### 4.4. Información del perfil lingüístico

LangBridge puede procesar:

- Idioma de la interfaz.
- Idioma nativo.
- Idioma que la persona desea aprender.
- Nivel lingüístico seleccionado.
- Estado de configuración del perfil lingüístico.

Esta información se utiliza para personalizar la experiencia, mostrar información relevante del perfil y facilitar la exploración de posibles compañeros de intercambio.

### 4.5. Preferencias de privacidad

LangBridge puede almacenar:

- Preferencia de visibilidad del perfil.
- Identificadores de usuarios bloqueados.
- Indicador de solicitud de eliminación.
- Fecha de solicitud de eliminación.

La persona puede cambiar la visibilidad de su perfil y gestionar la lista de usuarios bloqueados mediante las funciones disponibles en la aplicación.

### 4.6. Solicitudes de conexión

Cuando una persona envía, recibe, acepta o rechaza una solicitud de conexión, LangBridge puede procesar:

- Identificador del remitente.
- Identificador del destinatario.
- Nombre mostrado del remitente.
- Nombre mostrado del destinatario.
- Estado de la solicitud.
- Fecha de creación.
- Fecha de actualización.

Estos datos se utilizan para administrar las relaciones sociales dentro de LangBridge y habilitar las conversaciones entre participantes autorizados.

### 4.7. Conversaciones y mensajes

Cuando las personas utilizan el chat, LangBridge puede procesar:

- Identificador de la conexión.
- Identificadores de los participantes.
- Identificador de la persona remitente.
- Contenido de los mensajes.
- Fecha y hora de creación.
- Fecha y hora de lectura, cuando corresponda.
- Información necesaria para mostrar mensajes pendientes de lectura.

Los mensajes se almacenan para proporcionar el historial de conversación y permitir que las personas participantes consulten sus comunicaciones.

LangBridge no garantiza que los mensajes sean adecuados para todas las edades. El público objetivo y la edad mínima de uso deberán definirse antes de la publicación definitiva de la aplicación.

### 4.8. Usuarios bloqueados

Cuando una persona bloquea a otra, LangBridge almacena el identificador de la cuenta bloqueada dentro de la configuración de la persona que realizó el bloqueo.

Esta información se utiliza para:

- Impedir interacciones no deseadas.
- Aplicar controles de seguridad.
- Mostrar la lista privada de usuarios bloqueados.
- Permitir el desbloqueo posterior.

La lista de bloqueos no debe mostrarse públicamente.

### 4.9. Reportes y solicitudes de soporte

Cuando una persona envía un reporte desde LangBridge, pueden procesarse:

- Identificador de la persona que reporta.
- Correo electrónico asociado.
- Categoría seleccionada.
- Descripción proporcionada.
- Estado del reporte.
- Fecha de creación.
- Fecha de actualización.

Estos datos se utilizan para investigar problemas técnicos, de seguridad o de funcionamiento, responder cuando sea necesario y mantener seguimiento interno.

Los reportes no están destinados a ser consultados públicamente ni por otras personas usuarias.

### 4.10. Solicitudes de eliminación de cuenta

Cuando una persona solicita eliminar su cuenta, LangBridge puede procesar:

- Identificador de usuario.
- Correo electrónico.
- Estado de la solicitud.
- Fecha de creación.
- Fecha de actualización.
- Marca de solicitud de eliminación en el perfil.
- Fecha de solicitud de eliminación.

La versión actual puede registrar la solicitud y ocultar el perfil.

La eliminación efectiva de Firebase Authentication y de toda la información asociada todavía debe completarse antes de considerar plenamente implementado el proceso de eliminación.

LangBridge no publicará una promesa definitiva sobre el plazo de eliminación hasta que exista un proceso técnico y administrativo capaz de cumplirla de forma fiable.

## 5. Información almacenada localmente

LangBridge utiliza almacenamiento local en el dispositivo para:

- Mantener la persistencia de la sesión de Firebase Authentication.
- Recordar el idioma seleccionado para la interfaz.
- Recuperar la preferencia de idioma cuando se vuelve a abrir la aplicación.

La preferencia de idioma se almacena mediante la clave `appLanguage`.

La información local puede permanecer en el dispositivo hasta que:

- La aplicación la elimine.
- La persona borre los datos de la aplicación.
- La persona desinstale la aplicación.
- El sistema operativo elimine el almacenamiento correspondiente.

LangBridge no debe utilizar el almacenamiento local ordinario para guardar contraseñas en texto legible, secretos administrativos o contenido personal no necesario.

## 6. Fotografías de perfil

La versión actual puede utilizar la fotografía proporcionada por Google Sign-In o una URL de fotografía ya asociada con el perfil.

La selección y carga permanente de fotografías desde el dispositivo todavía no se encuentra completamente implementada.

Antes de activar una función de selección de fotografías, LangBridge deberá:

- Solicitar solamente el acceso necesario.
- Explicar la finalidad del acceso.
- Permitir que la persona seleccione voluntariamente una imagen.
- Aplicar límites de tipo, tamaño y formato.
- Configurar reglas seguras de almacenamiento.
- Informar dónde se almacenará la imagen.
- Permitir sustituir o eliminar la fotografía.
- Incorporar la fotografía al proceso de eliminación de cuenta.
- Actualizar esta Política.
- Actualizar la declaración de Seguridad de los datos de Google Play.

LangBridge no declarará que utiliza la cámara si la implementación final solamente permite seleccionar imágenes existentes y no permite capturarlas directamente.

## 7. Datos futuros de aprendizaje y gamificación

LangBridge tiene previsto ampliar sus funciones educativas con lecciones, progreso, resultados, puntos, vidas, rachas y niveles.

Estas funciones no deben considerarse completamente activas mientras no estén implementadas y validadas.

Antes de activar el aprendizaje gamificado, LangBridge deberá determinar qué información es estrictamente necesaria, que podría incluir:

- Lecciones iniciadas o completadas.
- Respuestas o resultados.
- Progreso por unidad.
- Nivel alcanzado.
- Puntos.
- Vidas.
- Rachas.
- Fechas de práctica.
- Metas de aprendizaje.

LangBridge deberá actualizar esta Política antes de recopilar nuevas categorías de información relacionadas con dichas funciones.

## 8. Finalidades del tratamiento

LangBridge utiliza la información para las siguientes finalidades:

- Crear y administrar cuentas.
- Autenticar a las personas.
- Mantener sesiones iniciadas.
- Permitir la recuperación del acceso.
- Crear y actualizar perfiles.
- Mostrar información del perfil a otras personas autorizadas.
- Personalizar la interfaz y la experiencia lingüística.
- Facilitar la exploración de compañeros de intercambio.
- Gestionar solicitudes de conexión.
- Habilitar conversaciones entre participantes autorizados.
- Mantener el historial de mensajes.
- Mostrar y administrar mensajes no leídos.
- Aplicar preferencias de visibilidad.
- Permitir bloqueos y desbloqueos.
- Recibir y gestionar reportes.
- Registrar solicitudes de eliminación.
- Proteger la aplicación, sus cuentas y sus servicios.
- Investigar fallos, abuso, fraude o incumplimientos.
- Cumplir obligaciones legales aplicables.
- Mejorar la seguridad y el funcionamiento de LangBridge.

LangBridge no debe utilizar los datos para finalidades incompatibles con las descritas sin proporcionar información adicional y realizar las actualizaciones legales necesarias.

## 9. Fundamento y criterios para el tratamiento

Según la finalidad y la legislación aplicable, el tratamiento puede apoyarse en:

- La solicitud de la persona de crear y utilizar una cuenta.
- La prestación de las funciones solicitadas.
- Las decisiones voluntarias de la persona al completar un perfil, enviar mensajes, bloquear usuarios o presentar reportes.
- La protección de las personas, la plataforma y sus servicios.
- La prevención de fraude, abuso o accesos no autorizados.
- El cumplimiento de obligaciones legales.
- El consentimiento cuando sea necesario para una función o permiso específico.

La aplicación y los documentos legales deberán mantener coherencia con la legislación de protección de datos aplicable y con los requisitos de las plataformas de distribución.

## 10. Visibilidad de la información

LangBridge contiene funciones sociales. Cierta información del perfil puede ser visible para otras personas autenticadas, incluyendo:

- Nombre mostrado.
- País.
- Biografía.
- Fotografía de perfil.
- Idioma nativo.
- Idioma de aprendizaje.
- Nivel lingüístico.

La visibilidad puede depender de la configuración del perfil y del funcionamiento de las funciones sociales.

Los siguientes datos no deben mostrarse públicamente como parte ordinaria del perfil:

- Contraseña.
- Credenciales de autenticación.
- Lista personal de bloqueos.
- Solicitudes privadas de eliminación.
- Reportes enviados.
- Información administrativa interna.
- Correo electrónico, salvo cuando exista una función específica, necesaria y debidamente informada.

Las personas deben evitar publicar en su nombre, biografía o mensajes información que no desean compartir.

## 11. Proveedores de servicios

LangBridge utiliza servicios de terceros para proporcionar funciones esenciales.

### 11.1. Google Firebase

Firebase puede utilizarse para:

- Autenticación.
- Administración de cuentas.
- Persistencia de sesiones.
- Almacenamiento de perfiles.
- Solicitudes de conexión.
- Conversaciones y mensajes.
- Reportes.
- Solicitudes de eliminación.

Antes de publicar esta Política se debe completar la identificación formal del proveedor, las funciones utilizadas y los enlaces públicos correspondientes.

### 11.2. Google Sign-In

Google Sign-In permite que una persona se autentique utilizando una cuenta de Google.

El tratamiento realizado directamente por Google se rige también por las condiciones y políticas de dicho proveedor.

### 11.3. Expo y servicios relacionados

LangBridge se desarrolla utilizando Expo y React Native. Antes de publicar se debe confirmar qué servicios de compilación, actualización o distribución se utilizarán en producción y qué datos técnicos podrían procesar.

### 11.4. Nuevos proveedores

Antes de incorporar un nuevo proveedor, biblioteca o SDK que procese información personal, LangBridge deberá:

- Identificar los datos tratados.
- Determinar la finalidad.
- Revisar los permisos solicitados.
- Revisar las condiciones del proveedor.
- Aplicar minimización.
- Actualizar esta Política.
- Actualizar la declaración de Google Play cuando corresponda.

## 12. Venta de datos y publicidad

Según la revisión técnica actual:

- LangBridge no contiene publicidad.
- LangBridge no utiliza seguimiento publicitario.
- LangBridge no utiliza datos para vender perfiles personales.
- LangBridge no ha identificado una función activa de venta de información personal.

Si el modelo de negocio o los proveedores cambian, esta sección deberá revisarse antes de activar la modificación.

## 13. Analítica y diagnóstico

Según la revisión realizada, LangBridge no ha identificado una integración activa de:

- Firebase Analytics.
- Firebase Crashlytics.
- Plataformas publicitarias.
- Servicios de seguimiento de comportamiento.
- Herramientas externas de grabación de sesiones.

Antes de activar analítica o diagnóstico externo, LangBridge deberá informar:

- Qué datos se recopilan.
- Si los datos se vinculan con una cuenta.
- Qué proveedor los recibe.
- Con qué finalidad se utilizan.
- Durante cuánto tiempo se conservan.
- Qué opciones tiene la persona usuaria.

## 14. Permisos del dispositivo

La configuración revisada no declara actualmente permisos explícitos para:

- Ubicación precisa o aproximada.
- Cámara.
- Notificaciones.
- Micrófono.
- Contactos.
- Calendario.
- Acceso general a archivos.

Esta lista deberá verificarse nuevamente mediante el manifiesto final del Android App Bundle antes de publicar en Google Play, ya que algunos plugins o dependencias pueden incorporar permisos durante el proceso de compilación.

Si LangBridge incorpora selección de fotografías, notificará la finalidad y solicitará solamente el acceso necesario.

## 15. Seguridad de la información

LangBridge aplica o tiene previsto aplicar medidas razonables para proteger la información, incluyendo:

- Firebase Authentication.
- Reglas de seguridad de Cloud Firestore.
- Restricción de conversaciones y mensajes a participantes autorizados.
- Validación de campos y operaciones.
- Protección de identificadores de usuario.
- Bloqueo de accesos no autorizados.
- Controles de visibilidad.
- Funciones de bloqueo.
- Funciones de reporte.
- Pruebas automáticas de reglas de Firestore.
- Revisión de dependencias y permisos.

Ningún sistema de almacenamiento o transmisión puede garantizar seguridad absoluta.

Las personas usuarias también son responsables de:

- Mantener protegidas sus credenciales.
- Utilizar una contraseña adecuada.
- No compartir códigos o accesos.
- Cerrar sesiones en dispositivos que no controlan.
- Reportar actividades sospechosas.
- Evitar publicar información altamente sensible en perfiles o mensajes.

## 16. Moderación, bloqueo y reportes

LangBridge proporciona funciones para bloquear usuarios y enviar reportes.

Cuando se complete el sistema administrativo de moderación, LangBridge podrá necesitar procesar información adicional, como:

- Identificador de la persona reportada.
- Referencia al contenido denunciado.
- Categoría de la posible infracción.
- Estado de la revisión.
- Medida aplicada.
- Fechas de revisión y resolución.

Antes de activar esta ampliación, LangBridge deberá:

- Restringir el acceso a personas autorizadas.
- Definir períodos de retención.
- Proteger la identidad de quien reporta.
- Evitar conservar contenido innecesario.
- Actualizar esta Política y las Normas de la comunidad.

## 17. Conservación de la información

LangBridge conservará la información solamente durante el tiempo necesario para:

- Proporcionar las funciones solicitadas.
- Mantener una cuenta activa.
- Proteger la seguridad de las personas y de la plataforma.
- Gestionar reportes y solicitudes.
- Resolver disputas.
- Prevenir fraude o abuso.
- Cumplir obligaciones legales aplicables.

Los períodos definitivos de conservación todavía están pendientes de aprobación.

Antes de publicar esta Política se deberán establecer criterios específicos para, al menos:

- Cuentas y perfiles.
- Solicitudes de conexión.
- Conversaciones y mensajes.
- Listas de bloqueo.
- Reportes técnicos.
- Reportes de seguridad.
- Solicitudes de eliminación.
- Fotografías almacenadas.
- Registros administrativos.

LangBridge no debe conservar información de manera indefinida sin una finalidad válida y documentada.

## 18. Eliminación de cuentas y datos

Las personas podrán solicitar la eliminación de su cuenta desde la aplicación y mediante una página web pública que deberá estar disponible antes de la publicación definitiva.

El proceso previsto incluirá:

- Verificación razonable de identidad.
- Ocultamiento del perfil mientras se procesa la solicitud, cuando corresponda.
- Eliminación de la cuenta de Firebase Authentication.
- Eliminación o anonimización del perfil.
- Eliminación de solicitudes de conexión pendientes.
- Limpieza de referencias de bloqueo.
- Tratamiento definido de conversaciones y mensajes.
- Tratamiento definido de reportes.
- Eliminación de fotografías almacenadas.
- Eliminación de datos futuros de aprendizaje y progreso.
- Registro mínimo de que la solicitud fue procesada, cuando sea necesario.

Algunos datos podrían conservarse durante un período limitado cuando exista una razón legítima, como:

- Prevención de fraude.
- Protección frente a abuso.
- Investigación de incidentes.
- Resolución de disputas.
- Cumplimiento de obligaciones legales.

Cualquier retención deberá limitarse a los datos necesarios, mantenerse protegida y explicarse de forma clara.

La versión actual registra la solicitud de eliminación y oculta el perfil, pero todavía no ejecuta automáticamente todas las operaciones descritas en esta sección. Esta Política no debe publicarse como definitiva hasta completar y validar el proceso efectivo.

## 19. Tratamiento de mensajes al eliminar una cuenta

El tratamiento definitivo de conversaciones y mensajes después de eliminar una cuenta todavía debe establecerse.

Antes de publicar, LangBridge deberá escoger y documentar una solución coherente, como:

- Eliminar los mensajes asociados.
- Anonimizar la identidad del remitente.
- Conservar determinados mensajes durante un período limitado cuando estén relacionados con reportes o seguridad.

La decisión deberá proteger tanto los derechos de la persona que elimina su cuenta como la integridad de las conversaciones, reportes y medidas de seguridad que afecten a otras personas.

## 20. Derechos y opciones de las personas

Según la legislación aplicable, una persona puede tener derecho a:

- Solicitar información sobre sus datos.
- Solicitar acceso.
- Solicitar corrección o actualización.
- Gestionar la visibilidad del perfil.
- Bloquear o desbloquear usuarios.
- Solicitar eliminación de la cuenta y de datos asociados.
- Solicitar información sobre conservación.
- Retirar un consentimiento cuando el tratamiento dependa de este.
- Presentar una consulta o reclamación.

Para proteger la cuenta, LangBridge podrá solicitar una verificación razonable de identidad antes de procesar determinadas solicitudes.

Los canales y plazos de respuesta deberán definirse antes de publicar esta Política.

## 21. Menores de edad y público objetivo

La edad mínima y el público objetivo de LangBridge todavía no han sido definidos formalmente.

Debido a que LangBridge incluye perfiles, exploración de personas, conexiones y chat, esta decisión debe completarse antes de publicar la aplicación.

Hasta que se establezcan los controles y requisitos correspondientes, LangBridge no debe presentarse como un servicio dirigido específicamente a menores de edad.

Antes de publicar se deberá:

- Definir la edad mínima.
- Configurar el público objetivo en Google Play.
- Evaluar los riesgos de las funciones sociales.
- Incorporar la edad mínima a los Términos y condiciones.
- Establecer medidas de moderación y seguridad.
- Determinar cómo se atenderán reportes relacionados con menores.
- Mantener coherencia entre esta Política, la aplicación y Play Console.

## 22. Transferencias y tratamiento internacional

Los proveedores tecnológicos utilizados por LangBridge pueden procesar información utilizando infraestructura ubicada fuera del país de la persona usuaria.

Antes de publicar, LangBridge deberá completar la información sobre:

- Proveedores utilizados.
- Servicios concretos.
- Ubicaciones o mecanismos de tratamiento aplicables.
- Medidas contractuales y de seguridad.
- Información que debe entregarse a las personas usuarias.

LangBridge procurará utilizar proveedores que ofrezcan medidas apropiadas de seguridad y protección de datos.

## 23. Legislación aplicable

LangBridge tiene su operación principal declarada en República Dominicana y tomará en consideración la normativa dominicana aplicable a protección de datos personales, incluyendo la Ley núm. 172-13, además de los requisitos aplicables de Google Play y de los países en los que se ofrezca el servicio.

La identificación definitiva de jurisdicción, autoridad competente y mecanismo de resolución de conflictos deberá completarse en los Términos y condiciones y revisarse jurídicamente antes de publicar.

## 24. Cambios en esta Política

LangBridge podrá actualizar esta Política cuando:

- Se incorporen nuevas funciones.
- Cambien las categorías de datos.
- Cambien las finalidades del tratamiento.
- Se incorporen nuevos proveedores.
- Se soliciten nuevos permisos.
- Cambien las prácticas de conservación o eliminación.
- Cambien los requisitos legales o de las plataformas.
- Sea necesario aclarar el contenido.

Cuando los cambios sean relevantes, LangBridge deberá informar mediante un mecanismo adecuado antes de que entren en vigor.

La versión publicada deberá indicar claramente:

- Fecha de entrada en vigor.
- Fecha de última actualización.
- Número de versión.
- Forma de consultar versiones anteriores cuando corresponda.

## 25. Contacto

Para consultas relacionadas con privacidad:

- Correo de privacidad: [PENDIENTE]
- Correo de soporte: [PENDIENTE]
- Dirección de contacto: [PENDIENTE]
- Sitio web: [PENDIENTE]
- Página para solicitar eliminación: [PENDIENTE]

No deben publicarse direcciones de correo personales o datos de domicilio particular sin una evaluación previa de privacidad y seguridad.

## 26. Información pendiente antes de publicación

Esta Política no está lista para publicación hasta completar:

- Nombre legal o comercial del responsable.
- Correo oficial de privacidad.
- Correo oficial de soporte.
- Medio o dirección oficial de contacto.
- Sitio web oficial.
- URL pública de eliminación.
- Fecha de entrada en vigor.
- Edad mínima.
- Público objetivo.
- Períodos de conservación.
- Procedimiento efectivo de eliminación.
- Tratamiento definitivo de mensajes.
- Tratamiento definitivo de reportes.
- Proveedores y funciones utilizadas.
- Información sobre tratamiento internacional.
- Procedimiento de moderación.
- Revisión de permisos del Android App Bundle.
- Revisión de Seguridad de los datos en Play Console.
- Revisión jurídica final.

## 27. Control interno de publicación

Antes de publicar esta Política, LangBridge debe verificar que:

- La Política coincide con el comportamiento real de la aplicación.
- No se declaran funciones que todavía no están activas.
- No se omiten datos realmente procesados.
- La eliminación dentro de la aplicación funciona.
- La página web pública de eliminación funciona.
- Las fotografías almacenadas pueden eliminarse.
- Los datos de aprendizaje pueden eliminarse.
- Los períodos de retención pueden cumplirse.
- Los formularios de Google Play coinciden con esta Política.
- El manifiesto Android no contiene permisos innecesarios.
- Los enlaces son públicos, estables y accesibles.
- La Política puede consultarse sin iniciar sesión.
- La revisión jurídica final ha sido completada.