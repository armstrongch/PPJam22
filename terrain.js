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
			actions: []
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
				break;
			
			case terrain_types.mine:
				t.terrain_name = "Mine";
				t.image_file_name = "mine.png";
				break;
			
			case terrain_types.pumpkin_patch:
				t.terrain_name = "Pumpkin Patch";
				t.image_file_name = "pumpkin_patch.png";
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
				break;
				
			case terrain_types.field:
			default:
				t.terrain_name = "Field";
				t.image_file_name = "field.png";
				t.actions.push("create_young_forest");
				t.actions.push("create_pumpkin_patch");
				t.actions.push("create_settlement");
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
		game.load_state('confirm_action_state');
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