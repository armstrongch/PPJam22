var terrain = 
{
	new_terrain: function(type, index)
	{
		var t = 
		{
			index: index,
			item_text: "",
			image_onclick: `terrain.show_terrain_info(${index})`,
			type: type,
			actions: [],
			daily_action: null
		}
		
		switch(type)
		{
			case terrain_types.barracks:
				t.terrain_name = "Barracks";
				t.image_file_name = "barracks.png";
				break;
			case terrain_types.crater:
				t.terrain_name = "Crater";
				t.image_file_name = "crater.png";
				break;
			
			case terrain_types.factory:
				t.terrain_name = "Factory";
				t.image_file_name = "factory.png";
				t.actions.push("decomission");
				t.daily_action = function()
				{
					if (game_stats.wood >= 1)
					{
						game_stats.wood -= 1;
						var carbon_produced = 1 * Math.pow(2, map.terrain_count(terrain_types.mine));
						var food_produced = carbon_produced * 2;
						game_stats.carbon += carbon_produced;
						game_stats.food += food_produced;
						game_stats.write_to_action_log(`A factory consumed 1 wood, and produced ${carbon_produced} carbon and ${food_produced} food.`);
					}
					else
					{
						game_stats.write_to_action_log('A factory did not have enough wood.');
					}
				}
				break;
			
			case terrain_types.mine:
				t.terrain_name = "Mine";
				t.image_file_name = "mine.png";
				t.actions.push("decomission");
				break;
			
			case terrain_types.pumpkin_patch:
				t.terrain_name = "Pumpkin Patch";
				t.image_file_name = "pumpkin_patch.png";
				t.actions.push("collect_pumpkins");
				t.actions.push("consume_pumpkin_patch");
				break;
			
			case terrain_types.settlement:
				t.terrain_name = "Settlement";
				t.image_file_name = "settlement.png";
				break;
			
			case terrain_types.young_forest:
				t.terrain_name = "Sapling Forest";
				t.image_file_name = "young_forest.png";
				break;
			
			case terrain_types.forest:
				t.terrain_name = "Forest";
				t.image_file_name = "forest.png";
				t.actions.push("collect_wood");
				t.actions.push("consume_forest");
				break;
				
			case terrain_types.field:
			default:
				t.terrain_name = "Field";
				t.image_file_name = "field.png";
				t.actions.push("create_young_forest");
				t.actions.push("create_pumpkin_patch");
				t.actions.push("create_settlement");
				t.actions.push("create_factory");
				t.actions.push("create_mine");
				t.actions.push("create_barracks");
				break;
		}
		
		return t;
	},
	
	show_terrain_info: function(index)
	{
		var selected_terrain = map.terrain_list[index];
		
		var action_content = `<h2>${selected_terrain.terrain_name}</h2><br/><img src="Images/${selected_terrain.image_file_name}" style='display: inline-block'><br/>`;
		for (let i = 0; i < selected_terrain.actions.length; i += 1)
		{
			var action = actions[selected_terrain.actions[i]];
			var eligible = action.eligible_function();
			
			var disabled_onclick = eligible ? `onclick="actions['${selected_terrain.actions[i]}'].redemption_function(${index})"` : 'disabled';
			var disabled_styling = eligible ? 'green_color' : 'yellow_color';
			
			var requires_text = `Requires ${action.food_cost} food, ${action.wood_cost} wood.`;
			if (action.custom_requires_text != "")
			{
				requires_text = action.custom_requires_text
			}
			
			action_content += `<p><button ${disabled_onclick}>${action.name}: ${action.desc} - <span style="color: var(--${disabled_styling})">${requires_text}</span></button></p>`;
		}			
		$('#action_content').html(action_content);
		game_state_manager.load_state_ext('confirm_action_state');
	},
};

var terrain_types =
{
	barracks: 0,
	crater: 1,
	factory: 2,
	field: 3,
	forest: 4,
	mine: 5,
	pumpkin_patch: 6,
	settlement: 7,
	young_forest: 8
}