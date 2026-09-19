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

## 6. Requisitos de identidad

Antes de cancelar, el backend deberá comprobar:

1. Que exista una persona autenticada.
2. Que el UID autenticado coincida con la solicitud activa.
3. Que la identidad haya sido verificada nuevamente.
4. Que la sesión sea suficientemente reciente.
5. Que la solicitud permanezca en un estado cancelable.

La definición técnica exacta de sesión reciente permanece pendiente.

## 7. Punto técnico de no retorno

El backend deberá mantener un indicador explícito que permita determinar si comenzó una operación irreversible.

El indicador técnico todavía deberá diseñarse.

Posibles elementos futuros:

```text
irreversibleProcessingStartedAt
irreversibleOperation
canCancel
processingCheckpoint
```

No se seleccionará ningún campo definitivo hasta diseñar el procesador integral de eliminación.

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

## 15. Infraestructura pendiente

Antes de implementar deberán decidirse:

- Tecnología del backend autorizado.
- Necesidad de Cloud Functions.
- Versión de Node.js.
- Región de ejecución.
- Uso de funciones invocables o endpoints HTTP.
- Validación mediante App Check.
- Estrategia de reautenticación.
- Programación de expiraciones.
- Gestión de secretos.
- Registro técnico mínimo.
- Costos y posible necesidad de Blaze.
- Procedimiento de despliegue.
- Estrategia de reversión.
- Pruebas con emuladores.

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

El próximo paso será definir el contrato de datos del registro cancelado y evaluar las alternativas de backend, manteniendo separadas:

1. La solicitud activa identificable.
2. El registro cancelado temporal.
3. El recibo DEL-S2 posterior a una eliminación completada.

La implementación continuará únicamente después de validar el diseño, las pruebas necesarias y el impacto de infraestructura.