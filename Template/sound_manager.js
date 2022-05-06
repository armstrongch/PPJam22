var sound_manager =
{
	music_tracks: [],
	sounds: [],
	current_music_index: 0,
	playthrough_count: 0,
	load_fail_interval: null,
	
	load_audio: function(audio_list, complete_setup_function)
	{
		this.complete_setup_function = complete_setup_function;
		for (let i = 0; i < audio_list.length; i += 1)
		{
			this.load_audio_item(audio_list[i].name, audio_list[i].file_name, audio_list[i].is_music);
		}
		this.load_fail_interval = setInterval(sound_manager.failed_load, 5000);
	},
	
	//this function is not called directly by this object, so we cannot reference using 'this'
	failed_load: function()
	{
		clearInterval(sound_manager.load_fail_interval);
		sound_manager.load_fail_interval = null;
		$('#failed_to_load').append(
			"<p>Some audio failed to load. For the best experience, play the game via the itch site, not the desktop app.</p>"
		);
		sound_manager.complete_setup_function();
	},
	
	//this should not be called from outside sound_manager. Load audio in bulk via load_audio.
	load_audio_item: function(name, file_name, is_music)
	{
		$('#media').append(`<audio id='${name}' src='./Sounds/${file_name}' oncanplaythrough='sound_manager.check_loading_complete()'></audio>`);
		
		/*var audio_element = document.createElement('audio');
		audio_element.src = './Sounds/' + file_name;
		audio_element.oncanplaythrough = sound_manager.check_loading_complete;*/
		var sound = {
			name: name,
			audio_element: $('#'+name)[0]
		};
		
		if (is_music)
		{
			this.music_tracks.push(sound);
		}
		else
		{
			this.sounds.push(sound);
		}
	},
	
	//this function is not called directly by this object, so we cannot reference using 'this'
	check_loading_complete: function()
	{
		sound_manager.playthrough_count += 1;
		if (sound_manager.playthrough_count >= sound_manager.sounds.length + sound_manager.music_tracks.length)
		{
			for (let i = 0; i < sound_manager.music_tracks.length; i += 1)
			{
				sound_manager.music_tracks[i].audio_element.addEventListener('ended', sound_manager.cycle_music);
			}
			sound_manager.complete_setup_function();
		}
	},
	
	play_sound_by_name: function(name)
	{
		if ($('#sound_checkbox').is(':checked'))
		{
			for (let i = 0; i < this.sounds.length; i += 1)
			{
				if (this.sounds[i].name == name)
				{
					if (this.sounds[i].audio_element.paused)
					{
						this.sounds[i].audio_element.play();
					}
				}
			}
		}
	},
	
	play_cycling_music: function()
	{
		if ($('#music_checkbox').is(':checked'))
		{
			for (let i = 0; i < this.music_tracks.length; i += 1)
			{
				if (i == this.current_music_index)
				{
					this.music_tracks[i].audio_element.play();
				}
				else
				{
					this.music_tracks[i].audio_element.pause();
				}
			}
		}
	},
	
	//this function uses "sound_manager" insead of "this" so it can be used in an event listener for audio elements
	cycle_music: function()
	{
		sound_manager.current_music_index += 1;
		if (sound_manager.current_music_index >= sound_manager.music_tracks.length)
		{
			sound_manager.current_music_index = 0;
		}
		sound_manager.play_cycling_music();
	},
	
	music_toggle_change: function()
	{
		if ($('#music_checkbox').is(':checked'))
		{
			this.play_cycling_music();
		}
		else
		{
			for (let i = 0; i < this.music_tracks.length; i += 1)
			{
				this.music_tracks[i].audio_element.pause();
			}
		}
	}
};