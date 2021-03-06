//This file is part of the game content, NOT part of the template
var game_state_manager =
{
	reload_action_state: true,
	
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
		game.aliens_negotiations = ['alien_images', 'alien_input', 'settings'];
		game.pre_war = ['squid_war_text', 'settings'];
		game.war = ['alien_war_text', 'war_district_1', 'war_district_2', 'war_district_3', 'settings'];
		game.post_war = ['alien_war_results', 'settings'];
	},
	
	load_state_ext: function(state)
	{
		if (state == 'aliens_negotiations')
		{
			aliens.setup_trades();
		}
		game.load_state(state);
		sound_manager.play_sound_by_name('click');
	},
	
	setup_page: function()
	{
		game_state_manager.load_state_ext('loading_state');
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
			name: 'music_track_1', file_name: 'pumpkinplanet-carbon-final.wav', is_music: true
		});
		audio_list.push({
			name: 'music_track_2', file_name: 'pumpkinplanet-industry-final.wav', is_music: true
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
		sound_manager.audio_loading_complete = true;
		sound_manager.set_track_levels();
		game_state_manager.load_state_ext('title_state');
	},

	begin_game_button: function()
	{
		game_state_manager.load_state_ext('intro_state');
		sound_manager.play_sound_by_name('click');
		sound_manager.play_cycling_music();
	},
	
	show_help: function()
	{
		$('#show_help_button').css('display', 'none');
		$('#show_help_button').css('visibility', 'hidden');
		
		$('#help_span').css('display', '');
		$('#help_span').css('visibility', 'visible');
	},
	
	hide_help: function()
	{
		$('#show_help_button').css('display', '');
		$('#show_help_button').css('visibility', 'visible');
		
		$('#help_span').css('display', 'none');
		$('#help_span').css('visibility', 'hidden');
	}
};