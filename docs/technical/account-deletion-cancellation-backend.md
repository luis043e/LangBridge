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

## 9. Registro cancelado mínimo

La colección propuesta para el registro temporal es:

```text
cancelledDeletionRequests/{requestId}
```

La estructura todavía no está implementada.

El registro cancelado podrá contener únicamente datos mínimos, por ejemplo:

```text
status: cancelled
cancelledAt
expiresAt
procedureVersion
verificationMethod
restorationResult
technicalReason
```

El diseño final deberá evitar conservar innecesariamente:

- UID.
- Correo.
- Mensajes.
- Conversaciones.
- Reportes.
- Tokens.
- Credenciales.
- Copias del perfil.
- `previousProfileVisibility`.
- Datos de otras personas.
- La palabra empleada para confirmar la eliminación.

## 10. Retención

El registro cancelado se conservará durante 30 días calendario desde `cancelledAt`.

Después del plazo deberá eliminarse completamente.

La expiración deberá:

- ejecutarse desde un entorno autorizado;
- admitir reintentos seguros;
- ser idempotente;
- no afectar la cuenta activa;
- no crear DEL-S2;
- no impedir una nueva solicitud.

## 11. Idempotencia

Una repetición de la operación de cancelación no deberá:

- duplicar registros cancelados;
- modificar incorrectamente la visibilidad;
- reactivar solicitudes terminales;
- crear DEL-S2;
- borrar datos ordinarios de una cuenta activa;
- crear dos solicitudes activas;
- prolongar indefinidamente la retención.

Cada operación deberá poder distinguir entre:

- cancelación no iniciada;
- restauración en curso;
- restauración completada;
- registro cancelado creado;
- limpieza temporal completada.

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