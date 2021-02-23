const config = require("config");
const express = require('express');
const cors = require('cors');
const cookieParser=require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const db = require('./config/db');
const auth = require('./middleware/auth');

//  Controllers
const corona = require('./controllers/corona/coronaController');
const orderController = require('./controllers/order/orderController');
const cartController = require('./controllers/cart/cartController');
const productController = require('./controllers/product/productController');
const userController = require('./controllers/user/userController');


/**
 *  Before Starting Server
 */

//  Verify app-key is defined
if (!config.get("app-key")) {
    console.error("WARNING: app-key is not defined.");
}

//  Connect to DB
db.getDbConnection().catch(error => {
    console.log('DB connection error', error);
    process.exit(1);
});


// Allow Origins Middleware
app.use(cors({
    credentials: true,
    origin: '*',
}));


//  Cookie Parser Middleware
app.use(cookieParser());


//  Set Public Directory
app.use( express.static('./src/dist/') );

//  Auth Middleware
app.use(auth);

//  Body Parser with RAW JSON support Middleware
app.use(bodyParser.json({
    verify: (req, res, buf) => {
        req.rawBody = buf
        req.safeBody =JSON.parse(buf.toString());
    }
})); 

//  Controller
userController(app);
productController(app);
cartController(app);
orderController(app);
corona(app);

/**
 *  Start Server
 */

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
    if(err) {
        console.log(`Server error ${err}`)
    } else {
        console.log(`Server listening on port ${port}`)
    }
});