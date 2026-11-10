# Proyecto tareas JavaScript 
Aplicación web interactiva creada desde cero, implementando HTML, CSS y JS, consumo de APIs públicas y persistencia 
local para la organización y gestión de tareas.

---
## 💠Acerca del proyecto 
Esta  aplicación web está pensada para ayudarnos con la organización diaria de pendientes. Permitiéndonos crear tareas, editarlas, borrarlas, buscarlas al instante, filtrarlas por estado 
o **importar un lote de tareas desde una API pública**, un factor importante que debemos tener en cuenta es que estas tareas que el usuario podrá importar solo tendrán  
la opción de eliminarlas, lo que quiere decir que el usuario no puede interferir en ellas, alterando su información precargada. 

---
## ✨ Características Principales
- **Componentes Modulares:** El diseño está dividido en piezas independientes las cuales se fusionan en una rama main para obtener el resultado final. 
- **Gestión Completa (CRUD):** Podemos crear, leer, actualizar y borrar nuestras propias tareas locales sin problemas.
- **Conexión con API:** Obtenemos tareas reales de internet usando peticiones asíncronas (`Fetch`).
- **Filtros y Buscador:** Una barra de búsqueda en tiempo real y un menú desplegable para ver las tareas por categorías (*Todo*, *Abierto*, *Completado*).
- **Acciones Rápidas:** Botones útiles para marcar todas las tareas como listas de un solo golpe o vaciar toda la lista.

---
## ⚙️Estructura del proyecto 
  ProyectoTareas_JavaScript_GarciaChristian_GarciaDaniela/
│
├── index.html        
├── style.css          
├── app.js             
├── README.md           
└── wireframes/

---
## 📋 Descripción de las vistas y el diseño 
La interfaz es limpia, moderna y se adapta a cualquier pantalla. Consta de una vista principal y dos ventanas flotantes las cuales son conocidas como modales:

#### 1. **Vista Principal:**
   - Muestra la fecha, el título "Mis tareas" y una breve descripción.
   - Contiene la barra superior con el buscador, el filtro y los botones de acción principal:  ***Importar desde API***, ***Crear tarea***, ***Marcar todas*** y ***Borrar lista***
   - En caso de que no haya tareas cargadas en el centro se muestra la lista de tareas o un aviso indicando cuando no hay elementos.
     <img width="1397" height="532" alt="image" src="https://github.com/user-attachments/assets/9d782dbb-bc3f-4694-872b-7a4f5a5dd095" />

#### 2. **Modal de Creación y Edición:**
   - Al presionar clic en el boton de crear o editar aparece una ventana emergente con fondo difuminado.
   - Cuenta con un campo de texto para escribir el nombre de la tarea y una casilla para marcarla como finalizada de una vez.
<img width="716" height="477" alt="image" src="https://github.com/user-attachments/assets/88890e9e-b971-423e-889f-9108dcecd786" />

#### 3. **Modal de Importación:**
   - Muestra una ventana con una lista deslizable que muestra las tareas importadas desde la API.
   - Permite seleccionar con casillas individuales cuáles queremos guardar en nuestra aplicación.
<img width="705" height="577" alt="image" src="https://github.com/user-attachments/assets/1a33686d-d819-47c5-92e0-400410788e20" />

## 🛠️ Tecnologías Utilizadas

- **HTML5:** Estructura de la página utilizando etiquetas modernas como `<template>` y `<div>` para los modales.
- **CSS3:** Estilos creados con CSS Grid, Flexbox y una paleta de colores minimalista en tonos verdes y blancos.
- **JavaScript:** Lógica de programación, manejo de eventos y funciones asíncronas.

---
## 📲 Instrucciones de instalación
- Inicialmente dbemos clonar el repositorio
- Abrir la caroeta del proyecto haciendo uso de Visual Studio Code
- Realizar la ejecución del programa, ya sea usando la extensión **Live Server** de VS Code o correrlo de forma local.

---
### Autores 
Proyecto desarrollado por Christian García y Daniela García 
