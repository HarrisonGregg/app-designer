/**
 * This is the file that will be creating the list view.
 */
/* global $, control, data */
'use strict';

if (JSON.parse(control.getPlatformInfo()).container === 'Chrome') {
    console.log('Welcome to Tables debugging in Chrome!');
    $.ajax({
        url: control.getFileAsUrl('output/debug/scan_example_data.json'),
        async: false,  // do it first
        success: function(dataObj) {
            if (dataObj === undefined || dataObj === null) {
                console.log('Could not load data json for table: plot');
            }
            window.data.setBackingObject(dataObj);
        }
    });
}

// Use chunked list view for larger tables: We want to chunk the displays so
// that there is less load time.
            
/**
 * Called when page loads. idxStart is the index of the row that should be
 * displayed at this iteration through the loop.
 */
var data = {};
var scan_out_dir = 'scan_output_directory';
var resumeFn = function(idxStart) {
    var scan_out_dir_value = util.getQueryParameter(scan_out_dir);

    // Our where clause is just going to be for this date.
    var whereClause = scan_out_dir + ' = ?';
    var selectionArgs = [scan_out_dir_value];

    // Manually set the data object to be correct
    data = control.query('scan_example', whereClause, selectionArgs);  
    //window.data.setBackingObject(data);

    console.log('resumeFn called. idxStart: ' + idxStart);
    // The first time through construct any constants you need to refer to
    // and set the click handler on the list elements.
    if (idxStart === 0) {
        // This add a click handler on the wrapper ul that will handle all of
        // the clicks on its children.
        $('#list').click(function(e) {
            var tableId = 'scan_example';
            // We have set the rowId while as the li id. However, we may have
            // clicked on the li or anything in the li. Thus we need to get
            // the original li, which we'll do with jQuery's closest()
            // method. First, however, we need to wrap up the target
            // element in a jquery object.
            // wrap up the object so we can call closest()
            var jqueryObject = $(e.target);
            // we want the closest thing with class item_space, which we
            // have set up to have the row id
            var containingDiv = jqueryObject.closest('.item_space');
            var rowId = containingDiv.attr('rowId');
            console.log('clicked with rowId: ' + rowId);
            // make sure we retrieved the rowId
            if (rowId !== null && rowId !== undefined) {
                // we'll pass null as the relative path to use the default file
                control.openDetailView(
                    tableId,
                    rowId,
                    'assets/scan_example/html/scan_example_detail.html');
            }
        });
    }
    
    return (function() {
        displayGroup(idxStart);
    }());
};
            
/**
 * Displays the list view in chunks. The number of list entries per chunk
 * can be modified. The list view is designed so that each row in the table is
 * represented as a list item. If you click a particular list item, it will
 * call the click handler defined in resumeFn. In the example case it opens
 * a detail view on the clicked row.
 */
var displayGroup = function(idxStart) {
    // Number of rows displayed per chunk
    var chunk = 50;
    for (var i = idxStart; i < idxStart + chunk; i++) {
        if (i >= data.getCount()) {
            break;
        }

        // Creates the space for a single element in the list. We add rowId as
        // an attribute so that the click handler set in resumeFn knows which
        // row was clicked.
        var item = $('<li>');
        item.attr('rowId', data.getRowId(i));
        item.attr('class', 'item_space');
        item.text(data.getData(i, 'name'));
                
        
        /* Creates arrow icon (Nothing to edit here) */
        var chevron = $('<img>');
        chevron.attr('src', control.getFileAsUrl('assets/img/little_arrow.png'));
        chevron.attr('class', 'chevron');
        item.append(chevron);

        var addrUriRelative = data.getData(i, 'address_image0.uriFragment');
        var addrSrc = '';
        if (addrUriRelative !== null && addrUriRelative !== "") {
            var addrUriAbsolute = control.getRowFileAsUrl(data.getTableId(), data.getRowId(i), addrUriRelative);
            addrSrc = addrUriAbsolute;
        }

        var imgDiv = $('<div>');
        var imgItem = $('<img>');
        imgItem.attr('src', addrSrc);
        imgItem.attr('class', 'thumbnail');
        imgDiv.append(imgItem);
        item.append(imgDiv);

        // Add any other details in your list item here.
                
        $('#list').append(item);
    }
    if (i < data.getCount()) {
        setTimeout(resumeFn, 0, i);
    }
};
