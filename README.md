# Pickup Express - Laravel

Proyecto Laravel para Pickup Express con CRUD de proyectos conectado al frontend.

## Iniciar con Herd o Artisan

1. Instala dependencias:

```bash
composer install
```

2. Copia el archivo de entorno si hace falta:

```bash
copy .env.example .env
php artisan key:generate
```

3. Ejecuta migraciones:

```bash
php artisan migrate
```

4. Inicia el servidor local:

```bash
php artisan serve
```

Con Herd, apunta el sitio a la carpeta `public`.

## Rutas principales

- Inicio: `/`
- CRUD de proyectos: `/proyectos`
- Crear proyecto: `/proyectos/create`

## Pruebas

```bash
php artisan test
```
