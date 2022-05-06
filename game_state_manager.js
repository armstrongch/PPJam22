//This file is part of the game content, NOT part of the template
var game_state_manager =
{

	setup_game: function()
	{
		this.init_states();
		this.setup_page();
	},
	
	init_states: function()
	{
		game.loading_state = ['loading'];
		game.title_state = ['title', 'settings'];
		game.intro_state = ['story_intro', 'settings'];
		game.action_state = ['game_info', 'map', 'settings'];
		game.confirm_action_state = ['game_info','action_confirmation', 'settings'];
		game.year_end_state = ['year_end', 'settings'];
	},
	
	setup_page: function()
	{
		game.load_state('loading_state');
		save.initialize_save('pumpkin_planet');
		map.initialize();
		actions.setup_actions();
		list_item.AddListItemsToRow('map', map.terrain_list, 'item_image_full');
		game_stats.show_game_info();
		
		this.load_audio(this.complete_setup);
	},
	
	load_audio: function(complete_setup_function)
	{
		var audio_list = [];
		audio_list.push({
			name: 'music_track_1', file_name: 'placeholder_song.mp3', is_music: true
		});
		audio_list.push({
			name: 'music_track_2', file_name: 'placeholder_song2.mp3', is_music: true
		});
		audio_list.push({
			name: 'click', file_name: 'placeholder_sound.wav', is_music: false
		});
		
		sound_manager.load_audio(audio_list, complete_setup_function);
	},
	
	complete_setup: function()
	{
		clearInterval(sound_manager.load_fail_interval);
		sound_manager.load_fail_interval = null;
		game.load_state('title_state');
	},

	begin_game_button: function()
	{
		game.load_state('intro_state');
	},
};