var mongoose   = require('mongoose'),
    bcrypt     = require('bcrypt'),
    validator  = require('validator'),
    jwt        = require('jsonwebtoken');
    JWT_SECRET = process.env.JWT_SECRET;

var profile = {

  // Basic info
  name: {
    type: String,
    min: 1,
    max: 100,
  },

  phone: {
    type: String,
    min: 1,
    max: 15,
  },

  adult: {
    type: Boolean,
    required: true,
    default: false,
  },

  school: {
    type: String,
    min: 1,
    max: 150,
  },

  major: {
    type: String,
    min: 1,
    max: 150,
  },

  graduationYear: {
    type: String,
    enum: {
      values: '2020 2021 2022 2023 Highschool Graduate'.split(' '),
    }
  },

  description: {
    type: String,
    min: 0,
    max: 300
  },

  essay: {
    type: String,
    min: 0,
    max: 1500
  },

  // Optional info for demographics
  gender: {
    type: String,
    enum : {
      values: 'M F O Z'.split(' ')
    }
  },

  race: {
    type: String,
    enum : {
      values: 'N A B H I W T Z'.split(' ')
    }
  },

  participationCount: {
    type: String,
    enum : {
      values: 'N S M L'.split(' ')
    }
  },

  resume: {
    type: String,
    min: 0,
    max: 50000
  },

  linkedIn: {
    type: String,
    min: 0,
    max: 500
  },

  github: {
    type: String,
    min: 0,
    max: 500
  },

  otherSites: {
    type: String,
    min: 0,
    max: 500
  },

  ssSize: {
    type: String,
    enum : {
      values: 'S M L X'.split(' ')
    }
  },

  diet: {
    type: String,
    enum : {
      values: 'N T V G D A K H O'.split(' ')
    }
  },

  travel: {
    type: String,
    enum : {
      values: 'D F B P W'.split(' ')
    }
  },

  youtubevid: {
    type: String,
    min: 0,
    max: 500
  },

  superbowl: {
    type: String,
    min: 0,
    max: 500
  },

  game: {
    type: String,
    min: 0,
    max: 500
  },

  discoveryMethod: {
    type: String,
    min: 0,
    max: 500
  },
  codeAgreement: {
    type: Boolean,
    required: true,
    default: false,
  },

  dataAgreement: {
    type: Boolean,
    required: true,
    default: false,
  },
};

// Only after confirmed
var confirmation = {
  phone: String,
  dietaryRestrictions: [String],
  shirtSize: {
    type: String,
    enum: {
      values: 'XS S M L XL XXL WXS WS WM WL WXL WXXL'.split(' ')
    }
  },
  wantsHardware: Boolean,
  hardware: String,

  major: String,
  github: String,
  twitter: String,
  website: String,
  resume: String,

  notes: String,

  signatureLiability: String,
  signaturePhotoRelease: String,
  signatureParentPhotoRelease: String,
  signatureCodeOfConduct: String,
  parentPhone: String,
  dateSig: String,
  dateParentSig: String,
  terms: Boolean,
};

var status = {
  /**
   * Whether or not the user's profile has been completed.
   * @type {Object}
   */
  completedProfile: {
    type: Boolean,
    required: true,
    default: false,
  },
  admitted: {
    type: Boolean,
    required: true,
    default: false,
  },
  admittedBy: {
    type: String,
    validate: [
      validator.isEmail,
      'Invalid Email',
    ],
    select: false
  },
  confirmed: {
    type: Boolean,
    required: true,
    default: false,
  },
  declined: {
    type: Boolean,
    required: true,
    default: false,
  },
  rejected: {
    type: Boolean,
    required: true,
    default: false,
  },
  checkedIn: {
    type: Boolean,
    required: true,
    default: false,
  },
  checkInTime: {
    type: Number,
  },
  confirmBy: {
    type: Number
  },
  reimbursementGiven: {
    type: Boolean,
    default: false
  }
};

// define the schema for our admin model
var schema = new mongoose.Schema({

  email: {
      type: String,
      required: true,
      unique: true,
      validate: [
        validator.isEmail,
        'Invalid Email',
      ]
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  admin: {
    type: Boolean,
    required: true,
    default: false,
  },

  timestamp: {
    type: Number,
    required: true,
    default: Date.now(),
  },

  lastUpdated: {
    type: Number,
    default: Date.now(),
  },

  teamCode: {
    type: String,
    min: 0,
    max: 140,
  },

  verified: {
    type: Boolean,
    required: true,
    default: false
  },

  salt: {
    type: Number,
    required: true,
    default: Date.now(),
    select: false
  },

  /**
   * User Profile.
   *
   * This is the only part of the user that the user can edit.
   *
   * Profile validation will exist here.
   */
  profile: profile,

  /**
   * Confirmation information
   *
   * Extension of the user model, but can only be edited after acceptance.
   */
  confirmation: confirmation,

  status: status,

});

schema.set('toJSON', {
  virtuals: true
});

schema.set('toObject', {
  virtuals: true
});

//=========================================
// Instance Methods
//=========================================

// checking if this password matches
schema.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// Token stuff
schema.methods.generateEmailVerificationToken = function(){
  return jwt.sign(this.email, JWT_SECRET);
};

schema.methods.generateAuthToken = function(){
  return jwt.sign(this._id, JWT_SECRET);
};

/**
 * Generate a temporary authentication token (for changing passwords)
 * @return JWT
 * payload: {
 *   id: userId
 *   iat: issued at ms
 *   exp: expiration ms
 * }
 */
schema.methods.generateTempAuthToken = function(){
  return jwt.sign({
    id: this._id
  }, JWT_SECRET, {
    expiresInMinutes: 60,
  });
};

//=========================================
// Static Methods
//=========================================

schema.statics.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

/**
 * Verify an an email verification token.
 * @param  {[type]}   token token
 * @param  {Function} cb    args(err, email)
 */
schema.statics.verifyEmailVerificationToken = function(token, callback){
  jwt.verify(token, JWT_SECRET, function(err, email) {
    return callback(err, email);
  });
};

/**
 * Verify a temporary authentication token.
 * @param  {[type]}   token    temporary auth token
 * @param  {Function} callback args(err, id)
 */
schema.statics.verifyTempAuthToken = function(token, callback){
  jwt.verify(token, JWT_SECRET, function(err, payload){

    if (err || !payload){
      return callback(err);
    }

    if (!payload.exp || Date.now() >= payload.exp * 1000){
      return callback({
        message: 'Token has expired.'
      });
    }

    return callback(null, payload.id);
  });
};

schema.statics.findOneByEmail = function(email){
  return this.findOne({
    email: email.toLowerCase()
  });
};

/**
 * Get a single user using a signed token.
 * @param  {String}   token    User's authentication token.
 * @param  {Function} callback args(err, user)
 */
schema.statics.getByToken = function(token, callback){
  jwt.verify(token, JWT_SECRET, function(err, id){
    if (err) {
      return callback(err);
    }
    this.findOne({_id: id}, callback);
  }.bind(this));
};

schema.statics.validateProfile = function(profile, cb){
  return cb(!(
    profile.name.length > 0 &&
    profile.school.length > 0 &&
    ['2020', '2021', '2022', '2023', 'Highschool', 'Graduate'].indexOf(profile.graduationYear) > -1 &&
    ['M', 'F', 'O', 'Z'].indexOf(profile.gender) > -1 &&
    profile.phone.length > 0 &&
    profile.major.length > 0 &&
    profile.gender.length > 0 &&
    profile.race.length > 0 &&
    profile.participationCount.length > 0 &&
    profile.codeAgreement == true &&
    profile.dataAgreement == true &&
    profile.game.length > 0 &&
    profile.discoveryMethod.length > 0 &&
    profile.superbowl.length > 0 &&
    profile.diet.length > 0 

  ));
};

//=========================================
// Virtuals
//=========================================

/**
 * Has the user completed their profile?
 * This provides a verbose explanation of their furthest state.
 */
schema.virtual('status.name').get(function(){

  if (this.status.checkedIn) {
    return 'checked in';
  }

  if (this.status.declined) {
    return "declined";
  }

  if (this.status.confirmed) {
    return "confirmed";
  }

  if (this.status.admitted) {
    return "admitted";
  }

  if (this.status.completedProfile){
    return "submitted";
  }

  if (!this.verified){
    return "unverified";
  }

  return "incomplete";

});

module.exports = mongoose.model('User', schema);
