var pumpkin_save =
{
	//It's not reasonable to get this working by the end of the jam. Maybe I'll add save/load for a post-jam update.
	current_state: 'intro_state',
	
	save: function()
	{
		var save_list = [];
		
		save_list.push({ key: 'year', value: game_stats.year });
		save_list.push({ key: 'food', value: game_stats.food });
		save_list.push({ key: 'wood', value: game_stats.wood });
		save_list.push({ key: 'carbon', value: game_stats.carbon });
		save_list.push({ key: 'days_until_winter', value: game_stats.days_until_winter });
		save_list.push({ key: 'impending_squid_war', value: game_stats.impending_squid_war });
		save_list.push({ key: 'current_state', value: this.current_state });
		
		for (let i = 0; i < map.terrain_list.length; i += 1)
		{
			save_list.push({ key: 'map_terrain', value: map.terrain_list[i].type });
		}
		
		save.save(save_list);
	},
	
	load: function()
	{
		var load_list = save.load();
		if (load_list.length > 1) //excludes test cookie
		{
			map.terrain_list = [];
			for (let i = 0; i < load_list.length; i += 1)
			{
				switch (load_list[i].key)
				{
					case "year":
						game_stats.year = parseInt(load_list[i].value);
						break;
					case "food":
						game_stats.food = parseInt(load_list[i].value);
						break;
					case "wood":
						game_stats.wood = parseInt(load_list[i].value);
						break;
					case "carbon":
						game_stats.carbon = parseInt(load_list[i].value);
						break;
					case "days_until_winter":
						game_stats.days_until_winter = parseInt(load_list[i].value);
						break;
					case "impending_squid_war":
						game_stats.impending_squid_war = (load_list[i].value == 'true');
						break;
					case "current_state":
						this.current_state = load_list[i].value;
						game_state_manager.load_state_ext(this.current_state);
						break;
					case "map_terrain":
						map.add_terrain(parseInt(load_list[i].value));
						break;
				}
			}
			
			list_item.AddListItemsToRow('map', map.terrain_list, 'item_image_full');
			game_stats.show_game_info();
		}
	}
};