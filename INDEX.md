# 📚 Índice de Documentación - Telegram Messenger API

**Guía rápida para navegar la documentación del proyecto**

---

## 🎯 ¿Por Dónde Empiezo?

### 👤 Soy Usuario Final / Tendré Que Usar La API
**Documentación recomendada:**
1. [README.md](./README.md) - Descripción general y configuración
2. [API_REFERENCE.md](./API_REFERENCE.md) - Guía completa de endpoints
3. **Ejemplos de cliente:** JavaScript, Python, cURL

**Léase en este orden:**
- [Descripción General](./README.md#descripción-general)
- [Endpoints de la API](./API_REFERENCE.md#endpoints-de-usuarios)
- [Ejemplos de Cliente](./API_REFERENCE.md#ejemplos-de-cliente)

---

### 👨‍💻 Soy Desarrollador y Necesito Entender la Arquitectura
**Documentación recomendada:**
1. [ARCHITECTURE.md](./ARCHITECTURE.md) - Explicación profunda de la arquitectura
2. [README.md](./README.md#módulos) - Descripción de módulos
3. [CONTRIBUTING.md](./CONTRIBUTING.md#estructura-de-carpetas---convenciones) - Convenciones de código

**Léase en este orden:**
- [Visión de Arquitectura](./ARCHITECTURE.md#visión-de-arquitectura)
- [Patrones de Diseño](./ARCHITECTURE.md#patrones-de-diseño)
- [Detalle de Capas](./ARCHITECTURE.md#detalle-de-capas)
- [Guía de Extensión](./ARCHITECTURE.md#guía-de-extensión)

---

### 🔧 Necesito Configurar el Proyecto para Desarrollo
**Documentación recomendada:**
1. [README.md](./README.md#configuración-e-instalación) - Pasos de instalación
2. [CONTRIBUTING.md](./CONTRIBUTING.md#configuración-del-ambiente) - Configuración detallada
3. [CONTRIBUTING.md](./CONTRIBUTING.md#estándares-de-código) - Estándares de código

**Léase en este orden:**
- [Requisitos Previos](./README.md#requisitos-previos)
- [Pasos de Instalación](./README.md#pasos-de-instalación)
- [Configuración del Ambiente](./CONTRIBUTING.md#configuración-del-ambiente)

---

### 🚀 Quiero Desarrollar una Nueva Feature
**Documentación recomendada:**
1. [ARCHITECTURE.md](./ARCHITECTURE.md#guía-de-extensión) - Cómo agregar funcionalidad
2. [CONTRIBUTING.md](./CONTRIBUTING.md#workflow-de-desarrollo) - Flujo de desarrollo
3. [CONTRIBUTING.md](./CONTRIBUTING.md#estándares-de-código) - Estándares a seguir

**Léase en este orden:**
- [Guía de Extensión](./ARCHITECTURE.md#guía-de-extensión)
- [Workflow de Desarrollo](./CONTRIBUTING.md#workflow-de-desarrollo)
- [Checklist Pre-Commit](./CONTRIBUTING.md#checklist-pre-commit)
- [Git Workflow](./CONTRIBUTING.md#git-workflow)

---

### 🐛 Necesito Debuggear o Corregir un Bug
**Documentación recomendada:**
1. [ARCHITECTURE.md](./ARCHITECTURE.md#detalle-de-capas) - Entender donde está el problema
2. [API_REFERENCE.md](./API_REFERENCE.md) - Entender el flujo de datos
3. [CONTRIBUTING.md](./CONTRIBUTING.md#testing) - Cómo testear la corrección

**Léase en este orden:**
- [Flujo de Datos](./ARCHITECTURE.md#flujo-de-datos)
- [Endpoints de la API](./API_REFERENCE.md)
- [Testing](./CONTRIBUTING.md#testing)

---

## 📖 Mapa de Documentación

```
📚 DOCUMENTACIÓN
│
├─ README.md ⭐
│  ├─ Descripción general del proyecto
│  ├─ Stack de tecnologías
│  ├─ Estructura del proyecto
│  ├─ Módulos principales
│  ├─ Instalación y configuración básica
│  └─ Scripts disponibles
│
├─ ARCHITECTURE.md (Técnico Profundo)
│  ├─ Visión y principios arquitectónicos
│  ├─ Patrones de diseño usados
│  ├─ Explicación detallada de capas (Domain, Application, Infrastructure)
│  ├─ Flujos de datos
│  ├─ Decisiones arquitectónicas (por qué)
│  ├─ Cómo extender el proyecto
│  └─ Diagramas y referencias
│
├─ API_REFERENCE.md (Para Usuarios de la API)
│  ├─ Autenticación y JWT
│  ├─ Endpoints de Usuarios (Register, Login)
│  ├─ Endpoints de Mensajes (Send, History, Config)
│  ├─ Códigos HTTP
│  ├─ Formatos de respuesta
│  ├─ Ejemplos en JavaScript, Python, cURL
│  └─ Mejores prácticas
│
├─ CONTRIBUTING.md (Para Desarrolladores)
│  ├─ Configuración del ambiente
│  ├─ Estructura de carpetas y nombrado
│  ├─ Estándares de código TypeScript
│  ├─ Workflow de desarrollo
│  ├─ Testing
│  ├─ Git workflow
│  └─ Checklist pre-commit
│
└─ INDEX.md (Este archivo)
   ├─ Guía rápida por roles
   ├─ Mapa de documentación
   ├─ Preguntas frecuentes
   └─ Glosario
```

---

## ❓ Preguntas Frecuentes

### P: ¿Dónde encuentro los endpoints disponibles?
**R:** En [API_REFERENCE.md](./API_REFERENCE.md#endpoints-de-usuarios). Los principales son:
- `POST /user/register` - Registrar usuario
- `POST /user/login` - Autenticarse
- `POST /message/send` - Enviar mensaje
- `POST /message/config/auto-reply` - Configurar respuesta automática
- `GET /message/history` - Obtener historial

---

### P: ¿Cómo uso la API desde mi aplicación?
**R:** Ver [Ejemplos de Cliente](./API_REFERENCE.md#ejemplos-de-cliente) donde encontrarás:
- Cliente JavaScript/Node.js
- Cliente Python
- Ejemplos con cURL
- Ejemplos con fetch()

---

### P: ¿Por qué se usa Arquitectura Hexagonal?
**R:** Ver [¿Por qué Arquitectura Hexagonal?](./ARCHITECTURE.md#1-por-qué-arquitectura-hexagonal). Resumen:
- Independencia de frameworks
- Facilita testing
- Código mantenible y escalable

---

### P: ¿Cómo agrego una nueva funcionalidad?
**R:** Sigue estos pasos en orden:
1. [Workflow de Desarrollo](./CONTRIBUTING.md#workflow-de-desarrollo)
2. [Guía de Extensión](./ARCHITECTURE.md#guía-de-extensión) - Ejemplo práctico
3. [Checklist Pre-Commit](./CONTRIBUTING.md#checklist-pre-commit)

---

### P: ¿Cómo cambio de base de datos (de in-memory a real)?
**R:** Ver [Detalle de Capas - Repositorios](./ARCHITECTURE.md#repositorios-adaptadores-de-persistencia). El cambio se hace solo en la capa de infraestructura:
1. Crear nueva clase que implemente `UserRepository`
2. Registrar en `ServiceContainer`
3. El resto del código no cambia

---

### P: ¿Cómo funciona la autenticación?
**R:** Ver [Autenticación](./API_REFERENCE.md#autenticación). Flujo:
1. `POST /user/register` - Crear usuario con contraseña hasheada
2. `POST /user/login` - Recibir token JWT
3. Incluir token en header `Authorization: Bearer <token>`

---

### P: ¿Dónde está el código de cada módulo?
**R:** En `/src/lib/`:
- **Usuarios:** `/src/lib/users/`
- **Mensajes:** `/src/lib/messages/`
- **Compartido:** `/src/lib/shared/`

La estructura dentro de cada módulo sigue el patrón hexagonal:
```
users/
├── domain/          (Lógica de negocio)
├── application/     (Casos de uso)
└── infrastructure/  (Adaptadores técnicos)
```

---

### P: ¿Cómo ejecuto los tests?
**R:** Ver [Testing](./CONTRIBUTING.md#testing):
```bash
npm test                    # Ejecutar todos
npm test -- --watch       # Modo observación
npm test -- --coverage    # Ver cobertura
```

---

### P: ¿Cuáles son los estándares de código?
**R:** Ver [Estándares de Código](./CONTRIBUTING.md#estándares-de-código):
- Tipado fuerte en TypeScript
- Inyección de dependencias
- Máximo 100 caracteres por línea
- Excepciones personalizadas
- Comentarios para lógica compleja

---

### P: ¿Cómo actualizo la documentación?
**R:** 
1. Edita el archivo `.md` correspondiente
2. Sigue el formato Markdown
3. Incluya en tu commit: `docs: descripción del cambio`

---

### P: ¿Dónde está la documentación Swagger interactiva?
**R:** Después de ejecutar `npm run dev`, accede a:
```
http://localhost:3000/api-docs
```
Allí puedes probar todos los endpoints directamente.

---

## 📚 Glosario

| Término | Definición |
|---------|-----------|
| **Entity** | Objeto con identidad única. Ej: `User`, `Message` |
| **Value Object** | Objeto sin identidad, solo valor. Ej: `UserEmail`, `UserId` |
| **Use Case** | Acción que el sistema puede realizar. Ej: `RegisterUser` |
| **Repository** | Abstracción de persistencia. Ej: `UserRepository` |
| **Adapter** | Implementación técnica de una interfaz. Ej: `TelegrafAdapter` |
| **Domain** | Capa con lógica de negocio pura |
| **Application** | Capa que orquesta use cases |
| **Infrastructure** | Capa con detalles técnicos (BD, APIs, etc.) |
| **Port** | Interfaz que define un contrato |
| **Adapter** | Implementación de un puerto |
| **JWT** | Token para autenticación stateless |
| **Hexagonal** | Arquitectura con capas independientes |
| **DI** | Dependency Injection - pasar dependencias |
| **SOLID** | Principios de diseño OOP |

---

## 🔗 Enlaces Directos Rápidos

### Instalación y Configuración
- [Requisitos](./README.md#requisitos-previos)
- [Instalación](./README.md#pasos-de-instalación)
- [Configuración Ambiente](./CONTRIBUTING.md#configuración-del-ambiente)

### Uso de la API
- [Endpoints Usuarios](./API_REFERENCE.md#endpoints-de-usuarios)
- [Endpoints Mensajes](./API_REFERENCE.md#endpoints-de-mensajes)
- [Ejemplos de Cliente](./API_REFERENCE.md#ejemplos-de-cliente)

### Desarrollo
- [Estructura de Carpetas](./CONTRIBUTING.md#estructura-de-carpetas---convenciones)
- [Estándares de Código](./CONTRIBUTING.md#estándares-de-código)
- [Workflow de Desarrollo](./CONTRIBUTING.md#workflow-de-desarrollo)

### Arquitectura
- [Explicación General](./ARCHITECTURE.md#visión-de-arquitectura)
- [Patrones de Diseño](./ARCHITECTURE.md#patrones-de-diseño)
- [Cómo Extender](./ARCHITECTURE.md#guía-de-extensión)

---

## 📊 Estadísticas del Proyecto

| Métrica | Valor |
|---------|-------|
| **Módulos Principales** | 3 (Usuarios, Mensajes, Compartido) |
| **Capas Arquitectónicas** | 3 (Domain, Application, Infrastructure) |
| **Use Cases** | 5 (RegisterUser, LoginUser, SendMessage, ReceiveAndReply, UpdateAutoResponse) |
| **Endpoints** | 5 (2 usuarios + 3 mensajes) |
| **Documentos** | 5 (README, ARCHITECTURE, API_REFERENCE, CONTRIBUTING, INDEX) |
| **Stack Tech** | TypeScript + Express + Telegraf + JWT + bcryptjs |

---

## ✨ Mejores Prácticas Aplicadas

✅ **Arquitectura Limpia** - Separación clara de responsabilidades  
✅ **SOLID Principles** - Principios de diseño orientado a objetos  
✅ **Type Safety** - TypeScript para evitar errores  
✅ **Dependency Injection** - Facilita testing y mantenimiento  
✅ **Value Objects** - Validación en tiempo de construcción  
✅ **Error Handling** - Excepciones personalizadas y centralizadas  
✅ **JWT Authentication** - Seguridad stateless  
✅ **API Documentation** - Swagger/OpenAPI  
✅ **Git Workflow** - Proceso de desarrollo ordenado  
✅ **Code Standards** - Convenciones consistentes  

---

## 🎓 Recursos para Aprender

### Conceptos Fundamentales
- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Advanced TypeScript](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Node.js y Express
- [Express.js Guide](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### Telegram Bot
- [Telegraf Documentation](https://telegraf.js.org/)
- [Telegram Bot API](https://core.telegram.org/bots/api)

### Autenticación
- [JWT.io Introduction](https://jwt.io/introduction)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)

---

## 💬 Comunidad y Soporte

- **GitHub Issues:** [Reporta problemas](https://github.com/taddeiPablo/telegram-messenger-api/issues)
- **GitHub Discussions:** [Haz preguntas](https://github.com/taddeiPablo/telegram-messenger-api/discussions)
- **Documentación:** Consulta los archivos `.md` disponibles

---

## 📝 Última Actualización

- **Fecha:** Febrero 2026
- **Versión del Proyecto:** 1.0.0
- **Estado:** Producción-ready
- **Mantenedor:** [Tu Nombre/Equipo]

---

## 🎯 Próximos Pasos Recomendados

1. **Si es tu primer contacto:** Lee [README.md](./README.md)
2. **Si vas a usar la API:** Consulta [API_REFERENCE.md](./API_REFERENCE.md)
3. **Si vas a desarrollar:** Estudia [ARCHITECTURE.md](./ARCHITECTURE.md)
4. **Antes de hacer commits:** Revisa [CONTRIBUTING.md](./CONTRIBUTING.md)

---

**¡Bienvenido al proyecto! 🚀**

