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

Cuando el proceso efectivo esté implementado, LangBridge tendrá previsto eliminar los datos que ya no sean necesarios, incluyendo:

- Cuenta de Firebase Authentication.
- Nombre y correo almacenados en el perfil.
- País.
- Ciudad histórica, cuando exista.
- Biografía.
- Idiomas del perfil.
- Nivel lingüístico.
- Preferencias de visibilidad.
- Lista personal de usuarios bloqueados.
- Solicitudes de conexión pendientes.
- Fotografía de perfil almacenada por LangBridge.
- URL de la fotografía almacenada.
- Futuros datos de aprendizaje.
- Puntos, vidas y rachas.
- Progreso de lecciones.
- Configuraciones asociadas exclusivamente con la cuenta.

La lista definitiva deberá verificarse contra todas las colecciones y servicios existentes en el momento de procesar la solicitud.

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

El documento de perfil correspondiente deberá eliminarse o anonimizarse cuando la solicitud sea procesada.

Entre los datos relacionados se encuentran:

- UID.
- Nombre.
- Correo.
- País.
- Ciudad histórica.
- Biografía.
- Fotografía.
- Idioma de interfaz.
- Idioma nativo.
- Idioma de aprendizaje.
- Nivel.
- Visibilidad.
- Fechas y estados técnicos.

LangBridge no deberá conservar el perfil completo después de finalizar la eliminación, salvo que exista una obligación o razón legítima específica y limitada.

## 13. Solicitudes de conexión

Las solicitudes de conexión pendientes enviadas o recibidas por la cuenta deberán eliminarse.

Las solicitudes aceptadas deberán procesarse de manera que:

- No permitan nuevas interacciones con una cuenta eliminada.
- No mantengan nombres innecesarios.
- No produzcan errores en conversaciones existentes.
- No dejen referencias personales innecesarias.

La solución técnica definitiva deberá probarse antes de publicar esta página.

## 14. Conversaciones y mensajes

El tratamiento definitivo de conversaciones y mensajes todavía está pendiente.

LangBridge deberá seleccionar y documentar una solución coherente.

Las opciones consideradas son:

- Eliminar completamente los mensajes de la cuenta.
- Anonimizar a la persona remitente.
- Mantener determinados mensajes para la otra persona sin conservar la identidad del remitente.
- Conservar temporalmente mensajes relacionados con investigaciones de seguridad.

Cuando se aplique anonimización, la identidad podrá sustituirse por una referencia neutral, como `Usuario eliminado`.

La decisión final deberá proteger:

- Los derechos de la persona que solicita la eliminación.
- La información perteneciente a otras personas participantes.
- La integridad de reportes activos.
- La prevención de fraude o abuso.
- La minimización de datos.

Tratamiento definitivo de conversaciones: [PENDIENTE].

Tratamiento definitivo de mensajes: [PENDIENTE].

## 15. Usuarios bloqueados

Al eliminar una cuenta:

- Se eliminará la lista de bloqueos almacenada en su perfil.
- Se limpiará su UID de las listas de bloqueo de otras personas cuando sea técnicamente razonable.
- Se evitarán errores provocados por referencias huérfanas.

LangBridge podrá conservar una referencia administrativa limitada cuando resulte necesaria para impedir que una cuenta utilizada para abuso evada una medida de seguridad.

Esta referencia no deberá conservar el perfil completo.

## 16. Reportes técnicos

Los reportes técnicos ordinarios podrán:

- Eliminarse después de resolverse.
- Anonimizarse.
- Conservarse temporalmente durante el período operativo aprobado.

Cuando ya no sea necesario identificar a la persona, deberán eliminarse o anonimizarse el UID y el correo.

Período definitivo de conservación de reportes técnicos: [PENDIENTE].

## 17. Reportes de seguridad y moderación

Algunos reportes relacionados con seguridad, fraude, abuso o disputas podrán conservarse temporalmente aunque se solicite la eliminación de la cuenta.

En esos casos, LangBridge deberá:

- Conservar únicamente la información necesaria.
- Restringir el acceso.
- Documentar la razón.
- Establecer una fecha de revisión.
- Eliminar o anonimizar los datos cuando dejen de ser necesarios.
- Evitar utilizar la información para una finalidad incompatible.

La eliminación del perfil público y de la cuenta no obliga necesariamente a destruir inmediatamente evidencia limitada de un reporte activo.

Período definitivo de conservación de reportes de seguridad: [PENDIENTE].

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

## 22. Registro mínimo de la solicitud

Después de completar la eliminación, LangBridge podrá conservar un registro mínimo que indique:

- Fecha de recepción.
- Fecha de finalización.
- Resultado general.
- Existencia de una retención limitada.
- Fecha prevista de revisión o eliminación.
- Razón general de la retención.

El UID y el correo completos deberán eliminarse, transformarse o limitarse cuando ya no sean necesarios.

Período de conservación del registro mínimo: [PENDIENTE].

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

- Inicia un proceso para eliminar o anonimizar la cuenta y sus datos asociados.
- Puede ser irreversible.
- Requiere verificación.
- Puede incluir una retención temporal limitada.

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

Esta política no está lista para publicación hasta completar:

- Nombre legal o comercial.
- Correos oficiales.
- Sitio web.
- URL pública de eliminación.
- Formulario público.
- Plazos de procesamiento.
- Períodos de conservación.
- Tratamiento definitivo de mensajes.
- Tratamiento definitivo de conversaciones.
- Tratamiento de reportes técnicos.
- Tratamiento de reportes de seguridad.
- Registro mínimo.
- Copias de seguridad.
- Política de cancelación.
- Canal de confirmación.
- Eliminación efectiva de Firebase Authentication.
- Eliminación efectiva de Cloud Firestore.
- Eliminación futura de Firebase Storage.
- Eliminación futura de datos de aprendizaje.
- Pruebas automáticas.
- Pruebas manuales.
- Revisión jurídica final.

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