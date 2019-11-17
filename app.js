const express = require("express");
const app = express();
const path = require('path')
var bodyParser = require('body-parser')
app.use(express.static("public"));
app.set("view engine", "ejs");
var fs = require('fs');
console.log("ana hna")
app.locals.CURRENTUSER = "ADMIN";
var CURRENTUSER = "ADMIN";
app.locals.FCURRENTUSER;
var FCURRENTUSER;
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.urlencoded(
{
    extended: false
}))




app.get("/", function(req, res)
{
    res.render("login.ejs");
});



if (process.env.PORT)
{
    app.listen(process.env.PORT, function()
    {
        console.log("server");
    });
}
else
{
    app.listen(8888, function() {});
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
            console.log("ana hna 2")
            app.locals.CURRENTUSER = req.body.username;
            CURRENTUSER = req.body.username;
            var obj = {
                name: req.body.username,
                pass: req.body.password,
                list: []
            };
            app.locals.FCURRENTUSER = obj;
            FCURRENTUSER = obj;

            users.push(obj);



            json = JSON.stringify(users);
            fs.writeFile('users.json', json, 'utf8', function() {});

            res.redirect("homes");
        }
    });

});

app.post("/search", function(req, res)
{

    app.locals.hoba = req.body.Search;
    res.render("searchresults.ejs");


});
app.post("/watchlist", function(req, res)
{
    fs.readFile('users.json', 'utf8', function readFileCallback(err, data)
    {
        users = JSON.parse(data);
        urlws = req.headers.referer;
        var i = 0;
        for (i = urlws.length; urlws[i] != '/'; i--)
        {}
        var linkws = urlws.substring(i);
        var temp = -1;
        for (var i = 0; i < users.length; i++)
        {
            console.log(users[i].name);

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
            console.log(users[temp].list[i] + "     " + linkws);
            if (users[temp].list[i] == linkws)
            {
                console.log(found);
                found = true;
            }
        }
        if (!found)
        {
            //console.log(users[temp]);
            //console.log(users[temp].list);
            //console.log(linkws);
            // console.log();
            //console.log();
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

        var temp = -1;
        for (var i = 0; i < users.length; i++)
        {
            console.log(users[i].name);

            if (users[i].name == CURRENTUSER)
            {
                temp = i;
            }

        }
        app.locals.FCURRENTUSER = users[temp];
        res.render(req.path.substring(1));
        res.render("login");



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