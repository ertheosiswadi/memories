console.log('Hi Im at Handler!');
$(document).ready(function() {
	$('#post_button').click(function(){
		let category = $('#select_category').val();
		let heading = $('#select_heading').val();
		let body = $('#select_body').val();
		let media = 'img';
		let vid_url = 'null', image_filename = 'null';
		if($('#select_radio_vid').is(':checked'))
		{
			media = 'vid';
		}
		//if none is checked
		if(!$('#select_radio_vid').is(':checked') && !$('#select_radio_img').is(':checked'))
		{
			media = 'none';
		}
		if(media === 'vid')
		{
			vid_url = YouTubeGetUrl($('#select_vid_url').val());
		}
		if(media === 'img')
		{
			image_filename = $('#select_image').val();
		}

		let form = {
			category: category,
			heading: heading,
			body: body,
			media: media,
			vid_url: vid_url,
			image: image_filename
		}
		console.log(form);

		$.ajax({
			type: "POST",
			url: '/form',
			data: form,
			success: function(data){
				var newFeed = data.toString();
				$('#feed').append(newFeed);

			},
			dataType: 'html'
		});
	})

})

function YouTubeGetUrl(url){
  var ID = '';
  url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if(url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = ID[0];
  }
  else {
    ID = url;
  }
    return 'https://www.youtube.com/embed/' + ID;
}