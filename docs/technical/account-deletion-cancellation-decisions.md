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
| DEC-BE-010 | Estrategia de idempotencia | Clave interna opaca y operación transaccional protegida | requiere-prueba |
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

### DEC-BE-006: Ventana de reautenticación reciente

**Pregunta:** ¿Durante cuánto tiempo después de una reautenticación deberá permitirse solicitar la cancelación de una eliminación?

**Recomendación preliminar:** cinco minutos.

**Estado:** requiere-prueba.

#### Objetivo de seguridad

La cancelación de una solicitud de eliminación es una operación sensible porque conserva la cuenta, restaura la configuración anterior del perfil y detiene un procedimiento solicitado previamente.

Una sesión iniciada no será suficiente por sí sola. Antes de solicitar la cancelación, la persona deberá verificar nuevamente su identidad mediante el método compatible con su proveedor de autenticación.

La ventana reciente deberá:

- reducir el riesgo de uso de una sesión abandonada o comprometida;
- permitir completar razonablemente la interacción con la aplicación;
- evitar períodos innecesariamente largos;
- utilizar evidencia verificada por Firebase Authentication;
- calcularse exclusivamente desde el backend;
- aplicarse de forma consistente a todos los proveedores compatibles.

#### Valor preliminar

La ventana técnica inicial propuesta será:

```text
5 minutos
```

El cálculo conceptual será:

```text
serverTime - auth_time <= allowedRecentAuthenticationWindow
```

El backend utilizará:

- su propia hora confiable;
- el `auth_time` contenido en el contexto autenticado verificado;
- una duración configurada en el backend;
- una comparación inclusiva en el límite permitido.

La aplicación no podrá proporcionar ni modificar:

- `auth_time`;
- la hora actual;
- la duración de la ventana;
- una indicación de que la sesión es reciente;
- una excepción manual al vencimiento.

#### Razones para proponer cinco minutos

Cinco minutos ofrecen preliminarmente un equilibrio entre seguridad y facilidad de uso.

La duración propuesta permite tiempo para:

- completar la reautenticación;
- regresar a la pantalla de cancelación;
- leer el aviso correspondiente;
- confirmar la decisión;
- realizar una llamada inicial;
- admitir un reintento inmediato después de un error transitorio.

La ventana no deberá utilizarse para autorizar indefinidamente operaciones nuevas. Una solicitud nueva o una operación sensible distinta podrá exigir otra reautenticación.

#### Correo y contraseña

Para una cuenta autenticada con correo y contraseña, la aplicación deberá:

1. Solicitar nuevamente la contraseña.
2. Crear una credencial únicamente en memoria.
3. Ejecutar `reauthenticateWithCredential`.
4. Obtener un token actualizado después de completar la reautenticación.
5. Invocar el backend con el contexto autenticado actualizado.
6. Eliminar inmediatamente la contraseña del estado local.

La contraseña no deberá:

- guardarse en Firestore;
- enviarse como dato de la función invocable;
- escribirse en registros;
- conservarse para reintentos posteriores;
- incluirse en mensajes de error;
- almacenarse en analítica.

Un error de contraseña incorrecta deberá mantenerse separado de un fallo temporal del backend. La cancelación no comenzará hasta que la reautenticación haya finalizado correctamente.

#### Proveedor federado

Para una cuenta autenticada mediante Google, la aplicación deberá utilizar el flujo de reautenticación correspondiente al proveedor.

El procedimiento deberá:

- confirmar nuevamente la identidad;
- obtener una credencial válida del proveedor;
- ejecutar la reautenticación de Firebase Authentication;
- actualizar el token autenticado;
- evitar crear un perfil nuevo;
- evitar reutilizar el flujo general de registro;
- no enviar credenciales federadas al backend como datos libres;
- no conservar tokens más tiempo del necesario.

Si en el futuro LangBridge admite otros proveedores, cada proveedor deberá contar con una estrategia explícita de reautenticación antes de permitir la cancelación.

Una ventana válida para un proveedor no deberá reutilizarse como prueba de identidad para otra cuenta o proveedor.

#### Vencimiento y límites temporales

El backend deberá rechazar la cancelación cuando:

- falte `auth_time`;
- `auth_time` no sea válido;
- `auth_time` represente una fecha futura fuera de una tolerancia técnica permitida;
- la antigüedad de la autenticación supere la ventana configurada;
- el token no corresponda a la cuenta autenticada;
- la reautenticación no haya actualizado correctamente el contexto.

La comparación inicial utilizará un límite inclusivo:

```text
antigüedad <= 5 minutos
```

Una antigüedad superior al límite deberá producir:

```text
recent-session-required
```

La tolerancia técnica frente a pequeñas diferencias de reloj deberá ser mínima, documentada y aplicada exclusivamente desde el backend. No deberá ampliar materialmente la ventana aprobada.

#### Reintentos e idempotencia

Un error transitorio inmediatamente después de una reautenticación válida podrá reintentarse mientras la ventana permanezca vigente.

El reintento deberá:

- utilizar un contexto autenticado todavía válido;
- volver a comprobar `auth_time`;
- volver a comprobar el estado de la solicitud;
- volver a comprobar la ausencia de `pointOfNoReturnAt`;
- conservar la idempotencia;
- evitar duplicar el registro cancelado;
- evitar extender `expiresAt`;
- evitar recrear una solicitud activa;
- evitar crear DEL-S2.

Una respuesta perdida después de completar la cancelación deberá devolver un resultado idempotente general y no exigir reautenticación con el único propósito de descubrir un registro interno.

Si la cancelación no fue confirmada y la ventana venció antes del reintento, deberá solicitarse una nueva reautenticación.

#### Solicitudes nuevas y reutilización

La reautenticación reciente no deberá reutilizarse indefinidamente.

Una solicitud de eliminación nueva deberá:

- tener su propia verificación;
- conservar nuevamente la visibilidad anterior;
- utilizar sus propias fechas;
- superar los controles vigentes;
- no depender de una cancelación anterior.

La aplicación no deberá almacenar una marca local que permita omitir la reautenticación en operaciones futuras.

#### Respuestas seguras

Cuando la ventana haya vencido, el backend devolverá:
```text
recent-session-required
```

La respuesta no deberá revelar:

- el valor exacto de `auth_time`;
- la hora interna del servidor;
- cuántos segundos excedieron el límite;
- información sobre sesiones anteriores;
- credenciales;
- tokens;
- detalles administrativos;
- información que facilite eludir el control temporal.

La aplicación deberá asociar el código con un mensaje localizado y seguro disponible en los 16 idiomas activos.

#### Pruebas requeridas

Antes de cambiar esta decisión a `aprobada` deberán comprobarse:

1. Reautenticación válida con correo y contraseña.
2. Reautenticación válida con Google.
3. Rechazo sin reautenticación.
4. Rechazo cuando falta `auth_time`.
5. Rechazo cuando `auth_time` no es válido.
6. Aceptación inmediatamente después de reautenticar.
7. Aceptación justo antes del límite.
8. Comportamiento exacto en el límite de cinco minutos.
9. Rechazo inmediatamente después del límite.
10. Rechazo de una fecha futura inválida.
11. Uso exclusivo de la hora del backend.
12. Reintento dentro de la ventana.
13. Reintento después del vencimiento.
14. Respuesta perdida después de completar la cancelación.
15. Dos llamadas concurrentes con el mismo contexto autenticado.
16. Ausencia de contraseñas, credenciales y tokens en registros.
17. Eliminación inmediata de la contraseña del estado local.
18. Mensajes seguros en los 16 idiomas.
19. Imposibilidad de reutilizar una verificación para otra cuenta.
20. Imposibilidad de omitir la verificación mediante datos proporcionados por el cliente.

Las pruebas deberán utilizar Emulator Suite y cuentas desechables. No se utilizarán contraseñas reales ni cuentas personales.
``
#### Costos e infraestructura

La aprobación documental de una ventana de cinco minutos no autoriza:

- crear la carpeta `functions`;
- instalar dependencias administrativas;
- activar Blaze;
- desplegar Functions;
- utilizar cuentas reales;
- ejecutar cancelaciones reales.

La lógica temporal deberá mantenerse configurable en el backend y no depender de una constante controlada por la aplicación móvil.

#### Decisión propuesta

Mantener cinco minutos como ventana técnica candidata para la reautenticación reciente.

Utilizar la hora confiable del backend y el `auth_time` verificado, con comparación inclusiva en el límite.

Requerir una nueva reautenticación cuando la ventana haya vencido o cuando la evidencia autenticada sea insuficiente.

Mantener la decisión en estado `requiere-prueba` hasta validar correo y contraseña, Google Sign-In, límites temporales, reintentos y respuestas localizadas mediante Emulator Suite.

### DEC-BE-007: Expiración del registro cancelado

**Pregunta:** ¿Qué mecanismo deberá eliminar el registro cancelado mínimo después de su período de conservación?

**Recomendación preliminar:** política TTL de Firestore basada en `expiresAt`.

**Estado:** requiere-prueba.

#### Objetivo de retención

El registro cancelado mínimo deberá conservarse durante 30 días calendario desde la finalización efectiva de la cancelación.

El backend deberá establecer una sola vez:

```text
cancelledAt
expiresAt
```

`cancelledAt` utilizará la hora confiable del servidor y representará la finalización efectiva de la cancelación.

`expiresAt` deberá:

- calcularse exclusivamente desde `cancelledAt`;
- representar exactamente 30 días calendario después de `cancelledAt`;
- establecerse al crear el registro cancelado;
- permanecer inmutable;
- no extenderse mediante reintentos;
- no reiniciarse por lecturas;
- no modificarse debido a una solicitud nueva;
- no reutilizar plazos de DEL-S2.

#### Alternativas consideradas

1. Política TTL de Firestore.
2. Función programada de limpieza.
3. Política TTL con verificación programada complementaria.
4. Proceso administrativo temporal para pruebas.
5. Eliminación manual, únicamente durante desarrollo controlado.

La eliminación manual no será aceptable como mecanismo de producción.

#### Política TTL recomendada

La política TTL deberá aplicarse exclusivamente al campo:

```text
expiresAt
```

de la colección:

```text
cancelledDeletionRequests
```

TTL deberá utilizarse únicamente para eliminar el registro cancelado mínimo cuando haya vencido.

TTL no deberá:

- aplicarse a `accountDeletionRequests`;
- aplicarse a `users`;
- aplicarse a conversaciones o mensajes;
- aplicarse a reportes;
- aplicarse a DEL-S2 mediante esta misma política;
- restaurar perfiles;
- retirar marcas de eliminación;
- ejecutar operaciones administrativas adicionales;
- modificar una cuenta activa;
- modificar una solicitud nueva.

Los documentos de `cancelledDeletionRequests` no deberán contener subcolecciones, porque la eliminación TTL del documento principal no garantiza la eliminación automática de subcolecciones.

#### Ventana técnica de eliminación

La política TTL no garantiza que el documento sea eliminado exactamente al alcanzar `expiresAt`.

Después del vencimiento podrá existir una ventana técnica antes de la eliminación física. Durante esa ventana:

- el registro se considerará vencido;
- el registro no podrá tratarse como vigente;
- el registro no podrá reactivarse;
- `expiresAt` no podrá modificarse;
- la retención no podrá extenderse;
- el registro no podrá utilizarse para bloquear una solicitud nueva;
- el registro no podrá convertirse en DEL-S2;
- el registro no podrá provocar cambios sobre la cuenta activa.

La aceptación de TTL para producción dependerá de aprobar expresamente esta diferencia entre:

```text
vencimiento lógico
```

y:

```text
eliminación física
```

El vencimiento lógico ocurrirá al alcanzar `expiresAt`.

La eliminación física ocurrirá posteriormente mediante TTL, dentro de la ventana operativa del servicio.

#### Tratamiento de registros vencidos

Cualquier proceso autorizado que encuentre un registro con:

```text
serverTime >= expiresAt
```

deberá tratarlo como vencido, aunque el documento todavía exista físicamente.

Un registro vencido no deberá:

- aparecer como una cancelación vigente;
- impedir una solicitud de eliminación nueva;
- modificar el perfil;
- retirar o establecer marcas de eliminación;
- provocar comunicaciones nuevas;
- generar una nueva fecha de expiración;
- reiniciar el plazo de 30 días;
- crear DEL-S2;
- exponer información a la aplicación móvil.

La aplicación no tendrá lectura directa sobre estos registros y no deberá depender de comprobar su eliminación física.

#### Inmutabilidad de expiresAt

`expiresAt` deberá permanecer inmutable desde la creación del registro cancelado.

Ningún reintento, función programada, proceso administrativo o solicitud nueva podrá:

- retrasar `expiresAt`;
- adelantar `expiresAt` sin una corrección técnica autorizada y documentada;
- sustituirlo por una hora proporcionada por el dispositivo;
- eliminarlo antes de que el registro sea procesable por TTL;
- usar una fecha distinta para renovar la retención;
- recalcularlo desde la fecha de un reintento;
- reutilizarlo para una cancelación posterior.

Si un registro carece de `expiresAt`, contiene un valor inválido o presenta una inconsistencia temporal, deberá enviarse a un procedimiento técnico controlado.

La inconsistencia no deberá corregirse:

- desde la aplicación móvil;
- mediante una fecha proporcionada por el cliente;
- extendiendo automáticamente la retención;
- recreando la solicitud activa;
- creando DEL-S2;
- modificando datos ordinarios de la cuenta.

Una corrección técnica autorizada deberá quedar limitada al mínimo necesario y no deberá convertir un registro vencido en vigente.

#### Función programada complementaria

Una función programada podrá evaluarse como mecanismo complementario de verificación, pero no será obligatoria en el diseño inicial.

Una función complementaria podría:

- detectar registros vencidos que todavía existan;
- identificar registros sin `expiresAt`;
- identificar valores temporales inválidos;
- comprobar que no existan subcolecciones;
- generar métricas técnicas generales;
- eliminar registros vencidos mediante una operación idempotente autorizada;
- ayudar a verificar el comportamiento de TTL.

La función programada no deberá:

- extender `expiresAt`;
- recrear registros eliminados;
- modificar una cuenta activa;
- modificar una solicitud nueva;
- restaurar perfiles;
- crear DEL-S2;
- enviar nuevas confirmaciones de cancelación;
- procesar conversaciones, mensajes o reportes;
- sustituir la política TTL sin una decisión nueva.

La necesidad de esta función dependerá de las pruebas, los costos, la observabilidad y la aceptación de la ventana técnica de TTL.

#### Costos y limitaciones

Las eliminaciones realizadas mediante TTL cuentan como operaciones de eliminación de Firestore.

Antes de producción deberán evaluarse:

- cantidad estimada de cancelaciones;
- cantidad mensual de eliminaciones TTL;
- costos por operaciones de eliminación;
- almacenamiento temporal durante la ventana posterior al vencimiento;
- costo de una posible función programada;
- costo de registros técnicos;
- límites aplicables de Firestore;
- configuración de alertas presupuestarias.

La política TTL:

- no garantiza eliminación instantánea;
- no elimina subcolecciones automáticamente;
- no ejecuta eliminaciones de forma transaccional;
- puede procesar documentos con la misma fecha en momentos diferentes;
- deberá utilizar siempre el último valor válido de `expiresAt`;
- deberá configurarse únicamente después de revisar el impacto sobre documentos existentes.

La activación de TTL sobre una colección existente deberá comprobar previamente que no contiene documentos con fechas vencidas incorrectas o inesperadas.

#### Restricciones actuales

La recomendación documental de TTL no autoriza:

- configurar una política TTL en producción;
- modificar índices o configuraciones remotas;
- activar Blaze;
- crear Functions;
- desplegar servicios;
- utilizar cuentas reales;
- crear registros cancelados reales;
- ejecutar eliminaciones reales.

Las pruebas iniciales deberán utilizar documentos sintéticos, fechas controladas y un entorno separado cuando corresponda.

#### Pruebas requeridas

Antes de cambiar esta decisión a `aprobada` deberán comprobarse:

1. Creación de un registro cancelado con `cancelledAt` válido.
2. Cálculo de `expiresAt` exactamente desde `cancelledAt`.
3. Conservación lógica durante 30 días calendario.
4. Inmutabilidad de `cancelledAt`.
5. Inmutabilidad de `expiresAt`.
6. Rechazo de una extensión mediante reintentos.
7. Rechazo de fechas proporcionadas por el cliente.
8. Tratamiento como vencido al alcanzar `expiresAt`.
9. Imposibilidad de tratar como vigente un documento vencido todavía existente.
10. Eliminación física posterior mediante TTL.
11. Ausencia de subcolecciones.
12. Eliminación exclusiva del registro cancelado mínimo.
13. Ausencia de modificaciones sobre la cuenta activa.
14. Ausencia de modificaciones sobre una solicitud nueva.
15. Ausencia de cambios en la visibilidad del perfil.
16. Ausencia de DEL-S2.
17. Ausencia de nuevas comunicaciones por la expiración.
18. Comportamiento seguro cuando falta `expiresAt`.
19. Comportamiento seguro ante un valor temporal inválido.
20. Reintento idempotente si el registro ya fue eliminado.
21. Imposibilidad de recrear un registro vencido.
22. Prueba de una posible función programada complementaria.
23. Verificación de costos y operaciones de eliminación.
24. Verificación de que TTL no se aplique a otras colecciones.

Las pruebas iniciales deberán utilizar Emulator Suite y datos sintéticos.

La eliminación física administrada mediante TTL deberá validarse posteriormente en un proyecto separado de pruebas, sin cuentas ni datos personales reales.

#### Decisión propuesta

Adoptar una política TTL de Firestore basada exclusivamente en `expiresAt` como mecanismo candidato para eliminar los registros de `cancelledDeletionRequests`.

Considerar el registro lógicamente vencido desde el instante en que:

```text
serverTime >= expiresAt
```
Aceptar provisionalmente que la eliminación física no será instantánea y podrá ocurrir durante la ventana operativa posterior del servicio.

Mantener una función programada únicamente como alternativa complementaria, condicionada a pruebas, observabilidad, necesidad técnica y costos.

No permitir subcolecciones bajo los registros cancelados.

Mantener la decisión en estado `requiere-prueba` hasta aprobar expresamente la ventana técnica de eliminación, verificar costos, probar documentos vencidos y confirmar que TTL no afecta ninguna cuenta activa, solicitud nueva o registro DEL-S2.

### DEC-BE-008: Función programada complementaria

**Pregunta:** ¿Debe existir inicialmente una función programada que complemente la política TTL?

**Recomendación preliminar:** no crearla inicialmente.

**Estado:** diferida.

#### Relación con TTL

La política TTL basada en `expiresAt` permanecerá como mecanismo candidato principal para eliminar los registros vencidos de `cancelledDeletionRequests`.

Una función programada no deberá duplicar automáticamente las responsabilidades de TTL ni convertirse en un segundo mecanismo de eliminación sin una necesidad técnica demostrada.

La ausencia inicial de una función programada permite:

- reducir infraestructura;
- evitar lógica duplicada;
- reducir costos potenciales;
- disminuir la superficie de errores;
- evitar ejecuciones concurrentes innecesarias;
- evaluar primero el comportamiento real de TTL.

#### Condiciones para reconsiderarla

La función programada podrá reconsiderarse si las pruebas muestran:

- registros vencidos que permanecen durante períodos operativamente inaceptables;
- registros sin `expiresAt`;
- valores temporales inválidos;
- necesidad de métricas técnicas periódicas;
- necesidad de verificar que TTL funciona correctamente;
- inconsistencias que no puedan resolverse mediante el procedimiento principal;
- una exigencia legal o técnica de comprobación complementaria;
- beneficios operativos superiores a sus costos y riesgos.

La existencia de una ventana técnica normal de TTL no será, por sí sola, razón suficiente para crear una función programada.

#### Responsabilidades permitidas

Si se aprueba en el futuro, la función programada deberá limitarse a responsabilidades técnicas complementarias.

Podrá:

- consultar registros de `cancelledDeletionRequests`;
- identificar registros lógicamente vencidos;
- comprobar la existencia y validez de `expiresAt`;
- detectar inconsistencias mínimas previamente definidas;
- eliminar de forma idempotente un registro vencido;
- generar métricas técnicas agregadas;
- comprobar que TTL se encuentre funcionando;
- registrar categorías generales de fallos;
- finalizar correctamente cuando no existan documentos procesables.

La función no deberá depender de datos proporcionados por la aplicación móvil.

#### Operaciones prohibidas

La función programada no podrá:

- extender `expiresAt`;
- modificar `cancelledAt`;
- recrear registros ya eliminados;
- reactivar una cancelación;
- recrear una solicitud activa;
- restaurar perfiles;
- modificar `isProfileVisible`;
- establecer o retirar `deletionRequested`;
- establecer o retirar `deletionRequestedAt`;
- crear DEL-S2;
- modificar una cuenta activa;
- modificar una solicitud nueva;
- eliminar conversaciones;
- eliminar mensajes;
- eliminar conexiones;
- eliminar reportes;
- modificar listas de bloqueos;
- eliminar `users/{uid}`;
- eliminar Firebase Authentication;
- enviar una nueva confirmación de cancelación;
- procesar ninguna otra operación irreversible.

La función tampoco deberá convertir una inconsistencia de expiración en una autorización para modificar datos ordinarios de la cuenta.

#### Idempotencia y concurrencia

Cada ejecución deberá ser idempotente.

Si dos ejecuciones se solapan, ambas deberán comprobar el estado real del documento antes de eliminarlo.

La función deberá tratar como resultado seguro:

- un registro ya eliminado;
- un registro que todavía no ha vencido;
- un registro vencido eliminado por otra ejecución;
- una ejecución sin documentos procesables;
- una interrupción después de completar una eliminación.

Una ejecución repetida no deberá:

- generar documentos duplicados;
- extender la retención;
- cambiar fechas;
- recrear datos;
- crear DEL-S2;
- afectar la cuenta activa.

La seguridad no deberá depender de que el programador ejecute la función exactamente una vez.

#### Costos e infraestructura

Una función programada podría implicar costos asociados con:

- invocaciones periódicas;
- lecturas de Firestore;
- eliminaciones de documentos;
- Cloud Scheduler;
- Cloud Functions;
- registros técnicos;
- almacenamiento de artefactos;
- tiempo de ejecución.

Antes de aprobarla deberán definirse:

- frecuencia de ejecución;
- consultas utilizadas;
- límite de documentos por ejecución;
- número máximo de instancias;
- tiempo máximo;
- política de reintentos;
- alertas presupuestarias;
- procedimiento para detenerla;
- procedimiento de reversión.

No se activará Blaze ni se crearán recursos programados únicamente para probar una necesidad todavía no demostrada.

#### Pruebas requeridas

Antes de cambiar esta decisión de `diferida` a `requiere-prueba` o `aprobada`, deberá demostrarse una necesidad técnica concreta.

Si se implementa una función programada, las pruebas deberán comprobar:

1. Ejecución sin documentos procesables.
2. Identificación de un registro lógicamente vencido.
3. Omisión segura de un registro todavía vigente.
4. Tratamiento seguro de un registro sin `expiresAt`.
5. Tratamiento seguro de un valor temporal inválido.
6. Eliminación idempotente de un registro vencido.
7. Resultado seguro cuando TTL eliminó previamente el documento.
8. Resultado seguro cuando otra ejecución eliminó previamente el documento.
9. Dos ejecuciones programadas concurrentes.
10. Interrupción antes de eliminar un documento.
11. Interrupción después de completar una eliminación.
12. Imposibilidad de extender `expiresAt`.
13. Imposibilidad de modificar `cancelledAt`.
14. Imposibilidad de recrear un registro eliminado.
15. Ausencia de cambios sobre una cuenta activa.
16. Ausencia de cambios sobre una solicitud nueva.
17. Ausencia de cambios sobre la visibilidad del perfil.
18. Ausencia de DEL-S2.
19. Ausencia de nuevas comunicaciones.
20. Ausencia de operaciones irreversibles.
21. Aplicación de límites por ejecución.
22. Generación de métricas técnicas mínimas.
23. Ausencia de datos personales innecesarios en registros.
24. Procedimiento seguro para detener la programación.

Las pruebas deberán utilizar datos sintéticos y un entorno separado. No se utilizarán cuentas personales ni datos reales.

#### Decisión propuesta

No crear inicialmente una función programada complementaria.

Mantener TTL como mecanismo candidato principal para la eliminación física de los registros vencidos.

Conservar la función programada como alternativa diferida y reconsiderarla únicamente si las pruebas o la operación real demuestran una necesidad técnica, legal u operativa.

Exigir una nueva evaluación de costos, seguridad, consultas, frecuencia, límites, observabilidad y reversión antes de crearla.

Mantener DEC-BE-008 en estado `diferida`.

Esta decisión no autoriza crear Cloud Scheduler, desplegar Functions, activar Blaze ni modificar recursos de producción.

### DEC-BE-009: App Check

**Pregunta:** ¿Debe exigirse App Check para invocar el futuro backend de cancelación?

**Recomendación preliminar:** incorporarlo como capa complementaria en una etapa posterior.

**Estado:** diferida.

#### Objetivo

App Check podrá ayudar a reducir solicitudes procedentes de aplicaciones modificadas, clientes no reconocidos o entornos no autorizados.

Su función será complementar los controles principales del backend, no sustituirlos.

App Check podrá contribuir a:

- verificar que una solicitud proceda de una instancia reconocida de la aplicación;
- reducir llamadas automatizadas desde clientes no autorizados;
- mejorar la defensa ante abuso;
- aportar señales adicionales para observabilidad;
- limitar parte del tráfico no legítimo;
- proteger la función invocable junto con otros controles.

App Check no demostrará por sí solo la identidad de la persona que solicita la cancelación.

#### Controles que App Check no sustituye

App Check no sustituirá:

- Firebase Authentication;
- la comprobación del `uid`;
- la reautenticación reciente;
- la validación de `auth_time`;
- la ventana de cinco minutos;
- la comprobación del estado de la solicitud;
- la carrera transaccional contra `pointOfNoReturnAt`;
- la idempotencia;
- las reglas de seguridad de Firestore;
- la validación estricta de entradas;
- los límites de uso;
- los controles presupuestarios;
- las pruebas de seguridad.

Una llamada con App Check válido deberá rechazarse si falla cualquiera de los controles obligatorios de identidad, estado o autorización.

#### Estado inicial

App Check no se habilitará como requisito obligatorio durante la primera implementación local del backend.

La primera fase deberá concentrarse en validar:

- Authentication;
- `auth_time`;
- la función invocable;
- transacciones;
- restauración del perfil;
- idempotencia;
- respuestas seguras;
- pruebas mediante Emulator Suite.

Después de estabilizar esos controles, App Check podrá incorporarse y probarse como una capa adicional.

#### Plataformas y proveedores

La estrategia futura de App Check deberá definirse por plataforma.

Para Android deberán evaluarse los proveedores admitidos y apropiados para:

- compilaciones locales;
- Emulator Suite;
- APK privado;
- prueba cerrada;
- distribución mediante Google Play;
- dispositivos físicos compatibles;
- versiones anteriores todavía admitidas.

Las compilaciones de desarrollo deberán utilizar mecanismos específicos de depuración y nunca deberán incorporar secretos de depuración en una versión pública.

Si LangBridge se publica posteriormente en otras plataformas, cada plataforma deberá contar con una configuración independiente y probada.

La aprobación de App Check para Android no implicará automáticamente su aprobación para web, iOS u otras plataformas.

#### Activación gradual

App Check no deberá pasar directamente de desactivado a obligatorio para todas las solicitudes de producción.

La activación futura deberá realizarse por etapas:

1. Integrar el SDK sin exigir todavía el token.
2. Verificar la obtención de tokens en desarrollo.
3. Probar dispositivos físicos.
4. Probar compilaciones privadas.
5. Observar solicitudes válidas e inválidas.
6. Comprobar el impacto sobre versiones anteriores.
7. Validar los mensajes de error.
8. Aplicar la protección inicialmente en un entorno de pruebas.
9. Habilitar la exigencia en producción solo después de completar la validación.
10. Mantener un procedimiento documentado de reversión.

La activación gradual deberá evitar bloquear de forma inesperada a usuarios legítimos.

#### Errores y recuperación

La aplicación deberá distinguir entre:

- falta de autenticación;
- reautenticación vencida;
- token de App Check ausente;
- token de App Check inválido;
- servicio temporalmente no disponible;
- error transitorio de red;
- rechazo definitivo del backend.

Los errores de App Check destinados a la aplicación deberán transformarse en respuestas generales y seguras.

La aplicación no deberá mostrar:

- tokens;
- identificadores internos;
- nombres de proveedores técnicos;
- claves de depuración;
- detalles de validación;
- instrucciones que permitan eludir App Check;
- trazas administrativas.

Un fallo de App Check no deberá provocar:

- cancelación directa desde el cliente;
- apertura de permisos administrativos;
- restauración directa del perfil;
- creación de registros cancelados;
- eliminación de solicitudes;
- creación de DEL-S2;
- ejecución de operaciones irreversibles.

#### Privacidad y registros

Los registros relacionados con App Check deberán aplicar minimización de datos.

Podrán conservar categorías técnicas generales, por ejemplo:

- token ausente;
- token inválido;
- proveedor no disponible;
- error temporal;
- solicitud bloqueada;
- validación completada.

No deberán conservar innecesariamente:

- tokens completos;
- credenciales;
- contenido;
- UID
#### Pruebas requeridas

Antes de cambiar esta decisión de `diferida` a `requiere-prueba` o `aprobada`, deberán comprobarse:

1. Obtención válida de un token de App Check en desarrollo.
2. Funcionamiento del mecanismo de depuración sin exponer secretos.
3. Rechazo de una llamada sin token cuando la exigencia se encuentre habilitada.
4. Rechazo de un token inválido.
5. Rechazo de un token vencido.
6. Aceptación de una llamada con token válido.
7. Autenticación obligatoria aunque App Check sea válido.
8. Reautenticación reciente obligatoria aunque App Check sea válido.
9. Validación de `auth_time` aunque App Check sea válido.
10. Validación del estado cancelable.
11. Protección de la carrera contra `pointOfNoReturnAt`.
12. Funcionamiento de la función invocable mediante Emulator Suite.
13. Funcionamiento en una compilación privada para Android.
14. Funcionamiento en dispositivos físicos compatibles.
15. Tratamiento seguro de un servicio temporalmente no disponible.
16. Tratamiento seguro de errores de red.
17. Ausencia de tokens y secretos en registros.
18. Ausencia de detalles técnicos sensibles en respuestas.
19. Mensajes localizados y seguros en los 16 idiomas activos.
20. Compatibilidad con una activación gradual.
21. Procedimiento de reversión de la exigencia.
22. Verificación de que versiones antiguas no sean bloqueadas sin aviso previo.
23. Ausencia de permisos administrativos directos para el cliente.
24. Ausencia de DEL-S2 y operaciones irreversibles ante fallos de App Check.

Las pruebas deberán utilizar cuentas desechables, compilaciones controladas y un entorno separado cuando corresponda.

#### Costos e infraestructura

La evaluación de App Check deberá considerar:

- disponibilidad de proveedores por plataforma;
- requisitos para distribución mediante Google Play;
- compatibilidad con compilaciones privadas;
- mantenimiento de claves y configuraciones;
- observabilidad;
- soporte para dispositivos legítimos;
- procedimientos de depuración;
- impacto operativo de falsos rechazos;
- costos indirectos de soporte;
- procedimiento de activación y reversión.

La decisión documental no autoriza:

- habilitar la exigencia en producción;
- registrar proveedores definitivos;
- modificar configuraciones remotas;
- activar Blaze;
- desplegar Functions;
- publicar una nueva compilación;
- utilizar cuentas reales;
- bloquear versiones existentes.

Cualquier secreto o token de depuración deberá mantenerse fuera del repositorio y nunca deberá incluirse en una compilación pública.

#### Decisión propuesta

No exigir App Check durante la primera implementación local del backend de cancelación.

Mantener App Check como capa complementaria futura y diferida.

Reconsiderar su implementación después de estabilizar Authentication, `auth_time`, la función invocable, las transacciones, la idempotencia y las respuestas seguras.

Exigir una integración gradual, pruebas en dispositivos físicos, tratamiento seguro de errores y un procedimiento de reversión antes de habilitarlo en producción.

Mantener DEC-BE-009 en estado `diferida`.

Esta decisión no autoriza habilitar App Check, registrar proveedores definitivos, desplegar servicios, activar Blaze ni modificar recursos de producción.

### DEC-BE-010: Estrategia de idempotencia

**Pregunta:** ¿Cómo deberá impedir el backend que reintentos, respuestas perdidas y llamadas concurrentes produzcan resultados duplicados o incompatibles?

**Recomendación preliminar:** clave interna opaca combinada con una operación transaccional protegida.

**Estado:** requiere-prueba.

#### Objetivos

La estrategia de idempotencia deberá garantizar que una misma cancelación lógica produzca un único resultado coherente.

Deberá impedir:

- dos registros cancelados para la misma cancelación;
- dos valores diferentes de `cancelledAt`;
- dos valores diferentes de `expiresAt`;
- restauraciones incompatibles del perfil;
- recreación de una solicitud activa eliminada;
- reactivación de una cancelación completada;
- creación de DEL-S2;
- ejecución de operaciones irreversibles;
- confirmación simultánea de cancelación y punto de no retorno;
- respuestas contradictorias ante reintentos.

La seguridad no deberá depender de que la aplicación invoque el backend una sola vez.

#### Situaciones que deberán tolerarse

La operación deberá ser segura ante:

1. Dos pulsaciones rápidas del botón de cancelación.
2. Dos dispositivos autenticados con la misma cuenta.
3. Dos llamadas concurrentes.
4. Una respuesta perdida después de completar la cancelación.
5. Un error de red durante el procesamiento.
6. Una interrupción después de restaurar el perfil.
7. Una interrupción después de crear el registro cancelado.
8. Una interrupción después de eliminar la solicitud activa.
9. Un reintento después de completar toda la operación.
10. Una carrera contra el procesador de eliminación.
11. Una ejecución repetida por infraestructura.
12. Una recuperación después de un error parcial.

Cada reintento deberá comprobar el estado real almacenado antes de repetir una operación.

#### Clave interna de idempotencia

El backend deberá generar una clave interna de idempotencia para la operación de cancelación.

La clave deberá:

- ser generada exclusivamente por el backend;
- ser aleatoria u opaca;
- no derivarse directamente del UID;
- no derivarse del correo;
- no contener datos personales;
- no ser seleccionada por la aplicación;
- no coincidir con `cancellationRecordId`;
- no coincidir con un identificador DEL-S2;
- no reutilizarse para otra cancelación;
- no exponerse en respuestas;
- no registrarse innecesariamente;
- no conservarse indefinidamente.

La estrategia exacta de generación y retención deberá validarse durante la implementación local.

#### Operación transaccional protegida

La cancelación y el avance del procesador de eliminación deberán competir mediante una transacción o mecanismo protegido equivalente.

La operación protegida deberá volver a leer el estado real de:

```text
accountDeletionRequests/{uid}
```

Dentro de la operación protegida, el backend deberá comprobar simultáneamente:

- que la solicitud activa exista;
- que `userId` coincida con el `uid` autenticado;
- que el estado continúe siendo cancelable;
- que `pointOfNoReturnAt` permanezca ausente;
- que la cancelación no haya sido confirmada previamente;
- que el procesador de eliminación no haya ganado previamente la carrera;
- que `previousProfileVisibility` sea válido;
- que la clave interna corresponda a la operación autorizada.

Solo una transición podrá ser confirmada primero:

```text
cancelación confirmada
```

o:

```text
punto de no retorno confirmado
```

No podrá existir un resultado donde ambas transiciones queden confirmadas.

#### Si la cancelación gana

Cuando la cancelación confirme primero:

- no se establecerá `pointOfNoReturnAt`;
- no se establecerá `pointOfNoReturnOperation`;
- no comenzará ninguna operación irreversible;
- se restaurará el perfil;
- se retirarán las marcas de eliminación;
- se creará como máximo un registro cancelado mínimo;
- se eliminará la solicitud activa;
- se eliminarán los datos temporales de restauración;
- no se creará DEL-S2;
- los reintentos devolverán un resultado idempotente general.

El procesador de eliminación deberá reconocer la cancelación confirmada y finalizar sin comenzar operaciones irreversibles.

#### Si el procesador de eliminación gana

Cuando el punto de no retorno confirme primero:

- la cancelación será rechazada;
- el perfil no será restaurado;
- la solicitud permanecerá en `processing`;
- no se creará un registro cancelado;
- no se eliminará la solicitud activa como cancelada;
- no se retirarán las marcas de eliminación;
- la eliminación continuará mediante operaciones idempotentes;
- la respuesta general será `point-of-no-return-reached`.

Un reintento de cancelación no podrá revertir esta transición.

#### Precondiciones y estado real

Los datos aportados por la aplicación no deberán decidir el resultado de la carrera.

El backend deberá utilizar:

- el contexto autenticado;
- el `uid` autenticado;
- el `auth_time` verificado;
- el estado real de Firestore;
- transacciones;
- precondiciones;
- la hora confiable del servidor;
- campos protegidos establecidos exclusivamente por el backend.

La aplicación no podrá proporcionar:

- el estado administrativo;
- `pointOfNoReturnAt`;
- `pointOfNoReturnOperation`;
- `previousProfileVisibility` durante la cancelación;
- la clave interna de idempotencia;
- `cancellationRecordId`;
- `cancelledAt`;
- `expiresAt`;
- una indicación de qué operación ganó la carrera;
- una indicación de que la cancelación ya fue completada.

Si una precondición deja de cumplirse durante la operación, la transacción deberá abortarse y volver a comprobar el estado real antes de decidir si corresponde reintentar o devolver un resultado general seguro.

#### Relación con cancellationRecordId

La clave interna de idempotencia y `cancellationRecordId` tendrán responsabilidades diferentes.

La clave interna de idempotencia:

- coordinará el procesamiento autorizado;
- permitirá reconocer la misma cancelación lógica;
- no será visible para la aplicación;
- no sustituirá el identificador del registro cancelado;
- no se conservará indefinidamente.

`cancellationRecordId`:

- identificará el registro cancelado mínimo;
- será generado exclusivamente por el backend;
- será aleatorio y opaco;
- no contendrá UID ni correo;
- no se reutilizará;
- no funcionará como credencial;
- no se expondrá a la aplicación.

La aplicación no podrá proporcionar, seleccionar o correlacionar ninguno de los dos identificadores.

#### Creación única del registro cancelado

Una cancelación válida deberá producir como máximo un registro en:

```text
cancelledDeletionRequests/{cancellationRecordId}
```

La creación deberá coordinarse con:

- la restauración del perfil;
- la retirada de `deletionRequested`;
- la retirada de `deletionRequestedAt`;
- la eliminación de la solicitud activa;
- la limpieza de `previousProfileVisibility`;
- la eliminación de cualquier otro dato temporal de restauración.

Si el registro ya existe para la misma cancelación lógica, un reintento no deberá crear otro.

Si el registro no existe porque la operación todavía no alcanzó esa fase, el backend deberá continuar únicamente desde el último punto seguro comprobable.

#### Fases de recuperación segura

La operación deberá reconocer el último estado seguro comprobable antes de continuar un reintento.

Las fases conceptuales serán:
```text
not-started
restoration-in-progress
profile-restored
cancelled-record-created
active-request-removed
temporary-restoration-data-removed
completed
```

Estas fases serán internas y no podrán ser seleccionadas ni modificadas por la aplicación móvil.

Durante un reintento, el backend deberá comprobar:

- si la solicitud activa todavía existe;
- si el perfil ya fue restaurado;
- si `deletionRequested` ya fue retirado;
- si `deletionRequestedAt` ya fue retirado;
- si el registro cancelado ya existe;
- si la solicitud activa ya fue eliminada;
- si `previousProfileVisibility` ya fue limpiado;
- si la operación ya terminó.

La comprobación del estado real deberá impedir repetir una operación de forma incompatible.
#### Recuperación después de interrupciones

Si la operación se interrumpe antes de confirmar la cancelación, podrá reiniciarse desde las validaciones iniciales.

Si la cancelación ya fue confirmada, el procesador de eliminación no podrá ganar posteriormente la carrera ni alcanzar el punto de no retorno.

Después de confirmar la cancelación, un reintento deberá completar únicamente las operaciones pendientes de restauración y limpieza.

El backend no deberá:

- invertir nuevamente una visibilidad ya restaurada;
- ocultar un perfil restaurado;
- crear otro registro cancelado;
- recrear una solicitud activa eliminada;
- volver a establecer marcas de eliminación;
- extender `expiresAt`;
- exigir nuevamente datos temporales ya eliminados;
- crear DEL-S2;
- iniciar operaciones irreversibles.

#### Respuesta idempotente

Cuando la cancelación ya haya sido completada, una llamada repetida deberá devolver:

```text
cancelled
```

La respuesta será general y no deberá revelar:

- si el registro cancelado todavía existe;
- `cancellationRecordId`;
- la clave interna de idempotencia;
- `cancelledAt`;
- `expiresAt`;
- fases internas;
- rutas de documentos;
- UID;
- correo;
- contenido;
- detalles administrativos.

Si la cancelación fue confirmada, pero todavía existen operaciones idempotentes pendientes, el backend podrá devolver:

```text
restoration-pending
```

La aplicación deberá tratar `restoration-pending` como un estado no destructivo y permitir una recuperación controlada.

La aplicación no deberá inferir que la eliminación fue completada por la ausencia de lectura directa sobre la solicitud protegida.

#### Retención de la clave interna

La clave interna de idempotencia deberá conservarse únicamente durante el tiempo necesario para coordinar la operación y sus reintentos seguros.

La clave no deberá:

- conservarse indefinidamente;
- copiarse al registro cancelado mínimo;
- exponerse a la aplicación;
- incluirse en mensajes localizados;
- incluirse en comunicaciones por correo;
- utilizarse como identificador DEL-S2;
- reutilizarse para una solicitud nueva;
- permitir reconstruir el UID o el correo;
- utilizarse para seguimiento publicitario;
- permanecer después de que deje de ser necesaria para la recuperación técnica.

Antes de implementar deberá definirse:

- dónde se conservará temporalmente;
- qué operación autorizará su creación;
- qué proceso verificará su coincidencia;
- cuándo se considerará innecesaria;
- cómo se eliminará;
- cómo se evitará que un reintento extienda su retención;
- cómo se comprobará una cancelación completada después de limpiarla.

La eliminación de la clave no deberá eliminar anticipadamente el registro cancelado ni modificar `expiresAt`.

#### Seguridad y privacidad

La estrategia de idempotencia deberá aplicar minimización de datos.

No deberá almacenar dentro de la clave ni de sus metadatos:

- UID en texto legible;
- correo;
- nombre;
- contenido del perfil;
- contraseñas;
- credenciales federadas;
- tokens;
- contenido de mensajes;
- contenido de conversaciones;
- contenido de reportes;
- listas de bloqueos;
- datos de otras cuentas;
- identificadores DEL-S2;
- valores que permitan correlación innecesaria.

Los registros técnicos podrán utilizar categorías generales como:

- operación iniciada;
- reintento detectado;
- operación ya completada;
- conflicto transaccional;
- recuperación pendiente;
- punto de no retorno alcanzado;
- error temporal.

Las categorías técnicas no deberán incluir secretos, datos personales innecesarios ni detalles que permitan eludir los controles de concurrencia.

La clave interna deberá permanecer inaccesible para la aplicación móvil y protegida contra lectura o modificación directa.

#### Pruebas requeridas

Antes de cambiar esta decisión a `aprobada` deberán comprobarse:

1. Cancelación válida ejecutada una sola vez.
2. Dos pulsaciones rápidas del botón de cancelación.
3. Dos llamadas concurrentes desde el mismo dispositivo.
4. Dos llamadas concurrentes desde dispositivos distintos.
5. Carrera entre cancelación y establecimiento de `pointOfNoReturnAt`.
6. Victoria única de la cancelación cuando confirma primero.
7. Victoria única del procesador de eliminación cuando confirma primero.
8. Imposibilidad de confirmar simultáneamente ambas transiciones.
9. Creación de un único registro cancelado.
10. Generación de un único `cancellationRecordId`.
11. Ausencia de registros cancelados duplicados.
12. Restauración única de un perfil originalmente visible.
13. Conservación correcta de un perfil originalmente oculto.
14. Compatibilidad con un perfil histórico.
15. Retirada idempotente de `deletionRequested`.
16. Retirada idempotente de `deletionRequestedAt`.
17. Interrupción antes de confirmar la cancelación.
18. Interrupción después de restaurar el perfil.
19. Interrupción después de crear el registro cancelado.
20. Interrupción después de eliminar la solicitud activa.
21. Interrupción después de limpiar los datos temporales.
22. Respuesta perdida después de completar la cancelación.
23. Reintento después de completar toda la operación.
24. Respuesta idempotente `cancelled`.
25. Respuesta `restoration-pending` durante una recuperación incompleta.
26. Imposibilidad de recrear la solicitud activa.
27. Imposibilidad de extender `expiresAt`.
28. Imposibilidad de modificar `cancelledAt`.
29. Imposibilidad de reutilizar la clave interna en otra cancelación.
30. Separación entre la clave interna y `cancellationRecordId`.
31. Ausencia de UID, correo y datos personales dentro de la clave.
32. Ausencia de la clave en respuestas destinadas a la aplicación.
33. Eliminación segura de la clave cuando deje de ser necesaria.
34. Ausencia de DEL-S2.
35. Ausencia de operaciones irreversibles.
36. Ausencia de conversaciones, mensajes o reportes afectados.
37. Ausencia de modificaciones sobre otras cuentas.
38. Funcionamiento correcto con concurrencia de segunda generación.
39. Recuperación después de un conflicto transaccional.
40. Pruebas completas mediante Emulator Suite.

Las pruebas deberán utilizar datos sintéticos y cuentas desechables.

Las pruebas de concurrencia deberán ejecutarse repetidamente para aumentar la probabilidad de detectar carreras y resultados no deterministas.

#### Decisión propuesta

Adoptar una estrategia de idempotencia basada en:

- una clave interna opaca generada exclusivamente por el backend;
- una operación transaccional protegida;
- precondiciones basadas en el estado real de Firestore;
- creación única del registro cancelado mínimo;
- reconocimiento de fases seguras de recuperación;
- respuestas generales e idempotentes;
- limpieza de la clave cuando deje de ser necesaria.

La estrategia deberá garantizar que solamente una transición pueda ganar:

```text
cancelación confirmada
```

o:

```text
punto de no retorno confirmado
```

La clave interna no sustituirá `cancellationRecordId`, no se expondrá a la aplicación, no contendrá datos personales y no se conservará indefinidamente.

Mantener DEC-BE-010 en estado `requiere-prueba` hasta validar transacciones, concurrencia, respuestas perdidas, errores parciales, recuperación, limpieza de la clave y ausencia de duplicados mediante Emulator Suite.

Esta decisión no autoriza crear Functions, instalar dependencias administrativas, activar Blaze, desplegar servicios ni ejecutar cancelaciones con cuentas reales.