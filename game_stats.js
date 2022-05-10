var game_stats = 
{
	year: 1,
	food: 0,
	wood: 0,
	carbon: 0,
	days_until_winter: 20,
	target_food: 60,
	
	show_game_info: function()
	{
		$('#game_info_p').html(
			`Year: ${this.year}&emsp;Food: ${this.food}&emsp;Wood: ${this.wood}&emsp;Carbon: ${this.carbon}&emsp;Days Until Winter: ${this.days_until_winter}`
		);
	},
	
	write_to_action_log: function(text)
	{
		$('#daily_action_log').html($('#daily_action_log').html() + `<p>${text}</p>`);
	},
	
	show_year_end_info: function()
	{
		var year_end_html = `<p>Year ${this.year} complete. You produced ${this.food} of the required ${this.target_food} food.</p>`;
		
		if (this.food < this.target_food)
		{
			year_end_html += "<p>The pumpkin planet will not be the the fresh start that humanity had hoped for.</p>";
			year_end_html += "<p><button onclick='location.reload()'>Try Again</button></p>";
		}
		else
		{
			this.days_until_winter = 20;
			this.food -= this.target_food;
			
			var sapling_count = map.terrain_count(terrain_types.young_forest);
			if (sapling_count > 0)
			{
				for (let i = 0; i < 16; i += 1)
				{
					if (map.terrain_list[i].type == terrain_types.young_forest)
					{
						map.replace_terrain(i, terrain_types.forest);
					}
				}
				year_end_html += `<p>The sapling forests grew into full forests.</p>`;
			}
			
			if (this.carbon > 0)
			{
				year_end_html += `<p>You produced ${this.carbon} carbon. Each forest can consume up to 5 carbon`;
				this.carbon = Math.max(this.carbon - map.terrain_count(terrain_types.forest)*5, 0);
				year_end_html += `, reducing your total carbon to ${this.carbon}.</p>`;
				
				if (this.carbon > 0)
				{
					this.days_until_winter = Math.max(this.days_until_winter - Math.ceil(this.carbon/5), 0);
					
					year_end_html += `<p>The remaining carbon warms the planet. Every 5 units of carbon reduces the length of the 20-day harvest season by 1 day. The next harvest season will last ${this.days_until_winter} days.</p>`;
				}
			}
			
			if (this.days_until_winter > 0)
			{
				this.year += 1;
				year_end_html += `<p><button onclick="game.load_state('action_state')">Begin Year ${this.year}</button></p>`;
			}
			else
			{
				year_end_html += "<p>It is no longer possible to grow food on the pumpkin planet.</p>";
				year_end_html += "<p><button onclick='location.reload()'>Try Again</button></p>";
			}
		}
		
		game_stats.show_game_info();
		$('#year_end_summary').html(year_end_html);
		$('#daily_action_log').html('');
	},
};