const express = require("express");
const app = express();
const path = require('path')
var bodyParser = require('body-parser')
app.use(express.static("public"));
app.set("view engine", "ejs");
var colors = require('colors');
var fs = require('fs');
const session = require('express-session')
////console.log("ana hna")
app.locals.CURRENTUSER = "ADMIN";
var CURRENTUSER = "ADMIN";
app.locals.FCURRENTUSER;
var FCURRENTUSER;
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.urlencoded(
{
    extended: false
}))

app.use(
    // Creates a session middleware with given options.
    session({


      name: 'sid',
      user:'',
      saveUninitialized: false,

      resave: false,
 
      secret: 'sssh, quiet! it\'s a secret!',

  
      cookie: {
        maxAge: 1000 * 60 * 60 * 2,

        sameSite: true,

      }
    })
  )


app.get("/", function(req, res)
{
    res.render("login.ejs");
});



if (process.env.PORT)
{
    app.listen(process.env.PORT, function()
    {   
        console.log("   HEROKU ".red);
        console.log(('OHH IT WORKS!'.rainbow).bold);
    });
}
else
{
    app.listen(8888, function() {
        console.log(' LOCAL HOST'.red);
        console.log(('OHH IT WORKS!'.rainbow.bold));
    });
    
}

app.post("/login", function(req, res)
{

    fs.readFile('users.json', 'utf8', function readFileCallback(err, data)
    {
        users = JSON.parse(data);

        var flag = false;

        for (var i = 0; i < users.length; i++)
        {
            if (req.body.username == users[i].name)
            {
                if (req.body.password == users[i].pass)
                {
                    flag = true
                    app.locals.CURRENTUSER = req.body.username;
                    CURRENTUSER = req.body.username;
                    app.locals.FCURRENTUSER = users[i];
                    FCURRENTUSER = users[i];
                }
            }
        }
        if (flag)
        {
            fs.readFile('users.json', 'utf8', function readFileCallback(err, data)
            {
                app.locals.users = JSON.parse(data)
            })
            req.session.user = FCURRENTUSER;
            //console.log(req.session);
            res.redirect("home.ejs");
        }
        if (!flag)
            res.redirect("loginwrong");
    })

});



app.post("/register", function(req, res)
{

    fs.readFile('users.json', 'utf8', function readFileCallback(err, data)
    {
        users = JSON.parse(data);
        var flag = false;

        for (var i = 0; i < users.length; i++)
        {
            if (req.body.username == users[i].name)
            {
                flag = true;

            }
        }
        if (req.body.password == "" || req.body.username == "")
        {
            flag = true;
        }

        if (flag)

            res.redirect("regf");
        if (!flag)
        {
            //console.log("ana hna 2")
            app.locals.CURRENTUSER = req.body.username;
            CURRENTUSER = req.body.username;
            var obj = {
                name: req.body.username,
                pass: req.body.password,
                list: []
            };
            app.locals.FCURRENTUSER = obj;
            FCURRENTUSER = obj;
            req.session.user = FCURRENTUSER;
           // console.log(req.session);
            users.push(obj);



            json = JSON.stringify(users);
            fs.writeFile('users.json', json, 'utf8', function() {});

            res.redirect("homes");
        }
    });

});

app.post("/search", function(req, res)
{
    try{
        console.log(req.session.user.name);
        }
        catch(error)
        {
        res.render("login");
        }
    app.locals.hoba = req.body.Search;
    res.render("searchresults.ejs");


});
app.post("/watchlist", function(req, res)
{
    fs.readFile('users.json', 'utf8', function readFileCallback(err, data)
    {   
        try{
            console.log(req.session.user.name);
            }
            catch(error)
            {
            res.render("login");
            }
        app.locals.CURRENTUSER= req.session.user.name;
        CURRENTUSER= req.session.user.name;
        FCURRENTUSER= req.session.user;
        app.locals.FCURRENTUSER = req.session.user;
        users = JSON.parse(data);
        urlws = req.headers.referer;
        var i = 0;
        for (i = urlws.length; urlws[i] != '/'; i--)
        {}
        var linkws = urlws.substring(i);
        var temp = -1;
        for (var i = 0; i < users.length; i++)
        {
            //console.log(users[i].name);
            CURRENTUSER= req.session.user.name;
            FCURRENTUSER= req.session.user;  
            //console.log(req.session);
            if (users[i].name == CURRENTUSER)
            {
                temp = i;
            }


        }
        if (temp == -1)
        {
            res.redirect("login");
            return;
        }
        var found = false;
        var temp2 = 0;

        for (i = 0; i < users[temp].list.length; i++)
        {
            //console.log(users[temp].list[i] + "     " + linkws);
            if (users[temp].list[i] == linkws)
            {
                //console.log(found);
                found = true;
            }
        }
        if (!found)
        {
            ////console.log(users[temp]);
            ////console.log(users[temp].list);
            ////console.log(linkws);
            // //console.log();
            ////console.log();
            users[temp].list.push(linkws)
            json = JSON.stringify(users);
            fs.writeFile('users.json', json, 'utf8', function() {});
        }
        //res.redirect("watchlist");
        res.redirect(linkws);
    })

});
app.get("*", function(req, res)
{
    fs.readFile('users.json', 'utf8', function readFileCallback(err, data)
    {
        try{
        console.log(req.session.user.name);
        }
        catch(error)
        {
        res.render("login");
        return;
        }
        CURRENTUSER= req.session.user.name;
        FCURRENTUSER= req.session.user;  
        var temp = -1;
        // for (var i = 0; i < users.length; i++)
        // {
        //     //console.log(users[i].name);

        //     if (users[i].name == CURRENTUSER)
        //     {
        //         temp = i;
        //     }

        // }
        app.locals.FCURRENTUSER = req.session.user;
        app.locals.CURRENTUSER = req.session.user.name;
        try{
        res.render(req.path.substring(1));
        }
        catch (error) 
        {
            res.render("login");
        }
        
        //res.render("login");



    })
});
// var obj = 
// { 
// name: "",
// pass: "",
// list: []
// };
var users = []
//   const games = [
//     {title: "conjuring" },
//     {title: "darkknight"  },
//     {title: "godfather" },
//     {title: "godfather2"  },
//     {title: "scream" },
//     {title: "fightclub"}
// ]
// users.push(obj)