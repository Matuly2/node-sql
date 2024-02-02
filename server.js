const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const server = require('http').Server(app);



const bodyParser = require("body-parser");
const mysql = require("mysql");


app.use(express.json());

const PORT = 3000;
app.use(express.static(path.join(__dirname, 'public')));



const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'buqtgtmbwfwgvdunsydd-mysql.services.clever-cloud.com',
    user            : 'uxkykzrdk2gsjklq',
    password        : '3vldmRBO3hZyG2vefUsD',
    database        : 'buqtgtmbwfwgvdunsydd'
})



app.get('/',(req,res)=>{
    var contenido=fs.readFileSync('public/index.html');
    res.setHeader('Content-type','text/html');
    res.send(contenido);
});
app.get('/centros',(req,res)=>{
    var contenido=fs.readFileSync('public/centros.html');
    res.setHeader('Content-type','text/html');
    res.send(contenido);
});
app.get('/alumnos',(req,res)=>{
    var contenido=fs.readFileSync('public/alumnos.html');
    res.setHeader('Content-type','text/html');
    res.send(contenido);
});
app.get('/graficos',(req,res)=>{
    var contenido=fs.readFileSync('public/graficos.html');
    res.setHeader('Content-type','text/html');
    res.send(contenido);
});




app.get("/cursosInfo", (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query(`SELECT
        cu.nombre AS nombreCurso,
        cu.lugar AS ubicacionCurso,
        cu.nivel,
        JSON_ARRAYAGG(ce.nombre) AS centrosImpartidos
    FROM
        Cursos cu
    JOIN
        CursosCentros cc ON cu.idCurso = cc.idCurso
    JOIN
        Centros ce ON cc.idCentro = ce.idCentro
    GROUP BY
        cu.idCurso;
    `, (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            
        })
    })
});
app.get("/centrosInfo", (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query(`SELECT
        ce.idCentro,
        ce.nombre AS nombreCentro,
        JSON_ARRAYAGG(cu.nombre) AS cursosImpartidos
    FROM
        Centros ce
    JOIN
        CursosCentros cc ON ce.idCentro = cc.idCentro
    JOIN
        Cursos cu ON cc.idCurso = cu.idCurso
    GROUP BY
        ce.idCentro, ce.nombre;
    `, (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            
        })
    })
});
app.get("/alumnosInfo", (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query(`SELECT
        a.idAlumno,
        a.nombre AS nombreAlumno,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'nombreCurso', c.nombre,
                'estado', ac.estado
            )
        ) AS cursosMatriculados
    FROM
        Alumnos a
    JOIN
        AlumnosCursos ac ON a.idAlumno = ac.idAlumno
    JOIN
        Cursos c ON ac.idCurso = c.idCurso
    GROUP BY
        a.idAlumno, a.nombre;
    `, (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
           
        })
    })
});
app.get("/graficosInfo", (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query(` SELECT
        cu.idCurso,
        cu.nombre AS nombreCurso,
        COUNT(ac.idAlumno) AS totalMatriculados,
        SUM(CASE WHEN ac.estado = 'aprobado' THEN 1 ELSE 0 END) AS aprobados,
        (SUM(CASE WHEN ac.estado = 'aprobado' THEN 1 ELSE 0 END) / COUNT(ac.idAlumno)) * 100 AS ratioAprobados
        FROM
            Cursos cu
        LEFT JOIN
            AlumnosCursos ac ON cu.idCurso = ac.idCurso
        GROUP BY
            cu.idCurso, cu.nombre;
     `, (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
           
        })
    })
});
app.get("/borrarAlumno", (req, res) => {
    console.log("Este es el alumno.nombrealumno que mando ala bdd: ",req.query.idAlumno)
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query(`DELETE FROM Alumnos WHERE idAlumno = '${req.query.idAlumno}'`
     , (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
           
        })
    })
});






server.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});