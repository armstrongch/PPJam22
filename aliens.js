var aliens = 
{
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
	}
};