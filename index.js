const express = require('express');
const cheerio = require('cheerio')
const app = express();

const fs = require('fs');
const bodyParser = require('body-parser');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/support_files'));
app.use(express.static(__dirname + '/img'));

// var content_pupload = getHTMLBody('./html_files/print_upload.html');

app.get('', (req, res) => {
	res.set('Content-Type', 'text/html');

	//send index.html
	var path = './html_files/index.html'
	res.write(fs.readFileSync(path, {encoding:'utf8'}));
	res.end();
});

app.post('/form', (req, res) => {
	console.log('request:');
	console.log(req.body);
	let form = req.body;
	console.log('new feed:');
	let feed = getNewFeed(form);
	res.send(feed);
})

app.listen(3000, ()=>{
	console.log('server is live');
})

function getHTMLBody(filepath)
{
	var html = fs.readFileSync(filepath).toString();
	//console.log(html);
	var $ = cheerio.load(html);
	var body = $('body').html().toString();
	return body;
}

function getNewFeed(form){
	var path = __dirname + '/html_files/form_template.html';
	var feed = fs.readFileSync(path).toString();
	var $ = cheerio.load(feed);
	$('#post_heading').html(getHTML_Category(form['category']) + form['heading']);
	$('#post_body').html(form['body']);

	var html_media = getHTML_Media(form['media'], form['vid_url'], form['image']);
	$('#post_media').html(html_media);
	$('#post_date').html(getCurrentDate());
	var body = $('body').html().toString();
	console.log(body);
	return body;
}

function getHTML_Category(x)
{
	if(x === 'hot')
	{
		return '<span role="img" aria-label="fire" id="post_category">🔥</span>';
	}
	else if(x === 'music')
	{
		return '<span role="img" aria-label="music" id="post_category">🎶</span>';
	}
	else if(x === 'thoughts')
	{
		return '<span role="img" aria-label="thoughts">💭</span>';
	}
}

function getHTML_Media(media, vid, img)
{
	if(media === 'vid')
	{
		return '<div class="embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item" width="560" height="315" src="' + vid + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
	}
	else if (media === 'img')
	{
		return '<img src="img/'+ img + '" class="post_media_image" id="#" style="align-self: center;">'
	}
	else
	{
		return '<img src="img/family.jpg" class="post_media_image" id="#" style="align-self: center;">'
	}
}

function getCurrentDate(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
	    dd = '0'+dd
	} 

	if(mm<10) {
	    mm = '0'+mm
	} 

	today = mm + '/' + dd + '/' + yyyy;
	return today;
}