var actions =
{
	new_action: function(name, desc, wood_cost, food_cost, transform_type)
	{
		var eligible_function = function() { return (game_stats.wood >= this.wood_cost || this.wood_cost == 0) && (game_stats.food >= this.food_cost || this.food_cost == 0); };
		var special_redemption_function = function(terrain_index) { map.replace_terrain(terrain_index, transform_type); };
		
		return this.new_action_ext(name, desc, wood_cost, food_cost, eligible_function, special_redemption_function, "", true);
	},
	
	new_action_ext: function(name, desc, wood_cost, food_cost, eligible_function, special_redemption_function, custom_requires_text, subtract_one_day)
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
				$('#daily_action_log').html('');
				game_stats.wood -= this.wood_cost;
				game_stats.food -= this.food_cost;
				if (subtract_one_day) {
					game_stats.days_until_winter -= 1;
					aliens.squid_military.develop();
				}
				this.special_redemption_function(terrain_index);
				map.perform_daily_actions();
				game_stats.show_game_info();
				
				if (game_stats.days_until_winter > 0)
				{
					if (game_state_manager.reload_action_state)
					{
						game_state_manager.load_state_ext('action_state');
					}
				}
				else
				{
					game_stats.show_year_end_info();
					game_state_manager.load_state_ext('year_end_state');
				}
				//pumpkin_save.save();
			}
		};
	},
	
	setup_actions: function()
	{
		this.create_young_forest = this.new_action(
			"Plant Trees", "Creates a sapling forest, which will grow into a full forest next year.", 0, 0, terrain_types.young_forest
		);
		
		this.create_pumpkin_patch = this.new_action(
			"Plant Pumpkins", "Creates a pumpkin patch, which can be harvested for food.", 1, 1, terrain_types.pumpkin_patch
		);
		
		this.create_settlement = this.new_action(
			"Build Settlement", "Creates a settlement", 3, 1, terrain_types.settlement
		);
		
		this.create_barracks = this.new_action(
			"Build Barracks", "Creates a barracks. During wartime, military strength is based on barracks.", 3, 1, terrain_types.barracks
		);
		
		this.create_factory = this.new_action(
			"Build Factory", "Creates a factory. Factories consume 1 wood and produce 2 food and 1 carbon every day.", 3, 0, terrain_types.factory
		);
		
		this.create_mine = this.new_action(
			"Build Mine", "Creates a mine. Mines double the wood and carbon output of factories.", 3, 0, terrain_types.mine
		);
		
		this.decomission = this.new_action(
			"Decomission", "Destroys this building.", 0, 0, terrain_types.crater
		);
		
		this.collect_wood = this.new_action_ext(
			"Harvest Wood", "Produces 1 wood per settlement.", 0, 0,
			function() { return map.terrain_count(terrain_types.forest) > 0 && map.terrain_count(terrain_types.settlement) > 0; },
			function() { game_stats.wood += map.terrain_count(terrain_types.settlement); game_stats.write_to_action_log("You harvested some wood."); },
			"Requires at least 1 settlement and 1 forest.",
			true
		);
		
		this.collect_pumpkins = this.new_action_ext(
			"Harvest Pumpkins", "Produces 1 food per settlement.", 0, 0,
			function() { return map.terrain_count(terrain_types.pumpkin_patch) > 0 && map.terrain_count(terrain_types.settlement) > 0; },
			function() { game_stats.food += map.terrain_count(terrain_types.settlement); game_stats.write_to_action_log("You harvested some pumpkins."); },
			"Requires at least 1 settlement and 1 pumpkin patch.",
			true
		);
		
		this.increase_military = this.new_action_ext(
			"Prepare for War", "Increases military strength by 1 per settlement", 0, 0,
			function() { return map.terrain_count(terrain_types.settlement) > 0; },
			function() { game_stats.military += map.terrain_count(terrain_types.settlement); game_stats.write_to_action_log("Your military strength increases."); },
			"Requires at least 1 settlement and 1 barracks.",
			true
		);
		
		this.scout = this.new_action_ext(
			"Gather Intel", "Sends scouts into squidling territory to assess their military strength.", 0, 0,
			function() { return true; },
			function() { game_stats.write_to_action_log(aliens.squid_military.get_info()); },
			"Requires at least 1 barracks.",
			true
		);
		
		this.declare_war = this.new_action_ext(
			"Declare War", "Initiate a military conflict against the squidling colony to the north.", 0, 0,
			function() { return game_stats.military >= 1; },
			function() { war.load_content(); },
			"Requires at least 1 military strength.",
			true
		);
		
		this.consume_forest = this.new_action_ext(
			"Consume Forest", "Destroys the forest, producing 15 wood.", 0, 0,
			function() { return true; },
			function(terrain_index) { game_stats.wood += 15; map.replace_terrain(terrain_index, terrain_types.crater); game_stats.write_to_action_log("You consumed a forest."); },
			"",
			true
		);
		
		this.consume_pumpkin_patch = this.new_action_ext(
			"Consume Pumpkin Patch", "Destroys the pumpkin patch, producing 30 food.", 0, 0,
			function() { return true; },
			function(terrain_index) { game_stats.food += 30; map.replace_terrain(terrain_index, terrain_types.crater); game_stats.write_to_action_log("You consumed a pumpkin patch."); },
			"",
			true
		);
		
		this.do_nothing = this.new_action_ext(
			"Do Nothing", "Does Nothing", 0, 0,
			function() { return true; },
			function(terrain_index) { /*do nothing*/ },
			"",
			true
		);
		
		//all the alien options need to bump the days until winter to offset
		this.accept_frog_trade = this.new_action_ext( "", "", 0, 0, function() { return true; },
			function(terrain_index)
			{
				game_stats.food -= 90;
				for (let i = 0; i < 4; i += 1)
				{
					map.add_terrain(terrain_types.field);
				}
			}, "", false
		);
		
		this.accept_squid_trade = this.new_action_ext( "", "", 0, 0, function() { return true; }, function(terrain_index) { game_stats.food -= game_stats.year*20; }, "", false);
		this.reject_squid_trade = this.new_action_ext( "", "", 0, 0, function() { return true; }, function(terrain_index) { game_stats.impending_squid_war = true; }, "", false);
		
		this.accept_duck_trade = this.new_action_ext( "", "", 0, 0, function() { return true; }, function(terrain_index) {
				game_stats.wood -= 50;
				game_stats.carbon -= 20;
				game_stats.days_until_winter += 4;
			}, "", false);
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