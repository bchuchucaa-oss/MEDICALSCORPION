# Guía de instalación de Consultorio360

Esta guía explica cómo instalar Consultorio360 en el computador de un
consultorio, sin conocimientos técnicos.

## 1. Qué archivo usar

Después de generar el instalador (ver sección "Para el desarrollador" al
final), en la carpeta `release/` aparecen dos archivos. Basta con enviar
**uno de los dos** al doctor:

| Archivo | Cuándo usarlo |
|---|---|
| `Consultorio360 Setup 0.0.0.exe` | Recomendado. Instala Consultorio360 como cualquier programa de Windows: queda en el menú Inicio, con ícono en el escritorio, y se puede desinstalar desde "Agregar o quitar programas". |
| `Consultorio360 0.0.0.exe` (portable) | No requiere instalación. Útil si el doctor no tiene permisos de administrador en el computador, o si se quiere correr Consultorio360 desde una memoria USB. |

Ambos instalan exactamente el mismo programa; la única diferencia es cómo
llegan a la computadora del doctor.

## 2. Instalación con el instalador (recomendado)

1. Copiar `Consultorio360 Setup 0.0.0.exe` al computador del consultorio
   (USB, correo, Drive, etc.).
2. Hacer doble clic sobre el archivo.
3. Windows puede mostrar una advertencia de "Editor desconocido" — esto es
   normal porque el instalador no tiene todavía una firma digital paga.
   Hacer clic en "Más información" → "Ejecutar de todas formas".
4. Seguir el asistente (siguiente, siguiente, instalar). Se puede dejar la
   carpeta de instalación por defecto.
5. Al terminar, queda un acceso directo en el escritorio y en el menú
   Inicio llamado **Consultorio360**.
6. Abrir Consultorio360 desde ese acceso directo.

## 3. Uso de la versión portable (alternativa)

1. Copiar `Consultorio360 0.0.0.exe` a cualquier carpeta o memoria USB.
2. Hacer doble clic. La primera vez tarda unos segundos en abrirse (se
   auto-extrae); las siguientes veces abre más rápido.
3. No deja accesos directos ni se "instala" — simplemente se ejecuta desde
   donde esté el archivo.

## 4. Primer uso

La primera vez que se abre Consultorio360 (con cualquiera de los dos
métodos), el programa crea automáticamente su base de datos vacía y un
perfil de "Doctor" por defecto. Esto ocurre una sola vez; no hace falta
ninguna configuración manual ni conexión a internet.

Desde **Configuración**, el doctor puede completar sus datos (nombre,
especialidad, número de licencia) y los datos de facturación.

## 5. Dónde quedan los datos del consultorio

Toda la información (pacientes, citas, recetas, etc.) se guarda en un
archivo local en esta carpeta del computador:

```
C:\Users\<usuario de Windows>\AppData\Roaming\consultorio360\mosa.db
```

Esto es importante para:

- **Respaldos**: copiar ese archivo (o usar la opción de respaldo dentro de
  Consultorio360, en Configuración) guarda toda la información del
  consultorio.
- **Cambio de computador**: para mover Consultorio360 a otro computador, se
  instala Consultorio360 en el nuevo equipo y luego se copia ese mismo
  archivo `mosa.db` a la misma ruta antes de abrir el programa por primera
  vez.

## 6. Problemas comunes

- **"Windows protegió su PC" / SmartScreen**: clic en "Más información" →
  "Ejecutar de todas formas". Ocurre porque el instalador no tiene firma
  digital comercial (esto no afecta el funcionamiento del programa).
- **El antivirus bloquea la instalación**: agregar una excepción para el
  instalador o para la carpeta donde se instaló Consultorio360.
- **Se necesita reinstalar sin perder datos**: los datos NO se borran al
  reinstalar o actualizar Consultorio360, porque viven en la carpeta
  `AppData` mencionada arriba, separada del programa.

---

## Para el desarrollador: cómo generar los instaladores

Desde la carpeta del proyecto, con las dependencias instaladas:

```
pnpm dist
```

Esto compila la aplicación, genera la base de datos plantilla y produce
ambos instaladores dentro de `release/`:

- `release/Consultorio360 Setup 0.0.0.exe` (NSIS)
- `release/Consultorio360 0.0.0.exe` (portable)

No requiere ninguna cuenta ni certificado de firma de código para
funcionar; Windows mostrará la advertencia de "editor desconocido"
mencionada arriba hasta que se firme el instalador con un certificado
comercial (opcional, no necesario para uso interno).

> Nota: la carpeta física del proyecto en disco todavía se llama
> `mosa-app/` — es cosmético y no afecta el funcionamiento. Renombrarla es
> un paso aparte y no urgente.
