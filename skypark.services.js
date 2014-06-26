/*
 *  @package Athens Skypark
 *  @author Andreas Loukakis, alou@alou.gr
 *  
 */
'use strict';

angular.module('skyPark')
    .factory('DataStorage', function($rootScope){
        var service = {};
        service.pageValue = 1;
        service.totalItems = 1;
        service.currentPage = 1;
        service.maxSize = 6;
        service.paginationMode = 'list';
        service.where = '';
        service.what = '';

        service.updatePageValue = function(value, mode){
            this.pageValue = value;
            this.mode = mode;
            $rootScope.$broadcast("changepage");
        };

        service.updatePaginationValues = function(total, current, paginationMode, where, what){
            this.totalItems = total;
            this.currentPage = current;
            this.what = what;
            this.where = where;
            this.paginationMode = paginationMode;
            $rootScope.$broadcast("changepagination");
        };

        return service;
    })
    .factory('BookingsService', function ($http, $q) {
        var baseUrl = '/admin/r/bookings';
        
        var find = function (page) {
            var deferred = $q.defer();
            var url = baseUrl + '/?page=' + page;

            $http.get(url).success(deferred.resolve).error(deferred.reject);
            return deferred.promise;
        };

        var search = function (where, what, page) {
            var deferred = $q.defer();
            var url = baseUrl + '/s/' + where + '/' + what + '/?page=' + page;

            $http.get(url).success(deferred.resolve).error(deferred.reject);

            return deferred.promise;
        };

        var searchInToday = function (page) {
            var deferred = $q.defer();
            var url = '/admin/r/intoday' + '/?page=' + page;

            $http.get(url).success(deferred.resolve).error(deferred.reject);

            return deferred.promise;
        };

        var searchOutToday = function (page) {
            var deferred = $q.defer();
            var url = '/admin/r/outtoday' + '/?page=' + page;

            $http.get(url).success(deferred.resolve).error(deferred.reject);

            return deferred.promise;
        };

        return {
            find: find,
            search: search,
            destroy: destroy,
            searchInToday: searchInToday,
            searchOutToday: searchOutToday
        };
    });
