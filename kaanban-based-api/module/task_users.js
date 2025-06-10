const TaskUsers = (sequelize, DataTypes) => {
const TaskUser = sequelize.define(
      'TaskUser',
      {
        task_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
      },
      {
        tableName: 'task_users',
        timestamps: false,
      }
    );

    return TaskUser;
}
export default TaskUsers;
