# Documento de Arquitectura - Telegram Messenger API

**Último actualizado:** Febrero 2026  
**Versión:** 1.0.0

---

## 📑 Tabla de Contenidos

1. [Visión de Arquitectura](#visión-de-arquitectura)
2. [Patrones de Diseño](#patrones-de-diseño)
3. [Flujo de Datos](#flujo-de-datos)
4. [Detalle de Capas](#detalle-de-capas)
5. [Decisiones Arquitectónicas](#decisiones-arquitectónicas)
6. [Guía de Extensión](#guía-de-extensión)

---

## 🎯 Visión de Arquitectura

### Objetivo Principal
Crear una API escalable y mantenible que gestione usuarios y mensajes de Telegram, utilizando principios SOLID y arquitectura limpia para garantizar que el código sea testeable, reutilizable y fácil de modificar.

### Principios Rectores
- **Independencia de Frameworks:** La lógica de negocio no depende de Express, Telegraf o cualquier otra librería
- **Testabilidad:** Todo componente crítico puede ser testeado en aislamiento
- **Escalabilidad:** Fácil agregar nuevas funcionalidades sin modificar código existente
- **Mantenibilidad:** Código claro, bien documentado y que sigue estándares de la industria

---

## 🔄 Patrones de Diseño

### 1. **Arquitectura Hexagonal (Ports & Adapters)**

```
                    ┌─────────────────────┐
                    │  EXTERIOR (Users)   │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   HTTP Adapters     │
                    │ (Express Controllers)
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
    ┌───▼──┐          ┌────────▼────────┐        ┌───▼──┐
    │Port  │          │  APLICACIÓN     │        │Port  │
    │(API) │          │  (Use Cases)    │        │(BD)  │
    └───┬──┘          └────────┬────────┘        └───┬──┘
        │                      │                      │
        │          ┌───────────▼────────────┐         │
        │          │  DOMINIO (Entities,    │         │
        │          │   Value Objects,       │         │
        │          │   Interfaces)          │         │
        │          └───────────┬────────────┘         │
        │                      │                      │
    ┌───▼──────────────────────┼──────────────────────▼──┐
    │      Adapters (Telegram, JWT, BD)                   │
    └────────────────────────────────────────────────────┘
```

**Ventajas:**
- Cambiar de framework web sin afectar la lógica de negocio
- Cambiar de base de datos sin modificar use cases
- Cambiar del cliente de Telegram sin tocar entidades

### 2. **Inyección de Dependencias**

```typescript
// ❌ Acoplamiento fuerte (evitado)
class UserService {
  private db = new PostgresDatabase(); // Acoplado a PostgreSQL
}

// ✅ Inyección de dependencias (implementado)
class RegisterUser {
  constructor(private userRepository: UserRepository) {} // Depende de interfaz
}
```

**Beneficio:** Fácil cambiar la implementación del repositorio en tests y producción.

### 3. **Value Objects**

Encapsulan valores específicos del dominio con validación:

```typescript
// ❌ Uso directo de strings (sin validación)
const email = "algo-invalido"; // ¿Es válido?

// ✅ Value Object (validado)
const email = new UserEmail("usuario@example.com"); // Validado en constructor
```

**Beneficio:** Garantiza que solo valores válidos circulen por el sistema.

### 4. **Repository Pattern**

Abstrae la persistencia de datos:

```typescript
// Interfaz (puerto)
interface UserRepository {
  register(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
}

// Implementación para Tests
class MockUserRepository implements UserRepository { ... }

// Implementación para Producción
class InMemoryDataBase implements UserRepository { ... }
```

### 5. **Adapter Pattern**

Adapta APIs externas al interfaz de la aplicación:

```typescript
// Interfaz del dominio
interface MessageSender {
  sendMessage(chatId: string, text: string): Promise<void>;
}

// Adaptador de Telegram
class TelegrafAdapter implements MessageSender {
  async sendMessage(chatId: string, text: string) {
    // Convierte a llamada Telegraf
    await this.bot.telegram.sendMessage(chatId, text);
  }
}
```

**Beneficio:** Si Telegram cambia su API, solo modificamos el adaptador.

### 6. **Service Locator (ServiceContainer)**

Centraliza la creación de instancias y dependencias:

```typescript
// Única fuente de verdad para todas las instancias
export const ServiceContainer = {
  user: {
    register: new RegisterUser(userRepo),
    login: new LoginUser(userRepo, tokenService)
  },
  messages: {
    receiveUseCase: new ReceiveAndReplyMessage(...)
  }
};

// Uso en cualquier lado
const user = await ServiceContainer.user.register.run(...);
```

---

## 🔀 Flujo de Datos

### Caso 1: Registro de Usuario

```
┌─────────────────┐
│  Cliente HTTP   │ POST /user/register
└────────┬────────┘
         │ { name, email, password }
         ▼
┌─────────────────────────────────┐
│  ExpressUserController.register │
│  (HTTP Adapter)                 │
└────────┬────────────────────────┘
         │ Extrae parámetros
         ▼
┌───────────────────────────┐
│  RegisterUser (Use Case)  │
│  - Validaciones           │
└────────┬──────────────────┘
         │ new User(...)
         ▼
┌──────────────────────┐
│  User (Entity)       │
│  - Genera ID         │
│  - Encapsula datos   │
└────────┬─────────────┘
         │ user.register()
         ▼
┌─────────────────────────────┐
│  UserRepository (Interfaz)  │
└────────┬────────────────────┘
         │
    ┌────▼────────────────┐
    │ InMemoryDataBase    │
    │ (Implementación)    │
    │ - Guarda en memoria │
    └─────────────────────┘
         │
         ▼
┌──────────────────────┐
│  Respuesta HTTP 201  │
│  { user, message }   │
└──────────────────────┘
```

### Caso 2: Recepción de Mensaje desde Telegram

```
Telegram Bot recibe mensaje
         │
         ▼
┌─────────────────────────┐
│  TelegrafAdapter        │
│  (Escucha actualizaciones)
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  ReceiveAndReplyMessage (UseCase)
│  - Guarda mensaje entrante      │
│  - Envía respuesta automática   │
│  - Guarda respuesta             │
└────────┬────────────────────────┘
         │
    ┌────▼─────────────────────┐
    │ MessageRepository        │
    │ - Almacena mensajes      │
    └──────────────────────────┘
         │
    ┌────▼─────────────────────┐
    │ TelegrafAdapter          │
    │ - Envía vía Telegram Bot │
    └──────────────────────────┘
```

---

## 🏛️ Detalle de Capas

### CAPA 1: DOMINIO (Domain)

**Responsabilidad:** Contiene la lógica de negocio pura, independiente de cualquier framework.

**Componentes:**

#### Entities
Objetos que tienen identidad única y ciclo de vida:

```typescript
// User.ts
export class User {
  private _id: UserId;
  name: UserName;
  email: UserEmail;
  password: UserPassword;
  
  constructor(name: UserName, email: UserEmail, password: UserPassword) {
    this._id = new UserId(this.generateRandomId());
    this.name = name;
    this.email = email;
    this.password = password;
  }
}
```

**Características:**
- Identidad única (`UserId`)
- Responsabilidad sobre sus propios datos
- Sin dependencias de frameworks
- Puede existir sin base de datos

#### Value Objects
Objetos que no tienen identidad, solo valor. Son inmutables:

```typescript
// UserEmail.ts - Encapsula y valida email
export class UserEmail {
  readonly value: string;
  
  constructor(email: string) {
    if (!this.isValidEmail(email)) {
      throw new Error("Invalid email");
    }
    this.value = email;
  }
  
  private isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}
```

**Características:**
- Validación en constructor
- Inmutables (no cambian después de creación)
- Comparable por valor, no por referencia

#### Interfaces (Puertos)
Definen contratos sin implementar:

```typescript
// UserRepository - Puerto
interface UserRepository {
  register(user: User): Promise<void>;
  findByEmail(email: UserEmail): Promise<User | null>;
}

// MessageSender - Puerto
interface MessageSender {
  sendMessage(chatId: string, text: string): Promise<void>;
}
```

#### Exceptions
Excepciones personalizadas del dominio:

```typescript
export class ExceptionUserErrorNotFound extends Error {
  private statusCode = 404;
  
  constructor(message: string) {
    super(message);
  }
  
  getStatusCode(): number {
    return this.statusCode;
  }
}
```

---

### CAPA 2: APLICACIÓN (Application)

**Responsabilidad:** Orquestación de la lógica de negocio. Define cómo usar el dominio.

**Componentes:**

#### Use Cases
Representan las acciones que el sistema puede realizar:

```typescript
// RegisterUser.ts - Caso de uso
export class RegisterUser {
  constructor(private userRepository: UserRepository) {}
  
  async run(name: string, email: string, password: string): Promise<User> {
    // 1. Crear entidad
    const user = new User(
      new UserName(name),
      new UserEmail(email),
      new UserPassword(password)
    );
    
    // 2. Persistir
    await this.userRepository.register(user);
    
    // 3. Retornar resultado
    return user;
  }
}
```

**Características:**
- Un método `run()` principal
- Inyecta dependencias del dominio
- Orquesta el flujo de negocio
- Responde a solicitudes externas

**Use Cases del Sistema:**

| Módulo | Use Case | Entrada | Salida |
|--------|----------|---------|--------|
| **Usuarios** | RegisterUser | name, email, password | User |
| **Usuarios** | LoginUser | email, password | User + Token JWT |
| **Mensajes** | SendMessageToUser | chatId, text | Success/Error |
| **Mensajes** | ReceiveAndReplyMessage | chatId, textReceived | Success/Error |
| **Mensajes** | UpdateAutoResponse | newText | Success/Error |

---

### CAPA 3: INFRAESTRUCTURA (Infrastructure)

**Responsabilidad:** Implementa adaptadores concretos para frameworks y APIs externas.

**Componentes:**

#### Repositorios (Adaptadores de Persistencia)

```typescript
// InMemoryDataBase.ts - Implementación en memoria
class InMemoryDataBase implements UserRepository {
  private users: User[] = [];
  
  async register(user: User): Promise<void> {
    this.users.push(user);
  }
  
  async findByEmail(email: UserEmail): Promise<User | null> {
    return this.users.find(u => u.email.value === email.value) || null;
  }
}
```

- **InMemoryDataBase:** Presistencia en memoria (desarrollo/testing)
- **Para Producción:** Reemplazar con PostgreSQL, MongoDB, etc.

#### Adaptadores de Factores Externos

```typescript
// TelegrafAdapter.ts - Adaptador de Telegram
class TelegrafAdapter implements MessageSender {
  private bot: Telegraf;
  
  async sendMessage(chatId: string, text: string): Promise<void> {
    await this.bot.telegram.sendMessage(chatId, text);
  }
}
```

#### Controladores HTTP (Adaptadores de Presentación)

```typescript
// ExpressUserController.ts
class ExpressUserController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const newUser = await ServiceContainer.user.register.run(name, email, password);
      res.status(201).json({ message: "Success", user: newUser });
    } catch (error) {
      next(error);
    }
  }
}
```

#### Rutas HTTP

```typescript
// ExpressUserRouter.ts
const router = Router();
router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));
export const ExpressUserRouter = router;
```

#### Seguridad

```typescript
// JwtTokenService.ts
class JwtTokenService implements TokenService {
  generateToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '24h' });
  }
}
```

---

## 🎓 Decisiones Arquitectónicas

### 1. ¿Por qué Arquitectura Hexagonal?

**Alternativas consideradas:**
- MVC: Mezcla lógica de negocio con presentación
- Arquitectura de capas tradacional: Acoplamiento vertical

**Razón de elección:**
- Maximiza independencia entre capas
- Facilita testing sin dependencias externas
- Permite cambiar frameworks sin reescribir lógica

### 2. ¿Por qué Inyección de Dependencias?

**Problema sin DI:**
```typescript
class LoginUser {
  private userRepository = new PostgresRepository(); // Acoplado
}
```

**Solución con DI:**
```typescript
class LoginUser {
  constructor(private userRepository: UserRepository) {} // Flexible
}
```

### 3. ¿Por qué Value Objects?

**Sin Value Objects:**
```typescript
const email = "invalid@"; // ¿Válido? No sabemos hasta usarlo
```

**Con Value Objects:**
```typescript
const email = new UserEmail("invalid@"); // Error inmediato
```

### 4. ¿Por qué ServiceContainer?

Centraliza la creación y ciclo de vida de dependencias. Facilita cambios globales sin modificar múltiples archivos.

### 5. ¿Por qué Almacenamiento en Memoria?

**Desarrollo:** Rápido, sin configuración de BD
**Testing:** Datos aislados por test
**Producción:** Reemplazar con verdadera BD sin cambiar código de negocio

---

## 🚀 Guía de Extensión

### Agregar Nueva Funcionalidad

**Ejemplo: Feature de Historial de Chats**

#### Paso 1: Definir Entity en Dominio

```typescript
// src/lib/chats/domain/entities/Chat.ts
export class Chat {
  private _id: ChatId;
  userId: UserId;
  telegramChatId: string;
  createdAt: Date;
  
  constructor(userId: UserId, telegramChatId: string) {
    this._id = new ChatId(crypto.randomUUID());
    this.userId = userId;
    this.telegramChatId = telegramChatId;
    this.createdAt = new Date();
  }
}
```

#### Paso 2: Crear Interfaz (Puerto)

```typescript
// src/lib/chats/domain/interfaces/ChatRepository.ts
export interface ChatRepository {
  save(chat: Chat): Promise<void>;
  findByUserId(userId: UserId): Promise<Chat[]>;
}
```

#### Paso 3: Crear Use Case

```typescript
// src/lib/chats/application/use-cases/GetUserChats.ts
export class GetUserChats {
  constructor(private chatRepository: ChatRepository) {}
  
  async run(userId: string): Promise<Chat[]> {
    return this.chatRepository.findByUserId(new UserId(userId));
  }
}
```

#### Paso 4: Implementar Adaptador

```typescript
// src/lib/chats/infrastructure/InMemoryChatRepository.ts
export class InMemoryChatRepository implements ChatRepository {
  private chats: Chat[] = [];
  
  async save(chat: Chat): Promise<void> {
    this.chats.push(chat);
  }
  
  async findByUserId(userId: UserId): Promise<Chat[]> {
    return this.chats.filter(c => c.userId.value === userId.value);
  }
}
```

#### Paso 5: Crear Controlador

```typescript
// src/lib/chats/infrastructure/Api/controllers/ChatController.ts
export class ChatController {
  async getChats(req: Request, res: Response): Promise<void> {
    const userId = req.user.id;
    const chats = await ServiceContainer.chats.getChatHistory.run(userId);
    res.json(chats);
  }
}
```

#### Paso 6: Registrar en Router

```typescript
// src/lib/chats/infrastructure/Api/routers/ChatRouter.ts
const router = Router();
router.get('/', chatController.getChats.bind(chatController));
export const ChatRouter = router;
```

#### Paso 7: Registrar en App.ts

```typescript
app.use('/chat', ChatRouter);
```

#### Paso 8: Agregar al ServiceContainer

```typescript
const chatRepository = new InMemoryChatRepository();
export const ServiceContainer = {
  // ... existing
  chats: {
    getChatHistory: new GetUserChats(chatRepository)
  }
};
```

---

## 📊 Diagrama de Dependencias

```
CAPA DE PRESENTACIÓN
├── ExpressUserRouter
│   └── ExpressUserController
│       └── RegisterUser (Use Case)
│
├── ExpressMessageRouter
│   └── MessageController
│       └── SendMessageToUser (Use Case)
│
└── TelegrafAdapter
    └── ReceiveAndReplyMessage (Use Case)

CAPA DE APLICACIÓN
├── RegisterUser ──────────┐
├── LoginUser              │
├── SendMessageToUser      ├─→ Inyecta interfaces
├── ReceiveAndReplyMessage │
└── UpdateAutoResponse     │
                           │
CAPA DE DOMINIO            │
├── User (Entity)   ◄──────┘
├── Message (Entity)
├── UserRepository (Interface)
├── MessageSender (Interface)
├── TokenService (Interface)
└── Value Objects

CAPA DE INFRAESTRUCTURA
├── InMemoryDataBase ────────────┐
├── InMemoryMessageRepository    ├─→ Implementan
├── TelegrafAdapter             │   interfaces
├── JwtTokenService             │
└── ExpressController           │
```

---

## ✅ Checklist para Código de Calidad

- [ ] Entidad tiene responsabilidad única
- [ ] Value Objects validan en constructor
- [ ] Use Cases orquestan pero no implementan lógica compleja
- [ ] Interfaces definen claramente contratos
- [ ] Adaptadores no contienen lógica de negocio
- [ ] Controladores solo convierten HTTP ↔ objetos de dominio
- [ ] Todas las dependencias se inyectan (no se crean en el constructor)
- [ ] Los tests pueden usar mock del repositorio

