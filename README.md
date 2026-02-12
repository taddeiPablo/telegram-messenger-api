# Telegram Messenger API

**Versión:** 1.0.0  
**Descripción:** API REST desarrollada con Node.js y Express para la gestión de usuarios y mensajes de Telegram, implementando **Arquitectura Hexagonal** (Clean Architecture).

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura](#arquitectura)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Módulos](#módulos)
5. [Endpoints de la API](#endpoints-de-la-api)
6. [Configuración e Instalación](#configuración-e-instalación)
7. [Tecnologías Utilizadas](#tecnologías-utilizadas)
8. [Scripts Disponibles](#scripts-disponibles)

---

## 📖 Descripción General

Esta API proporciona un sistema completo para:
- **Gestión de Usuarios:** Registro, login y autenticación mediante JWT
- **Gestión de Mensajes:** Recepción, envío automático y almacenamiento de mensajes de Telegram
- **Respuestas Automáticas:** Configuración de respuestas automáticas a mensajes entrantes
- **Documentación Interactiva:** Documentación Swagger en tiempo real

El proyecto utiliza **Arquitectura Hexagonal** para mantener una clara separación de responsabilidades entre capas (Dominio, Aplicación e Infraestructura).

---

## 🏗️ Arquitectura

El proyecto implementa **Arquitectura Hexagonal (Clean Architecture)**, que organiza el código en capas independientes:

```
┌─────────────────────────────────────────────┐
│         CAPA DE PRESENTACIÓN (API REST)     │
│  Controllers • Routers • Middlewares        │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│    CAPA DE APLICACIÓN (Use Cases)           │
│  Lógica de negocio base y orchestración     │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│  CAPA DE DOMINIO (Entities, Value Objects) │
│  Lógica empresarial pura                    │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│   CAPA DE INFRAESTRUCTURA (Adapters)        │
│  BD • APIs Externas • Servidores            │
└─────────────────────────────────────────────┘
```

### Principios Aplicados:
- **Separación de responsabilidades:** Cada capa tiene un propósito específico
- **Independencia de frameworks:** La lógica de negocio no depende de Express, Telegraf, etc.
- **Testabilidad:** Inyección de dependencias facilita testing unitario
- **Escalabilidad:** Fácil agregar nuevas funcionalidades sin modificar código existente

---

## 📁 Estructura del Proyecto

```
telegram-messenger-api/
├── src/
│   ├── app.ts                           # Configuración principal de Express
│   └── lib/
│       ├── shared/                      # Código compartido
│       │   ├── Config.ts               # Variables de configuración
│       │   └── ServiceContainer.ts     # Inyección de dependencias
│       │
│       ├── users/                       # MÓDULO: Gestión de Usuarios
│       │   ├── domain/
│       │   │   ├── entities/
│       │   │   │   └── User.ts
│       │   │   ├── interfaces/
│       │   │   │   ├── UserRepository.ts
│       │   │   │   └── TokenService.ts
│       │   │   ├── errors/
│       │   │   │   └── ExceptionUserErrorNotFound.ts
│       │   │   └── values-objects/
│       │   │       ├── UserId.ts
│       │   │       ├── UserEmail.ts
│       │   │       ├── UserName.ts
│       │   │       └── UserPassword.ts
│       │   ├── application/
│       │   │   └── use-cases/
│       │   │       ├── RegisterUser.ts
│       │   │       └── LoginUser.ts
│       │   └── infrastructure/
│       │       ├── inMemoryDataBase.ts
│       │       ├── swagger.ts
│       │       └── Api/
│       │           ├── controllers/
│       │           │   └── ExpressUserController.ts
│       │           ├── routers/
│       │           │   └── ExpressUserRouter.ts
│       │           ├── middlewares/
│       │           │   └── IsAuthenticated.ts
│       │           └── security/
│       │               └── JwtTokenService.ts
│       │
│       └── messages/                    # MÓDULO: Gestión de Mensajes
│           ├── domain/
│           │   ├── entities/
│           │   │   └── Message.ts
│           │   ├── interfaces/
│           │   │   ├── MessageRepository.ts
│           │   │   ├── MessageSender.ts
│           │   │   └── AutoResponseConfig.ts
│           │   ├── errors/
│           │   │   └── ExceptionMessageErrorNotFound.ts
│           │   └── value_objects/
│           │       ├── MessageId.ts
│           │       └── MessageContent.ts
│           ├── application/
│           │   └── use-cases/
│           │       ├── ReceiveAndReplyMessage.ts
│           │       ├── SendMessageToUser.ts
│           │       └── UpdateAutoResponse.ts
│           └── infrastructure/
│               ├── InMemoryMessageRepository.ts
│               ├── TelegrafAdapter.ts
│               ├── TelegrafMessageAdapter.ts
│               └── Api/
│                   ├── controllers/
│                   │   └── MessageController.ts
│                   └── routers/
│                       └── ExpressMessageRouters.ts
│
├── package.json
├── tsconfig.json
└── README.md

```

---

## 🔧 Módulos

### 1. **Módulo de Usuarios** (`/lib/users/`)

Gestiona el ciclo de vida de los usuarios del sistema (registro, login, autenticación).

#### Componentes:

**Domain Layer:**
- **User** (Entity): Representa a un usuario del sistema
  - Propiedades: `id`, `name`, `email`, `password`
  - Método generador de ID único (12 caracteres aleatorios)

- **Value Objects:**
  - `UserId`: Encapsula la identidad del usuario
  - `UserEmail`: Valida y encapsula email
  - `UserName`: Valida y encapsula nombre
  - `UserPassword`: Encapsula y criptografa contraseña

- **Interfaces:**
  - `UserRepository`: Define operaciones CRUD de usuarios
  - `TokenService`: Define operaciones de generación/validación de JWT

- **Exceptions:**
  - `ExceptionUserErrorNotFound`: Excepción personalizada para errores de usuario

**Application Layer:**
- `RegisterUser` (Use Case): Registra nuevo usuario
  - Entrada: `name`, `email`, `password`
  - Salida: Objeto `User` con ID generado

- `LoginUser` (Use Case): Autentica usuario
  - Entrada: `email`, `password`
  - Salida: Usuario autenticado con token JWT

**Infrastructure Layer:**
- `InMemoryDataBase`: Repositorio en memoria que simula una base de datos
- `JwtTokenService`: Genera y valida tokens JWT
- `ExpressUserController`: Controlador HTTP para pedir registros y login
- `ExpressUserRouter`: Define rutas HTTP del módulo usuarios
- `IsAuthenticated`: Middleware para validar tokens
- `swagger.ts`: Documentación OpenAPI para usuarios

#### Endpoints:
```
POST   /user/register       - Registrar nuevo usuario
POST   /user/login          - Autenticar usuario
```

---

### 2. **Módulo de Mensajes** (`/lib/messages/`)

Gestiona el ciclo completo de mensajes de Telegram (recepción, respuestas automáticas, envío manual).

#### Componentes:

**Domain Layer:**
- **Message** (Entity): Representa un mensaje
  - Propiedades: `id`, `content`, `senderId`, `receiverId`, `direction`, `createdAt`, `telegramChatId`
  - Direcciones: `INBOUND` (entrante) o `OUTBOUND` (saliente)

- **Value Objects:**
  - `MessageId`: Encapsula ID único del mensaje
  - `MessageContent`: Encapsula contenido del mensaje

- **Interfaces:**
  - `MessageRepository`: Define operaciones de almacenamiento de mensajes
  - `MessageSender`: Define operaciones de envío de mensajes
  - `AutoResponseConfig`: Define configuración de respuestas automáticas

- **Exceptions:**
  - `ExceptionMessageErrorNotFound`: Excepción personalizada para errores de mensajes

**Application Layer:**
- `ReceiveAndReplyMessage` (Use Case): Recibe mensajes entrantes y envía respuesta automática
  - Entrada: `chatId`, `textReceived`
  - Procesos:
    1. Guarda mensaje entrante en repositorio
    2. Envía respuesta automática configurada
    3. Guarda respuesta enviada en repositorio

- `SendMessageToUser` (Use Case): Envía mensaje manual a un usuario
  - Entrada: `chatId`, `text`
  - Procesos:
    1. Valida parámetros
    2. Envía mensaje vía Telegram
    3. Registra mensaje en historial

- `UpdateAutoResponse` (Use Case): Actualiza el mensaje de respuesta automática
  - Entrada: nuevo texto de respuesta automática

**Infrastructure Layer:**
- `InMemoryMessageRepository`: Almacenan mensajes en memoria
- `TelegrafAdapter`: Adaptador para Telegram usando librería Telegraf
- `TelegrafMessageAdapter`: Adaptador específico para operaciones de mensajes
- `ExpressMessageController`: Controlador HTTP para mensajes
- `ExpressMessageRouter`: Define rutas HTTP del módulo mensajes

#### Endpoints:
```
POST   /message/send                - Enviar mensaje manual a Telegram
POST   /message/config/auto-reply   - Configurar respuesta automática
GET    /message/history             - Obtener historial de mensajes
```

---

### 3. **Módulo Compartido** (`/lib/shared/`)

Contiene funcionalidad transversal utilizada por otros módulos.

#### Componentes:

- **ServiceContainer**: Contenedor de inyección de dependencias
  - Centraliza instancias de repositorios, servicios y use cases
  - Estructura:
    ```typescript
    {
      user: { register, login },
      messages: { receiveUseCase, updateConfig, sendMessage, repository }
    }
    ```

- **Config**: Variables de configuración globales

---

## 📡 Endpoints de la API

### Usuarios

#### 1. Registrar Usuario
```http
POST /user/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "SecurePass123"
}
```
**Respuesta (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "aBcDeF123456",
    "name": { "value": "Juan Pérez" },
    "email": { "value": "juan@example.com" },
    "password": { "value": "$2a$10$..." }
  }
}
```

#### 2. Autenticar Usuario
```http
POST /user/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "SecurePass123"
}
```
**Respuesta (200):**
```json
{
  "message": "Login successful",
  "user": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { ... }
  }
}
```

---

### Mensajes

#### 1. Enviar Mensaje Manual
```http
POST /message/send
Content-Type: application/json
Authorization: Bearer <token_jwt>

{
  "chatId": "123456789",
  "text": "Hola desde la API"
}
```
**Respuesta (200):**
```json
{
  "status": "success",
  "message": "Mensaje enviado correctamente a Telegram"
}
```

#### 2. Configurar Respuesta Automática
```http
POST /message/config/auto-reply
Content-Type: application/json
Authorization: Bearer <token_jwt>

{
  "autoReply": "Gracias por tu mensaje. Pronto te responderé"
}
```
**Respuesta (200):**
```json
{
  "message": "Configuración actualizada correctamente",
  "newAutoReply": "Gracias por tu mensaje. Pronto te responderé"
}
```

#### 3. Obtener Historial de Mensajes
```http
GET /message/history
Authorization: Bearer <token_jwt>
```
**Respuesta (200):**
```json
[
  {
    "id": "uuid-v4",
    "content": "Hola bot",
    "senderId": "123456789",
    "receiverId": "987654321",
    "direction": "INBOUND",
    "createdAt": "2026-02-11T10:30:00.000Z"
  },
  ...
]
```

---

## 🚀 Configuración e Instalación

### Requisitos Previos
- **Node.js** >= 16.x
- **npm** o **yarn**
- Token de Telegram Bot (desde [@BotFather](https://t.me/botfather))

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/taddeiPablo/telegram-messenger-api.git
cd telegram-messenger-api
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Crear archivo `.env`**
```bash
# .env
TELEGRAM_BOT_TOKEN=tu_token_de_bot_aqui
JWT_SECRET=tu_secreto_jwt_aqui
PORT=3000
```

4. **Compilar TypeScript** (opcional, para producción)
```bash
npm run build
```

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **Node.js** | 16+ | Runtime de JavaScript |
| **TypeScript** | ^5.9.3 | Tipado estático |
| **Express** | ^5.2.1 | Framework web HTTP |
| **Telegraf** | ^4.16.3 | Cliente Telegram Bot |
| **JWT** | ^9.0.3 | Autenticación y autorización |
| **bcryptjs** | ^3.0.3 | Encriptación de contraseñas |
| **Swagger** | ^6.2.8 | Documentación interactiva |
| **dotenv** | ^17.2.4 | Gestión de variables de entorno |

### DevDependencies:
- **tsx** ^4.21.0 - Ejecutor de TypeScript rápido
- **ts-node** ^10.9.2 - Ejecutor de TypeScript alternativo
- **@types/*** - Definiciones de tipos para librerías

---

## 📜 Scripts Disponibles

### Desarrollo
```bash
npm run dev
```
Inicia el servidor en modo desarrollo con recarga automática (usando tsx).

### Producción - Compilar
```bash
npm run build
```
Compila TypeScript a JavaScript en la carpeta `dist/`.

### Producción - Ejecutar
```bash
npm start
```
Ejecuta la aplicación compilada.

---

## 📚 Documentación Interactiva

Una vez el servidor está corriendo, accede a:
```
http://localhost:3000/api-docs
```

Aquí encontrarás documentación completa Swagger con la posibilidad de probar los endpoints directamente.

---

## 🏆 Patrones y Mejores Prácticas Implementadas

1. **Arquitectura Hexagonal:** Separación clara de capas
2. **Value Objects:** Encapsulación de valores con validación
3. **Use Cases:** Lógica de negocio granular y testeable
4. **Inyección de Dependencias:** Facilita testing y mantenimiento
5. **Repositorio Pattern:** Abstracción de la persistencia
6. **Adapter Pattern:** Integración con Telegram sin acoplar la lógica de negocio
7. **Error Handling:** Excepciones personalizadas y manejo centralizado
8. **JWT Authentication:** Autenticación segura y stateless
9. **Password Hashing:** Criptografía de contraseñas con bcryptjs

---

## 📝 Notas de Desarrollo

- La persistencia actual es **en memoria** (`InMemoryDataBase`, `InMemoryMessageRepository`)
- Para usar en producción, reemplazar con una verdadera base de datos (MongoDB, PostgreSQL, etc.)
- El token JWT se configurará con las variables de entorno
- Los middlewares de autenticación están disponibles pero pueden implementarse más ampliamente

---

## 📧 Contacto y Soporte

**Autor:** [Tu Nombre]  
**Repositorio:** [GitHub - telegram-messenger-api](https://github.com/taddeiPablo/telegram-messenger-api)  
**Issues:** Reportar en [Issues](https://github.com/taddeiPablo/telegram-messenger-api/issues)
