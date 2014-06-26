/*
 *  @package Athens Skypark
 *  @author Andreas Loukakis, alou@alou.gr
 *  
 */
'use strict';


angular.module('skyPark').directive('printDiv', function () {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {

      element.bind('click', function(evt){
        evt.preventDefault();
        PrintElem(attrs.printDiv);
      });

      function PrintElem(elem) {
        PrintWithIframe($(elem).html());
      }

      function PrintWithIframe(data) {
        if ($('iframe#printf').size() == 0) {
          $('html').append('<iframe id="printf" name="printf"></iframe>'); 

          var mywindow = window.frames["printf"];
          mywindow.document.write('<html><head><title>AthensSkypark.gr Site Printout</title><style>@page {margin: 25mm 0mm 25mm 5mm;font-size:16pt;}</style>' +
                        '</head><body style="font-size:15pt !important;"><div>' +
                        data +
                        '</div></body></html>');

          $(mywindow.document).ready(function(){
            mywindow.print();
            setTimeout(function(){
              $('iframe#printf').remove();
            },
            2000);
          });
        }

        return true;
      }
    }
  };
});
