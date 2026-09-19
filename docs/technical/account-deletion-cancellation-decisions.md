# Matriz de decisiones técnicas del backend de cancelación

**Proyecto:** LangBridge  
**Área:** Cancelación de solicitudes de eliminación  
**Estado:** En evaluación  
**Documento principal relacionado:** `account-deletion-cancellation-backend.md`

## 1. Objetivo

Esta matriz registra y compara las decisiones técnicas necesarias antes de crear la infraestructura del backend de cancelación.

Su finalidad es distinguir claramente:

- la opción recomendada;
- las alternativas consideradas;
- las ventajas;
- los riesgos;
- el impacto sobre seguridad;
- la compatibilidad con Emulator Suite;
- los costos potenciales;
- la necesidad o no de Blaze;
- el estado de aprobación.

## 2. Restricciones vigentes

Mientras esta matriz no esté cerrada y aprobada:

- no se creará la carpeta `functions`;
- no se instalarán `firebase-functions` ni `firebase-admin`;
- no se modificará `firebase.json` para agregar Functions;
- no se activará Blaze;
- no se configurará TTL en producción;
- no se desplegará Firebase;
- no se abrirán permisos administrativos al cliente;
- no se utilizarán cuentas reales;
- no se ejecutará ninguna operación irreversible.

## 3. Estados de decisión

Cada decisión utilizará uno de estos estados:

- `pendiente`: todavía no evaluada completamente;
- `recomendada`: existe una opción técnica preferida, pero no está aprobada;
- `aprobada`: autorizada documentalmente para la siguiente fase;
- `rechazada`: descartada con una justificación registrada;
- `diferida`: pospuesta para una etapa posterior;
- `requiere-prueba`: depende de una validación local antes de aprobarse.

## 4. Resumen de decisiones

| ID | Decisión | Recomendación preliminar | Estado |
|---|---|---|---|
| DEC-BE-001 | Plataforma de backend | Cloud Functions | recomendada |
| DEC-BE-002 | Tipo de función | Función invocable protegida | recomendada |
| DEC-BE-003 | Versión de Node.js | Pendiente de validación | pendiente |
| DEC-BE-004 | Generación de Functions | Pendiente de validación | pendiente |
| DEC-BE-005 | Región de ejecución | Pendiente de evaluación | pendiente |
| DEC-BE-006 | Ventana de reautenticación | Cinco minutos | requiere-prueba |
| DEC-BE-007 | Expiración del registro cancelado | Política TTL | requiere-prueba |
| DEC-BE-008 | Función programada complementaria | No necesaria inicialmente | diferida |
| DEC-BE-009 | App Check | Capa complementaria futura | diferida |
| DEC-BE-010 | Estrategia de idempotencia | Clave interna y operación protegida | pendiente |
| DEC-BE-011 | Métricas y observabilidad | Registros técnicos mínimos | pendiente |
| DEC-BE-012 | Costos y Blaze | No activar todavía | pendiente |
| DEC-BE-013 | Despliegue y reversión | Procedimiento previo obligatorio | pendiente |
## 5. Decisiones detalladas

### DEC-BE-001: Plataforma de backend

**Pregunta:** ¿Qué plataforma deberá ejecutar las operaciones administrativas de cancelación?

**Recomendación preliminar:** Cloud Functions for Firebase.

**Estado:** recomendada.

#### Alternativas consideradas

1. Cloud Functions for Firebase.
2. Endpoint HTTP en Cloud Run o servicio administrado equivalente.
3. Backend externo independiente de Firebase.
4. Proceso administrativo provisional.
5. Proceso local exclusivo para Emulator Suite.

#### Razones de la recomendación

Cloud Functions es la opción preliminar preferida porque:

- LangBridge ya utiliza Firebase Authentication y Cloud Firestore;
- permite aislar las operaciones administrativas del cliente;
- facilita validar el contexto autenticado;
- admite el uso de Firebase Admin SDK;
- permite implementar una función invocable;
- puede integrarse con App Check;
- es compatible con Emulator Suite;
- reduce la necesidad de administrar manualmente rutas HTTP y validación de tokens;
- mantiene la lógica de cancelación cerca de los servicios que deberá coordinar.

#### Riesgos y condiciones

La recomendación no implica autorización para desplegar.

Antes de aprobar Cloud Functions para producción deberán resolverse:

- versión compatible de Node.js;
- generación de Cloud Functions;
- región de ejecución;
- configuración de concurrencia;
- límites de memoria y tiempo;
- estrategia de reintentos;
- observabilidad y minimización de registros;
- costos potenciales;
- necesidad de Blaze;
- procedimiento de despliegue y reversión.

#### Alternativas descartadas provisionalmente

El endpoint HTTP y el backend externo no se recomiendan como primera opción porque introducirían una superficie adicional de autenticación, despliegue, escalado, CORS y mantenimiento.

El proceso administrativo provisional no es apropiado para producción, pero podrá utilizarse de forma limitada durante pruebas locales controladas.

El proceso local para Emulator Suite no sustituye una plataforma de producción. Se recomienda únicamente para desarrollar y validar la lógica antes de cualquier despliegue.

#### Seguridad

La plataforma seleccionada deberá:

- obtener el `uid` desde un contexto autenticado y verificado;
- comprobar `auth_time`;
- aplicar privilegios mínimos;
- ejecutar la carrera protegida contra el punto de no retorno;
- impedir escrituras administrativas directas desde el cliente;
- no registrar credenciales, tokens ni contenido;
- admitir operaciones idempotentes;
- evitar cualquier operación irreversible durante una cancelación válida.

#### Compatibilidad con Emulator Suite

Cloud Functions ofrece la ruta preliminar más directa para probar localmente:

- llamadas autenticadas;
- transacciones de Firestore;
- errores parciales;
- concurrencia;
- reintentos;
- respuestas seguras;
- ausencia de DEL-S2.

La compatibilidad deberá comprobarse mediante pruebas locales antes de aprobar la implementación.

#### Costos y Blaze

La creación del diseño o del código local no autorizará la activación de Blaze.

Antes de desplegar deberán existir:

- estimación inicial de invocaciones;
- estimación de lecturas, escrituras y eliminaciones;
- alertas presupuestarias;
- procedimiento para detener nuevos despliegues;
- procedimiento de reversión;
- aprobación explícita del responsable del proyecto.

#### Decisión propuesta

Adoptar provisionalmente Cloud Functions como plataforma candidata de producción y utilizar Emulator Suite como entorno inicial de desarrollo y pruebas.

Esta decisión permanecerá en estado `recomendada` hasta aprobar costos, región, versión de Node.js, generación de Functions y condiciones de despliegue.

### DEC-BE-002: Tipo de función

**Pregunta:** ¿Qué mecanismo deberá utilizar la aplicación móvil para solicitar al backend la cancelación de una solicitud de eliminación?

**Recomendación preliminar:** función invocable protegida.

**Estado:** recomendada.

#### Alternativas consideradas

1. Función invocable de Cloud Functions.
2. Función HTTP con endpoint propio.
3. Endpoint en Cloud Run.
4. Operación administrativa sin acceso directo desde la aplicación.

#### Razones de la recomendación

La función invocable es la opción preliminar preferida porque:

- se integra directamente con Firebase Authentication;
- permite recibir un contexto autenticado verificado;
- facilita obtener el `uid` sin aceptarlo como identificador libre del cliente;
- permite devolver códigos de resultado estructurados;
- reduce la configuración manual de rutas y encabezados;
- puede integrarse con App Check;
- es compatible con Emulator Suite;
- mantiene la operación administrativa fuera de las reglas directas del cliente;
- reduce la superficie inicial de implementación frente a un endpoint HTTP propio.

#### Contrato preliminar de entrada

La función invocable no deberá aceptar un `uid` proporcionado libremente por la aplicación.

La entrada deberá limitarse a datos estrictamente necesarios y no deberá incluir:

- UID;
- correo;
- contraseña;
- credenciales federadas;
- tokens de acceso;
- tokens de sesión;
- `previousProfileVisibility`;
- `cancelledAt`;
- `expiresAt`;
- `pointOfNoReturnAt`;
- `cancellationRecordId`;
- estados administrativos elegidos por el cliente.

Cuando no sea necesario ningún dato de negocio adicional, la función deberá admitir una entrada vacía o un objeto limitado y validado.

#### Contexto autenticado

La función deberá obtener del contexto autenticado:

- el `uid`;
- las marcas de autenticación disponibles;
- `auth_time`;
- la evidencia complementaria admitida por Firebase Authentication.

La función deberá rechazar:

- llamadas sin autenticación;
- contextos inválidos;
- `auth_time` ausente o inválido;
- sesiones fuera de la ventana reciente permitida;
- solicitudes que intenten seleccionar otra cuenta;
- datos desconocidos o innecesarios.

#### Contrato preliminar de respuesta

La función deberá devolver únicamente códigos generales permitidos:

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

La respuesta no deberá incluir:

- UID;
- correo;
- fechas internas;
- rutas de documentos;
- `cancellationRecordId`;
- claves de idempotencia;
- fases administrativas;
- contenido;
- credenciales;
- tokens;
- detalles que permitan correlacionar el registro cancelado con una cuenta.

#### Errores y reintentos

La función deberá distinguir entre:

- resultado exitoso e idempotente;
- verificación de identidad requerida;
- sesión reciente requerida;
- estado no cancelable;
- punto de no retorno alcanzado;
- restauración pendiente;
- error temporal seguro.

Los errores técnicos internos deberán transformarse en respuestas generales. La aplicación no deberá recibir trazas, mensajes administrativos libres ni detalles de Firebase Admin SDK.

Los reintentos deberán ser seguros y no podrán:

- duplicar el registro cancelado;
- extender `expiresAt`;
- recrear una solicitud activa;
- alterar nuevamente un perfil ya restaurado;
- crear DEL-S2;
- ejecutar operaciones irreversibles.

#### Alternativa HTTP

Una función HTTP o un endpoint de Cloud Run podría ofrecer mayor control sobre rutas, encabezados y portabilidad.

Sin embargo, exigiría:

- verificar manualmente tokens;
- diseñar autorización explícita;
- gestionar CORS cuando corresponda;
- definir límites y validación de solicitudes;
- ampliar la observabilidad;
- mantener una superficie adicional de seguridad;
- administrar más detalles de despliegue y escalado.

Por estas razones, el endpoint HTTP queda como alternativa futura y no como primera opción.

#### Seguridad

La función invocable deberá:

- utilizar privilegios administrativos únicamente en el backend;
- aplicar el principio de privilegios mínimos;
- validar el estado real de Firestore;
- competir transaccionalmente contra el punto de no retorno;
- impedir decisiones basadas solo en datos del cliente;
- minimizar registros técnicos;
- no registrar secretos;
- admitir protección complementaria mediante App Check;
- mantener bloqueadas las operaciones administrativas directas desde la aplicación.

#### Compatibilidad con Emulator Suite

Antes de cualquier despliegue deberán probarse localmente:

- llamada autenticada válida;
- rechazo sin autenticación;
- rechazo con sesión no reciente;
- rechazo de campos desconocidos;
- obtención del UID desde el contexto;
- códigos de respuesta seguros;
- concurrencia;
- reintentos;
- errores parciales;
- ausencia de datos sensibles en las respuestas.

#### Costos y Blaze

La selección documental de una función invocable no autoriza:

- crear infraestructura;
- desplegar Cloud Functions;
- activar Blaze;
- configurar recursos de producción;
- utilizar cuentas reales.

Los costos y requisitos del plan deberán evaluarse antes de cambiar el estado de esta decisión a `aprobada`.

#### Decisión propuesta

Adoptar provisionalmente una función invocable protegida como interfaz entre la aplicación móvil y el backend autorizado de cancelación.

La decisión permanecerá en estado `recomendada` hasta aprobar la plataforma, la versión de ejecución, la región, los costos, las pruebas locales y el procedimiento de despliegue.
