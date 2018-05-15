/**
 * If this script is included, all application defined events will be logged in the console.
 * Include it only AFTER jQuery.
 * <script type="text/javascript" src="test/jquery-event-log.js"></script>
 * 
 */
var oldJQueryEventTrigger = jQuery.event.trigger;
jQuery.event.trigger = function( event, data, elem, onlyHandlers ) { 
    //console.log( event, data, elem, onlyHandlers ); 
      if 
      (   event != 'ajaxSend' &&
          event != 'ajaxStop' &&
          event != 'ajaxSuccess' &&
          event != 'ajaxComplete' &&
          event != 'ajaxStart'        
      )
      {
          console.log('%c Triggerred ' + event.toString(), 'color: #a053c1; font-weight: bold;');
      }
    
    oldJQueryEventTrigger( event, data, elem, onlyHandlers ); 
  }