var game_stats = 
{
	year: 1,
	food: 0,
	wood: 0,
	carbon: 0,
	days_until_winter: 20,
	
	show_game_info: function()
	{
		$('#game_info_p').html(
			`Year: ${this.year}&emsp;Food: ${this.food}&emsp;Wood: ${this.wood}&emsp;Carbon: ${this.carbon}&emsp;Days Until Winter: ${this.days_until_winter}`
		);
	},
	
	write_to_action_log: function(text)
	{
		$('#daily_action_log').html($('#daily_action_log').html() + `<p>${text}</p>`);
	}
};