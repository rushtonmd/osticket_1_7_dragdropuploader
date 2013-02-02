/*************************************************************************
    uploader.js
 
    Mark D Rushton <mark@rushtonmd.com>
    Copyright (c)  2013

    Released under the GNU General Public License WITHOUT ANY WARRANTY.

**********************************************************************/

// Create a global namespace for settings
var DragDropLib = {};

// Document Ready - Setup All The Things!
$(function() {
    
    // Verify compatability of browser
   if (typeof window.File === "undefined" || 
        typeof window.FileReader === "undefined" || 
        typeof window.FileList === "undefined" || 
        typeof window.Blob === "undefined") {	
            return false;
        };
    
   DragDropLib.setConfigurationSettings();

   // At this point, check to see if the container we made exists.
   // If it doesn't, something we'd wrong and we need to bail 
   if(!DragDropLib.initializeDiv() || !DragDropLib.setupListeners()) return false;
   
   // The div exists!!
   
   // At this point, everything looks good and you're ready to upload!
   
   return true;
   
});
 
DragDropLib.setConfigurationSettings =  function(){

   // jQuery creates it's own event object, and it doesn't have a
   // dataTransfer property yet. This adds dataTransfer to the event object.
    jQuery.event.props.push('dataTransfer');
   
    // All the configuration settings for the library
    
   DragDropLib.divContainerName = 'dragDropArea';
   DragDropLib.initialMessage = 'Drop files here...';
   DragDropLib.divContainerID = '#' + DragDropLib.divContainerName; // This just helps make jquery calls a little cleaner
   DragDropLib.divContainerTextID = DragDropLib.divContainerID + ' H1';
   DragDropLib.query_id = DragDropLib.getQueryParam('id');
   DragDropLib.uploadUrl = $('#reply').attr('action');
   
   DragDropLib.ticket_id = $("input:hidden[name=id]").val();
   DragDropLib.token = $("input:hidden[name=__CSRFToken__").val();
   
   DragDropLib.reloadUrl = DragDropLib.uploadUrl.split('#')[0];
   
   DragDropLib.msg_id = $("input:hidden[name=msgId]").val();

   // These are used for the dynamic tracking of file uploads
   DragDropLib.totalFilesDropped = 0;
   DragDropLib.totalFilesUploaded = 0;
   DragDropLib.filesDropped = [];
};

DragDropLib.initializeDiv = function(){
    
   // Find the div that has the attachments upload input, and insert a div for our drag-drop box
   $('#reply_form_attachments').parent().after('<tr><td width="160"></td><td width="765"><div id="'+ DragDropLib.divContainerName + '" class="uploadArea"></div></td></tr>');

   
   $(DragDropLib.divContainerID).append('<h1>'+DragDropLib.initialMessage+'</h1> <div id="loadingBar"><div id="loadingProgressG" style="margin-left: auto; margin-right: auto; margin-top: 60px;"><div id="loadingProgressG_1" class="loadingProgressG"></div></div></div>');

   // This function returns false if the div wasn't created properly
   return ($(DragDropLib.divContainerID).length); 
};

DragDropLib.setupListeners = function(){

    // Setup the listeners for the drag drop area
    $(DragDropLib.divContainerID).bind('dragover', DragDropLib.dragOverEvent);
    $(DragDropLib.divContainerID).bind('dragleave', DragDropLib.dragLeaveEvent);
    $(DragDropLib.divContainerID).bind('drop', DragDropLib.dropEvent);
    
    return true;
};
  
DragDropLib.dragOverEvent = function(e){
    
    // Stop any default behaviors
    e.stopPropagation(); 
    e.preventDefault(); 
    
    // Add the class 'hover' to the drag drop area
    $(DragDropLib.divContainerID).addClass('hover');
    
};

DragDropLib.dragLeaveEvent = function(e){
    
    // Remove the class 'hover' to the drag drop area
    $(DragDropLib.divContainerID).removeClass('hover');
};

DragDropLib.dropEvent = function(e){
    
    // Stop any default behaviors
    e.stopPropagation(); 
    e.preventDefault();

    // Add the class 'hover' to the drag drop area
    $(DragDropLib.divContainerID).removeClass('hover');

    // Get all the files that were dropped
    DragDropLib.filesDropped = e.dataTransfer.files;
    DragDropLib.totalFilesDropped = e.dataTransfer.files.length;
    DragDropLib.totalFilesUploaded = 0;

    // Set the text of the feedback text
    //$(DragDropLib.divContainerTextID).text('0'+' of '+ DragDropLib.totalFilesDropped +' uploaded.');
    $(DragDropLib.divContainerTextID).text('Uploading files')
    
    // Show the loading progress bar
    $('#loadingBar').show();

    // Loop through the files and uplaod
    //for (var i = 0; i < DragDropLib.totalFilesDropped; i++) {
        
        var data = new FormData();

            // Create the form element
            data.append('id', DragDropLib.ticket_id);
            data.append('msgId', DragDropLib.msg_id);
            data.append('__CSRFToken__', DragDropLib.token);
            data.append('a', 'reply');
            data.append('response', ' ' + $('#response').val()); // There has to be a response, even if it's a space character
            
            for (var ii = 0; ii < DragDropLib.filesDropped.length; ii++) {
                data.append('attachments[]', DragDropLib.filesDropped[ii]);
              }
            //data.append('attachments[]',DragDropLib.filesDropped);
            
            // Make the ajax request
            $.ajax({
                    type:"POST",
                    url:DragDropLib.uploadUrl,
                    data:data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success:function(rponse){
                            console.log(rponse);
                            // All files are finished, replace the list with the response list
                                $(DragDropLib.divContainerTextID).text('Finishing up');
                                
                                // Ensure there are no alert messages currently on the page
                                $('#msg_error').remove();
                                $('#msg_notice').remove();
                                
                                // Refresh the reply list and error messages
                                $('#ticket_thread').fadeOut("slow", function(){
                                    var newDiv = $('#ticket_thread', $(rponse)).css({ opacity: 0.0 });
                                    $(this).replaceWith(newDiv);
                                    $('#ticket_thread').fadeTo('slow',1.0);
                                    $('#loadingBar').hide();
                                    $(DragDropLib.divContainerTextID).text(DragDropLib.initialMessage);
                                    
                                    // Add any errors or notices
                                    $('#response_options').before(($('#msg_error', $(rponse)).first()));
                                    $('#response_options').before(($('#msg_notice', $(rponse)).first()));
                                });
                                
                                       
                    },
                    error:function(rponse){
                        // There was an error with the upload
                        alert("There was a problem with your upload!");
                        window.location = DragDropLib.reloadUrl;
                    }
            });
      //}
  
};

DragDropLib.getQueryParam = function(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
};

 
