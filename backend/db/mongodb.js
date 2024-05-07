const mongoose = require('mongoose');



mongoose.connection.on('open', () => console.log('db connected'))

async function connectDb ({ host, port, dbName }){
  const uri = "mongodb+srv://proyecto_diseno:MLdmnzq3DcLU7Jqw@cluster0.cj7hwee.mongodb.net/proyecto_diseno";

    
    await mongoose.connect(uri, { useNewUrlParser: true})
}

module.exports = connectDb

/*
const bdUrl = "mongodb+srv://proyecto_diseno:MLdmnzq3DcLU7Jqw@cluster0.cj7hwee.mongodb.net/";

mongoose.connect(bdUrl)
  .then(() => {
    console.info("Connected to the DB");
  })
  .catch((e) => {
    console.log("Error: ", e);
  });*/




  

  