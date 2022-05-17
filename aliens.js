var aliens = 
{
	squid_military: {
		strength: 0,
		
		settlement_count: 1,
		patch_count: 1,
		barracks_count: 0,
		
		state: 'gather',
		
		develop: function()
		{
			if (this.barracks_count == 0)
			{
				this.barracks_count += 1;
			}
			else if (this.patch_count == 0)
			{
				this.patch_count += 1;
			}
			else if (this.state == 'build')
			{
				this.settlement_count += 1;
				this.state = 'gather';
			}
			else if (this.state == 'gather')
			{
				this.state = 'grow';
			}
			else
			{
				this.strength += this.settlement_count;
				this.state = 'build';
			}
		},
		
		get_info: function()
		{
			return `The squidlings have amassed ${this.strength} military strength. Their colony contains ${this.settlement_count} settlements, ${this.patch_count} pumpkin patches, and ${this.barracks_count} barracks.`;
		}
	},
	
	process_alien_trades: function()
	{
		if ($('input[name="frog_trade"]:checked').val() == 'accept')
		{
			actions['accept_frog_trade'].redemption_function(-1);
		}
		
		if ($('input[name="squid_trade"]:checked').val() == 'accept')
		{
			actions['accept_squid_trade'].redemption_function(-1);
		}
		else
		{
			actions['reject_squid_trade'].redemption_function(-1);
		}
		
		if ($('input[name="duck_trade"]:checked').val() == 'accept')
		{
			actions['accept_duck_trade'].redemption_function(-1);
		}
		game_state_manager.load_state_ext('action_state');
	},
	
	setup_trades: function()
	{
		$('#tribute_value').html(game_stats.year*20);
	}
};