const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const librarianSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  // store hashed password; do not validate against plain-text regex here
  password: { type: String, required: true, select: false },
  phone: { type: String, required: true, unique: true },
  role: { type: String, enum: ['librarian', 'admin'], default: 'librarian' }
}, { timestamps: true });

// Hash password before saving

librarianSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});


// Instance method to compare password
librarianSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Librarian = mongoose.model('Librarian', librarianSchema);
module.exports = Librarian;
