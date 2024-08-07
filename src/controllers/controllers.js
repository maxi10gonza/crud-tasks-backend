const connection = require("../database/db");

// Controlador para obtener todas las tareas
const todasLasTareas = async (req, res) => {
    const sql = 'SELECT * FROM tasks'; //  Consulta SQL para obtener todas las tareas
    console.log('Ejecutando consulta para obtener todas las tareas'); // Mensaje de depuración

connection.query(sql, (error, results) => {
    if (error) {
        console.error('Error al obtener tarea:', error); //  Registrar error en consola
        res.status(500).send('Error al obtener tarea'); //  Enviar respuesta de error
        return; //  Salir de la función si hay error
    }
      console.log('Tareas obtenidas:', results); //  Mensaje de depuración
      res.json(results); // Enviar resultados al cliente
    });
}

const tareaPorId = async (req, res) => {
    const id = req.params.id; // Obtener ID del parámetro de ruta
    console.log('Obteniendo tarea con ID:', id); //  Mensaje de depuración

    const query = `SELECT * FROM tasks WHERE id = ${id}`; // Consulta SQL para obtener usuario por ID

    connection.query(query, (error, results) => {
    if (error) {
        console.error('Error al obtener tarea:', error); // Registrar error en consola
        res.status(500).send('Error al obtener tarea'); // Enviar respuesta de error
        return; //  Salir de la función si hay error
    }

    if (!results.length) {
        console.log('Tarea no encontrada con ID:', id); //  Mensaje de depuración
        res.status(404).send('Tarea no encontrada'); //  Enviar respuesta de no encontrado
        return; //  Salir de la función si no se encuentra la tarea
    }

      console.log('Tarea encontrado:', results[0]); // Mensaje de depuración
      res.json(results[0]); // Enviar tarea al cliente
    });
}

const crearTarea = async (req, res) => {
    // primer paso: obtener datos del cuerpo de la solicitud
    console.log('req.body:', req.body);

    const { title, description, isComplete } = req.body;

    //segundo paso: validar que todos los datos sean obligatorios, es decir que no sean NULL
    if (!title || !description || !isComplete) {
      res.status(400).send('Falta información obligatoria'); // Enviar respuesta de error (código 400)
      return; // Salir de la función si faltan datos
    }

    // tercer paso: se hace la consulta SQL para insertar un nuevo usuario
    const query = `INSERT INTO tasks (title, description, isComplete) VALUES (?, ?, ?)`;
    const values = [title, description, isComplete]; // Valores para la consulta

    // cuarto paso: ejecutamos la consulta SQL para crear la tarea
    connection.query(query, values, (error, results) => {
    if (error) {
        console.error('Error al crear tarea:', error); // Registrar error en consola
        res.status(500).send('Error al crear tarea'); // Enviar respuesta de error (código 500)
        return; // Salir de la función si hay error en la consulta
    }

      // ultimo paso: si la consulta se ejecuta correctamente, enviar respuesta de éxito
    res.json({ message: 'Tarea creada correctamente' });
    });
}

const actualizarTarea = async (req, res) => {
    // Obtiene el ID de la tarea y datos del cuerpo de la solicitud
    const id = req.params.id;
    const { title, description, isComplete } = req.body;

    // Valida que todos los datos sean obligatorios
if (!title || !description || !isComplete) {
    res.status(400).send('Falta información obligatoria'); // Enviar respuesta de error (código 400)
    return; // Salir de la función si faltan datos
}

    // se hace la consulta SQL para actualizar la tarea
const query = `UPDATE tasks SET title = ?, description = ?, isComplete = ? WHERE id = ?`;
const values = [title, description, isComplete, id]; // Valores para la consulta

    // ejecutamos la consulta SQL para actualizar el tarea
connection.query(query, values, (error, results) => {
    if (error) {
        console.error('Error al actualizar tarea:', error); // Registrar error en consola
        res.status(500).send('Error al actualizar tarea'); // Enviar respuesta de error (código 500)
        return; // Salir de la función si hay error en la consulta
    }

      // verificar si se actualizó algún registro
    if (results.affectedRows === 0) {
        res.status(404).send('Tarea no encontrada'); // Enviar respuesta de error (código 404) si no se encuentra la tarea
        return; // Salir de la función si no se actualizó ningún registro
    }

      // si la consulta se hizo bien, enviar respuesta de éxito
    res.json({ message: 'Tarea actualizada correctamente' });
    });
}

const eliminarTarea = async (req, res) => {
    // se obtiene el ID de la tarea a eliminar
    const id = req.params.id; // Extraer el ID del parámetro de la URL

    // hacemos la consulta SQL para eliminar la tarea
    const query = `DELETE FROM tasks WHERE id = ${id}`; // Consulta SQL para eliminar el registro con el ID especificado
    const values = [id]; // Valor para la consulta (el ID de la tarea)

    // ejecutamos la consulta SQL para eliminar la tarea
connection.query(query, values, (error, results) => {
    if (error) {
        // Si ocurre un error al ejecutar la consulta
        console.error('Error al eliminar tarea:', error); // Registrar el error en la consola
        res.status(500).send('Error al eliminar tarea'); // Enviar respuesta de error al cliente (código HTTP 500)
        return; // Salir de la función si hay un error
    }

      // se verifica si se eliminó algún registro
    if (results.affectedRows === 0) {
        // Si no se eliminó ningún registro (es decir, no se encontró la tarea)
        res.status(404).send('Tarea no encontrada'); // Enviar respuesta de error al cliente (código HTTP 404)
        return; // Salir de la función si no se encontró la tarea
    }

      // se notifica que se realizo bien la consulta y se elimina la tarea
      res.json({ message: 'Tarea eliminada correctamente' }); // Enviar respuesta de éxito al cliente indicando que la tarea se eliminó correctamente
    });
} 

module.exports = {
    todasLasTareas,
    tareaPorId,
    crearTarea,
    actualizarTarea,
    eliminarTarea,
}