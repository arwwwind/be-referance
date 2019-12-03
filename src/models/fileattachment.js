'use strict';
module.exports = (sequelize, DataTypes) => {
  const FileAttachment = sequelize.define('FileAttachment', {
    fileName: DataTypes.STRING,
    googleDriveFileId: DataTypes.STRING,
    tag: DataTypes.STRING,
    description: DataTypes.TEXT,
    filePath: DataTypes.STRING
  }, {
    paranoid: true
  });
  FileAttachment.associate = function(models) {
    FileAttachment.belongsToMany(models.Notes, {through: "NotesFileAttachmentsPivot", as: "notes", foreignKey: "fileAttachmentId"})
  };
  return FileAttachment;
};