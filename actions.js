var actions =
{
	new_action: function(name, desc, wood_cost, food_cost, transform_type)
	{
		var eligible_function = function() { return game_stats.wood >= this.wood_cost && game_stats.food >= this.food_cost; };
		var special_redemption_function = function(terrain_index) { map.replace_terrain(terrain_index, transform_type); };
		
		return this.new_action_ext(name, desc, wood_cost, food_cost, eligible_function, special_redemption_function, "");
	},
	
	new_action_ext: function(name, desc, wood_cost, food_cost, eligible_function, special_redemption_function, custom_requires_text)
	{
		return {
			name: name,
			desc: desc,
			wood_cost: wood_cost,
			food_cost: food_cost,
			eligible_function: eligible_function,
			special_redemption_function: special_redemption_function,
			custom_requires_text: custom_requires_text,
			redemption_function: function(terrain_index)
			{
				game_stats.wood -= this.wood_cost;
				game_stats.food -= this.food_cost;
				game_stats.days_until_winter -= 1;
				this.special_redemption_function(terrain_index);
				game_stats.show_game_info();
				if (game_stats.days_until_winter > 0)
				{
					game.load_state('action_state');
				}
				else
				{
					game.load_state('year_end_state');
				}
			}
		};
	},
	
	setup_actions: function()
	{
		this.create_young_forest = this.new_action(
			"Plant Trees", "Creates a sapling forest, which will grow into a full forest next year.", 0, 0, terrain_types.young_forest
		);
		
		this.create_pumpkin_patch = this.new_action(
			"Plant Pumpkins", "Creates a pumpkin patch, which can be harvested for food.", 0, 0, terrain_types.pumpkin_patch
		);
		
		this.create_settlement = this.new_action(
			"Build Settlement", "Creates a settlement", 3, 0, terrain_types.settlement
		);
		
		this.collect_wood = this.new_action_ext(
			"Collect Wood", "Produces 1 wood per settlement per forest.", 0, 0,
			function() { return map.terrain_count(terrain_types.forest) > 0 && map.terrain_count(terrain_types.settlement) > 0; },
			function() { game_stats.wood += map.terrain_count(terrain_types.forest)*map.terrain_count(terrain_types.settlement); },
			"Requires at least 1 settlement and 1 forest."
		);
	}
};


/*
barracks: 0,
crater: 1,
factory: 2,
field: 3,
forest: 4,
mine: 5,
pumpkin_patch: 6,
settlement: 7,
young_forest: 8
*/