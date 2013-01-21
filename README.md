# Drag and Drop Upload Plugin for osTicket v1.6

This drag and drop upload plugin for osTicket v1.6 will work in all modern broswers with HTML5 compatability.

osTicket: http://osticket.com/

## Description

When a ticket is updated in osTicket, you are able to add a single file to the reply. I always thought this was a bit restricting, and wanted an easy way to upload many files. 

After this plugin in installed, it adds a Drag-and-Drop area directly above the attachments input on the reply form. When file(s) are dropped on to the area, the script uploads all the files as separate responses and then refreshes the page when done (to display the results). This way, if attachments are turned off, the drag and drop area won't be displayed.

## File & Folders

 - /css 	-	Stylesheet
 - /js  	-	Javascript files
 - uploader.php -	Template file to load scripts

## Requirements

	- osTicket 1.6
	- HTML5 compatable browser

## How to use

 1. Create a directory in the root of osTicket named 'dragdropuploader'
 2. Copy the contents (css, js, and uploader.php) into the dragdropuploader directory
 3. In the scp/tickets.php file: <br>
 	- Below this line: require_once(INCLUDE_DIR.'class.banlist.php'); <br>
 	- Add this line: require_once(ROOT_PATH.'/dragdropuploader/uploader.php');
 4. Drag and drop some files!	
 
## Notes

 1. The directory MUST be in the root, and MUST be named 'dragdropuploader'. If you'd like to move or change the directory, then some of the paths in the .js and uploader.php file will need to change.
 2. This works well for a new installation of osTicket 1.6. If you've made customizations, it may not work as expected.



	
