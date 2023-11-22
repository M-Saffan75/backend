const mongoose = require('mongoose');

const connectDB = async (DATABASE_URL) => {
    try {
        const DB_HERE = {
            dbName : 'Fitness'   
        }
        await mongoose.connect(DATABASE_URL, DB_HERE)
        console.log('connect successfully')
    } catch (error) {
        console.log('Error==>',error)
    }
}

module.exports = connectDB;