/*
 *  @package Athens Skypark
 *  @author Andreas Loukakis, alou@alou.gr
 *  
 */
'use strict';

angular.module('skyPark')
    .controller('BookingsCtrl', function ($scope, $rootScope, DataStorage, BookingsService, $timeout) {
        $rootScope.page = '1';
        $scope.current_page = $rootScope.page;

        $scope.getBookings = function (page) {
            BookingsService.find(page).then(function (result) {
                $scope.bookings = (result !== 'null') ? result : {};
                DataStorage.updatePaginationValues(result.total, result.current_page, 'list');
            }, function (reason) {
                console.log('ERROR', reason);
            });
        };

        $scope.getInToday = function (page) {
            if (!page) {page = '1';}
            BookingsService.searchInToday(page).then(function (result) {
                $scope.bookings = (result !== 'null') ? result : {};
                DataStorage.updatePaginationValues(result.total, result.current_page, 'intoday');
            }, function (reason) {
                console.log('ERROR', reason);
            });
        };

        $scope.getOutToday = function (page) {
            if (!page) {page = '1';}
            BookingsService.searchOutToday(page).then(function (result) {
                $scope.bookings = (result !== 'null') ? result : {};
                DataStorage.updatePaginationValues(result.total, result.current_page, 'outtoday', '', '');
            }, function (reason) {
                console.log('ERROR', reason);
            });
        };



        $scope.searchBookings = function (where, what, page) {
            if (!page) {page = '1';}
            if (!what) { $scope.getBookings(page); return; }

            if (liveSearchTimeout) $timeout.cancel(liveSearchTimeout);
            liveSearchTimeout = $timeout(function() {
                    BookingsService.search(where, what, page).then(function (result) {
                    $scope.bookings = (result !== 'null') ? result : {};
                    DataStorage.updatePaginationValues(result.total, result.current_page, 'search', where, what);
                }, function (reason) {
                    console.log('ERROR', reason);
                });
            }, 250);
            
        };

        $scope.deleteBooking= function (bookingId) {
            BookingsService.destroy(bookingId).then(function (result) {
                $scope.getBookings();
            }, function (reason) {
                console.log('ERROR', reason);
            });
        };

        //init
        $scope.getBookings($scope.current_page);

        var liveSearchTimeout;
        $rootScope.$on('changepage', function() {
            if (DataStorage.paginationMode == 'list'){
                $scope.getBookings(DataStorage.pageValue);
            } else if (DataStorage.paginationMode == 'search') {
                $scope.searchBookings(DataStorage.where, DataStorage.what, DataStorage.pageValue);
            } else if (DataStorage.paginationMode == 'intoday') {
                $scope.getInToday(DataStorage.pageValue);
            } else if (DataStorage.paginationMode == 'outtoday') {
                $scope.getOutToday(DataStorage.pageValue);
            }
        });
    })

    .controller('PaginationCtrl', function ($scope, $rootScope, DataStorage) {
        $scope.totalItems = DataStorage.totalItems;
        $scope.currentPage = DataStorage.currentPage;
        $scope.maxSize = 10;

        $scope.fetchNew = function(page){
            DataStorage.updatePageValue(page);
        };

        $rootScope.$on('changepagination', function() {
            $scope.totalItems = DataStorage.totalItems;
            $scope.currentPage = DataStorage.currentPage;
        });
    })

    .controller('ModalCtrl', function ($scope, $modal, $log) {

      $scope.items = ['item1', 'item2', 'item3'];

      $scope.open = function (booking) {
        $scope.items = booking;

        var modalInstance = $modal.open({
          template: '<div id="printme"><div class="modal-header">' +
                '<h3 class="modal-title">{[{items.name + " " + items.surname }]}</h3>' +
            '</div>' +
            '<div class="modal-body">' +
                '<ul class="list-group">' +
                   '<li class="list-group-item">' +
                        'Άφιξη στο Skypark: <strong>{[{ items.anaxorisi }]}</strong>' +
                    '</li>' +
                    '<li class="list-group-item">' +
                        'Άφιξη πτήσης επιστροφής: <strong>{[{ items.afiksi }]}</strong>' +
                    '</li>' +
                    '<li class="list-group-item">' +
                        'Ημερομηνία κράτησης: <strong>{[{ items.created_at }]}</strong>' +
                    '</li>' +
                    '<li class="list-group-item">' +
                        'Αεροπορική εταιρεία: <strong>{[{ items.airline }]}</strong> από <strong>{[{ items.flycity }]}</strong>' +
                    '</li>' +
                    '<li class="list-group-item">' +
                        'Στοιχεία επικοινωνίας: <strong>{[{ items.phone }]}</strong> / <strong>{[{ items.email }]}</strong>' +
                    '</li>' +
                    '<li class="list-group-item">' +
                        'Πινακίδες: <strong>{[{ items.plates }]}</strong>' +
                    '</li>' +
                    '<li class="list-group-item">' +
                        'Ημέρες & κόστος: <strong>{[{ items.totald }]}</strong> ημέρες, <strong>{[{ items.cost }]} ευρώ</strong>' +
                    '</li>' +
                    '<li class="list-group-item">' +
                        'Επιβάτες / κάθισμα: <strong>{[{ items.passengers }]}</strong> επιβάτες, παιδικό κάθισμα: <strong>{[{ items.childseat }]}</strong>' +
                    '</li>' +
                    '<li class="list-group-item">' +
                        'Υπηρεσίες: <strong>Πλύσιμο: {[{ items.carwash }]}</strong>, <strong>AMEA: {[{ items.amea }]}</strong>, <strong>κάρτα μέλους: {[{ items.membercard }]}</strong>' +
                    '</li>' +
                    '<li class="list-group-item">' +
                        'Κωδικός κράτησης: <strong>{[{ items.item_number }]}</strong>' +
                    '</li>' +
                    '<li class="list-group-item">' +
                        'Σημειώσεις: <strong>{[{ items.notes }]}</strong>' +
                    '</li>' +
                '</ul>' +
            '</div></div>' +
            '<div class="modal-footer">' +
                '<a class="btn btn-primary" href="#" print-div="#printme"><span class="glyphicon glyphicon-print"></span> Print</a>' +
                '<button class="btn btn-primary" ng-click="ok()">Close</button>' +
            '</div>',
          controller: ModalInstanceCtrl,
          size: '500',
          resolve: {
            items: function () {
              return $scope.items;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };
    });

    var ModalInstanceCtrl = function ($scope, $modalInstance, items) {
        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
          };

            $scope.ok = function () {
                $modalInstance.close($scope.selected.item);
            };

            $scope.printIt = function(){
                window.print;
            };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
    };
