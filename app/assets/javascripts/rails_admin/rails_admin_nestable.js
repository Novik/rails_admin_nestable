$(document).on('ready pjax:end', function() 
{
	var $live_update, $tree_nodes, $tree_nodes_max_depth, $tree_nodes_options, $update_button, live_update_mode, updateNodes;
	updateNodes = function(tree_nodes) 
	{
		var serialized_tree;
		serialized_tree = tree_nodes.nestable('serialize');
		$update_button.addClass('busy');

		return $.ajax(
		{
			url: tree_nodes.data('update-path'),
			type: 'POST',
			dataType: 'json',
      			data: 
      			{
				tree_nodes: serialized_tree
      			},
			success: function(data) 
			{
				$('.links').each( function()
				{
					$(this).html( data[ $(this).data('id') ] );
				});
      			},
      			complete: function()
      			{
				$update_button.removeClass('busy');
      			}
    		});
  	};

	$tree_nodes = $('#tree_nodes');
	$tree_nodes_options = {};
	$tree_nodes_max_depth = $tree_nodes.data('max-depth');
	$live_update = $('#rails_admin_nestable input[type=checkbox]');
	$update_button = $('#rails_admin_nestable button');
	live_update_mode = !$live_update.length && !$update_button.length ? true : $live_update.prop('checked');
	$('#rails_admin_nestable button').prop('disabled', $live_update.prop('checked'));

	$live_update.off('change').change(function() 
	{
		live_update_mode = $(this).prop('checked');
	    	return $update_button.prop('disabled', live_update_mode);
  	});

	$update_button.off('click').click(function() 
	{
		return updateNodes($tree_nodes);
  	});

	if ($tree_nodes_max_depth && $tree_nodes_max_depth !== 'false') 
	{
		$tree_nodes_options['maxDepth'] = $tree_nodes_max_depth;
  	}

	return $tree_nodes.nestable($tree_nodes_options).off('change').on('change', function(event) 
	{
		if (live_update_mode) 
		{
			return updateNodes($tree_nodes);
		}
	});
});