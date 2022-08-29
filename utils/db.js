import mongoose from 'mongoose'

function connect() {
    if(mongoose.connections[0].readyState) {
        console.log('connected already')
    }
}

export default connnect;