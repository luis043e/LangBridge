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

- Pendiente.

### Pregunta

¿Qué nombre identificará públicamente al responsable de LangBridge?

### Opciones

- Nombre personal completo.
- Nombre comercial registrado.
- Empresa constituida.
- Nombre del producto acompañado del responsable.

### Recomendación preliminar

No presentar como entidad legal un nombre comercial que no esté formalmente establecido.

### Valor aprobado

- [PENDIENTE]

## 6. Decisión LEG-002: país y medio oficial de contacto

### Estado

- En análisis.

### Información confirmada

- País de operación principal: República Dominicana.

### Recomendación preliminar

Utilizar un medio o dirección comercial y evitar publicar un domicilio residencial.

### Valor aprobado

- País: República Dominicana.
- Dirección o medio oficial: [PENDIENTE]

## 7. Decisión LEG-003: correo oficial de soporte

### Estado

- Pendiente.

### Requisitos

- Dedicado a LangBridge.
- Revisado regularmente.
- Protegido con autenticación multifactor.
- Separado de credenciales administrativas.
- Apto para consultas de cuenta y funcionamiento.

### Valor aprobado

- [PENDIENTE]

## 8. Decisión LEG-004: correo oficial de privacidad

### Estado

- Pendiente.

### Finalidades

- Consultas sobre datos personales.
- Solicitudes de acceso o corrección.
- Solicitudes de eliminación.
- Consultas sobre retención.
- Comunicaciones relacionadas con privacidad.

### Valor aprobado

- [PENDIENTE]

## 9. Decisión LEG-005: sitio web oficial

### Estado

- Pendiente.

### Requisitos

- Accesible sin iniciar sesión.
- Utilizar HTTPS.
- Ser compatible con teléfonos.
- Mantener URL estable.
- Alojar políticas, términos, normas, soporte y eliminación.

### URL aprobada

- [PENDIENTE]

## 10. Decisión LEG-006: URL pública de eliminación

### Estado

- Pendiente.

### Requisitos

- Ser pública y estable.
- Identificar claramente a LangBridge.
- Permitir iniciar una solicitud.
- Explicar qué se elimina y qué podría retenerse.
- No exigir instalar la aplicación.
- No solicitar contraseñas.
- Permitir verificación segura.
- Ser apta para Play Console.

### URL aprobada

- [PENDIENTE]

### Dependencias

- Sitio web.
- Correo de privacidad.
- Verificación de identidad.
- Eliminación efectiva.
- Confirmación de finalización.

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

- En análisis.

### Criterios

- Verificación de identidad.
- Eliminación de Authentication.
- Limpieza o anonimización de Firestore.
- Eliminación de Storage.
- Tratamiento de mensajes y reportes.
- Fallos parciales y reintentos.
- Capacidad administrativa real.

### Valores pendientes

- Inicio del procesamiento: [PENDIENTE]
- Plazo objetivo: [PENDIENTE]
- Plazo máximo informado: [PENDIENTE]

### Regla

No publicar un plazo que no pueda cumplirse técnicamente.

## 14. Decisión LEG-010: tratamiento de conversaciones

### Estado

- En análisis.

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

- [PENDIENTE]

## 15. Decisión LEG-011: tratamiento de mensajes

### Estado

- En análisis.

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

- [PENDIENTE]

## 16. Decisión LEG-012: solicitudes de conexión

### Estado

- Propuesta.

### Propuesta

- Eliminar solicitudes pendientes enviadas.
- Eliminar solicitudes pendientes recibidas.
- Eliminar solicitudes rechazadas o canceladas según el período aprobado.
- Transformar o eliminar solicitudes aceptadas cuando exista conversación.
- Eliminar nombres personales innecesarios.

### Decisión aprobada

- [PENDIENTE]

## 17. Decisión LEG-013: listas de bloqueo

### Estado

- Propuesta.

### Propuesta

- Eliminar la lista personal del perfil eliminado.
- Limpiar su UID de listas de otras personas.
- Evitar referencias huérfanas.
- Conservar separadamente una referencia mínima cuando exista una medida administrativa justificada.

### Decisión aprobada

- [PENDIENTE]

## 18. Decisión LEG-014: reportes técnicos

### Estado

- En análisis.

### Propuesta

- Resolver el reporte.
- Eliminar o anonimizar UID y correo cuando dejen de ser necesarios.
- Conservar solamente información técnica no identificable que resulte útil.
- Eliminar descripciones con datos personales innecesarios.
- Aplicar revisión periódica.

### Período aprobado

- [PENDIENTE]

## 19. Decisión LEG-015: reportes de seguridad

### Estado

- En análisis.

### Criterios

- Gravedad.
- Estado de la investigación.
- Riesgo para otras personas.
- Reincidencia.
- Posibilidad de revisión.
- Obligación legal.
- Minimización.
- Acceso restringido.

### Período aprobado

- [PENDIENTE]

### Regla

No se utilizará una retención de seguridad para conservar indefinidamente el perfil completo.

No se debe utilizar una retención de seguridad para conservar indefinidamente el perfil completo.

## 20. Decisión LEG-016: registro mínimo de eliminación

### Estado

- Propuesta.

### Datos propuestos

- Identificador interno no reutilizable.
- Fecha de recepción.
- Fecha de finalización.
- Resultado general.
- Existencia de retención limitada.
- Razón general de retención.
- Fecha prevista de revisión.

### Datos que deberán reducirse

- UID completo.
- Correo completo.
- Nombre.
- Biografía.
- Fotografía.
- Información lingüística.

### Período aprobado

- [PENDIENTE]

## 21. Decisión LEG-017: copias de seguridad

### Estado

- Bloqueada por auditoría de proveedores.

### Información que debe confirmarse

- Servicios que mantienen copias.
- Ciclo de respaldo.
- Período de rotación.
- Acceso.
- Eliminación.
- Restauración.
- Tratamiento de cuentas eliminadas.

### Decisión aprobada

- [PENDIENTE]

## 22. Decisión LEG-018: cancelación de solicitudes

### Estado

- En análisis.

### Alternativas

- No permitir cancelación después de confirmar.
- Permitir cancelación antes de `processing`.
- Permitir cancelación hasta la primera operación irreversible.
- Evaluar manualmente cada cancelación.

### Recomendación preliminar

Permitir cancelación únicamente antes de comenzar una operación irreversible y después de verificar la identidad.

### Decisión aprobada

- [PENDIENTE]

## 23. Decisión LEG-019: confirmación de eliminación

### Estado

- Pendiente.

### Canal propuesto

- Correo asociado con la solicitud.

### Contenido mínimo

- Fecha de finalización.
- Confirmación de cierre.
- Categorías generales eliminadas.
- Existencia de retención limitada.
- Razón general.
- Canal de consulta.

### Canal aprobado

- [PENDIENTE]

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
