# 🎯 Decisiones Arquitéctonicas - Telegram Messenger API

**Documento que detalla las decisiones estratégicas tomadas durante el desarrollo del proyecto**

---

## 📋 Tabla de Contenidos

1. [Persistencia de Datos en Memoria](#1-persistencia-de-datos-en-memoria)
2. [Inyección de Dependencias Manual](#2-inyección-de-dependencias-manual)
3. [Mapeo Manual vs. Serialización Automática](#3-mapeo-manual-toprimives-vs-serialización-automática)

---

## 1. Persistencia de Datos en Memoria

### 🔹 Decisión

Implementé un `InMemoryMessageRepository` e `InMemoryDataBase` en lugar de utilizar una base de datos tradicional como MongoDB, SQL Server o PostgreSQL.

### 🎯 Razón de la Decisión

En este caso, la prioridad era enfocarse en el diseño y construcción de la propia arquitectura hexagonal, así como validar la lógica de negocio y la integración con la API de Telegram. Al utilizar almacenamiento en memoria, fue posible iterar rápidamente sin la sobrecarga de configurar esquemas, migraciones o contenedores de base de datos.

### ⚖️ Trade-offs

| Beneficio | Costo |
|-----------|-------|
| Iteración rápida sin configuración | Pérdida de persistencia al reiniciar |
| Sin overhead de esquemas/migraciones | Datos no persistentes entre sesiones |
| Enfoque en arquitectura | Limitado para entornos de producción |
| Desarrollo más ágil | Requiere migración posterior a BD real |

### ✨ Mitigación

Gracias a la Arquitectura Hexagonal, el sistema está completamente preparado para conectar una base de datos real. El cambio requiere únicamente crear un nuevo adaptador que implemente la interfaz `MessageRepository`, sin necesidad de modificar una sola línea de lógica de aplicación.

---

## 2. Inyección de Dependencias Manual

### 🔹 Decisión

Opté por una inyección de dependencias manual a través de un `ServiceContainer`, en lugar de utilizar frameworks de IoC como Inversify o NestJS.

### 🎯 Razón de la Decisión

Para un proyecto de esta escala, introducir un framework de IoC (Inversion of Control) agregaba complejidad innecesaria y "ruido" con decoradores adicionales en las clases de dominio. La simplicidad y claridad eran prioritarias.

### ⚖️ Trade-offs

| Beneficio | Costo |
|-----------|-------|
| Código 100% TypeScript puro (vanilla) | Más código manual de instanciación |
| Mayor legibilidad | Menos "magia" automática |
| Sin dependencias pesadas en el núcleo | Responsabilidad manual de dependencias |
| Control explícito de instanciación | Posible duplicación si no se centraliza |

### ✨ Implementación

El `ServiceContainer` centraliza todas las instancias y sus dependencias, proporcionando un punto único de verdad para la configuración de inyecciones:

```typescript
export const ServiceContainer = {
  user: {
    register: new RegisterUser(UserRepository),
    login: new LoginUser(UserRepository, tokenService)
  },
  messages: {
    receiveUseCase: new ReceiveAndReplyMessage(...)
  }
};
```

---

## 3. Mapeo Manual (toPrimitives) vs. Serialización Automática

### 🔹 Decisión

Se implementó el método `toPrimitives()` en las entidades en lugar de devolver los objetos de dominio directamente en la respuesta de la API.

### 🎯 Razón de la Decisión

Los objetos de dominio utilizan Value Objects (con propiedades `.value`). Devolverlos directamente en las respuestas ensuciaba el JSON y exponía datos sensibles como el hash de la contraseña. Se requería un control granular sobre qué datos se serializan.

### ⚖️ Trade-offs

| Beneficio | Costo |
|-----------|-------|
| Control total sobre el contrato de API | Método extra por entidad |
| Respuestas JSON limpias | Código adicional de mapeo |
| Filtrado de datos sensibles | Mantenimiento sincronizado |
| Seguridad intrínseca | Posible duplicación de lógica |

### ✨ Implementación

Cada entidad implementa un método de serialización:

```typescript
// Método en la entidad
toPrimitives(): UserDTO {
  return {
    id: this._id.value,
    name: this.name.value,
    email: this.email.value
    // Nota: password NO se incluye
  };
}

// Uso en el controlador
const user = await ServiceContainer.user.register.run(name, email, password);
res.status(201).json({ user: user.toPrimitives() });
```

**Ventajas de este enfoque:**
- Las propiedades sensibles (como contraseñas hasheadas) nunca se exponen
- La respuesta es exactamente lo que el cliente necesita
- Cambios en la estructura de dominio no afectan el contrato de API
- Capa de seguridad adicional y explícita

---

## 📊 Comparativa de Decisiones

| Aspecto | Decisión | Alternativa | Razón de Elección |
|--------|----------|-------------|-------------------|
| **Persistencia** | In-Memory | BD Real (PostgreSQL/MongoDB) | Enfoque en arquitectura (iterable rápidamente) |
| **DI** | Manual Container | Framework IoC | Mantener código simple y puro |
| **Serialización** | toPrimitives() | Automática/Reflection | Control de datos sensibles |

---

## 🔮 Futuras Mejoras

Con base en estas decisiones, los siguientes cambios son minimales:

1. **Cambio a BD Real:**
   - Crear nueva clase que implemente `*Repository`
   - Registrar en `ServiceContainer`
   - ✅ Cero cambios en capas de aplicación y dominio

2. **Adoptar Framework IoC (si es necesario):**
   - Reemplazar `ServiceContainer` manual
   - Los principios SOLID aplicados permiten migración directa
   - ✅ Cero cambios en lógica de negocio

3. **Serialización Automática (si se requiere):**
   - Utilizar bibliotecas de transformación (class-transformer, etc.)
   - Mantener el mismo contrato de DTO
   - ✅ Cero cambios en controladores

---

## ✅ Conclusión

Cada decisión fue tomada priorizando:

1. **Claridad:** Código legible y comprensible
2. **Escalabilidad:** Fácil de extender sin modificar existente
3. **Principios SOLID:** Mantenibilidad a largo plazo
4. **Pragmatismo:** Evitar sobre-ingeniería innecesaria

Las decisiones sientan las bases para un proyecto que puede evolucionar fácilmente cuando sea necesario, sin estar atado a restricciones arquitectónicas.

---

**Documento Versión:** 1.0  
**Última Actualización:** Febrero 2026  
**Estado:** Decisiones Finales



