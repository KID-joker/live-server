var request = require('supertest');
var path = require('path');
var port = 40200;
var server1 = require('..').start({
	root: path.join(__dirname, "data"),
	port: port,
	open: false
});
var server2 = require('..').start({
	root: path.join(__dirname, "data"),
	port: 0,
	open: false,
	proxy: [
		["/server1", "http://localhost:" + port]
	]
});

describe('proxy tests', function() {
	before(function(done) {
		Promise.all([server1, server2]).then(function(servers) {
			server1 = servers[0];
			server2 = servers[1];
		}).finally(function() {
			done();
		});
	});
	it('should respond with proxied content', function(done) {
		request(server2)
			.get('/server1/index.html')
			.expect('Content-Type', 'text/html; charset=UTF-8')
			.expect(/Hello world/i)
			.expect(200, done);
	});
});


