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

La cancelación deberá ejecutarse exclusivamente mediante un backend autorizado. El cliente no podrá restaurar el perfil, modificar el estado de la solicitud, eliminar la solicitud activa ni crear directamente el registro cancelado.

### 8.1. Autenticación y solicitud

Antes de iniciar la operación, el backend deberá:

1. Exigir una llamada autenticada.
2. Obtener el `uid` exclusivamente del contexto autenticado.
3. Rechazar cualquier `uid` libre enviado por el cliente.
4. Comprobar que el token contiene un `auth_time` válido.
5. Confirmar que la reautenticación ocurrió dentro de la ventana reciente permitida.
6. Rechazar la cancelación si falta `auth_time`, si es inválido o si la ventana permitida ha vencido.
7. No recibir, guardar ni registrar contraseñas, credenciales de Google, tokens de acceso ni otros secretos de reautenticación.

La ventana técnica inicial propuesta es de cinco minutos. Este valor continúa pendiente de pruebas y aprobación definitiva antes de implementarlo.

### 8.2. Validación de la solicitud activa

El backend deberá leer `accountDeletionRequests/{uid}` y comprobar que:

1. La solicitud existe.
2. El campo `userId` coincide con el `uid` autenticado.
3. El estado actual permite cancelación.
4. Los estados `pending` y `verified` son cancelables después de verificar nuevamente la identidad.
5. El estado `processing` solo es cancelable si todavía no se alcanzó el punto técnico de no retorno.
6. El estado `completed` nunca es cancelable.
7. `pointOfNoReturnAt` está ausente.
8. No existe una cancelación previamente confirmada para la misma operación.

La presencia de `pointOfNoReturnAt` deberá provocar el rechazo de la cancelación, aunque una parte del cliente todavía muestre la opción de cancelar.

### 8.3. Carrera con el procesador de eliminación

La cancelación y el avance de la eliminación deberán competir mediante una transacción o mecanismo equivalente protegido por el backend.

Dentro de esa operación protegida, el backend deberá volver a leer la solicitud activa y confirmar simultáneamente:

- que el estado continúa siendo cancelable;
- que `pointOfNoReturnAt` continúa ausente;
- que ninguna cancelación fue confirmada previamente;
- que el procesador de eliminación no obtuvo antes el derecho de comenzar una operación irreversible.

Solo una transición podrá confirmarse primero:

- cancelación confirmada; o
- punto de no retorno confirmado.

Si la cancelación gana la carrera:

- no se establecerá `pointOfNoReturnAt`;
- no comenzará ninguna operación irreversible;
- se restaurará el perfil;
- la solicitud activa se cerrará como cancelada.

Si el procesador de eliminación gana la carrera:

- la cancelación será rechazada;
- la solicitud permanecerá en `processing`;
- no se restaurará el perfil;
- la eliminación continuará mediante operaciones idempotentes.

### 8.4. Restauración y cierre de la solicitud

Cuando la cancelación sea válida y gane la carrera, el backend deberá ejecutar de forma atómica o mediante un procedimiento idempotente coordinado:

1. Leer `previousProfileVisibility` desde la solicitud activa.
2. Confirmar que `previousProfileVisibility` sea booleano.
3. Confirmar que exista `users/{uid}`.
4. Restaurar `users/{uid}.isProfileVisible` con el valor conservado.
5. Retirar `users/{uid}.deletionRequested`.
6. Retirar `users/{uid}.deletionRequestedAt`.
7. Verificar que la restauración del perfil haya finalizado correctamente.
8. Crear una sola vez el registro cancelado mínimo.
9. Establecer `cancelledAt` con la hora del servidor.
10. Establecer `expiresAt` exactamente a 30 días calendario desde `cancelledAt`.
11. Eliminar la solicitud activa identificable.
12. Eliminar `previousProfileVisibility` y cualquier otro dato temporal de restauración al completar y verificar la restauración.
13. Permitir una nueva solicitud de eliminación posterior.
14. No crear un recibo DEL-S2.

La solicitud activa no deberá eliminarse antes de que la restauración del perfil y la creación del registro cancelado mínimo estén confirmadas.

### 8.5. Idempotencia y reintentos

La operación deberá ser segura ante reintentos, respuestas perdidas y ejecuciones concurrentes.

Si el backend recibe nuevamente la misma operación después de completar la cancelación, deberá:

- reconocer que la cancelación ya fue completada;
- no crear un segundo registro cancelado;
- no extender `expiresAt`;
- no volver a aplicar cambios incompatibles al perfil;
- no recrear la solicitud activa;
- no crear DEL-S2;
- devolver una respuesta idempotente que no exponga identificadores internos ni datos personales.

Si ocurre un fallo antes de confirmar la operación protegida, podrá reintentarse desde el inicio.

Si ocurre un fallo después de confirmar la cancelación, el backend deberá continuar únicamente las operaciones pendientes de restauración y limpieza, sin permitir que el procesador de eliminación alcance posteriormente el punto de no retorno.

### 8.6. Resultado esperado

Una cancelación completada deberá dejar el sistema en el siguiente estado:

- la cuenta continúa activa;
- la visibilidad anterior del perfil queda restaurada;
- `deletionRequested` y `deletionRequestedAt` quedan retirados;
- la solicitud activa identificable deja de existir;
- existe un único registro cancelado mínimo con expiración a 30 días;
- no permanece `previousProfileVisibility`;
- no se ejecuta ninguna operación irreversible;
- no se crea DEL-S2;
- la persona puede crear una nueva solicitud de eliminación en el futuro.

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

El futuro backend deberá devolver respuestas generales, seguras e idempotentes. La aplicación utilizará códigos estables para seleccionar mensajes localizados, pero no mostrará directamente textos técnicos enviados por el backend.

### Resultados permitidos

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

Los códigos tendrán el siguiente significado general:

- `cancelled`: la cancelación fue completada o un reintento confirmó que ya estaba completada.
- `not-cancellable`: la solicitud existe, pero su estado actual no permite cancelarla.
- `identity-verification-required`: la identidad deberá verificarse nuevamente antes de continuar.
- `recent-session-required`: la sesión autenticada no cumple la ventana reciente permitida.
- `request-not-found`: no se encontró una solicitud activa que pueda procesarse.
- `point-of-no-return-reached`: la eliminación alcanzó el punto técnico de no retorno y ya no puede cancelarse.
- `restoration-pending`: la cancelación fue aceptada, pero todavía existen operaciones idempotentes de restauración o limpieza pendientes.
- `temporary-error`: ocurrió un fallo transitorio y la operación podrá reintentarse de forma segura.

### Comportamiento de la aplicación

La aplicación deberá:

1. Tratar `cancelled` como un resultado exitoso e idempotente.
2. Actualizar la interfaz solo después de recibir una respuesta segura del backend.
3. Solicitar una nueva verificación cuando reciba `identity-verification-required`.
4. Solicitar reautenticación cuando reciba `recent-session-required`.
5. Impedir nuevos intentos de cancelación cuando reciba `point-of-no-return-reached`.
6. Mantener una presentación no destructiva mientras reciba `restoration-pending`.
7. Permitir un reintento controlado cuando reciba `temporary-error`.
8. No inferir que la eliminación terminó únicamente porque la solicitud activa ya no pueda leerse desde el cliente.
9. No crear, modificar ni eliminar registros protegidos como respuesta a uno de estos códigos.
10. No mostrar rutas internas, identificadores administrativos ni detalles técnicos sensibles.

### Localización

Los códigos serán independientes del idioma y no se mostrarán literalmente a la persona.

La aplicación deberá asociar cada código con una clave de traducción controlada y disponible en los 16 idiomas activos. Los mensajes localizados deberán:

- explicar el resultado de manera clara;
- evitar detalles administrativos internos;
- no revelar la existencia de registros protegidos;
- no incluir UID, correo, fechas internas ni identificadores;
- diferenciar un resultado exitoso, una verificación requerida, un rechazo definitivo y un error temporal;
- mantener el mismo significado jurídico y técnico en todos los idiomas.

La ausencia de una traducción no deberá provocar que se muestre el código técnico directamente. Deberá utilizarse un mensaje general seguro previamente definido.

### Información prohibida en las respuestas

Las respuestas no deberán exponer:

- UID o correo;
- fechas internas;
- `cancellationRecordId`;
- claves de idempotencia;
- detalles administrativos internos;
- credenciales;
- tokens;
- rutas protegidas;
- datos de otras cuentas;
- estados o fases internas no destinados al cliente;
- información que facilite eludir controles de seguridad.

Las respuestas tampoco deberán permitir determinar si el registro cancelado todavía existe o si ya fue eliminado por expiración.

## 13. Reglas de seguridad

La cancelación deberá permanecer fuera de los permisos directos de la aplicación móvil. Todas las operaciones privilegiadas deberán ejecutarse exclusivamente desde un backend autorizado.

### Autenticación y autorización

El backend deberá:

1. Exigir una llamada autenticada.
2. Obtener el `uid` exclusivamente del contexto de autenticación verificado.
3. Ignorar y rechazar cualquier `uid` libre enviado por la aplicación.
4. Comprobar que el token pertenezca a la cuenta cuya solicitud se procesa.
5. Verificar que exista un `auth_time` válido.
6. Comprobar que la reautenticación se encuentre dentro de la ventana reciente permitida.
7. Rechazar tokens ausentes, inválidos, vencidos o revocados.
8. Aplicar el principio de privilegios mínimos a la identidad de ejecución del backend.
9. No recibir ni registrar contraseñas, credenciales federadas, tokens de acceso ni secretos utilizados durante la reautenticación.

La comprobación de `auth_time` deberá realizarse exclusivamente en el backend y no depender de fechas proporcionadas por el dispositivo.

### Operaciones prohibidas para la aplicación

La aplicación móvil no podrá:

- leer directamente la solicitud protegida;
- actualizar el estado de la solicitud;
- marcar la solicitud como `cancelled`;
- eliminar la solicitud activa;
- establecer o retirar `pointOfNoReturnAt`;
- establecer o modificar `pointOfNoReturnOperation`;
- declarar que no se alcanzó el punto de no retorno;
- proporcionar `previousProfileVisibility` durante la cancelación;
- restaurar directamente el perfil como parte de la cancelación;
- retirar directamente `deletionRequested`;
- retirar directamente `deletionRequestedAt`;
- crear el registro cancelado;
- seleccionar `cancellationRecordId`;
- modificar `cancelledAt`;
- modificar `expiresAt`;
- modificar el resultado técnico de restauración;
- crear DEL-S2;
- ejecutar operaciones administrativas de expiración.

Estas operaciones deberán reservarse para el backend autorizado.

### Protección de documentos

Las reglas de seguridad deberán impedir que la aplicación móvil lea, cree, actualice o elimine directamente registros de:

```text
cancelledDeletionRequests/{cancellationRecordId}
```

La solicitud activa:

```text
accountDeletionRequests/{uid}
```

continuará protegida contra lectura, actualización y eliminación directa desde el cliente.

La creación inicial de una solicitud desde la aplicación solo podrá permanecer permitida bajo las validaciones estrictas ya definidas, incluyendo:

- ID del documento igual al UID autenticado;
- estado inicial permitido;
- campos limitados;
- `previousProfileVisibility` protegido;
- ocultamiento atómico del perfil;
- `deletionRequested` establecido correctamente;
- `deletionRequestedAt` igual a la hora del servidor.

La existencia de permisos para crear una solicitud inicial no deberá conceder permisos para cancelarla o procesarla.

### Concurrencia y punto de no retorno

La autorización del backend no será suficiente por sí sola para aprobar una cancelación.

Cada operación deberá comprobar dentro de una transacción o mecanismo protegido equivalente:

- que la solicitud activa todavía existe;
- que el estado continúa siendo cancelable;
- que `pointOfNoReturnAt` está ausente;
- que la cancelación no fue completada previamente;
- que el procesador de eliminación no ganó previamente la carrera.

La cancelación deberá rechazarse si el punto de no retorno fue confirmado antes de la transacción de cancelación.
### App Check y controles complementarios

App Check podrá utilizarse como una capa complementaria para reducir llamadas abusivas o procedentes de clientes no autorizados.

App Check:

- no sustituirá Firebase Authentication;
- no sustituirá la reautenticación reciente;
- no sustituirá la comprobación de `auth_time`;
- no sustituirá la validación del estado;
- no sustituirá la transacción contra el punto de no retorno;
- no concederá permisos administrativos al cliente;
- no se considerará por sí solo una prueba de identidad.

La decisión definitiva sobre App Check dependerá de la arquitectura de backend seleccionada y deberá probarse antes de producción.

### Registros y observabilidad

Los registros técnicos del backend deberán aplicar minimización de datos.

No deberán registrar:

- contraseñas;
- credenciales federadas;
- tokens de acceso o sesión;
- contenido de mensajes o conversaciones;
- contenido de reportes;
- copias del perfil;
- `previousProfileVisibility` después de completar la restauración;
- identificadores internos innecesarios;
- datos personales que no sean indispensables para diagnosticar un fallo autorizado.

Los errores deberán utilizar categorías técnicas generales y no deberán exponer información protegida en las respuestas destinadas a la aplicación.

### Defensa ante abuso

El backend futuro deberá contemplar:

- limitación controlada de reintentos;
- rechazo de solicitudes malformadas;
- validación estricta de campos;
- protección contra llamadas concurrentes;
- prevención de duplicados;
- control de tamaño de las solicitudes;
- observabilidad de fallos sin conservar datos personales innecesarios;
- revisión de App Check y mecanismos de limitación antes de producción.

Las medidas contra abuso no deberán impedir que una persona legítimamente autenticada reintente una cancelación después de un error transitorio seguro.

## 14. Pruebas futuras

Antes de implementar en producción deberá existir cobertura automatizada para el backend, las reglas de seguridad y la integración controlada con la aplicación.

### Autenticación y reautenticación

Las pruebas deberán comprobar:

1. Aceptación de una llamada autenticada con reautenticación reciente válida.
2. Rechazo de una llamada no autenticada.
3. Rechazo de un token inválido, vencido o revocado.
4. Rechazo cuando falta `auth_time`.
5. Rechazo cuando `auth_time` no es válido.
6. Rechazo cuando la ventana de reautenticación reciente ha vencido.
7. Obtención del `uid` exclusivamente desde el contexto autenticado.
8. Rechazo de un `uid` libre enviado por el cliente.
9. Rechazo cuando el contexto autenticado no coincide con la solicitud activa.
10. Ausencia de contraseñas, credenciales y tokens en registros técnicos.

### Estados y posibilidad de cancelación

Las pruebas deberán comprobar:

1. Cancelación válida en `pending`.
2. Cancelación válida en `verified`.
3. Cancelación condicional en `processing` antes del punto de no retorno.
4. Rechazo en `processing` después del punto de no retorno.
5. Rechazo en `completed`.
6. Rechazo de estados desconocidos o malformados.
7. Rechazo cuando la solicitud activa no existe.
8. Rechazo cuando `userId` no coincide con el `uid` autenticado.
9. Imposibilidad de reactivar una solicitud cancelada.
10. Posibilidad de presentar una nueva solicitud después de completar la cancelación.

### Concurrencia y punto de no retorno

Las pruebas deberán comprobar:

1. Carrera entre la cancelación y el establecimiento de `pointOfNoReturnAt`.
2. Victoria única de la cancelación cuando confirma primero.
3. Victoria única del procesador de eliminación cuando confirma primero.
4. Rechazo de la cancelación cuando `pointOfNoReturnAt` ya existe.
5. Imposibilidad de establecer el punto de no retorno después de confirmar la cancelación.
6. Imposibilidad de confirmar simultáneamente ambas transiciones.
7. Inmutabilidad de `pointOfNoReturnAt`.
8. Establecimiento conjunto de `pointOfNoReturnAt` y `pointOfNoReturnOperation`.
9. Rechazo de valores no permitidos para `pointOfNoReturnOperation`.
10. Ausencia de operaciones irreversibles cuando la cancelación gana la carrera.

### Restauración del perfil

Las pruebas deberán comprobar:

1. Restauración de un perfil originalmente visible.
2. Conservación de un perfil originalmente oculto.
3. Compatibilidad con perfiles históricos sin `isProfileVisible`.
4. Rechazo de `previousProfileVisibility` ausente o no booleano.
5. Rechazo de `previousProfileVisibility` falsificado.
6. Retirada de `deletionRequested`.
7. Retirada de `deletionRequestedAt`.
8. Conservación de todos los demás campos del perfil.
9. Rechazo si `users/{uid}` no existe.
10. Eliminación del dato temporal de restauración después de verificar el resultado.

### Registro cancelado mínimo

Las pruebas deberán comprobar:

1. Creación de un único registro cancelado.
2. Generación de un `cancellationRecordId` aleatorio y opaco.
3. Imposibilidad de derivar el identificador desde el UID o correo.
4. Uso de `status: cancelled`.
5. Uso de hora del servidor para `cancelledAt`.
6. Cálculo de `expiresAt` desde `cancelledAt`.
7. Inmutabilidad de `cancelledAt`.
8. Inmutabilidad de `expiresAt`.
9. Presencia exclusiva de campos permitidos.
10. Ausencia de UID, correo, `requestId` y `previousProfileVisibility`.
11. Ausencia de contenido, credenciales, tokens y copias del perfil.
12. Ausencia de identificadores DEL-S2.
13. Rechazo de valores no permitidos en campos de lista cerrada.
14. Eliminación de la solicitud activa solo después de confirmar la restauración y el registro cancelado.

### Idempotencia y reintentos

Las pruebas deberán comprobar:

1. Reintento seguro después de una interrupción antes de restaurar el perfil.
2. Reintento seguro después de restaurar el perfil.
3. Reintento seguro después de crear el registro cancelado.
4. Reintento seguro después de eliminar la solicitud activa.
5. Respuesta idempotente después de completar la cancelación.
6. Ausencia de registros cancelados duplicados.
7. Ausencia de cambios incompatibles en la visibilidad del perfil.
8. Imposibilidad de recrear una solicitud activa eliminada.
9. Imposibilidad de extender `expiresAt`.
10. Imposibilidad de crear DEL-S2 durante un reintento.
11. Recuperación segura después de perder la respuesta al cliente.
12. Comportamiento correcto ante dos llamadas concurrentes de cancelación.

### Retención y expiración

Las pruebas deberán comprobar:

1. Inicio del plazo después de completar y verificar la cancelación.
2. Vencimiento exactamente 30 días calendario después de `cancelledAt`.
3. Eliminación completa del registro al vencer `expiresAt`.
4. Reintento seguro si el registro ya fue eliminado.
5. Imposibilidad de recrear un registro vencido.
6. Ausencia de cambios en la cuenta activa durante la expiración.
7. Ausencia de cambios en una nueva solicitud activa.
8. Ausencia de cambios en la visibilidad del perfil.
9. Ausencia de DEL-S2.
10. Ausencia de una nueva comunicación de cancelación por la expiración.

### Reglas de seguridad y acceso directo

Las pruebas deberán comprobar:

1. Rechazo de lectura directa de la solicitud activa desde la aplicación.
2. Rechazo de actualización directa de la solicitud activa.
3. Rechazo de cancelación directa desde la aplicación.
4. Rechazo de eliminación directa de la solicitud activa.
5. Rechazo de lectura directa del registro cancelado.
6. Rechazo de creación directa del registro cancelado.
7. Rechazo de actualización directa del registro cancelado.
8. Rechazo de eliminación directa del registro cancelado.
9. Rechazo de modificación directa de `pointOfNoReturnAt`.
10. Rechazo de restauración directa del perfil como parte de la cancelación.
11. Conservación de las validaciones estrictas para crear la solicitud inicial.
12. Prevención de dos solicitudes activas simultáneas.

### Respuestas para la aplicación

Las pruebas deberán comprobar:

1. Respuesta `cancelled` después de completar la cancelación.
2. Respuesta idempotente `cancelled` después de un reintento completado.
3. Respuesta `not-cancellable` para estados no cancelables.
4. Respuesta `identity-verification-required` cuando corresponda.
5. Respuesta `recent-session-required` cuando la reautenticación haya vencido.
6. Respuesta `request-not-found` cuando no exista una solicitud procesable.
7. Respuesta `point-of-no-return-reached` cuando corresponda.
8. Respuesta `restoration-pending` durante una recuperación idempotente.
9. Respuesta `temporary-error` ante un fallo transitorio seguro.
10. Ausencia de UID, correo, fechas e identificadores internos en las respuestas.
11. Ausencia de información que revele la existencia del registro cancelado.
12. Uso de mensajes localizados en los 16 idiomas activos.
13. Uso de un mensaje general seguro cuando falte una traducción.
14. Imposibilidad de mostrar directamente un código técnico a la persona.

### Ausencia de efectos destructivos

Todas las rutas de cancelación y sus reintentos deberán probar que no:

- eliminan conversaciones;
- eliminan mensajes;
- eliminan solicitudes o conexiones ordinarias;
- eliminan reportes;
- alteran listas de bloqueos;
- eliminan `users/{uid}`;
- eliminan Firebase Authentication;
- modifican datos de otras cuentas;
- crean DEL-S2;
- ejecutan ninguna otra operación irreversible.

### Entornos y condiciones de prueba

Las pruebas deberán ejecutarse inicialmente con Emulator Suite y cuentas desechables.

Antes de producción deberá existir cobertura para:

- ejecución local controlada;
- errores parciales simulados;
- llamadas concurrentes;
- respuestas perdidas;
- reintentos;
- expiración simulada;
- tokens y sesiones inválidos;
- perfiles visibles, ocultos e históricos;
- ausencia temporal de documentos;
- reglas desplegadas en un proyecto separado de pruebas.

No deberán utilizarse cuentas reales ni datos personales reales para validar operaciones destructivas.


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