var war =
{
	available_military: 0,
	
	player_allocations: {
		agricultural: {
			attackers: 0,
			defenders: 0,
		},
		industrial: {
			attackers: 0,
			defenders: 0,
		},
		residential: {
			attackers: 0,
			defenders: 0,
		}
	},
	
	squid_allocations: {
		agricultural: {
			attackers: 0,
			defenders: 0,
		},
		industrial: {
			attackers: 0,
			defenders: 0,
		},
		residential: {
			attackers: 0,
			defenders: 0,
		}
	},

	
	load_content: function()
	{
		$('#player_military').html(game_stats.military);
		$('#squid_military').html(aliens.squid_military.strength);
		this.available_military = game_stats.military;
		$('#unallocated_military').html(this.available_military);
		this.show_allocations();
		game_state_manager.load_state_ext('war');
		game_state_manager.reload_action_state = false;
	},
	
	show_allocations: function()
	{
		$('#ag_def_count').html(this.player_allocations.agricultural.defenders);
		$('#ag_atk_count').html(this.player_allocations.agricultural.attackers);
		
		$('#ind_def_count').html(this.player_allocations.industrial.defenders);
		$('#ind_atk_count').html(this.player_allocations.industrial.attackers);
		
		$('#res_def_count').html(this.player_allocations.residential.defenders);
		$('#res_atk_count').html(this.player_allocations.residential.attackers);
		
		$('#unallocated_military').html(this.available_military);
		
	},

	allocate: function(district, type)
	{
		if (this.available_military > 0)
		{
			this.player_allocations[district][type] += 1;
			this.available_military -= 1;
			this.show_allocations();
		}
	},
	
	reset_allocations: function()
	{
		this.available_military = game_stats.military;
		this.player_allocations.agricultural.defenders = 0;
		this.player_allocations.agricultural.attackers = 0;
		this.player_allocations.industrial.defenders = 0;
		this.player_allocations.industrial.attackers = 0;
		this.player_allocations.residential.defenders = 0;
		this.player_allocations.residential.attackers = 0;
		this.show_allocations();
	},
	
	allocate_for_squids: function()
	{
		var available_squids = aliens.squid_military.strength;
		var random_groups = [];
		for (let i = 0; i < 5; i += 1)
		{
			var random_int = Math.min
			(
				Math.max(
					Math.round(available_squids / (6-i) - 3 + Math.floor(Math.random() * 7)), 0
				),
				available_squids
			);
			available_squids -= random_int;
			random_groups.push(random_int);
		}
		random_groups.push(available_squids);
		random_groups = utility.shuffle(random_groups);
		
		this.squid_allocations.agricultural.defenders = random_groups[0];
		this.squid_allocations.agricultural.attackers = random_groups[1];
		this.squid_allocations.industrial.defenders = random_groups[2];
		this.squid_allocations.industrial.attackers = random_groups[3];
		this.squid_allocations.residential.defenders = random_groups[4];
		this.squid_allocations.residential.attackers = random_groups[5];
	},
	
	calculate_results: function()
	{
		this.allocate_for_squids();
		aliens.squid_military.strength = 0;
		game_stats.military = this.available_military;
		total_battle_html = "";
		
		total_battle_html += this.resolve_battle('player', 'agricultural', [terrain_types.field, terrain_types.forest, terrain_types.young_forest, terrain_types.pumpkin_patch]);
		total_battle_html += this.resolve_battle('player', 'industrial', [terrain_types.factory, terrain_types.mine, terrain_types.barracks]);
		total_battle_html += this.resolve_battle('player', 'residential', [terrain_types.barracks]);
		
		$('#war_results_span').html(total_battle_html);
		game_state_manager.load_state_ext('post_war');
		game_state_manager.reload_action_state = false;
	},
	
	resolve_battle: function(colony, district, associated_terrain)
	{
		var return_html = "";
		
		var random_indexes = [];
		for (let i = 0; i < map.terrain_list.length; i += 1) { random_indexes.push(i); }
		random_indexes = utility.shuffle(random_indexes);
		
		if (colony == 'player')
		{
			return_html += `<p>You allocated ${this.player_allocations[district].defenders} soldiers to defend your ${district} district. The squidlings sent ${this.squid_allocations[district].attackers} soldiers to attack.`;
			
			if (this.player_allocations[district].defenders >= this.squid_allocations[district].attackers)
			{
				return_html += " Your defenses held!</p>";
			}
			else
			{
				var casualties = false;
				for (let i = 0; i < random_indexes.length; i += 1)
				{
					var t = map.terrain_list[random_indexes[i]];
					
					if (associated_terrain.includes(t.type))
					{
						return_html += " A friendly " + t.terrain_name.toLowerCase() + " was destroyed.</p>";
						map.replace_terrain(random_indexes[i], terrain_types.crater);
						casualties = true;
					}
				}
				if (!casualties)
				{
					return_html += " There were no friendly casualties.</p>";
				}
			}
		}
		
		return return_html;
	}
};