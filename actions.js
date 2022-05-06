var actions =
{
	new_action: function(name, desc, wood_cost, food_cost, transform_type)
	{
		var eligible_function = function() { return game_stats.wood > this.wood_cost && game_state.food > this.food_cost; };
		var special_redemption_function = function(terrain_index) { map.replace_terrain(terrain_index, transform_type); };
		
		return this.new_action_ext(name, desc, wood_cost, food_cost, eligible_function, special_redemption_function);
	},
	
	new_action_ext: function(name, desc, wood_cost, food_cost, eligible_function, special_redemption_function)
	{
		return {
			name: name,
			desc: desc,
			wood_cost: wood_cost,
			food_cost: food_cost,
			eligible_function: eligible_function,
			special_redemption_function: special_redemption_function,
			redemption_function: function(terrain_index)
			{
				game_stats.wood -= this.wood_cost;
				game_stats.food -= this.food_cost;
				game_stats.days_until_winter -= this.time_cost;
				this.special_redemption_function(terrain_index);
			}
		};
	},
	
	setup_actions: function()
	{
		this.create_settlement = this.new_action(
			"Build Settlement", "Creates a settlement", 3 /*wood*/, 0 /*food*/
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