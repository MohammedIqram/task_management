const Projects = (sequelize, DataTypes) => {
const Project = sequelize.define(
      'Project',
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
        owner_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        tableName: 'projects',
        timestamps: false,
      }
    );

    return Project;
}
export default Projects;
