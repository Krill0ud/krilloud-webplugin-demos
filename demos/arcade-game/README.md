<!-- 
Prueba Krilloud, plugin web
 -->

Archivos necesarios para ejecutar el plugin
 - Contract.json (archivo exportado de krilloud)
 - .krll (soundbank exportado de Krilloud)
 - krilloud.wasm
 - krilloud.js 
 - KLDebug.txt


 <!-- 
 Funciones: Create, init, load, mainloop
  -->

Éstas funciones deben de hacerse de forma asíncrona, para que las tags carguen de forma correcta. 

En el caso de que las librerías se encuentren en un servidor web (no local), el relativePath establece el path desde la url base, en este caso el relativePath es la carpeta "dist". 

Estos son los parámetros por defecto que necesita krilloud para consigurarse en la función `js_wrapped_EX_Krilloud_Init(1,0,0,0,2); `

<!-- 
Contexto del juego: 
 -->

Tags a cargar: musica, bugs, ui, step, musicaBugs

Variables: pitch_pasos, superficie, pitch_bugs, music_pitch

Objetos creados:
    1. Player
    2. Enemy
    3. Canvas

El comportamiento de las variables dependerá de su tipo: Global o local. 
En el caso de que sea global, sin importar a que objeto esté asociada, siempre se modificará para todas las tags, mientras que de forma local, se puede aosciar a distintos objetos y setear solo en una instancia.


<!-- 
Pruebas de funciones: uso
 -->

| Objeto |      Recurso/Tag      |  Acción  -------------------------------------------------------------------------------   | 
| Canvas |      musica           | Start game, inicia la música de fondo - Al cambiar de nivel cambiar de velocidad del juego |
| Player |      step, ui         | Pasos del player, sonido de win al ganar el juego.                                         |
| Enemy  |      bugs, MusicaBugs | Collision del player con un enemigo - Musica de fonde de los bugs moviendose               |  

