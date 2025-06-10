const Columns = (sequelize, DataTypes) => {
  const Column = sequelize.define(
      'Column',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(40),
          allowNull: false,
        },
        project_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        orders: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
      },
      {
        tableName: 'columns',
        timestamps: false,
      }
    );
      Column.associate = (models) => {
    Column.hasMany(models.TASKS, {
      foreignKey: 'column_id', // column_id in the Task table
      as: 'tasks', // Alias to use when including tasks
    });
  };
    return Column;
};

export default Columns;
