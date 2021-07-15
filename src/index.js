const express = require('express');
const app = express();
const env = require('dotenv');
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRouter = require('./routes/auth');
const adminRouter = require('./routes/admin/auth');


env.config();
app.use(express.json());
// middleware
app.use('/api' , userRouter);
app.use('/api' , adminRouter);

// mongoose db connection
mongoose.connect(
    process.env.MONGO_DB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
).then(() => {
    console.log("Database Connected");
});

app.listen(process.env.PORT , () => {
    console.log(`Application is running on PORT ${process.env.PORT}`);
})

