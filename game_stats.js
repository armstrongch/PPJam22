var game_stats = 
{
	year: 1,
	food: 0,
	wood: 0,
	days_until_winter: 100,
	
	show_game_info: function()
	{
		$('#game_info_p').html(
			`Year: ${this.year}&emsp;Food: ${this.food}&emsp;Wood: ${this.wood}&emsp;Days Until Winter: ${this.days_until_winter}`
		);
	}
};