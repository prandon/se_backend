const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//Adding body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//test endpoint
app.get('/', (req, res) => {
    res.send({
        message: "Welcome"
    });
});

//start server
app.listen(process.env.PORT || 5000, () => console.log('Server Started at 5000'));