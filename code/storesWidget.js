define(

  ['knockout', 'viewModels/paymentsViewModel', 'ccConstants', 'pubsub', 
  'storageApi', 'notifier', 'navigation', 'ccNumber', 'pageLayout/site',
  'currencyHelper', 'ccRestClient', 'viewModels/address', 'CCi18n'],

  function(ko, paymentsViewModel, CCConstants, pubsub, storageApi, notifier, 
    navigation, ccNumber, site, currencyHelper, ccRestClient, Address, CCi18n) {

    "use strict";

    return {
      /*
       * Note that "this" is bound to the Widget View Model.
       */      
      resourcesLoaded : function(widget) {
      },

      onLoad : function(widget) { 
        widget.defaultLocations = ko.observable(true);
        widget.locations = ko.observable();
        widget.filteredLocations = ko.observable();
        widget.cities = ko.observable();
        widget.states = ko.observable();
        widget.locationTriggerCity = ko.observable('City');
        widget.locationTriggerState = ko.observable('State');
        widget.showCityList = ko.observable(false);
        widget.showStateList = ko.observable(false);

        // GET LOCATION - listagem de todas as lojas
        require(["ccRestClient"], function (ccRestClient) {
          ccRestClient.request('listLocations', {'offset': 0}, function (response) {
            console.log(response);
            widget.locations(response);
            widget.getCitiesAndStates();
          }, console.error);
        });

        // listagem - cidades / estados
        widget.getCitiesAndStates = function () {
          var locationsItems = widget.locations().items;
          var citiesList = [];
          var statesList = [];
          var filteredCities = [];
          var filteredStates = [];
          
          // listagem - de todas as cidades e estados
          locationsItems.forEach(function (item) {
            var city = item.city;
            var state = item.stateAddress;
            citiesList.push(city);
            statesList.push(state);
          });

          // filtro - eliminando as cidades repetidas
          citiesList = citiesList.filter(function(city, i) {
            return citiesList.indexOf(city) === i;
          });
          // criando payload de cidades
          citiesList.forEach(function (city) {
            var pushCity = {"cityName":city};
            filteredCities.push(pushCity);
          });
          // listagem final de cidades
          widget.cities(filteredCities);

          // filtro - eliminando estados repetidos
          statesList = statesList.filter(function(state, i) {
            return statesList.indexOf(state) === i;
          });
          // criando payload de estados
          statesList.forEach(function (state) {
            var pushState = {"stateName":state};
            filteredStates.push(pushState);
          });
          // listagem final de estados
          widget.states(filteredStates);
        }

        // Filtragem - lista de lojas por cidade
        widget.filteredByCity = function () {
          var trigger = widget.locationTriggerCity();
          var byCity = widget.locations().items;
          var locationsItems = [];

          byCity.forEach(function (item) {
            if (item.city == trigger) {
              var location = item;
              locationsItems.push(location);
            }
          });

          widget.filteredLocations(locationsItems);
          widget.defaultLocations(false);
        }

        // Filtragem - lista de lojas por estado
        widget.filteredByState = function () {
          var trigger = widget.locationTriggerState();
          var byState = widget.locations().items;
          var locationsItems = [];

          byState.forEach(function (item) {
            if (item.stateAddress == trigger) {
              var location = item;
              locationsItems.push(location);
            }
          });

          widget.filteredLocations(locationsItems);
          widget.defaultLocations(false);
        }
        
      },

      beforeAppear : function(page) {
      }
    }
  }
);
