const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const	cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.port 

app.use(cors({
  origin: `${process.env.frontend_url}`,  // React frontend URL
  //credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json()); // Use body-parser for JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.static('public')); // Serve static files from the 'public' folder
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');


let go=false
let	goldRate=9700
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

 app.post('/daily', (req, res) => {
 
let data=req.body
 
if(data.email=="admin@AJ.com" && data.password=="admin@12345")
{
res.redirect('/home')
go=true
}
else
{

res.send("Invalid email or password");

}

});

const middleware = (req, res, next) => {
 if(go){
  next();
 } else {
  res.redirect('/');
 }
};

app.get("/home", middleware, (req, res) => {
res.render("homepage.hbs", { goldRate });
});

app.post('/update', (req, res) => {
	const { num } = req.body;
	goldRate = num;
	res.redirect('/home');
});

app.get('/api/goldrates', async (req, res) => {
  try {
 
    const dummyData = {
      gold_22k_rate: goldRate 

    };
    
    res.json(dummyData);

  } catch (error) {
    console.error("Error fetching gold rates:", error);
    res.status(500).json({ error: 'Failed to fetch gold rates' });
  }
});


app.use((req, res, next) => {

	res.sendFile(__dirname + "/404.html");

});

app.listen(port, () => {
  console.log(`Server is running at ${process.env.host}:${port}`);
});