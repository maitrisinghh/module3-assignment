(function () {
  'use strict';
  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', ['MenuSearchService', function (MenuSearchService) {
    var narrow = this;
    narrow.foundItems = [];

    narrow.getMatchedMenuItems = function (searchTerm) {
      if (!searchTerm) {
        narrow.foundItems = [];
        return;
      }

      MenuSearchService.getMatchedMenuItems(searchTerm).then(function (items) {
        narrow.foundItems = items;
      });
    };

    narrow.removeItem = function (index) {
      narrow.foundItems.splice(index, 1);
    };
  }])
  .service('MenuSearchService', ['$http', function ($http) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {
      return $http({
        method: 'GET',
        url: 'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json'
      }).then(function (result) {
        var foundItems = [];
        var menuItems = result.data.menu_items;

        for (var i = 0; i < menuItems.length; i++) {
          var item = menuItems[i];
          if (item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
            foundItems.push(item);
          }
        }
        return foundItems;
      });
    };
  }])
  .directive('foundItems', function () {
    return {
      restrict: 'E',
      templateUrl: 'foundItems.html',
      scope: {
        items: '<',
        onRemove: '&'
      }
    };
  });
})();
