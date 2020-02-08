# Conclusiones Práctica P0-t0-esprima-logging
#### Autor: Florentín Pérez González
#### Fecha: 06/02/2020
#### Asignatura: Procesadores de Lenguajes

---
##### Aplicación del programa
El programa *logging-espree.js* tiene como finalidad permitir al usuario, en concreto a un programador, realizar un seguimiento
del flujo del control de los pogramas que este escriba en __JavasSript__. Ello lo hace mediante la identificación de las distintas
funciones que se definen en un código y que el programador pasa como entrada al programa, incluyendo al comienzo de cada una de ellas una sentencia para mostrar el nombre de la función en sí. Es importante destacar, que estas modificaciones no se realizan al código original, sino que se origina un nuevo fichero con el código modificado. Es la ejecución de este, la que permitirá al programador comprobar el flujo de ejecución de su programa a través de las sentencias previamente mencionadas que muestran un mensaje único cada vez que se acceda a cualquier función definida. En concreto, estos mensajes aparecen a través de la consola del navegador si se ejecuta en uno; o bien en una terminal local si se ejecuta el código generado a través de __NodeJS__.

---
##### Funcionamiento del programa
El programa funciona aprovechando las funcionalidades del compilador ***espree**, en concreto, su capacidad para generar análisis
léxicos de fragmentos de código, generando en el proceso un árbol representativo del mismo. Cada uno de los nodos de dicho árbol
representa un aspecto de la estructura del código: Declaraciones de variables, definiciones de funciones, llamadas a funciones...
En consecuencia, podemos afirmar que cualquier definición de función que se encuentre en un código debe estar contenida en alguno
de los nodos del árbol, por lo que el paso necesario para realizar el cometido del programa pasa por atravesar el árbol generado
en su totalidad buscando todos los nodos del mismo que se corresponden con definiciones de funciones, ya sean estas anónimas o no.
Ello se hace comprobando el **tipo** de cada nodo, representado como un *String* contenido en la property ***type***. En concreto,
nos interesan los siguientes tipos:

- *FunctionDeclaration*, que identifica a funciones no anónimas.
- *FunctionExpression*, que identifica a funciones anónimas.

Cada vez que encontramos durante el proceso de exploración del árbol alguno de estos nodos, detenemos el proceso de exploración
temporalmente para dar paso a la función responsable de incrustar las sentencias indicativas de la función por las que pasa el flujo
de control del programa/código pasado como entrada. Esta función aprovecha la naturaleza y conocimiento de la estructura del árbol
generado por el compilador para realizar modificaciones en los nodos pertinentes. En concreto, realiza el análisis léxico de un nuevo
código contenido en un *String* y que es el responsable de mostrar los mensajes. El nuevo árbol generado, en concreto su nodo **body**
se almacena en una constante. El motivo de esto es simple; el nodo raíz de todo árbol léxico generado por el compilador **espree**
es de tipo **Program**, puesto que interpreta la totalidad del código analizado como tal, mientras que a nosotros nos interesa
únicamente un componente del mismo que representa a la sentencia contenida en el *String*. El contenido de cada fragmento o bloque
de cógido se encuentra definido en forma de nodos hijos en el **body** de cada nodo. Por tanto, y debido a la sencillez del código, el
**body** del nuevo código analizado contendrá la expresión que nos interesa incluir en cada función detectada. Esta lógica también es
aplicable al nodo representativo de la función, aunque para su caso concreto el elemento que nos interesa es la serie de nodos hijos
pertenecientes al **body** del **body** del nodo en sí. El motivo de esto se debe enteramente al mecanismo de clasificación de los
compiladores **espree** y **esprima**, que para toda función atribuyen un único elemento en **body**, siendo este un nodo de tipo
*BlockStatement*, representante directo de todo el código propio de la función y en cuyo **body** se encuentra toda la información de
la misma. Teniendo en cuenta esta información, podemos llegar a la conclusión de que si añadimos un nuevo nodo al **body** del
*BlockStatement* habremos modificado efectivamente el contenido de la función a la que pertecene dicho bloque. Si el nodo añadido
fuese el obtenido tras la realización del segundo análisis léxico, conseguiríamos el resultado deseado: Añadir la sentencia que
muestra el mensaje indicativo. Esta modificación es perfectamente válida y no genera ningún tipo incoherencia siempre y cuando se
realice adecuadamente. Aprovechando el hecho de que **body** es siempre un *Array de nodos*, la manera más fácil de realizar esta
modificación es concatenar al array del nodo de la función (`node.body.body`) con el obtenido tras el segundo análisis
léxico.

Tras este paso, el nodo correspondiente a la función habrá sido modificado satisfactoriametne, mas no obstante, estos cambios no se
reflejan todavía en ningún fichero, sino que únicamente denotan su presencia en el árbol resultante del primer análisis léxico. Para
conseguir un nuevo fichero de código que refleje la nueva realidad del árbol, es necesario recurrir a ***escodegen***, un generador
de código de **ECMAScript**. Esta herramienta nos permitirá generar el código equivalente a un árbol léxico, es decir, realiza
el proceso contrario al compilador **espree**. Tras este último paso, la funcionalidad del programa acaba y se ha obtenido como salida
del mismo un nuevo fichero con el código modificado.

---
##### Funciones principales
A continuación se expondrán las funciones/métodos responsables de las principales tareas/acciones que realiza el programa durante su
ejecución:

- `parse(arg)`: Perteneciente al compilador ***espree***, es la responsable del análisis léxico del código que se le pasa como argumento. Devuelve el árbol resultante de la operación.
- `traverse(arg1, arg2)`: Perteneciente a ***estraverse***, es el procedimiento encargado de atravesar el árbol léxico que se le pasa como *arg1*. *arg2* es usado para indicar una acción que debe realizar con cada nodo según lo atraviesa, en concreto, determinar si su tipo es el deseado y en caso afirmativo, dar paso a la función encargada de incrustar el código.
- `generate(arg)`: Perteneciente al generador de código ***escodegen***, es el método que se encarga de crear el código equivalente a un árbol léxico indicado mediante *arg*.