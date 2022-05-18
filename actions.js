var actions =
{
	repeat_previous: function() {},
	
	new_action: function(id, name, desc, wood_cost, food_cost, transform_type)
	{
		var eligible_function = function() { return (game_stats.wood >= this.wood_cost || this.wood_cost == 0) && (game_stats.food >= this.food_cost || this.food_cost == 0); };
		var special_redemption_function = function(terrain_index) { map.replace_terrain(terrain_index, transform_type); };
		
		return this.new_action_ext(id, name, desc, wood_cost, food_cost, eligible_function, special_redemption_function, "", true, false);
	},
	
	new_action_ext: function(id, name, desc, wood_cost, food_cost, eligible_function, special_redemption_function, custom_requires_text, subtract_one_day, repeatable)
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
				
				if (game_state_manager.reload_action_state)
				{
					if (game_stats.days_until_winter > 0)
					{
						game_state_manager.load_state_ext('action_state');
					}
					else if (game_stats.impending_squid_war)
					{
						game_state_manager.load_state_ext('pre_war');
					}
					else
					{
						game_stats.show_year_end_info();
						game_state_manager.load_state_ext('year_end_state');
					}
				}
				
				$('#repeat_previous_button').prop('disabled', !repeatable);
				$('#previous_action_text').html('');
				if (repeatable)
				{
					$('#repeat_previous_button').removeAttr('onClick');
					$('#repeat_previous_button').attr('onClick', "actions['" + id + "'].redemption_function(-1)");
					
					$('#previous_action_text').html(" (" + this.name + ")");
				}
				
				//pumpkin_save.save();
			}
		};
	},
	
	setup_actions: function()
	{
		$('#repeat_previous_button').prop('disabled', true);
		
		this.create_young_forest = this.new_action(
			'create_young_forest', "Plant Trees", "Creates a sapling forest, which will grow into a full forest next year.", 0, 0, terrain_types.young_forest
		);
		
		this.create_pumpkin_patch = this.new_action(
			'create_pumpkin_patch', "Plant Pumpkins", "Creates a pumpkin patch, which can be harvested for food.", 1, 1, terrain_types.pumpkin_patch
		);
		
		this.create_settlement = this.new_action(
			'create_settlement', "Build Settlement", "Creates a settlement", 3, 1, terrain_types.settlement
		);
		
		this.create_barracks = this.new_action(
			'create_barracks', "Build Barracks", "Creates a barracks. During wartime, military strength is based on barracks.", 3, 1, terrain_types.barracks
		);
		
		this.create_factory = this.new_action(
			'create_factory', "Build Factory", "Creates a factory. Factories consume 1 wood and produce 2 food and 1 carbon every day.", 3, 0, terrain_types.factory
		);
		
		this.create_mine = this.new_action(
			'create_mine', "Build Mine", "Creates a mine. Mines double the wood and carbon output of factories.", 3, 0, terrain_types.mine
		);
		
		this.decomission = this.new_action(
			'decomission', "Decomission", "Destroys this building.", 0, 0, terrain_types.crater
		);
		
		this.collect_wood = this.new_action_ext(
			'collect_wood', "Harvest Wood", "Produces 1 wood per settlement.", 0, 0,
			function() { return map.terrain_count(terrain_types.forest) > 0 && map.terrain_count(terrain_types.settlement) > 0; },
			function() { game_stats.wood += map.terrain_count(terrain_types.settlement); game_stats.write_to_action_log("You harvested some wood."); },
			"Requires at least 1 settlement and 1 forest.",
			true, true
		);
		
		this.collect_pumpkins = this.new_action_ext(
			'collect_pumpkins', "Harvest Pumpkins", "Produces 1 food per settlement.", 0, 0,
			function() { return map.terrain_count(terrain_types.pumpkin_patch) > 0 && map.terrain_count(terrain_types.settlement) > 0; },
			function() { game_stats.food += map.terrain_count(terrain_types.settlement); game_stats.write_to_action_log("You harvested some pumpkins."); },
			"Requires at least 1 settlement and 1 pumpkin patch.",
			true, true
		);
		
		this.increase_military = this.new_action_ext(
			'increase_military', "Prepare for War", "Increases military strength by 1 per settlement", 0, 0,
			function() { return map.terrain_count(terrain_types.settlement) > 0; },
			function() { game_stats.military += map.terrain_count(terrain_types.settlement); game_stats.write_to_action_log("Your military strength increases."); },
			"Requires at least 1 settlement and 1 barracks.",
			true, true
		);
		
		this.scout = this.new_action_ext(
			'scout', "Gather Intel", "Sends scouts into squidling territory to assess their military strength.", 0, 0,
			function() { return true; },
			function() { game_stats.write_to_action_log(aliens.squid_military.get_info()); },
			"Requires at least 1 barracks.",
			true, false
		);
		
		this.declare_war = this.new_action_ext(
			'declare_war', "Declare War", "Initiate a military conflict against the squidling colony to the north.", 0, 0,
			function() { return game_stats.military >= 1; },
			function() { war.load_content(); },
			"Requires at least 1 military strength.",
			false, false
		);
		
		this.consume_forest = this.new_action_ext(
			'consume_forest', "Consume Forest", "Destroys the forest, producing 15 wood.", 0, 0,
			function() { return true; },
			function(terrain_index) { game_stats.wood += 15; map.replace_terrain(terrain_index, terrain_types.crater); game_stats.write_to_action_log("You consumed a forest."); },
			"",
			true, false
		);
		
		this.consume_pumpkin_patch = this.new_action_ext(
			'consume_pumpkin_patch', "Consume Pumpkin Patch", "Destroys the pumpkin patch, producing 30 food.", 0, 0,
			function() { return true; },
			function(terrain_index) { game_stats.food += 30; map.replace_terrain(terrain_index, terrain_types.crater); game_stats.write_to_action_log("You consumed a pumpkin patch."); },
			"",
			true, false
		);
		
		this.do_nothing = this.new_action_ext(
			'do_nothing', "Do Nothing", "Does Nothing", 0, 0,
			function() { return true; },
			function(terrain_index) { /*do nothing*/ },
			"",
			true, false
		);
		
		//Same as "Do Nothing", but does not use a day of time.
		this.do_nothing_no_time = this.new_action_ext(
			'do_nothing_no_time', "", "", 0, 0,
			function() { return true; },
			function(terrain_index) { /*do nothing*/ },
			"",
			false, false
		);
		
		//all the alien options need to bump the days until winter to offset
		this.accept_frog_trade = this.new_action_ext( 'accept_frog_trade', "", "", 0, 0, function() { return true; },
			function(terrain_index)
			{
				game_stats.target_food += 90;
				for (let i = 0; i < 4; i += 1)
				{
					map.add_terrain(terrain_types.field);
				}
			}, "", false, false
		);
		
		this.accept_squid_trade = this.new_action_ext( 'accept_squid_trade', "", "", 0, 0, function() { return true; }, function(terrain_index) { game_stats.target_food += game_stats.year*20; }, "", false, false);
		this.reject_squid_trade = this.new_action_ext( 'reject_squid_trade', "", "", 0, 0, function() { return true; }, function(terrain_index) { game_stats.impending_squid_war = true; }, "", false, false);
		
		this.accept_duck_trade = this.new_action_ext( 'accept_duck_trade', "", "", 0, 0, function() { return true; }, function(terrain_index) {
				game_stats.target_wood += 50;
				game_stats.carbon -= 20;
				game_stats.days_until_winter += 4;
			}, "", false, false);
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