const mongoose =require('mongoose');

const getConnection=async()=>{
    try {
        const url='mongodb://inventario:5mQvfDdgtOkf7GvK@ac-nusbaxw-shard-00-00.wnvxi9b.mongodb.net:27017,ac-nusbaxw-shard-00-01.wnvxi9b.mongodb.net:27017,ac-nusbaxw-shard-00-02.wnvxi9b.mongodb.net:27017/app-security?ssl=true&replicaSet=atlas-5dxop9-shard-0&authSource=admin&retryWrites=true&w=majority' 
        await mongoose.connect(url);
        console.log('Conectado BD');

    } catch (error) {
        console.log('Error de conexion BD');
    }
}
module.exports={getConnection}