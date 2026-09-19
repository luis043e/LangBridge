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
| DEC-BE-003 | Versión de Node.js | Node.js 24, condicionada a Functions de segunda generación | requiere-prueba |
| DEC-BE-004 | Generación de Functions | Segunda generación, condicionada a pruebas locales | requiere-prueba |
| DEC-BE-005 | Región de ejecución | us-central1, próxima a Firestore nam5 | requiere-prueba |
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

### DEC-BE-003: Versión de Node.js

**Pregunta:** ¿Qué versión de Node.js deberá utilizar el backend de cancelación?

**Recomendación preliminar:** Node.js 24, condicionada a la aprobación de Cloud Functions de segunda generación.

**Estado:** requiere-prueba.

#### Entorno local verificado

La inspección local confirmó:
```text
Node.js: v24.19.0
npm: 11.17.0
Firebase CLI: 15.30.2
```

El proyecto principal:

- no define actualmente `engines.node`;
- no contiene `.nvmrc`;
- no contiene `.node-version`;
- no contiene `.tool-versions`;
- no contiene todavía un paquete independiente para Functions.

La versión del backend deberá declararse más adelante en el paquete exclusivo de Functions y no deberá imponerse prematuramente al paquete principal de la aplicación móvil.

#### Alternativas consideradas

1. Node.js 24.
2. Node.js 22.
3. Node.js 20.
4. Una versión posterior todavía no validada.

#### Node.js 24

Node.js 24 es la opción preliminar preferida porque:

- coincide con el entorno local actualmente instalado;
- ofrece un horizonte de soporte mayor que Node.js 22;
- evita iniciar un backend nuevo sobre una versión próxima a quedar obsoleta;
- permite preparar la implementación sobre una base reciente;
- reduce la necesidad de una migración temprana de runtime.

La aprobación dependerá de confirmar:

- uso de Cloud Functions de segunda generación;
- compatibilidad con la versión seleccionada de `firebase-functions`;
- compatibilidad con la versión seleccionada de `firebase-admin`;
- compatibilidad con Firebase CLI;
- funcionamiento correcto en Emulator Suite;
- ausencia de diferencias relevantes entre emulador y producción.

#### Node.js 22

Node.js 22 será la alternativa de compatibilidad.

Sus ventajas incluyen:

- disponibilidad para primera generación y funciones basadas en Cloud Run;
- mayor flexibilidad si la generación de Functions todavía no está aprobada;
- ecosistema más maduro para dependencias existentes;
- ruta de contingencia si alguna dependencia no admite Node.js 24.

Sus limitaciones incluyen un horizonte de soporte menor y la posibilidad de requerir una migración más temprana.

#### Node.js 20

Node.js 20 no se recomienda para un backend nuevo.

No deberá seleccionarse salvo que aparezca una incompatibilidad excepcional, documentada y temporal que impida utilizar Node.js 22 o Node.js 24.

No se aprobará una versión únicamente porque una dependencia antigua declare compatibilidad con ella.
``
#### Criterios de prueba

Antes de cambiar esta decisión a `aprobada` deberán comprobarse localmente:

1. Instalación reproducible del paquete futuro de Functions.
2. Compatibilidad de `firebase-functions`.
3. Compatibilidad de `firebase-admin`.
4. Inicio correcto del emulador de Functions.
5. Ejecución de una función invocable mínima.
6. Integración con el emulador de Authentication.
7. Integración con el emulador de Firestore.
8. Lectura válida del contexto autenticado.
9. Lectura y validación de `auth_time`.
10. Ejecución de transacciones.
11. Pruebas automatizadas sin errores.
12. Ausencia de advertencias críticas sobre el runtime.

Estas pruebas deberán realizarse sin desplegar servicios y sin utilizar cuentas reales.

#### Separación respecto de la aplicación móvil

El runtime del backend deberá definirse en el futuro paquete independiente de Functions.

No se modificará el `package.json` principal de LangBridge únicamente para fijar la versión del backend.

Cuando se apruebe la infraestructura, podrán utilizarse controles específicos dentro de la carpeta de Functions, como:

- `engines.node` en el paquete del backend;
- un archivo local de versión cuando resulte necesario;
- validaciones en integración continua;
- documentación del runtime aprobado.

#### Seguridad y mantenimiento

La versión seleccionada deberá:

- recibir actualizaciones de seguridad;
- permanecer dentro de su período de soporte;
- admitir actualizaciones planificadas;
- evitar dependencias abandonadas;
- mantener bloqueos reproducibles de dependencias;
- revisarse antes de alcanzar deprecación;
- contar con un procedimiento documentado de actualización.

La aplicación no deberá depender de detalles internos del runtime para interpretar respuestas del backend.

#### Costos y Blaze

La selección de Node.js 24 o Node.js 22 no autoriza:

- crear la carpeta `functions`;
- instalar dependencias administrativas;
- activar Blaze;
- desplegar Cloud Functions;
- cambiar recursos de producción.

La selección definitiva deberá coordinarse con la generación de Functions, la región, las pruebas locales y el análisis económico.

#### Decisión propuesta

Adoptar Node.js 24 como runtime candidato, condicionado a seleccionar Cloud Functions de segunda generación y superar las pruebas locales de compatibilidad.

Mantener Node.js 22 como alternativa de contingencia.

Descartar Node.js 20 como opción normal para un backend nuevo.

La decisión permanecerá en estado `requiere-prueba` hasta validar el SDK de Functions, Admin SDK, Firebase CLI y Emulator Suite.

### DEC-BE-004: Generación de Cloud Functions

**Pregunta:** ¿Qué generación de Cloud Functions deberá utilizar el backend de cancelación?

**Recomendación preliminar:** Cloud Functions de segunda generación.

**Estado:** requiere-prueba.

#### Alternativas consideradas

1. Cloud Functions de segunda generación.
2. Cloud Functions de primera generación.
3. Cloud Run administrado directamente.
4. Mantener únicamente una implementación local hasta cerrar la decisión.

#### Segunda generación

Cloud Functions de segunda generación es la opción preliminar preferida porque:

- es la generación recomendada para funciones nuevas;
- permite utilizar Node.js 24;
- se ejecuta sobre infraestructura de Cloud Run;
- ofrece configuración más flexible de recursos;
- permite controlar la concurrencia;
- admite administración de revisiones y tráfico;
- ofrece una ruta de evolución más amplia;
- es compatible conceptualmente con una función invocable;
- evita iniciar un componente nuevo sobre una generación anterior.

La selección de segunda generación no implica utilizar automáticamente sus límites máximos.

El backend de cancelación deberá comenzar con una configuración conservadora y ajustarse solamente después de observar pruebas y métricas.

#### Primera generación

La primera generación se conservará únicamente como alternativa de compatibilidad.

Podría considerarse si:

- una dependencia indispensable no funciona con segunda generación;
- Emulator Suite presenta una incompatibilidad bloqueante;
- la función invocable seleccionada no se comporta correctamente en segunda generación;
- aparece una limitación concreta y documentada que impide continuar.

No deberá elegirse primera generación únicamente por familiaridad o por evitar evaluar la concurrencia.

#### Cloud Run administrado directamente

Un servicio administrado directamente mediante Cloud Run ofrecería mayor control sobre el entorno, despliegue y rutas HTTP.

Sin embargo, también exigiría gestionar más aspectos de:

- autenticación;
- autorización;
- rutas;
- validación de tokens;
- escalado;
- observabilidad;
- despliegue;
- mantenimiento operativo.

Por estas razones no se recomienda como primera opción para el flujo inicial de cancelación.

#### Concurrencia y configuración inicial

La segunda generación permite que una instancia procese varias solicitudes simultáneamente.

Para el flujo de cancelación, una mayor concurrencia no deberá considerarse automáticamente beneficiosa. Dos solicitudes simultáneas podrían competir con:

- otra llamada de cancelación;
- el procesador de eliminación;
- una restauración pendiente;
- un reintento después de una respuesta perdida;
- el establecimiento del punto de no retorno.

La seguridad no deberá depender de limitar la concurrencia a una sola solicitud. La operación deberá seguir utilizando transacciones, precondiciones e idempotencia.

Sin embargo, durante las pruebas iniciales se recomienda:

- comenzar con una configuración conservadora;
- probar dos o más llamadas concurrentes;
- probar la carrera entre cancelación y eliminación;
- comprobar que solo una transición pueda confirmarse;
- medir el comportamiento antes de aumentar concurrencia;
- no utilizar la concurrencia para sustituir controles transaccionales.

La configuración definitiva permanecerá pendiente hasta realizar pruebas locales.

#### Seguridad y privilegios

La segunda generación deberá configurarse aplicando privilegios mínimos.

El backend deberá:

- utilizar una identidad de ejecución controlada;
- acceder únicamente a los recursos necesarios;
- validar Authentication antes de ejecutar operaciones administrativas;
- comprobar `auth_time`;
- rechazar datos administrativos proporcionados por el cliente;
- proteger la carrera contra `pointOfNoReturnAt`;
- minimizar los registros técnicos;
- evitar secretos incrustados;
- impedir acceso público no controlado;
- mantener bloqueadas las escrituras administrativas directas desde la aplicación.

La elección de segunda generación no sustituirá ninguna validación de identidad, estado o idempotencia.

#### Compatibilidad con función invocable

Antes de aprobar esta decisión deberá comprobarse que la función invocable seleccionada:

- recibe correctamente el contexto autenticado;
- funciona con Node.js 24;
- admite la validación de `auth_time`;
- puede integrarse con App Check;
- devuelve códigos generales y seguros;
- maneja errores sin exponer detalles internos;
- funciona correctamente con los emuladores de Authentication y Firestore;
- mantiene el mismo contrato esperado por la aplicación móvil.

Si una incompatibilidad bloqueante impide utilizar Node.js 24, deberá evaluarse Node.js 22 antes de considerar primera generación.

#### Pruebas requeridas

Antes de cambiar esta decisión a `aprobada` deberán realizarse pruebas locales para comprobar:

1. Inicio correcto del emulador de Functions.
2. Ejecución de una función invocable mínima.
3. Autenticación válida.
4. Rechazo sin autenticación.
5. Validación de `auth_time`.
6. Integración con Firestore Emulator.
7. Transacciones administrativas.
8. Dos llamadas concurrentes de cancelación.
9. Carrera entre cancelación y punto de no retorno.
10. Reintento después de una respuesta perdida.
11. Recuperación después de un error parcial.
12. Creación única del registro cancelado.
13. Ausencia de DEL-S2.
14. Ausencia de operaciones irreversibles.
15. Ausencia de datos sensibles en respuestas y registros.
16. Funcionamiento bajo una configuración conservadora de concurrencia.

Estas pruebas no requerirán desplegar servicios ni utilizar cuentas reales.

#### Recursos y límites

Antes de producción deberán definirse explícitamente:

- memoria;
- tiempo máximo de ejecución;
- concurrencia;
- número mínimo de instancias;
- número máximo de instancias;
- política de reintentos;
- identidad de servicio;
- retención de registros;
- límites de uso;
- alertas presupuestarias.

La configuración inicial deberá evitar recursos mínimos permanentes que generen costos sin una necesidad demostrada.

Los límites máximos deberán reducir el riesgo de consumo inesperado y abuso.

#### Costos y Blaze

La segunda generación puede implicar recursos y cargos asociados con Cloud Run, Cloud Build, Artifact Registry y otros servicios relacionados con el despliegue.

La recomendación documental no autoriza:

- activar Blaze;
- crear recursos en producción;
- desplegar Functions;
- configurar instancias mínimas;
- crear repositorios o artefactos;
- modificar cuotas;
- utilizar datos reales.

Antes del despliegue deberán evaluarse los costos potenciales y configurarse alertas presupuestarias.

#### Reversión y migración

Antes de producción deberá existir un procedimiento para:

- detener nuevos despliegues;
- deshabilitar temporalmente la función;
- restaurar una revisión anterior;
- revertir cambios incompatibles;
- migrar el runtime cuando sea necesario;
- conservar una respuesta segura para la aplicación durante una interrupción;
- evitar que una reversión reactive solicitudes canceladas;
- evitar que una reversión extienda `expiresAt`;
- evitar que una reversión cree DEL-S2.

La reversión no deberá depender de modificar directamente datos mediante la aplicación móvil.

#### Decisión propuesta

Adoptar Cloud Functions de segunda generación como candidata para el backend de cancelación.

Mantener primera generación únicamente como alternativa de compatibilidad documentada.

Iniciar, cuando exista aprobación para crear infraestructura local, con una configuración conservadora de recursos y concurrencia.

La decisión permanecerá en estado `requiere-prueba` hasta validar Node.js 24, la función invocable, Emulator Suite, concurrencia, costos y procedimiento de reversión.

### DEC-BE-005: Región de ejecución

**Pregunta:** ¿En qué región deberá ejecutarse el backend de cancelación?

**Recomendación preliminar:** `us-central1`.

**Estado:** requiere-prueba.

#### Ubicación de Firestore verificada

La inspección realizada en Firebase Console confirmó:

```text
Base de datos: (default)
Ubicación: nam5
Edición: Estándar
Configuración: Firestore nativo
```
La ubicación `nam5` es multirregional y no deberá confundirse con una región individual de Functions.

#### Alternativas consideradas

1. `us-central1`.
2. `us-east1`.
3. Otra región compatible de Estados Unidos.
4. Una región más próxima a la mayoría futura de usuarios.
5. Mantener la región pendiente hasta realizar pruebas locales y estimaciones de producción.

#### Razones para recomendar us-central1

`us-central1` es la recomendación preliminar porque:

- está relacionada geográficamente con la ubicación multirregional `nam5`;
- permite mantener el backend próximo a una de las áreas principales de Firestore;
- puede reducir latencia frente a una región distante;
- es una región ampliamente utilizada para servicios de Firebase y Google Cloud;
- ofrece una opción coherente para comenzar las pruebas técnicas;
- permite documentar una región explícita en vez de depender de valores predeterminados.

La selección de `us-central1` deberá confirmarse antes del despliegue y no se basará únicamente en la ubicación física del responsable del proyecto.

#### Latencia y proximidad a Firestore

La región de Functions deberá seleccionarse priorizando la comunicación con Firestore y no únicamente la proximidad con el dispositivo de la persona usuaria.

El flujo de cancelación realizará operaciones administrativas que incluyen:

- lectura de la solicitud activa;
- lectura del perfil;
- transacciones;
- restauración de la visibilidad;
- retirada de marcas de eliminación;
- creación del registro cancelado;
- eliminación de la solicitud activa;
- reintentos idempotentes.

Mantener Functions próxima a `nam5` puede reducir la latencia y las transferencias innecesarias durante esas operaciones.

La aplicación móvil realizará una llamada relativamente pequeña al backend. La mayor parte del trabajo ocurrirá entre Functions y Firestore.

#### Residencia y transferencia de datos

Antes de aprobar la región deberán revisarse:

- requisitos legales de residencia de datos;
- ubicación principal de las personas usuarias;
- transferencias entre regiones;
- costos potenciales de red;
- disponibilidad de los servicios necesarios;
- compatibilidad con la ubicación `nam5`;
- futuras necesidades de expansión internacional.

La selección de `us-central1` no cambiará la ubicación de Firestore.

No se creará una base nueva ni se migrarán datos como parte de esta decisión.

#### Seguridad

La región seleccionada no sustituirá los controles de seguridad del backend.

La función deberá mantener:

- autenticación obligatoria;
- comprobación de `auth_time`;
- validación del `uid`;
- transacciones contra el punto de no retorno;
- privilegios mínimos;
- idempotencia;
- minimización de registros;
- ausencia de secretos incrustados;
- respuestas generales y seguras.

La aplicación no podrá seleccionar la región ni dirigir una cancelación hacia un endpoint administrativo alternativo.

#### Compatibilidad y pruebas

Antes de cambiar esta decisión a `aprobada` deberán comprobarse:

1. Disponibilidad de Functions de segunda generación en `us-central1`.
2. Disponibilidad del runtime Node.js 24.
3. Compatibilidad de la función invocable.
4. Integración con Firestore ubicado en `nam5`.
5. Funcionamiento con Authentication.
6. Transacciones correctas.
7. Latencia razonable.
8. Ausencia de errores por ubicación.
9. Ausencia de transferencias innecesarias.
10. Comportamiento correcto de los reintentos.
11. Compatibilidad con despliegue y reversión.
12. Diferencias relevantes entre Emulator Suite y producción.

Las pruebas locales no reproducirán completamente la latencia regional. La validación final deberá realizarse con un proyecto separado de pruebas y sin datos personales reales.

#### Costos y Blaze

La recomendación de `us-central1` no autoriza:

- activar Blaze;
- desplegar Functions;
- crear recursos regionales;
- modificar Firestore;
- configurar TTL;
- utilizar cuentas reales;
- ejecutar cancelaciones reales.

Antes del despliegue deberán evaluarse:

- costos de invocación;
- lecturas y escrituras;
- posibles transferencias entre ubicaciones;
- almacenamiento de artefactos;
- registros técnicos;
- límites máximos de instancias;
- alertas presupuestarias.

#### Reversión y continuidad

El procedimiento de despliegue deberá permitir:

- detener nuevas invocaciones;
- restaurar una revisión anterior;
- cambiar la región solo mediante un procedimiento controlado;
- evitar endpoints duplicados activos;
- impedir que dos regiones procesen simultáneamente la misma cancelación;
- mantener respuestas seguras durante una interrupción;
- preservar la idempotencia;
- evitar la creación duplicada de registros cancelados.

Un cambio futuro de región deberá tratarse como una migración técnica y no como una modificación automática.

#### Decisión propuesta

Adoptar `us-central1` como región candidata para la función invocable de cancelación debido a la ubicación multirregional `nam5` de Firestore.

Mantener la decisión en estado `requiere-prueba` hasta confirmar disponibilidad, compatibilidad, latencia, costos, residencia de datos y procedimiento de reversión.

No configurar ni desplegar recursos regionales hasta recibir aprobación explícita.