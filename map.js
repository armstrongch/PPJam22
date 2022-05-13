var map =
{
	terrain_list: [],
	
	initialize: function()
	{
		var random = [];
		for (let i = 0; i < 16; i += 1)
		{
			random.push(i);
		}
		random = utility.shuffle(random);
		
		for (let i = 0; i < 16; i += 1)
		{
			var type;
			switch (i)
			{
				case random[0]:
				case random[1]:
					type = terrain_types.forest;
					break;
				case random[2]:
					type = terrain_types.settlement;
					break;
				case random[3]:
					type = terrain_types.pumpkin_patch;
					break;
				default:
					type = terrain_types.field;
					break;
			}
			
			this.terrain_list.push(
					terrain.new_terrain(type, i)
				);
		}
	},
	
	replace_terrain: function(terrain_index, new_type)
	{
		this.terrain_list[terrain_index] = terrain.new_terrain(new_type, terrain_index);
		list_item.AddListItemsToRow('map', map.terrain_list, 'item_image_full');
	},
	
	add_terrain: function(new_type)
	{
		var new_terrain = terrain.new_terrain(new_type, this.terrain_list.length)
		this.terrain_list.push(new_terrain);
		list_item.AddListItemsToRow('map', map.terrain_list, 'item_image_full');
	},
	
	terrain_count: function(type)
	{
		var count = 0;
		
		for (let i = 0; i < this.terrain_list.length; i += 1)
		{
			if (this.terrain_list[i].type == type)
			{
				count += 1;
			}
		}
		
		return count;
	},
	
	perform_daily_actions: function()
	{
		for (let i = 0; i < this.terrain_list.length; i += 1)
		{
			if (this.terrain_list[i].daily_action != null)
			{
				this.terrain_list[i].daily_action();
			}
		}
	}
};