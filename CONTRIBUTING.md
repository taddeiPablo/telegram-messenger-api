# Guía de Contribución y Desarrollo - Telegram Messenger API

**Versión:** 1.0.0  
**Última actualización:** Febrero 2026

---

## 📋 Tabla de Contenidos

1. [Configuración del Ambiente](#configuración-del-ambiente)
2. [Estructura de Carpetas](#estructura-de-carpetas)
3. [Estándares de Código](#estándares-de-código)
4. [Workflow de Desarrollo](#workflow-de-desarrollo)
5. [Testing](#testing)
6. [Git Workflow](#git-workflow)
7. [Checklist Pre-Commit](#checklist-pre-commit)

---

## 🛠️ Configuración del Ambiente

### Requisitos

**Sistema Operativo:**
- Windows, macOS o Linux

**Software Requerido:**
- Node.js >= 16.0.0
- npm >= 7.0.0 o yarn >= 1.22.0
- Git
- Editor de código (recomendado: VS Code)

### Instalación Inicial

#### 1. Clonar Repositorio
```bash
git clone https://github.com/taddeiPablo/telegram-messenger-api.git
cd telegram-messenger-api
```

#### 2. Instalar Dependencias
```bash
npm install
# o
yarn install
```

#### 3. Crear Archivo de Configuración
```bash
# Copiar plantilla
cp .env.example .env

# Editar con tus valores
nano .env
```

**.env Ejemplo:**
```env
# Servidor
PORT=3000
NODE_ENV=development

# Telegram
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11

# JWT
JWT_SECRET=tu_secreto_muy_seguro_aqui_cambiar_en_produccion
JWT_EXPIRES_IN=24h

# BD (Futuro)
DATABASE_URL=mongodb://localhost:27017/telegram-api
```

#### 4. Instalar Extensiones Recomendadas (VS Code)

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-vue",
    "orta.vscode-jest",
    "ms-vscode-remote.remote-containers"
  ]
}
```

Comando para instalar:
```bash
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
```

#### 5. Verificar Configuración
```bash
npm run dev
# Debe conectarse en http://localhost:3000
# Y mostrar documentación en http://localhost:3000/api-docs
```

---

## 📁 Estructura de Carpetas - Convenciones

```
src/
├── app.ts                          # Entrada principal - NO TOCAR sin revisar
├── lib/
│   ├── shared/                     # Código reutilizable
│   │   ├── Config.ts              # Configuraciones globales
│   │   └── ServiceContainer.ts    # Inyección de dependencias
│   │
│   ├── [modulo]/                  # Cada dominio es un módulo
│   │   ├── domain/                # ⭐ Lógica de negocio pura
│   │   │   ├── entities/
│   │   │   │   └── [Entity].ts   # Objetos con identidad
│   │   │   │
│   │   │   ├── value-objects/
│   │   │   │   └── [VO].ts       # Objetos de valor (inmutables)
│   │   │   │
│   │   │   ├── interfaces/
│   │   │   │   └── [Interface].ts # Contratos (puertos)
│   │   │   │
│   │   │   └── errors/
│   │   │       └── Exception[Name].ts # Excepciones del dominio
│   │   │
│   │   ├── application/           # ⭐ Reglas de negocio
│   │   │   └── use-cases/
│   │   │       └── [UseCase].ts  # Casos de uso
│   │   │
│   │   └── infrastructure/        # ⭐ Detalles técnicos
│   │       ├── [Adapter].ts      # Adaptadores
│   │       ├── [Repository].ts   # Implementaciones
│   │       └── Api/
│   │           ├── controllers/
│   │           │   └── [...].ts
│   │           ├── routers/
│   │           │   └── [...].ts
│   │           ├── middlewares/
│   │           │   └── [...].ts
│   │           └── security/
│   │               └── [...].ts
```

### Nomenclatura de Archivos

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| **Entity** | `[Name].ts` | `User.ts`, `Message.ts` |
| **Value Object** | `[Name].ts` | `UserEmail.ts`, `MessageId.ts` |
| **Use Case** | `[Verb][Noun].ts` | `RegisterUser.ts`, `SendMessage.ts` |
| **Repository** | `[Name]Repository.ts` o `[Adapter]Repo.ts` | `UserRepository.ts`, `InMemoryMessageRepository.ts` |
| **Adapter** | `[Name]Adapter.ts` | `TelegrafAdapter.ts`, `JwtTokenService.ts` |
| **Controller** | `[Domain]Controller.ts` | `UserController.ts`, `MessageController.ts` |
| **Router** | `[Domain]Router.ts` o `[Domain]Routes.ts` | `UserRouter.ts`, `MessageRouter.ts` |
| **Interface** | `I[Name].ts` o `[Name].ts` | `IUserRepository.ts` o `UserRepository.ts` (interfaz) |
| **Error/Exception** | `Exception[Domain][Type].ts` | `ExceptionUserNotFound.ts` |
| **Middleware** | `[Name]Middleware.ts` | `AuthMiddleware.ts`, `LoggingMiddleware.ts` |

---

## 📐 Estándares de Código

### TypeScript

#### 1. Tipado Fuerte

```typescript
// ❌ EVITAR
function createUser(data: any): any {
  return data;
}

// ✅ HACER
interface UserInput {
  name: string;
  email: string;
  password: string;
}

interface UserOutput {
  id: string;
  name: string;
  email: string;
}

function createUser(data: UserInput): UserOutput {
  // ...
}
```

#### 2. Inyección de Dependencias

```typescript
// ❌ EVITAR
class LoginUser {
  constructor() {
    this.repository = new PostgresUserRepository();
  }
}

// ✅ HACER
class LoginUser {
  constructor(private userRepository: UserRepository) {}
}
```

#### 3. Métodos Privados

```typescript
// ✅ Usar privado para métodos internos
class User {
  private generateId(): string {
    return crypto.randomUUID();
  }
}
```

#### 4. Accesores

```typescript
// ✅ HACER
class User {
  private _id: UserId;
  
  get id(): UserId {
    return this._id;
  }
}

// Uso
const userId = user.id;
```

### Estilo Visual

#### Espaciado
```typescript
// ❌ MUY COMPACTO
class User{private _id:UserId;constructor(id:UserId){this._id=id;}}

// ✅ LEGIBLE
class User {
  private _id: UserId;
  
  constructor(id: UserId) {
    this._id = id;
  }
}
```

#### Longitud de Línea
- Máximo 100 caracteres
- Si excedem romper a la siguiente línea

```typescript
// ✅ BIEN
const user = new User(
  new UserName("Juan"),
  new UserEmail("juan@example.com")
);

// ❌ MAL
const user = new User(new UserName("Juan"), new UserEmail("juan@example.com"), someOtherData);
```

#### Comentarios

```typescript
// ✅ COMENTARIO ÚTIL
// Validamos el email antes de crear el usuario para evitar entradas inválidas
const email = new UserEmail(emailInput);

// ❌ COMENTARIO INNECESARIO
// Crear el objeto User
const user = new User(name, email, password);

// ✅ COMENTARIOS DE BLOQUE GRANDES
/**
 * Algoritmo de encriptación
 * 1. Genera salt aleatorio
 * 2. Aplica bcrypt
 * 3. Retorna hash
 */
```

### Excepciones Personalizadas

```typescript
// ✅ CREAR EXCEPCIONES ESPECÍFICAS
export class ExceptionUserNotFound extends Error {
  private statusCode = 404;
  
  constructor(message: string = "User not found") {
    super(message);
    this.name = "ExceptionUserNotFound";
  }
  
  getStatusCode(): number {
    return this.statusCode;
  }
}

// Usar
throw new ExceptionUserNotFound("Email not found");
```

---

## 🔄 Workflow de Desarrollo

### 1. Crear Feature Localmente

```bash
# Actualizar rama main
git checkout main
git pull origin main

# Crear rama de feature
git checkout -b feature/nueva-funcionalidad
```

**Nomenclatura de Ramas:**
- `feature/descripcion-feature` - Nueva funcionalidad
- `fix/descripcion-bug` - Corrección de bug
- `refactor/descripcion` - Refactorización
- `docs/descripcion` - Cambios en documentación

### 2. Desarrollar Feature

#### Estructura de Carpeta Nueva
Si creas un nuevo módulo, mantén la estructura hexagonal:

```typescript
// 1. Crear entity (domain/entities/NewEntity.ts)
export class NewEntity {
  // ...
}

// 2. Crear interfaces (domain/interfaces/NewRepository.ts)
export interface NewRepository {
  save(entity: NewEntity): Promise<void>;
}

// 3. Crear use case (application/use-cases/DoSomething.ts)
export class DoSomething {
  constructor(private repository: NewRepository) {}
  async run() { /* ... */ }
}

// 4. Crear adaptador (infrastructure/NewRepositoryImpl.ts)
export class NewRepositoryImpl implements NewRepository {
  async save(entity: NewEntity): Promise<void> {
    // Implementación
  }
}

// 5. Crear controller (infrastructure/Api/controllers/NewController.ts)
// 6. Crear router (infrastructure/Api/routers/NewRouter.ts)
// 7. Registrar en ServiceContainer
```

### 3. Testear Localmente

```bash
# Ejecutar dev server
npm run dev

# Probar los endpoints
# En otra terminal, usar Postman, curl o Swagger en http://localhost:3000/api-docs
```

### 4. Compilar y Verificar

```bash
# Compilar TypeScript
npm run build

# Verificar que no hay errores
npm run lint
```

### 5. Commit y Push

```bash
# Ver cambios
git status
git diff

# Agregar cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: agregar nueva funcionalidad de XYZ"

# Push a rama
git push origin feature/nueva-funcionalidad
```

**Formato de Commit:**
```
<tipo>(<alcance>): <descripción>

<cuerpo (opcional)>

<pie de página (opcional)>
```

**Tipos de Commit:**
- `feat` - Nueva funcionalidad
- `fix` - Corrección de bug
- `docs` - Cambios en documentación
- `style` - Cambios de formato (no afectan lógica)
- `refactor` - Refactorización sin cambios funcionales
- `perf` - Mejora de performance
- `test` - Agregar o modificar tests

**Ejemplo:**
```
feat(users): agregar endpoint de actualizar perfil

- Nuevas rutas PUT /user/profile
- Validación de email único
- Actualización segura de contraseña

Relacionado con: #123
```

---

## ✅ Testing

### Estrategia de Testing

**Niveles de Test:**
1. **Unit Tests** - Testear métodos individuales
2. **Integration Tests** - Testear módulos juntos
3. **E2E Tests** - Testear flujos completos

### Ejemplo: Test de Use Case

```typescript
// src/lib/users/application/use-cases/__tests__/RegisterUser.test.ts

describe('RegisterUser', () => {
  let registerUser: RegisterUser;
  let mockRepository: UserRepository;

  beforeEach(() => {
    // Mock del repositorio
    mockRepository = {
      register: jest.fn(),
      findByEmail: jest.fn()
    };
    registerUser = new RegisterUser(mockRepository);
  });

  it('debe crear usuario con datos válidos', async () => {
    // Arrange
    const name = 'Juan';
    const email = 'juan@test.com';
    const password = 'Segura123';

    // Act
    const user = await registerUser.run(name, email, password);

    // Assert
    expect(user.name.value).toBe(name);
    expect(user.email.value).toBe(email);
    expect(mockRepository.register).toHaveBeenCalledWith(user);
  });

  it('debe lanzar error con email inválido', async () => {
    // Assert & Act
    expect(() => {
      new UserEmail('email-invalido');
    }).toThrow('Invalid email');
  });
});
```

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar en modo watch (reinicia con cambios)
npm test -- --watch

# Ejecutar un archivo específico
npm test RegisterUser.test.ts

# Ver cobertura
npm test -- --coverage
```

---

## 🌳 Git Workflow

### Modelo de Ramas

```
main (producción)
  ↑
  ├── develop (integración)
  │    ↑
  │    └── feature/nueva-funcionalidad (desarrollo)
  │
  └── hotfix/bug-critico (correcciones urgentes)
```

### Pull Request Workflow

1. **Crear Pull Request**
```bash
# Después de push a rama feature
# -> Ir a GitHub y crear Pull Request
# -> Título: "feat: descripción" o "fix: descripción"
# -> Descripción: explicar qué cambia y por qué
```

2. **PR Template** (en descripción del PR):
```markdown
## Descripción
Explica qué hace este cambio y por qué.

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva feature
- [ ] Breaking change

## Testing
¿Cómo testeaste esto?

## Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He actualizado la documentación
- [ ] He agregado tests
- [ ] Todas las pruebas pasan
```

3. **Code Review**
   - Mínimo 1 aprobación requerida
   - Responder comentarios del revisor
   - Hacer cambios si es necesario

4. **Merge**
```bash
# Merge en develop (después de aprobación)
git checkout develop
git pull origin develop
git merge feature/nueva-funcionalidad
git push origin develop

# Después, de develop a main
```

---

## 📝 Checklist Pre-Commit

Antes de hacer commit, verifica:

### Código
- [ ] El código sigue los estándares de TypeScript
- [ ] No hay `console.log()` innecesarios
- [ ] No hay variables sin usar
- [ ] Las funciones tienen un propósito claro
- [ ] Los nombres de variables y funciones son descriptivos

### Architecture
- [ ] Mantuve la separación hexagonal (domain, application, infrastructure)
- [ ] Las dependencias se inyectan (no se crean en el constructor)
- [ ] Las interfaces están bien definidas
- [ ] Las value objects validan en constructor

### Documentación
- [ ] Actualiza el README si es necesario
- [ ] Documento cambios en la arquitectura si es applicable
- [ ] Comentarios explicando lógica compleja
- [ ] JSDoc en funciones públicas

### Testing
- [ ] Agregué tests para código nuevo
- [ ] Todos los tests pasan (`npm test`)
- [ ] Cobertura > 80% en lógica crítica

### Performance
- [ ] Sin queries en loops
- [ ] Sin recreación de objetos innecesariamente
- [ ] Manejo eficiente de memoria

### Seguridad
- [ ] Sin credenciales en el código
- [ ] Validación de inputs
- [ ] Sin acceso a variables privadas desde fuera
- [ ] Ver variables en `.env`

### Build
- [ ] Compila sin errores (`npm run build`)
- [ ] No hay type errors (`npx tsc --noEmit`)

---

## 🚀 Deployment (Futuro)

### Ambiente de Staging
```bash
npm run build
npm run test
# Deploy a staging
```

### Ambiente de Producción
```bash
# En rama main
npm run build
# Revisar logs
# Deploy
```

### Variables de Ambiente Producción
- `NODE_ENV=production`
- Usar BD real (PostgreSQL/MongoDB)
- `JWT_SECRET` fuerte
- Habilitar CORS restringido
- Habilitar rate limiting

---

## 📞 Contacto y Ayuda

- **Issues:** [GitHub Issues](https://github.com/taddeiPablo/telegram-messenger-api/issues)
- **Discussions:** [GitHub Discussions](https://github.com/taddeiPablo/telegram-messenger-api/discussions)
- **Docs:** Revisar [README.md](./README.md) y [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 📚 Recursos Útiles

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Express.js Guide](https://expressjs.com/)
- [Telegraf Documentation](https://telegraf.js.org/)
- [JWT.io](https://jwt.io/)

