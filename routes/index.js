/**
* Sencillo script con nodejs trabajando con sqlite3,
* bootstrap de twitter y el motor de plantillas jade
*/

//llamamos al modelo user.js para utilizar toda su funcionalidad
var UserModel = require('../models/user');

//aquí tenemos el objeto app que hemos traído de app.js
module.exports = function(app)
{

	//ruta para crear la tabla usuarios
    app.get("/createTable", function(req, res)
    {
		UserModel.createUsersTable();
		res.end();
	});

    //para acceder aquí escribiremos http://localhost:3000/
    //req es un objeto que contiene información sobre la solicitud HTTP que provocó el evento. 
    //En respuesta a req, res se utiliza para devolver la respuesta HTTP que necesitemos.
    app.get("/", function(req, res)
    {
        //en este caso le decimos que queremos renderizar la vista views/index.jade con algunos datos
        res.render('index', { 
            title: 'Formularios en node con Jade y Twitter Bootstrap'
        });
    });

    //mostramos la vista views/register.jade
    app.get("/register", function(req, res)
    {
    	if(req.session.username)
    	{ 
    		res.redirect("/home");
    	}
        //en este caso le decimos que queremos renderizar la vista views/index.jade con algunos datos
        res.render('register', {
            title: 'Formulario de registro con Twitter Bootstrap'
        });
    });

   	//recibimos la interaccion de cuando el usuario envia el formulario de login
    app.post("/login", function(req,res)
    {
    	UserModel.loginUser({username:req.body.username,password:req.body.password}, function(data)
    	{
    		if(data)
    		{
	    		//si los datos no son correctos
	    		if(data.msg === "error")
	    		{
	    			res.send("error", 200);
	    		}
	    		else
	    		{
	    			req.session.username = req.body.username;
	    			res.send("logueado", 200);
	    		}
	    	}
	    	else
	    	{
	    		res.send("error", 200);
	    	}
    	});
    });

    //mostramos la vista views/home.jade solo si el usuario ha iniciado sesion
    app.get("/home", function(req, res)
    {
        //si no existe la sesion del usuario redirigimos al login
        if(!req.session.username)
        { 
            res.redirect("/");
        }
        //en otro caso mostramos el formulario
        else 
        {
            res.render('home', { 
                title: 'Bienvenido a nuestra aplicación',
                username: req.session.username//asi accedemos a la sesion del usuario
            });
        }
    });

    app.get("/logout", function(req,res)
    {
    	req.session.destroy();
    	res.redirect("/");
    })
}