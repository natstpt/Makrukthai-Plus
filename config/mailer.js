module.exports = function(app, mailer){
	mailer.extend(app, {
		from: '',
		host: '',
		secureConnection: true,
		port: 465,
		transportMethod: 'SMTP',
		auth: {
			user: '',
			pass: ''
		}
	});
}