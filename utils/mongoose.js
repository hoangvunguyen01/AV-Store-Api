module.exports = {
    mutipleMongooseToObject: function(array) {
        return array.map((element) => element.toObject());
    },
    
    mongooseToObject: function(mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    }
}

