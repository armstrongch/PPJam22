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
			var type = terrain_types.field;
			if (i == random[0] || i == random[2])
			{
				type = terrain_types.forest;
			}
			else if (i == random[3])
			{
				type = terrain_types.settlement;
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
	}
};