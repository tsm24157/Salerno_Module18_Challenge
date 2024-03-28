const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    thoughts: [{
        type: Schema.Types.ObjectId,
        ref: 'thought'
    }],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true
    },
    id: false
  }
);

userSchema.virtual('friendCount').get(function(){
  return this.friends.length;
});

const User = model('user', userSchema);

module.exports = User;
