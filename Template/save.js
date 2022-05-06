var save =
{
	save_mode: 'server',
	save_list: [],
	save_file_name: 'save_game',
	
	initialize_save: function(save_file_name)
	{
		test_save_list = [{key: 'test', value: 'test'}];
		this.save(test_save_list);
		var test_load_list = this.load();
		if (test_load_list.length == 0)
		{
			this.save_mode = 'local';
			$('#save_button').html("<button onclick='save.save_local()'>Save Game</button>");
			$('#load_button').html("<p><label for ='load_input'>Load Save Game: </label><input type='file' id='load_input'/></p>");
			$("#load_input").on('change', function() { save.load_file(this.files[0]); });
			this.save_file_name = save_file_name;
		}
	},
	
	//saves a list of key-value pairs
	save: function(save_list)
	{
		if (this.save_mode == 'server')
		{
			this.auto_save(save_list);
		}
		else
		{
			this.save_list = save_list;
		}
	},
	
	load: function()
	{
		if (this.save_mode == 'server')
		{
			return this.load_server();
		}
		else
		{
			return this.save_list;
		}
	},
	
	save_local: function()
	{
		var fileContent = "";
		for (let i = 0; i < this.save_list.length; i += 1)
		{
			fileContent += this.save_list[i].key + "=" + this.save_list[i].value + ";";
		}
		var bb = new Blob([fileContent ], { type: 'text/plain' });
		var a = document.createElement('a');
		a.download = this.save_file_name + '.sav';
		a.href = window.URL.createObjectURL(bb);
		a.click();
	},
	
	auto_save: function(save_list)
	{
		var path = "path=\;";
		const d = new Date();
		d.setTime(d.getTime() + (365*24*60*1000));
		var expires = "expires=" + d.toUTCString() + ";";
		var same_site = "SameSite=None;secure;";
		
		for (let i = 0; i < save_list.length; i += 1)
		{
			var new_cookie = save_list[i].key + "=" +  save_list[i].value + ";";
			new_cookie += path;
			new_cookie += same_site;
			new_cookie += expires;
			document.cookie = new_cookie;
		}
	},
	
	load_server: function()
	{
		var load_list = [];
		var split_cookies = document.cookie.split(';');
		for (let i = 0; i < split_cookies.length; i += 1)
		{
			var key_value_array = split_cookies[i].split('=');
			if (key_value_array.length > 1)
			{
				load_list.push(
					{ 
						key: key_value_array[0].slice().trim(),
						value: key_value_array[1].slice().trim()
					}
				);
			}
		}
		return load_list;
	},
	
	load_file: function(file)
	{
		if (typeof file !== 'undefined')
		{
			this.save_list = [];
			var reader = new FileReader();
			reader.readAsText(file,'UTF-8');
			reader.onload = readerEvent =>
			{
				var split_cookies = readerEvent.target.result.split(';');
				for (let i = 0; i < split_cookies.length; i += 1)
				{
					var key_value_array = split_cookies[i].split('=');
					if (key_value_array.length > 1)
					{
						this.save_list.push(
							{ 
								key: key_value_array[0].slice().trim(),
								value: key_value_array[1].slice().trim()
							}
						);
					}
				}
			}
		}
	}
};