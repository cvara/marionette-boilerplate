// simple production-ish server
const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();

// gzip (must be first)
app.use(compression());
// serve our static stuff like index.css
app.use(express.static(path.join(__dirname, 'dist')));

// send all requests to index.html so HTML5 history works
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, function() {
	console.log(`Production Express server running at localhost: ${PORT}`);
});
