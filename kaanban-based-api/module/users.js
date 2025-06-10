// models/users.js
import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt'; // Import bcrypt

const Users = (sequelize) => { // Removed 'DataTypes' from here as it's passed directly to sequelize.define
  const User = sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true, // Add unique constraint for username if it's used for login
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING, // Store hashed password
        allowNull: false,
      },
    },
    {
      tableName: 'users',
      timestamps: false,
      hooks: {
        // Hash password before saving a new user or updating password
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) { // Only hash if password actually changed
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  
  User.prototype.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  return User;
};

export default Users;