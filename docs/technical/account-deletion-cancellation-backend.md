# Backend seguro de cancelación de solicitudes de eliminación

## 1. Estado del documento

- Estado: diseño técnico inicial.
- Implementación: pendiente.
- Infraestructura de backend: no creada.
- Despliegue: no autorizado.
- Activación de Blaze: no autorizada.
- Pruebas actuales de Firestore: 55 de 55 aprobadas.
- Rama de trabajo: `feat/account-deletion-compliance`.

## 2. Objetivo

Este documento define el contrato técnico preliminar para cancelar de forma segura una solicitud de eliminación de cuenta en LangBridge conforme a LEG-018.

La cancelación no podrá ejecutarse mediante escrituras directas de la aplicación móvil. Deberá realizarse desde un entorno servidor o administrativo autorizado.

## 3. Situación técnica actual

LangBridge utiliza:

- Expo y React Native para la aplicación.
- Firebase Authentication.
- Cloud Firestore.
- Firebase Hosting.
- Reglas de seguridad de Firestore.
- Firebase Emulator Suite para probar las reglas.

Actualmente no existen:

- Carpeta `functions`.
- Cloud Functions implementadas.
- Dependencia `firebase-functions`.
- Dependencia `firebase-admin`.
- Backend alternativo.
- Endpoints HTTP propios.
- Funciones invocables mediante `httpsCallable`.

## 4. Solicitud activa

La solicitud activa utiliza la ruta:

```text
accountDeletionRequests/{uid}
```

El identificador del documento deberá coincidir con el UID autenticado.

La solicitud activa contiene actualmente:

```text
userId
userEmail
status
previousProfileVisibility
createdAt
updatedAt
```

La aplicación crea la solicitud y oculta el perfil mediante una operación atómica.

## 5. Estados relevantes

Los estados relevantes para la cancelación son:

- `pending`
- `verified`
- `processing`
- `completed`
- `rejected`
- `cancelled`

La cancelación podrá permitirse:

- En `pending`, después de verificar nuevamente la identidad.
- En `verified`, después de verificar nuevamente la identidad.
- En `processing`, únicamente si el backend confirma que no se alcanzó el punto técnico de no retorno.

La cancelación no podrá permitirse:

- En `completed`.
- Después de una operación irreversible.
- Mediante una actualización directa desde la aplicación móvil.

## 6. Reautenticación reciente y requisitos de identidad

### Requisitos generales

Antes de cancelar, el backend deberá comprobar:

1. Que exista una persona autenticada.
2. Que el UID autenticado coincida con la solicitud activa.
3. Que la identidad haya sido verificada nuevamente.
4. Que la autenticación se encuentre dentro de la ventana reciente aprobada.
5. Que la solicitud permanezca en un estado cancelable.
6. Que no se haya alcanzado el punto técnico de no retorno.

La existencia de `auth.currentUser` no será suficiente para autorizar la cancelación.

La renovación automática de un token de ID tampoco se considerará por sí sola una nueva verificación de identidad.

### Proveedores actualmente admitidos

LangBridge utiliza actualmente:

```text
email
google
```
La aplicación deberá seleccionar el procedimiento de reautenticación según los proveedores realmente vinculados con la cuenta autenticada.

No deberá confiar únicamente en el campo `authProvider` almacenado en el perfil de Firestore.

### Correo y contraseña

Para una cuenta con correo y contraseña, la aplicación deberá:

1. Solicitar nuevamente la contraseña.
2. Obtener el correo desde la persona actualmente autenticada.
3. Crear una credencial nueva de correo y contraseña.
4. Ejecutar la reautenticación sobre `auth.currentUser`.
5. Eliminar inmediatamente la contraseña del estado local.
6. Renovar el token de ID después de la reautenticación.
7. Invocar el futuro backend de cancelación.

La implementación prevista utilizará conceptualmente:

```text
EmailAuthProvider.credential
reauthenticateWithCredential
getIdToken
```

La contraseña:

- no se almacenará de forma persistente;
- no se guardará en Firestore;
- no se enviará al backend;
- no se incluirá en parámetros de navegación;
- no se escribirá en registros;
- no se conservará después del intento;
- no se reutilizará desde el inicio de sesión original.

Si la contraseña es incorrecta, la cancelación no continuará y la solicitud activa permanecerá sin cambios.

### Google

Para una cuenta vinculada con Google, la aplicación deberá:

1. Iniciar una nueva interacción con Google.
2. Obtener una credencial nueva del proveedor.
3. Crear una credencial mediante `GoogleAuthProvider.credential`.
4. Ejecutar la reautenticación sobre `auth.currentUser`.
5. Renovar el token de ID de Firebase.
6. Invocar el futuro backend de cancelación.

La implementación prevista utilizará conceptualmente:

```text
GoogleSignin.signIn
GoogleAuthProvider.credential
reauthenticateWithCredential
getIdToken
```

La reautenticación con Google no deberá utilizar el flujo general de registro ni tratar la cuenta como nueva.

Tampoco deberá:

- sobrescribir la aceptación legal;
- cambiar los idiomas;
- actualizar datos ordinarios del perfil;
- crear otro documento de usuario;
- almacenar el token de Google;
- enviar la credencial de Google mediante Firestore;
- incluir credenciales o tokens en registros técnicos.

Si la persona cancela la interacción con Google, la cancelación de la solicitud de eliminación no continuará y ningún documento será modificado.

### Cuentas con varios proveedores

Si una cuenta tiene más de un proveedor vinculado:

- deberá utilizarse un proveedor realmente vinculado;
- la aplicación podrá presentar las opciones admitidas;
- la reautenticación deberá aplicarse a `auth.currentUser`;
- no deberá crearse una segunda cuenta;
- no deberá cambiarse el UID;
- no deberá confiar únicamente en `authProvider` almacenado en Firestore;
- no deberá vincular ni desvincular proveedores durante la cancelación.

La selección deberá basarse en los proveedores reales disponibles mediante Firebase Authentication.

### Cancelación o fallo de la reautenticación

Si la persona cancela la interfaz de reautenticación:

- no se invocará el backend;
- no se modificará la solicitud activa;
- no se modificará el perfil;
- no se creará un registro cancelado;
- no se creará DEL-S2;
- se mostrará un mensaje general.

Si la reautenticación falla:

- no se ejecutará la cancelación;
- no se restaurará la visibilidad;
- no se retirarán las marcas de eliminación;
- no se eliminará la solicitud activa;
- no se registrarán contraseñas, credenciales ni tokens;
- podrá permitirse un nuevo intento controlado.

Los errores deberán traducirse a mensajes generales y localizados, sin exponer detalles internos del proveedor.

### Evidencia para el backend

Después de una reautenticación correcta, la aplicación deberá obtener un token de ID actualizado mediante los mecanismos oficiales de Firebase Authentication.

La aplicación no deberá enviar por separado:

```text
password
Google ID token
Google access token
refresh token
credential object
auth_time supplied by the client
```

El backend deberá obtener la información autenticada desde el contexto verificado de la invocación o desde la verificación oficial del token.

El backend deberá comprobar como mínimo:

```text
uid
auth_time
```

El UID autenticado deberá coincidir con la ruta:

```text
accountDeletionRequests/{uid}
```

El backend no deberá aceptar un UID enviado libremente por la aplicación como autoridad para seleccionar la solicitud.

### Ventana propuesta de autenticación reciente

La ventana técnica inicial propuesta será:

```text
5 minutos
```

El backend deberá calcular la antigüedad utilizando su propia hora confiable y el valor autenticado de `auth_time`.

Conceptualmente:

```text
serverTime - auth_time <= allowedRecentAuthenticationWindow
```

La aplicación no podrá proporcionar:

- la hora actual;
- la hora de reautenticación;
- la antigüedad de la sesión;
- la ventana permitida;
- una declaración de que la identidad ya fue verificada.

La ventana de 5 minutos permanece como propuesta técnica pendiente de pruebas y aprobación definitiva.

### Expiración antes de invocar el backend

Si la ventana reciente vence antes de ejecutar la cancelación:

- el backend rechazará la operación;
- la solicitud activa permanecerá sin cambios;
- el perfil permanecerá oculto mientras la solicitud activa continúe existiendo;
- no se creará un registro cancelado;
- no se creará DEL-S2;
- la persona deberá repetir la reautenticación;
- el rechazo no alcanzará el punto técnico de no retorno.

### Respuestas generales previstas

Los resultados relacionados con identidad podrán incluir:

```text
identity-verification-required
recent-session-required
authentication-provider-unsupported
reauthentication-cancelled
temporary-error
```

Las respuestas no deberán revelar:

- datos internos del token;
- marcas de tiempo exactas del backend;
- credenciales;
- tokens;
- información de otras cuentas;
- detalles que permitan evadir la ventana reciente.

### Estado de implementación

Actualmente:

- no existe reautenticación en la pantalla de eliminación;
- no se importa `reauthenticateWithCredential`;
- no se utiliza `EmailAuthProvider`;
- el flujo de Google utiliza `signInWithCredential` para el inicio de sesión general;
- no existe backend que compruebe `auth_time`;
- la ventana de 5 minutos no está implementada;
- no deberán realizarse cancelaciones reales hasta completar estas protecciones.

## 7. Punto técnico de no retorno

### Definición

El punto técnico de no retorno representa el instante a partir del cual LangBridge ya no puede garantizar una cancelación segura ni la recuperación completa de la información.

Se considerará alcanzado inmediatamente antes de comenzar la primera operación irreversible del procedimiento de eliminación.

Las operaciones irreversibles aprobadas incluyen:

- eliminación de mensajes;
- eliminación de conversaciones;
- eliminación de solicitudes de conexión;
- eliminación de referencias en listas `blockedUserIds` de otras cuentas;
- eliminación de reportes;
- eliminación del documento `users/{uid}`;
- eliminación de la cuenta de Firebase Authentication.

La ocultación temporal del perfil y la creación de la solicitud activa no constituirán por sí solas el punto de no retorno.

### Indicador definitivo

La solicitud activa utilizará el campo:

```text
pointOfNoReturnAt
```

Antes de alcanzar el punto de no retorno, el campo deberá:

- estar ausente;
- no contener `null`;
- no poder ser creado por la aplicación móvil;
- no poder modificarse mediante reglas del cliente.

Cuando se alcance el punto de no retorno, `pointOfNoReturnAt` deberá:

- establecerse exclusivamente desde el backend autorizado;
- utilizar una marca de tiempo del servidor;
- fijarse una sola vez;
- permanecer inmutable;
- no poder eliminarse;
- no depender de la hora del dispositivo;
- establecerse inmediatamente antes de la primera operación irreversible.

### Categoría general de la primera operación irreversible

La solicitud activa también podrá contener:

```text
pointOfNoReturnOperation
```

Este campo deberá:

- establecerse exclusivamente desde el backend;
- utilizar una lista cerrada de valores generales;
- establecerse junto con `pointOfNoReturnAt`;
- permanecer inmutable;
- no contener identificadores de documentos;
- no contener UID, correo ni contenido;
- no revelar detalles administrativos sensibles.

Valores preliminares permitidos:

```text
messages
conversations
connection-requests
external-block-references
reports
user-profile
authentication
```

La lista definitiva deberá validarse antes de la implementación.

### Transición atómica

El backend deberá utilizar una transacción o mecanismo equivalente para:

1. Leer la solicitud activa.
2. Confirmar que la solicitud exista.
3. Confirmar que el estado sea `processing`.
4. Confirmar que `pointOfNoReturnAt` todavía esté ausente.
5. Confirmar que no exista una cancelación en curso o completada.
6. Establecer `pointOfNoReturnAt` con hora del servidor.
7. Establecer `pointOfNoReturnOperation`.
8. Confirmar la transición.
9. Comenzar la primera operación irreversible.

La primera operación irreversible no deberá comenzar antes de confirmar correctamente la transición.

Si la transición falla, no deberá comenzar ninguna operación irreversible.

### Carrera entre cancelación y eliminación

La cancelación y el avance al punto de no retorno deberán competir mediante una operación transaccional protegida.

Solo una de las dos operaciones podrá confirmar primero su transición:

```text
cancelación confirmada
```

o:

```text
punto de no retorno confirmado
```

Si la cancelación confirma primero:

- el punto de no retorno no podrá establecerse;
- no comenzará ninguna eliminación irreversible;
- se restaurará el perfil;
- se completará la cancelación.

Si el punto de no retorno confirma primero:

- la cancelación será rechazada;
- la solicitud permanecerá en `processing`;
- el proceso de eliminación continuará de manera idempotente;
- no se intentará restaurar información ya eliminada.

La aplicación móvil no podrá decidir cuál operación gana la carrera.

### Cancelación por estado

En `pending`:

- la cancelación podrá continuar después de verificar nuevamente la identidad;
- `pointOfNoReturnAt` deberá estar ausente.

En `verified`:

- la cancelación podrá continuar después de verificar nuevamente la identidad;
- `pointOfNoReturnAt` deberá estar ausente.

En `processing`:

- la cancelación solo podrá continuar si `pointOfNoReturnAt` está ausente;
- el backend deberá comprobar el estado dentro de la misma operación protegida.

En `completed`:

- la cancelación será rechazada;
- la existencia o ausencia anómala del indicador no permitirá reabrir el proceso.

### Comportamiento después del punto de no retorno

Después de establecer `pointOfNoReturnAt`:

- no se permitirá cancelar;
- no se restaurará el perfil;
- no se eliminará el indicador;
- no se cambiará la categoría general registrada;
- la solicitud permanecerá en `processing` hasta finalizar;
- los fallos parciales admitirán reintentos seguros;
- el procedimiento continuará hasta `completed`;
- no se prometerá recuperar datos ya eliminados.

### Reintentos

Un reintento del procesador deberá:

- conservar el mismo `pointOfNoReturnAt`;
- conservar la misma `pointOfNoReturnOperation`;
- no crear una segunda marca de tiempo;
- no reiniciar el proceso desde el comienzo;
- comprobar qué operaciones ya terminaron;
- continuar desde el último punto seguro;
- evitar duplicar eliminaciones o recibos;
- no permitir una cancelación tardía.

### Acceso y protección

La aplicación móvil no podrá:

- crear `pointOfNoReturnAt`;
- crear `pointOfNoReturnOperation`;
- modificar estos campos;
- eliminarlos;
- establecerlos como `null`;
- declarar que todavía no se alcanzó el punto de no retorno;
- declarar que una operación irreversible comenzó;
- enviar una categoría elegida libremente.

Estas operaciones deberán reservarse para el backend autorizado.

### Respuestas generales para la aplicación

Si la cancelación ya no es posible, el backend podrá devolver:

```text
point-of-no-return-reached
```

La respuesta no deberá revelar:

- qué documento fue eliminado;
- cuántos elementos fueron eliminados;
- nombres de colecciones internas;
- identificadores;
- horas administrativas exactas;
- detalles que faciliten eludir controles de seguridad.

### Estado de implementación

Actualmente:

- `pointOfNoReturnAt` no existe en la solicitud activa;
- `pointOfNoReturnOperation` no existe;
- no existe backend autorizado para establecer esos campos;
- no existe una transacción entre la cancelación y el inicio irreversible;
- las reglas actuales no permiten esos campos desde el cliente;
- no se ejecuta ninguna operación irreversible;
- no deberán realizarse eliminaciones reales hasta completar el backend y sus pruebas.

## 8. Operación de cancelación

Si la cancelación es válida, el backend deberá ejecutar de forma atómica o mediante un procedimiento idempotente coordinado:

1. Leer `accountDeletionRequests/{uid}`.
2. Confirmar que la solicitud existe.
3. Confirmar que el estado permite cancelación.
4. Confirmar que no se alcanzó el punto de no retorno.
5. Leer `previousProfileVisibility`.
6. Restaurar `users/{uid}.isProfileVisible`.
7. Retirar `users/{uid}.deletionRequested`.
8. Retirar `users/{uid}.deletionRequestedAt`.
9. Crear un registro cancelado mínimo.
10. Eliminar la solicitud activa identificable.
11. Verificar que la restauración del perfil haya terminado.
12. Eliminar los datos temporales de restauración.
13. Permitir una nueva solicitud futura.
14. No crear DEL-S2.

## 9. Contrato del registro cancelado mínimo

### Ruta propuesta

El registro temporal de una cancelación completada utilizará la colección:

```text
cancelledDeletionRequests/{cancellationRecordId}
```

`cancellationRecordId` deberá:

- ser generado exclusivamente desde el backend autorizado;
- ser aleatorio y opaco;
- no contener el UID;
- no derivarse directamente del UID o del correo;
- no permitir reconstruir la identidad;
- no reutilizarse para otra cancelación;
- no coincidir con el identificador de DEL-S2.

La aplicación móvil no podrá seleccionar, crear ni modificar este identificador.

### Campos obligatorios

El registro cancelado mínimo deberá contener:

```text
status: cancelled
cancelledAt
expiresAt
procedureVersion
verificationMethod
restorationResult
```

Los campos deberán cumplir:

- `status` será exactamente `cancelled`.
- `cancelledAt` utilizará la hora del servidor.
- `expiresAt` representará exactamente 30 días calendario después de `cancelledAt`.
- `procedureVersion` identificará la versión general del procedimiento aplicado.
- `verificationMethod` describirá únicamente el método general de verificación.
- `restorationResult` contendrá únicamente un resultado técnico general.

### Campo opcional

El registro podrá incluir:

```text
technicalReason
```

`technicalReason` será opcional y solo podrá utilizar valores generales previamente permitidos.

No deberá contener mensajes libres, datos personales ni información administrativa detallada.

### Valores generales previstos

Los futuros valores permitidos deberán definirse mediante listas cerradas.

Ejemplos preliminares:

```text
verificationMethod:
  recent-session
  credential-reauthentication
  federated-reauthentication

restorationResult:
  restored
  already-restored
  restoration-completed-after-retry

technicalReason:
  user-requested
  verified-cancellation
  processing-cancelled-before-no-return
```

Estos valores son preliminares y deberán validarse antes de la implementación.

### Campos y contenidos prohibidos

El registro cancelado no podrá conservar:

```text
userId
uid
userEmail
email
requestId
activeRequestId
previousProfileVisibility
deletionRequestedAt
createdAt de la solicitud activa
updatedAt de la solicitud activa
authentication tokens
session tokens
credentials
confirmation text
profile data
message content
conversation content
report content
DEL-S2 identifiers
```

Tampoco podrá conservar:

- copias del perfil;
- fotografías;
- nombres;
- país o ciudad;
- idiomas del perfil;
- listas de bloqueos;
- datos de conexiones;
- razones escritas libremente por la persona;
- información de otras cuentas;
- detalles internos que permitan eludir controles de seguridad.

### Separación respecto de la solicitud activa

La solicitud activa identificable:

```text
accountDeletionRequests/{uid}
```

deberá eliminarse después de completar y verificar la restauración.

El registro cancelado mínimo:

```text
cancelledDeletionRequests/{cancellationRecordId}
```

no sustituirá una solicitud activa ni podrá reactivarse.

La existencia del registro cancelado:

- no impedirá crear una solicitud nueva;
- no reutilizará estados o fechas anteriores;
- no reutilizará la verificación anterior;
- no permitirá dos solicitudes activas simultáneas;
- no conservará los datos temporales usados para restaurar el perfil.

### Separación respecto de DEL-S2

El registro cancelado mínimo no será un recibo DEL-S2.

Una cancelación:

- no creará DEL-S2;
- no iniciará el plazo de retención de DEL-S2;
- no reutilizará identificadores de DEL-S2;
- no se convertirá posteriormente en DEL-S2.

DEL-S2 solo podrá existir después de completar efectivamente una eliminación.

## 10. Retención y expiración

### Inicio del período

El período de conservación comenzará en la fecha efectiva en que el backend complete y verifique la cancelación.

El backend establecerá una sola vez:

```text
cancelledAt
expiresAt
```

`cancelledAt` deberá:

- utilizar la hora del servidor;
- representar la finalización efectiva de la cancelación;
- establecerse después de restaurar correctamente el perfil;
- no depender de la hora del dispositivo;
- no reutilizar la fecha de creación de la solicitud activa;
- no modificarse durante reintentos posteriores.

`expiresAt` deberá:

- calcularse a partir de `cancelledAt`;
- representar exactamente 30 días calendario después de `cancelledAt`;
- establecerse en la misma operación lógica que crea el registro cancelado;
- permanecer inmutable;
- no extenderse por reintentos, lecturas o nuevas solicitudes;
- no reutilizar el plazo de DEL-S2.

### Cálculo del vencimiento

El cálculo de `expiresAt` deberá realizarse exclusivamente en el backend autorizado.

La aplicación móvil no podrá:

- proporcionar `cancelledAt`;
- proporcionar `expiresAt`;
- modificar esas fechas;
- solicitar una extensión;
- reiniciar el período;
- seleccionar la zona horaria usada por el backend.

Antes de implementar deberá definirse una única función compartida para calcular el vencimiento y evitar diferencias entre procesos.

### Eliminación del registro vencido

Cuando se alcance `expiresAt`, el registro cancelado deberá eliminarse completamente.

La operación de expiración deberá:

1. Leer el registro cancelado.
2. Confirmar que `status` sea `cancelled`.
3. Confirmar que `expiresAt` exista.
4. Confirmar que el plazo haya vencido.
5. Eliminar únicamente el registro cancelado.
6. No modificar la cuenta activa.
7. No modificar una solicitud activa nueva.
8. No restaurar ni ocultar el perfil.
9. No crear DEL-S2.
10. No enviar una nueva confirmación de cancelación.

### Reintentos de expiración

La expiración deberá admitir reintentos seguros.

Si el registro ya no existe, el proceso deberá tratar el resultado como una eliminación previamente completada y no como una razón para recrearlo.

Un reintento no deberá:

- recrear un registro eliminado;
- cambiar `cancelledAt`;
- cambiar `expiresAt`;
- extender la retención;
- afectar datos ordinarios de la cuenta;
- afectar una nueva solicitud activa;
- producir DEL-S2;
- generar registros duplicados.

### Alternativas técnicas pendientes

Las alternativas futuras para ejecutar la expiración podrán incluir:

- una tarea programada desde un backend autorizado;
- una función programada;
- un proceso administrativo automatizado;
- una política administrada de tiempo de vida, si satisface los requisitos técnicos y legales;
- un proceso local exclusivo para pruebas con emuladores.

La alternativa definitiva no se seleccionará hasta revisar:

- disponibilidad en el plan de Firebase;
- necesidad de Blaze;
- precisión del vencimiento;
- posibilidades de reintento;
- observabilidad;
- costos;
- pruebas con emuladores;
- procedimiento de reversión.

## 11. Idempotencia y prevención de duplicados

### Clave interna de operación

El backend deberá generar una clave interna de idempotencia para cada cancelación.

La clave:

- se utilizará únicamente durante el procesamiento autorizado;
- no se expondrá a la aplicación;
- no se derivará directamente del UID o correo;
- no sustituirá `cancellationRecordId`;
- no se conservará indefinidamente;
- no permitirá reconstruir la identidad.

La estrategia exacta permanece pendiente de la selección del backend.

### Creación única del registro cancelado

Una misma cancelación válida deberá producir como máximo un registro cancelado.

El backend deberá impedir que dos ejecuciones concurrentes:

- creen dos registros para la misma cancelación;
- restauren el perfil con valores diferentes;
- eliminen dos veces solicitudes distintas;
- calculen fechas de expiración diferentes;
- creen DEL-S2;
- prolonguen el período de retención.

La creación del registro cancelado deberá coordinarse con:

1. La restauración del perfil.
2. La retirada de las marcas de eliminación.
3. La eliminación de la solicitud activa.
4. La limpieza de los datos temporales de restauración.

### Orden lógico de la cancelación

La operación deberá reconocer como mínimo estas fases internas:

```text
not-started
restoration-in-progress
profile-restored
cancelled-record-created
active-request-removed
temporary-restoration-data-removed
completed
```

Estas fases describen el procedimiento técnico interno y no deberán exponerse como estados modificables por la aplicación móvil.

### Reintento después de una interrupción

Si el proceso se interrumpe, un reintento deberá continuar desde el último punto seguro comprobable.

El backend deberá verificar el estado real de los documentos antes de repetir una operación.

Ejemplos:

- Si el perfil ya fue restaurado, no deberá invertir nuevamente su visibilidad.
- Si el registro cancelado ya existe, no deberá crear otro.
- Si la solicitud activa ya fue eliminada, no deberá recrearla.
- Si los datos temporales ya fueron eliminados, no deberá exigirlos nuevamente.
- Si la operación terminó, deberá devolver un resultado general de cancelación completada.

### Restauración idempotente del perfil

La restauración de `isProfileVisible` deberá utilizar exclusivamente el valor protegido de `previousProfileVisibility`.

La restauración deberá:

- ejecutarse desde el backend autorizado;
- comprobar que el valor sea booleano;
- evitar valores proporcionados por el cliente durante la cancelación;
- mantener `false` cuando el perfil estaba oculto;
- restaurar `true` cuando el perfil estaba visible;
- retirar `deletionRequested`;
- retirar `deletionRequestedAt`;
- no alterar otros campos del perfil.

Después de verificar la restauración, `previousProfileVisibility` no deberá copiarse al registro cancelado.

### Solicitud activa y solicitudes posteriores

Después de completar la cancelación:

- la solicitud activa anterior deberá dejar de existir;
- el registro cancelado no podrá reactivarse;
- podrá crearse una solicitud nueva;
- la nueva solicitud deberá superar una nueva verificación;
- la nueva solicitud deberá tener sus propias fechas;
- la nueva solicitud deberá conservar nuevamente la visibilidad anterior;
- no podrán existir dos solicitudes activas simultáneamente.

### Operaciones prohibidas durante reintentos

Un reintento no podrá:

- duplicar el registro cancelado;
- reutilizar una verificación anterior para una solicitud nueva;
- cambiar la visibilidad a un valor distinto del anterior;
- crear DEL-S2;
- eliminar conversaciones, mensajes o reportes;
- eliminar Firebase Authentication;
- modificar datos de otras cuentas;
- extender `expiresAt`;
- reactivar una solicitud cancelada;
- borrar datos ordinarios de una cuenta activa.

### Resultado idempotente

Una operación repetida después de una cancelación completada deberá devolver una respuesta general equivalente a:

```text
cancelled
```

La respuesta no deberá revelar:

- si el registro cancelado todavía existe;
- su identificador;
- fechas internas;
- fases administrativas;
- claves de idempotencia;
- detalles que permitan correlacionar el registro con una cuenta.

## 12. Respuestas previstas para la aplicación

El futuro backend deberá devolver respuestas generales y seguras.

Posibles resultados:

```text
cancelled
not-cancellable
identity-verification-required
recent-session-required
request-not-found
point-of-no-return-reached
restoration-pending
temporary-error
```

Las respuestas no deberán exponer:

- detalles administrativos internos;
- credenciales;
- tokens;
- rutas protegidas;
- datos de otras cuentas;
- información que facilite eludir controles de seguridad.

## 13. Reglas de seguridad

La aplicación móvil no podrá:

- leer directamente la solicitud protegida;
- actualizar su estado;
- marcarla como `cancelled`;
- eliminar la solicitud;
- restaurar directamente el perfil como parte de la cancelación;
- crear el registro cancelado;
- modificar `cancelledAt`;
- modificar `expiresAt`;
- declarar que no se alcanzó el punto de no retorno.

Estas operaciones deberán reservarse para el backend autorizado.

## 14. Pruebas futuras

Antes de implementar producción deberán existir pruebas para comprobar:

1. Cancelación válida en `pending`.
2. Cancelación válida en `verified`.
3. Cancelación condicional en `processing`.
4. Rechazo después del punto de no retorno.
5. Rechazo en `completed`.
6. Restauración de un perfil originalmente visible.
7. Conservación de un perfil originalmente oculto.
8. Compatibilidad con perfiles históricos.
9. Rechazo de `previousProfileVisibility` falsificado.
10. Eliminación de la solicitud activa.
11. Creación de un único registro cancelado.
12. Ausencia de DEL-S2.
13. Posibilidad de presentar una nueva solicitud.
14. Prevención de dos solicitudes activas.
15. Reintentos idempotentes.
16. Eliminación del registro cancelado después de 30 días.
17. Protección contra acceso directo desde el cliente.
18. Ausencia de efectos sobre conversaciones, mensajes y reportes de una cuenta activa.

## 15. Evaluación de alternativas de backend

### Requisitos mínimos

La infraestructura seleccionada deberá permitir:

- validar la autenticación de la persona solicitante;
- comprobar que el UID autenticado corresponda a la solicitud activa;
- exigir una verificación reciente de identidad;
- utilizar privilegios administrativos sin abrir permisos directos al cliente;
- ejecutar operaciones atómicas o transacciones;
- restaurar `previousProfileVisibility`;
- eliminar la solicitud activa;
- crear un único registro cancelado mínimo;
- admitir reintentos idempotentes;
- aplicar o coordinar la expiración de 30 días;
- probarse localmente antes de cualquier despliegue;
- conservar registros técnicos mínimos;
- evitar exponer secretos en la aplicación móvil.

### Alternativa A: función invocable

Una función invocable permitiría que la aplicación solicitara la cancelación mediante una operación autenticada y controlada por el backend.

Ventajas previstas:

- integración directa con una aplicación que ya utiliza Firebase;
- lógica aislada del cliente;
- validación centralizada de autenticación;
- uso de privilegios administrativos;
- respuestas estructuradas para la aplicación;
- posibilidad de integrar App Check;
- compatibilidad con pruebas locales mediante emuladores;
- menor necesidad de administrar rutas HTTP manualmente.

Riesgos y requisitos:

- requiere crear infraestructura de Cloud Functions;
- requiere dependencias administrativas;
- puede requerir el plan Blaze para despliegue;
- deberá protegerse contra invocaciones repetidas;
- no sustituye la reautenticación reciente;
- deberá validar explícitamente el UID y los estados cancelables;
- necesitará observabilidad y manejo de errores.

Uso preliminar recomendado:

```text
cancelAccountDeletionRequest
```

El nombre definitivo deberá elegirse únicamente cuando comience la implementación.

### Alternativa B: endpoint HTTP autorizado

Un endpoint HTTP podría ejecutar el mismo procedimiento desde un servicio administrado o servidor propio.

Ventajas previstas:

- control explícito de rutas, encabezados y respuestas;
- portabilidad hacia otros proveedores;
- posibilidad de separar el backend del proyecto Firebase;
- flexibilidad para integraciones externas futuras.

Riesgos y requisitos:

- autenticación manual más compleja;
- validación explícita de tokens;
- configuración de CORS cuando corresponda;
- mayor superficie de seguridad;
- necesidad de administrar despliegue, escalado y observabilidad;
- riesgo de duplicar funciones que Firebase ya proporciona;
- posible incremento del mantenimiento operativo.

Esta alternativa no se recomienda como primera opción mientras LangBridge continúe utilizando principalmente servicios de Firebase.

### Alternativa C: proceso administrativo provisional

Un proceso administrativo provisional podría ejecutar cancelaciones de forma manual o semiautomatizada durante las primeras pruebas internas.

Ventajas previstas:

- permite validar el procedimiento antes de desplegar un backend público;
- reduce el riesgo de automatizar prematuramente;
- permite utilizar exclusivamente cuentas desechables;
- facilita revisar cada transición durante las pruebas iniciales.

Limitaciones:

- no es adecuado para producción;
- depende de intervención humana;
- puede provocar demoras;
- aumenta el riesgo de errores operativos;
- no satisface el objetivo de procesamiento automático;
- no deberá usar credenciales personales incrustadas en scripts;
- no podrá convertirse en el procedimiento permanente.

Esta alternativa solo podría utilizarse durante pruebas locales y controladas.

### Alternativa D: función programada para expiración

Una función programada podría buscar registros cancelados vencidos y eliminarlos periódicamente.

Ventajas previstas:

- permite comprobaciones adicionales antes de eliminar;
- permite métricas, reintentos y registros técnicos;
- puede detectar datos inconsistentes;
- ofrece control sobre lotes y concurrencia;
- puede servir como comprobación complementaria.

Riesgos y requisitos:

- utiliza infraestructura programada;
- puede ejecutarse más de una vez;
- puede solaparse con otra ejecución;
- requiere idempotencia estricta;
- puede implicar costos de Cloud Scheduler y Cloud Functions;
- puede requerir el plan Blaze;
- exige supervisión del proceso.

No deberá suponerse que una sola ejecución programada ocurrirá exactamente una vez.

### Alternativa E: política TTL de Firestore

Una política TTL podría usar `expiresAt` para eliminar automáticamente los documentos vencidos de:

```text
cancelledDeletionRequests
```

Ventajas previstas:

- menor cantidad de código personalizado;
- eliminación automática basada en un campo definido;
- reducción del almacenamiento de datos vencidos;
- separación entre creación del registro y limpieza posterior;
- menor superficie de errores en un proceso programado propio.

Limitaciones y consideraciones:

- la eliminación no será instantánea al alcanzar `expiresAt`;
- un documento vencido podrá existir durante una ventana técnica posterior;
- la eliminación podrá ocurrir horas después del vencimiento;
- las eliminaciones contarán como operaciones de Firestore;
- TTL no deberá modificar una cuenta activa;
- TTL no deberá utilizarse para ejecutar la restauración;
- TTL solo eliminará el registro cancelado mínimo;
- deberá verificarse su disponibilidad, configuración y costo;
- no deberá aplicarse accidentalmente a la solicitud activa ni a DEL-S2.

Antes de aprobar TTL deberá determinarse si la política legal admite una ventana técnica razonable después del vencimiento.

### Alternativa F: proceso local exclusivo para emuladores

Antes de seleccionar una infraestructura de producción podrá implementarse una versión local destinada exclusivamente a Emulator Suite.

Esta versión permitirá:

- probar restauración del perfil;
- probar eliminación de la solicitud activa;
- crear registros cancelados sintéticos;
- comprobar idempotencia;
- simular concurrencia;
- probar expiraciones;
- verificar que no se cree DEL-S2;
- trabajar únicamente con cuentas desechables;
- evitar despliegues prematuros.

La implementación local no deberá confundirse con una solución de producción.

## 15.1 Arquitectura preliminar recomendada

La arquitectura preliminar recomendada para LangBridge es:

```text
Aplicación móvil
    |
    | solicitud autenticada de cancelación
    v
Función invocable protegida
    |
    | validación de identidad, estado y punto de no retorno
    v
Operación administrativa idempotente
    |
    +-- restaurar el perfil
    +-- retirar marcas de eliminación
    +-- crear el registro cancelado mínimo
    +-- eliminar la solicitud activa
    +-- eliminar datos temporales
    |
    v
Política TTL basada en expiresAt
```

La función invocable manejaría la cancelación inmediata.

La política TTL manejaría exclusivamente la eliminación posterior del registro cancelado mínimo.

Una tarea programada podría considerarse como mecanismo complementario de verificación, pero no será obligatoria en el diseño inicial.

## 15.2 Recomendación preliminar por responsabilidad

### Solicitud de cancelación

Alternativa recomendada:

```text
función invocable protegida
```

### Restauración de visibilidad

Alternativa recomendada:

```text
operación administrativa atómica o transaccional
```

### Creación del registro cancelado

Alternativa recomendada:

```text
backend autorizado con cancellationRecordId opaco
```

### Eliminación de la solicitud activa

Alternativa recomendada:

```text
misma operación administrativa de cancelación
```

### Expiración a los 30 días

Alternativa preliminar recomendada:

```text
política TTL basada en expiresAt
```

### Verificación complementaria

Alternativa opcional:

```text
función programada idempotente
```

## 15.3 App Check

App Check podrá añadirse como una capa complementaria para reducir solicitudes provenientes de clientes no autorizados.

App Check:

- no sustituirá Firebase Authentication;
- no sustituirá la reautenticación;
- no decidirá si una solicitud es cancelable;
- no sustituirá las comprobaciones del punto de no retorno;
- no autorizará directamente escrituras administrativas;
- deberá probarse antes de exigirse en producción.

La aplicación deberá manejar de forma segura los errores producidos cuando App Check no esté disponible o no sea válido.

## 15.4 Reautenticación reciente

La función de cancelación no deberá confiar únicamente en que exista una sesión iniciada.

Antes de invocar el backend, la aplicación deberá realizar una comprobación de identidad apropiada según el proveedor de autenticación.

Posibles métodos:

```text
correo y contraseña:
  reautenticación con credenciales

proveedor federado:
  reautenticación con el proveedor correspondiente
```

El backend deberá recibir únicamente evidencia válida y verificable a través de los mecanismos admitidos por Firebase Authentication.

No deberá recibir contraseñas, tokens escritos manualmente ni credenciales almacenadas por la aplicación.

La ventana exacta considerada como sesión reciente deberá decidirse antes de la implementación.

## 15.5 Región y versión de ejecución

Antes de crear infraestructura deberán seleccionarse:

- una región compatible con la ubicación principal de los datos;
- una versión de Node.js admitida;
- una generación de Cloud Functions;
- límites de memoria y tiempo;
- configuración de concurrencia;
- políticas de reintento;
- retención de registros técnicos.

La decisión deberá minimizar:

- latencia;
- transferencias innecesarias;
- costos;
- diferencias entre emulador y producción.

## 15.6 Costos y Blaze

No se activará Blaze durante la fase actual.

Antes de activarlo deberá existir:

1. Estimación de invocaciones mensuales.
2. Estimación de lecturas y escrituras administrativas.
3. Estimación de eliminaciones TTL.
4. Estimación de tareas programadas.
5. Alertas de presupuesto.
6. Límites de uso cuando sean aplicables.
7. Procedimiento para detener despliegues.
8. Procedimiento de reversión.
9. Aprobación explícita del responsable del proyecto.

La activación de Blaze no se considerará implícita por escribir o probar código localmente.

## 15.7 Pruebas con Emulator Suite

Antes de cualquier despliegue deberán probarse localmente:

- función de cancelación autenticada;
- rechazo sin autenticación;
- rechazo con UID diferente;
- rechazo sin reautenticación;
- cancelación en `pending`;
- cancelación en `verified`;
- cancelación condicionada en `processing`;
- rechazo después del punto de no retorno;
- restauración de visibilidad;
- creación única del registro cancelado;
- eliminación de la solicitud activa;
- ausencia de DEL-S2;
- reintentos idempotentes;
- concurrencia;
- expiración simulada;
- errores parciales;
- posibilidad de crear una solicitud nueva.

Las pruebas locales no deberán utilizar cuentas ni datos reales.

## 15.8 Decisiones todavía pendientes

Permanecen pendientes:

- aprobación definitiva de Cloud Functions;
- aprobación de una función invocable;
- selección de versión de Node.js;
- selección de región;
- definición de la sesión reciente;
- estrategia exacta de reautenticación;
- decisión final sobre TTL;
- decisión sobre una función programada complementaria;
- configuración de App Check;
- estimación de costos;
- aprobación de Blaze;
- diseño de métricas y observabilidad;
- procedimiento de despliegue y reversión.

No se creará infraestructura hasta cerrar estas decisiones.

## 16. Restricciones actuales

Durante esta fase:

- No se creará la carpeta `functions`.
- No se instalará `firebase-functions`.
- No se instalará `firebase-admin`.
- No se activará Blaze.
- No se desplegará Firebase.
- No se probará con cuentas reales.
- No se abrirán permisos de cancelación al cliente.
- No se ejecutará una eliminación real.

## 17. Próximo paso técnico

El próximo paso será cerrar las decisiones mínimas necesarias antes de crear infraestructura de backend.

El siguiente bloque deberá:

1. Validar la arquitectura preliminar recomendada.
2. Definir la estrategia de reautenticación reciente.
3. Establecer el criterio técnico del punto de no retorno.
4. Decidir si `expiresAt` utilizará una política TTL.
5. Determinar si será necesaria una función programada complementaria.
6. Seleccionar una versión compatible de Node.js.
7. Seleccionar la región de ejecución.
8. Preparar una estimación inicial de costos.
9. Definir alertas y límites de presupuesto antes de considerar Blaze.
10. Diseñar las pruebas locales del backend mediante Emulator Suite.
11. Preparar un procedimiento de despliegue y reversión.
12. Solicitar aprobación explícita antes de crear infraestructura o activar facturación.

Hasta completar estas decisiones:

- no se creará la carpeta `functions`;
- no se instalarán dependencias administrativas;
- no se activará Blaze;
- no se desplegará Firebase;
- no se abrirán permisos administrativos al cliente;
- no se ejecutarán cancelaciones con cuentas reales.

La implementación del backend comenzará únicamente después de aprobar la arquitectura, los controles de seguridad, las pruebas locales y el impacto económico.