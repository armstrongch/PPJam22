var lists =
{
	generate_dropdown_from_list: function(array_list, select_id)
	{
		var return_html = "<select id='" + select_id + "'>";
		for (let i = 0; i < array_list.length; i += 1)
		{
			var temp_item = array_list[i];
			return_html += "<option value='" + temp_item.item_name + "'>";
			return_html += temp_item.item_name;
			return_html += "</option>";
		}
		return_html += "</select";
		
		return return_html;
	},
	
	generate_dropdown_submission_button: function(select_id, button_text, button_function_name)
	{
		var return_html = `<button onclick='${button_function_name}("${select_id}")'>`;
		return_html += button_text;
		return_html += "</button>";
		return return_html;
	}
};