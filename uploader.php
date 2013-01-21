<!-- ****************************************************************
    uploader.js
 
    Mark D Rushton <mark@rushtonmd.com>
    Copyright (c)  2013

    Released under the GNU General Public License WITHOUT ANY WARRANTY.

    Installation: 
    1. Copy the dragdropuploader into the root directory of osTicket
    2. In the scp/tickets.php file:
        Below this line: require_once(INCLUDE_DIR.'class.banlist.php');
        Add this line: require_once(ROOT_PATH.'/dragdropuploader/uploader.php');
    3. Drag and drop some files!

********************************************************************** -->


<script src=' <?php echo ROOT_PATH."dragdropuploader/js/jquery-1.9.0.min.js"?> ' type="text/javascript"  ></script>
<script src=' <?php echo ROOT_PATH."dragdropuploader/js/uploader.js"?>' type="text/javascript" ></script>
<link rel="stylesheet" href='<?php echo ROOT_PATH."dragdropuploader/css/defaultstyle.css"?>' type="text/css" />