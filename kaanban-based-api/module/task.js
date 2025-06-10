const TASKS = (sequelize, DataTypes) => {
  const Task = sequelize.define(
      'Task',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        title: {
          type: DataTypes.STRING(40),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        due_date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        column_name: {
          type: DataTypes.STRING(40),
          allowNull: false,
        },
        column_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        orders: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
      },
      {
        tableName: 'tasks',
        timestamps: false,
      }
    );

    Task.associate = (models) => {
    Task.belongsTo(models.COLUMN, {
      foreignKey: 'column_id',
      as: 'column', 
    });
  };

    return Task;
};

export default TASKS;
