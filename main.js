const express = require("express");
const app = express();

function arrayOfParam(users, param){
    /**
     * @return list of user's value of the given parameter 
     */
    /**
    * @parameter users: List of users
    * @parameter param: the value to use to generate the list
    */

    const listOfParameters = [];

    users.forEach(u => {
        listOfParameters.push(u[param]);
    });

}


app.use(express.json());

app.use(require("./routes/routes.js"));


const port = 3000
app.listen(port, () => {
    console.log(`Listening at port: ${port}`);
});