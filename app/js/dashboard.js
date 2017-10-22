
$( document ).ready(function() {
    //quick dirty hacking code 
    // Optimalisation: Store the references outside the event handler:
    let $window = $(window);
  
    function checkWidth() {
        let windowsize = $window.width();
        if (windowsize < 440) {
            //if the window is less than 440px wide then turn day view.
                setTimeout(function(){ 
                    $( ".fc-agendaDay-button" ).hide();
                    $('.fc-agendaDay-button')[0].click(); 
                }, 50);
        }
        else {
            //if the window is greater than 440px wide then turn month view.
            setTimeout(function(){ $( ".fc-agendaDay-button" ).hide();
                $( ".fc-month-button" ).hide();
                $('.fc-month-button')[0].click(); 
                }, 50);
        }
    }
    // Execute on load
    checkWidth();
    // Bind event listener
    $(window).resize(checkWidth);
});
