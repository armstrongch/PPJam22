var map =
{
	terrain_list: [],
	
	initialize: function()
	{
		for (let i = 0; i < 16; i += 1)
		{
			var type = terrain_types.field;
			if (i % 3 == 0)
			{
				type = terrain_types.forest;
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
	}
};