export default callback => {
	callback(require('./models').sequelize);
}
