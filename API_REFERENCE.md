# Referencia de API - Telegram Messenger API

**Última actualización:** Febrero 2026  
**Versión:** 1.0.0

---

## 📑 Tabla de Contenidos

1. [Autenticación](#autenticación)
2. [Endpoints de Usuarios](#endpoints-de-usuarios)
3. [Endpoints de Mensajes](#endpoints-de-mensajes)
4. [Códigos de Respuesta](#códigos-de-respuesta)
5. [Ejemplos de Cliente](#ejemplos-de-cliente)

---

## 🔐 Autenticación

### Flujo de Autenticación

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │ 1. POST /user/register {name, email, password}
       ▼
   ┌────────┐
   │Registro│
   └────┬───┘
       │ 2. Respuesta: Usuario creado
       │
       │ 3. POST /user/login {email, password}
       ▼
   ┌──────────┐
   │  Login   │
   └────┬─────┘
       │ 4. Respuesta: Token JWT
       ▼
   ┌──────────────────┐
   │ Requests con    │
   │ Authorization   │
   │ Bearer <token>  │
   └──────────────────┘
```

### Tipos de Autenticación

#### 1. Sin Autenticación (Público)
Endpoints accesibles sin token:
- `POST /user/register`
- `POST /user/login`

#### 2. Con Autenticación (Privado)
Incluir header:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Endpoints protegidos:
- `POST /message/send`
- `POST /message/config/auto-reply`
- `GET /message/history`

### Token JWT

**Estructura:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5YzM1MDQ0Mi1iODdjLTQ0OGQtODM5Mi0yODQ2YjZjNDNkMDUiLCJpYXQiOjE3Mzk4MTk3NzksImV4cCI6MTczOTkwNjE3OX0.CqVsF4...
```

**Compuesto por:**
- **Header:** { "alg": "HS256", "typ": "JWT" }
- **Payload:** { "userId": "...", "iat": ..., "exp": ... }
- **Signature:** HMACSHA256(header + payload, secret)

**Duración:** 24 horas

---

## 👥 Endpoints de Usuarios

### 1. Registrar Nuevo Usuario

#### Solicitud
```http
POST /user/register
Content-Type: application/json

{
  "name": "Juan Pérez Rodríguez",
  "email": "juan.perez@example.com",
  "password": "MiContraseñaSegura123!"
}
```

#### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `name` | string | Sí | Nombre completo del usuario (1-100 caracteres) |
| `email` | string | Sí | Email válido (será validado) |
| `password` | string | Sí | Contraseña (mínimo 6 caracteres) |

#### Respuesta Exitosa (201)
```json
{
  "message": "User registered successfully",
}
```

#### Errores Posibles

```json
// 400 - Email inválido
{
  "message": "Invalid email"
}

// 400 - Contraseña muy corta
{
  "message": "Password must be at least 6 characters"
}

// 400 - Email ya registrado
{
  "message": "Email already registered"
}
```

#### Ejemplo cURL
```bash
curl -X POST http://localhost:3000/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "Segura123"
  }'
```

---

### 2. Autenticar Usuario (Login)

#### Solicitud
```http
POST /user/login
Content-Type: application/json

{
  "email": "juan.perez@example.com",
  "password": "MiContraseñaSegura123!"
}
```

#### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `email` | string | Sí | Email del usuario registrado |
| `password` | string | Sí | Contraseña en texto plano |

#### Respuesta Exitosa (200)
```json
{
    "message": "Login successful",
    "Response": {
        "user": {
            "id": "b92090e1-32cc-4330-951f-20d00e2587ea",
            "name": "test1",
            "email": "test@test.com"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI5MjA5MGUxLTMyY2MtNDMzMC05NTFmLTIwZDAwZTI1ODdlYSIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTc3MDg0NzgyNiwiZXhwIjoxNzcwODU1MDI2fQ.mlo7kxcYoQa_7pjfpY0ogXgYEmcdJmHxCkMNOsekeCw"
    }
}
```

#### Errores Posibles

```json
// 401 - Email o contraseña incorrectos
{
  "message": "Invalid email or password"
}

// 404 - Usuario no encontrado
{
  "message": "User not found"
}
```

#### Ejemplo cURL
```bash
curl -X POST http://localhost:3000/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "Segura123"
  }'
```

#### Guardar Token (JavaScript)
```javascript
const response = await fetch('http://localhost:3000/user/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: '...', password: '...' })
});

const { user } = await response.json();
localStorage.setItem('authToken', user.token); // Guardar para uso posterior
```

---

## 💬 Endpoints de Mensajes

### Requisito: Token de Autenticación
Todos los endpoints de mensajes requieren autenticación. Incluir header:
```http
Authorization: Bearer <token_jwt>
```

---

### 1. Enviar Mensaje Manualmente

Envía un mensaje manualmente a un usuario de Telegram.

#### Solicitud
```http
POST /message/send
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "chatId": "123456789",
  "text": "Hola, este es un mensaje desde la API"
}
```

#### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `chatId` | string | Sí | Chat ID de Telegram (número único del usuario) |
| `text` | string | Sí | Contenido del mensaje (1-4096 caracteres) |

#### Respuesta Exitosa (200)
```json
{
  "status": "success",
  "message": "Mensaje enviado correctamente a Telegram"
}
```

#### Errores Posibles

```json
// 400 - Parámetros inválidos
{
  "error": "ChatId y el texto son obligatorios"
}

// 400 - Chat ID no válido
{
  "error": "Chat ID must be a valid number"
}

// 400 - Mensaje muy largo
{
  "error": "Message too long (max 4096 characters)"
}

// 401 - No autenticado
{
  "message": "Unauthorized"
}

// 500 - Error de Telegram
{
  "error": "Failed to send message to Telegram"
}
```

#### Ejemplo cURL
```bash
curl -X POST http://localhost:3000/message/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "chatId": "123456789",
    "text": "¡Hola! Esto viene desde la API"
  }'
```

#### Ejemplo JavaScript/Fetch
```javascript
const token = localStorage.getItem('authToken');

fetch('http://localhost:3000/message/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    chatId: '123456789',
    text: 'Mensaje desde la API'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

#### Cómo Obtener Chat ID en Telegram
1. Inicia conversación con tu bot
2. Envía cualquier mensaje
3. Accede a: `https://api.telegram.org/bot<TOKEN>/getUpdates`
4. Busca `chat.id` en la respuesta JSON

---

### 2. Configurar Respuesta Automática

Actualiza el mensaje que el bot envía automáticamente al recibir un mensaje.

#### Solicitud
```http
POST /message/config/auto-reply
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "autoReply": "Gracias por tu mensaje. Pronto me pondré en contacto contigo. ¡Saludos!"
}
```

#### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `autoReply` | string | Sí | Nuevo texto de respuesta automática (1-4096 caracteres) |

#### Respuesta Exitosa (200)
```json
{
  "message": "Configuración actualizada correctamente",
  "newAutoReply": "Gracias por tu mensaje. Pronto me pondré en contacto contigo. ¡Saludos!"
}
```

#### Errores Posibles

```json
// 400 - Parámetro vacío
{
  "error": "autoReply text cannot be empty"
}

// 401 - No autenticado
{
  "message": "Unauthorized"
}
```

#### Ejemplo cURL
```bash
curl -X POST http://localhost:3000/message/config/auto-reply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "autoReply": "Hola! Gracias por escribir. Pronto responderé."
  }'
```

#### Flujo de Uso
1. Usuario configura respuesta automática vía POST
2. Bot recibe mensaje de Telegram
3. Bot guarda mensaje entrante
4. Bot envía la respuesta automática configurada
5. Bot guarda respuesta saliente
6. API devuelve éxito

---

### 3. Obtener Historial de Mensajes

Recupera el historial de todos los mensajes (entrantes y salientes) procesados por el bot.

#### Solicitud
```http
GET /message/history
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Parámetros
Ninguno (puede agregarse filtrado por queries en futuras versiones)

#### Respuesta Exitosa (200)
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "content": "Hola bot, ¿cómo estás?",
    "senderId": "123456789",
    "receiverId": "987654321",
    "direction": "INBOUND",
    "createdAt": "2026-02-11T10:30:00.000Z",
    "telegramChatId": "123456789"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "content": "Hola, soy un bot con Arquitectura Hexagonal.",
    "senderId": "system",
    "receiverId": "987654321",
    "direction": "OUTBOUND",
    "createdAt": "2026-02-11T10:30:01.000Z",
    "telegramChatId": "123456789"
  }
]
```

#### Estructura de Mensaje

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string (UUID) | Identificador único del mensaje |
| `content` | string | Contenido/texto del mensaje |
| `senderId` | string | ID de quién envía (user ID o "system") |
| `receiverId` | string | ID de quién recibe (Chat ID de Telegram) |
| `direction` | string | "INBOUND" (entrante) o "OUTBOUND" (saliente) |
| `createdAt` | ISO 8601 | Timestamp de creación |
| `telegramChatId` | string (opcional) | Chat ID para búsquedas |

#### Filtros Recomendados (Implementation Future)
```http
GET /message/history?direction=INBOUND
GET /message/history?chatId=123456789
GET /message/history?from=2026-02-10&to=2026-02-11
```

#### Errores Posibles

```json
// 401 - No autenticado
{
  "message": "Unauthorized"
}

// 500 - Error del servidor
{
  "error": "Internal server error"
}
```

#### Ejemplo cURL
```bash
curl -X GET http://localhost:3000/message/history \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Ejemplo JavaScript
```javascript
async function getMessageHistory() {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('http://localhost:3000/message/history', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const messages = await response.json();
  
  // Filtrar solo mensajes entrantes
  const inbound = messages.filter(m => m.direction === 'INBOUND');
  
  // Agrupar por chat
  const byChat = {};
  messages.forEach(msg => {
    if (!byChat[msg.telegramChatId]) {
      byChat[msg.telegramChatId] = [];
    }
    byChat[msg.telegramChatId].push(msg);
  });
  
  console.log('Mensajes por chat:', byChat);
}
```

---

## 📊 Códigos de Respuesta HTTP

| Código | Significado | Descripción |
|--------|------------|-------------|
| **200** | OK | Solicitud exitosa |
| **201** | Created | Recurso creado exitosamente (ej: usuario registrado) |
| **400** | Bad Request | Parámetros inválidos o faltantes |
| **401** | Unauthorized | Token no válido o faltante |
| **403** | Forbidden | Acceso prohibido |
| **404** | Not Found | Recurso no encontrado |
| **409** | Conflict | Conflicto (ej: email ya registrado) |
| **500** | Internal Server Error | Error del servidor |
| **503** | Service Unavailable | Servicio no disponible |

### Formato de Error Estándar

```json
{
  "error": "Descripción del error",
  "statusCode": 400,
  "timestamp": "2026-02-11T10:30:00.000Z"
}
```

---

## 🧪 Ejemplos de Cliente

### 1. Cliente en JavaScript/Node.js

```javascript
class TelegramAPIClient {
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
    this.token = null;
  }

  // Autenticación
  async register(name, email, password) {
    const response = await fetch(`${this.baseURL}/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return response.json();
  }

  async login(email, password) {
    const response = await fetch(`${this.baseURL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    this.token = data.user.token;
    return data;
  }

  // Mensajes
  async sendMessage(chatId, text) {
    const response = await fetch(`${this.baseURL}/message/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({ chatId, text })
    });
    return response.json();
  }

  async setAutoReply(autoReply) {
    const response = await fetch(`${this.baseURL}/message/config/auto-reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({ autoReply })
    });
    return response.json();
  }

  async getHistory() {
    const response = await fetch(`${this.baseURL}/message/history`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
    return response.json();
  }
}

// Uso
(async () => {
  const client = new TelegramAPIClient();
  
  // Registro
  await client.register('Juan', 'juan@test.com', 'Segura123');
  
  // Login
  await client.login('juan@test.com', 'Segura123');
  
  // Enviar mensaje
  await client.sendMessage('123456789', '¡Hola!');
  
  // Configurar respuesta automática
  await client.setAutoReply('Gracias por escribir!');
  
  // Obtener historial
  const history = await client.getHistory();
  console.log(history);
})();
```

### 2. Cliente en Python

```python
import requests
import json

class TelegramAPIClient:
    def __init__(self, base_url='http://localhost:3000'):
        self.base_url = base_url
        self.token = None
        self.session = requests.Session()
    
    def register(self, name, email, password):
        url = f'{self.base_url}/user/register'
        data = {'name': name, 'email': email, 'password': password}
        response = self.session.post(url, json=data)
        return response.json()
    
    def login(self, email, password):
        url = f'{self.base_url}/user/login'
        data = {'email': email, 'password': password}
        response = self.session.post(url, json=data)
        result = response.json()
        self.token = result['user']['token']
        self.session.headers.update({
            'Authorization': f'Bearer {self.token}'
        })
        return result
    
    def send_message(self, chat_id, text):
        url = f'{self.base_url}/message/send'
        data = {'chatId': chat_id, 'text': text}
        response = self.session.post(url, json=data)
        return response.json()
    
    def set_auto_reply(self, auto_reply):
        url = f'{self.base_url}/message/config/auto-reply'
        data = {'autoReply': auto_reply}
        response = self.session.post(url, json=data)
        return response.json()
    
    def get_history(self):
        url = f'{self.base_url}/message/history'
        response = self.session.get(url)
        return response.json()

# Uso
if __name__ == '__main__':
    client = TelegramAPIClient()
    
    # Registro
    client.register('Juan', 'juan@test.com', 'Segura123')
    
    # Login
    client.login('juan@test.com', 'Segura123')
    
    # Enviar mensaje
    client.send_message('123456789', '¡Hola desde Python!')
    
    # Historial
    history = client.get_history()
    print(json.dumps(history, indent=2))
```

### 3. Cliente en cURL (Bash)

```bash
#!/bin/bash

API_URL="http://localhost:3000"
TOKEN=""

# Registro
echo "=== Registrando usuario ==="
REGISTER_RESPONSE=$(curl -X POST "$API_URL/user/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@test.com",
    "password": "Segura123"
  }')
echo $REGISTER_RESPONSE | jq '.'

# Login
echo -e "\n=== Autenticando usuario ==="
LOGIN_RESPONSE=$(curl -X POST "$API_URL/user/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@test.com",
    "password": "Segura123"
  }')
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.user.token')
echo "Token: $TOKEN"

# Enviar mensaje
echo -e "\n=== Enviando mensaje ==="
curl -X POST "$API_URL/message/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "chatId": "123456789",
    "text": "Mensaje desde bash"
  }' | jq '.'

# Historial
echo -e "\n=== Obteniendo historial ==="
curl -X GET "$API_URL/message/history" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

---

## 📝 Notas Importantes

1. **Seguridad del Token:**
   - Guardar en `localStorage` solo para desarrollo
   - En producción, usar `httpOnly` cookies

2. **CORS (Cross-Origin):**
   - Actualmente sin restricciones
   - En producción, configurar según necesidad

3. **Rate Limiting:**
   - No implementado actualmente
   - Considerar para producción

4. **Validación de Email:**
   - Se valida formato básico
   - Considerar validación de existencia en producción

5. **Encriptación de Contraseñas:**
   - Usa bcryptjs con salt 10
   - Seguro para almacenamiento

---

## 🔗 Recursos Adicionales

- [Documentación Swagger](/api-docs) - Disponible en `/api-docs`
- [Guía de Arquitectura](./ARCHITECTURE.md)
- [README Principal](./README.md)

