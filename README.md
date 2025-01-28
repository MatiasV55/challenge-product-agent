# Challenge Gen-AI Dev - Product Agent

## Descripción

API para interacción con agente de consulta de productos e información del estado de pedidos.
Solo debe ser capaz de responder informando sobre productos y pedidos existentes en la base de datos.

## Instalación

```bash
$ npm install
```

## Ejecución

### Levantar base de datos

```bash
$ docker compose up -d
```

### Correr migraciones

```bash
$ npm run migration:run
```

### Ejecutar seeders

```bash
$ npm run seed:run
```

### Levantar API

```bash
# desarrollo
$ npm run start

# watch mode
$ npm run start:dev

# producción
$ npm run start:prod
```

## Edge Cases y Futuras Tareas

### 1. Manejo de saludos, agradecimientos, descontentos, despedidas

- Implementar análisis de sentimiento y respuestas básicas a saludos, agradecimientos, descontentos y despedidas.

### 2. Manejo de errores y fallback

- Implementar un sistema de fallback para responder de manera estándar si falla la API de OpenAI, con un mensaje genérico o un servicio extra de soporte (ejemplo Anthropic).

### 3. Registro de métricas relacionadas al rendimiento del agente y satisfacción del usuario

- Tasa de consultas correctamente respondidas.
- Tasa de consultas derivadas.
- Tasa de mensajes marcados como off-topic.
- Pedir feedback al usuario sobre su satisfacción con la respuesta.

### 4. Respuestas genéricas para derivación, mensajes off-topic o mensajes ofensivos.

- Implementar respuestas para los casos de derivación, mensajes off-topic o mensajes ofensivos. Bajo ningún caso el agente no debe ofrecer una respuesta.
