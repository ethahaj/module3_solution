(function () {

'use strict';

   angular.module('NarrowItDownApp',[])
   .controller('NarrowItDownController', NarrowItDownController)
   .service('MenuSearchService', MenuSearchService)
   .directive('resultsList', resultsList);


function resultsList() {
    var ddo = {
        templateUrl: 'foundItems.html',
        scope: {
            directiveFoundList:'<foundItems',
            directiveOnRemove:'&onRemove',
            directiveDisplayMessage: '<displayMessage'
        },
        controller: NarrowItDownDirectiveController,
        controllerAs: 'dirCtrl',
        bindToController: true
    };
    return ddo;
}

function NarrowItDownDirectiveController() {
    var dirCtrl = this;
}


NarrowItDownController.$inject = ['MenuSearchService']
function NarrowItDownController(MenuSearchService) {
    var ctrl = this;
    ctrl.found = [];
    ctrl.message = "";
        
    ctrl.getItems = function () {
        var promise = MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);
        promise.then(function (result) {
            console.log("Inside controller");
            console.log(promise);
            console.log(result);
            ctrl.found = result;
            if ( ctrl.found.length === 0){
                ctrl.message = "Nothing found";
            }
        });
    }

    ctrl.removeItem = function (itemIndex) {
        console.log("'this' is: ", this);
        //this.lastRemoved = "Last item removed was " + this.items[itemIndex].name;
        console.log("Last item removed was " + this.found[itemIndex].name);
        //shoppingList.removeItem(itemIndex);
        ctrl.found.splice(itemIndex,1);
        //this.title = origTitle + " (" + list.items.length + " items )";
    };
}


MenuSearchService.$inject = ['$http'];
function MenuSearchService($http) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {
        var foundItems = [];
        var data;
        var menuDesc;

        return $http({
            method: 'GET',
            url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
        }).then(function (result) {
            data = result.data;

            for (var i = 0; i < data.menu_items.length; i++) {
                menuDesc = data.menu_items[i].description;
                if (searchTerm && menuDesc.indexOf(searchTerm) !== -1) {
                    foundItems.push(data.menu_items[i]);
                }
            }
             return foundItems;
        });       
    }
}

})();