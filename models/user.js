const { Schema,model } = require('mongoose');
const {craeteHmac , randomBytes, createHmac} = require('crypto');
const{createToken } = require('../services/auth');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  salt: {
     type: String,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  profileImage: {
    type: String,
    default: "images/user.jpg",
  },
  role:{
    type: String,
    enum: ['ADMIN','USER'],
    default: 'USER',
  }
},{ timestamps: true});


userSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified('password')) return;
    const salt = 'somerandom';
    const hashedPassword = createHmac("sha256", salt) 
                            .update(user.password)
                            .digest("hex");
    this.salt = salt;
    this.password = hashedPassword;

    next();
})


userSchema.static('matchpasswordAndGenerateToken', async function(email,password) {
      const user = await this.findOne({ email});
      if(!user){
        throw new Error("User not found");
      }
      console.log(password);
      const salt = user.salt;
      const hashedPassword = user.password;
      const userProvidehash = createHmac("sha256", salt) 
                            .update(password)
                            .digest("hex");
    
     if(hashedPassword !== userProvidehash){
        throw new Error("Invalid password");
     }
    const token = createToken(user);
    return token;
})

const User = model('user', userSchema);
module.exports = User;