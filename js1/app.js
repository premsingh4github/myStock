var myApp = angular.module('myApp', ['ui.router', 'ui.bootstrap']);
debugger
document.getElementById('loading').style.display = "none";

myApp.controller('ModalDemoCtrl', function($scope, $modal) {
  $scope.open = function(size) {
    var modalInstance = $modal.open({
      template: '<h1>modal again</h1>',
      size: size,
    });
  };
});
myApp.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/login");
  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: "loginController"

    }).state('home', {
      url: "/home",
      templateUrl: "templates/home.html",
      controller:"homeController"
    }).state('register',{
      url:'/register',
      templateUrl:"templates/register.html",
      controller:"registerController"
    });
});
myApp.directive('showErrors', function($timeout) {
  return {
    restrict: 'A',
    require: '^form',
    link: function(scope, el, attrs, formCtrl) {
      // find the text box element, which has the 'name' attribute
      var inputEl = el[0].querySelector("[name]");
      // convert the native text box element to an angular element
      var inputNgEl = angular.element(inputEl);
      // get the name on the text box
      var inputName = inputNgEl.attr('name');

      // only apply the has-error class after the user leaves the text box
      inputNgEl.bind('blur', function() {
        el.toggleClass('has-error', formCtrl[inputName].$invalid);
      });

      scope.$on('show-errors-check-validity', function() {
        el.toggleClass('has-error', formCtrl[inputName].$invalid);
      });

      scope.$on('show-errors-reset', function() {
        $timeout(function() {
          el.removeClass('has-error');
        }, 0, false);
      });
    }
  }
});
// added to support jwt authentication
function authInterceptor(API, auth) {
  
  return {
    // automatically attach Authorization header
    request: function(config) {
      var token = auth.getToken();
      if (config.url.indexOf(API) === 0 && token) {
        config.headers.token = token;
      }

      return config;
    },

    // If a token was sent back, save it
    response: function(res) {
      if (res.config.url.indexOf(API) === 0 && res.data.token) {
        auth.saveToken(res.data.token);
      }
      return res;
    },
  }
}

function authService($window) {
 
  var self = this;

  self.saveToken = function(token) {
    $window.localStorage['jwtToken'] = token;
  }

  self.getToken = function() {
    return $window.localStorage['jwtToken'];
  }
  self.logout = function() {
    $window.localStorage.removeItem('jwtToken');
  }
}

function userService($http, API, auth,$state) {

  var self = this;
  self.getQuote = function() {
    return $http.post(API + '/getUser');
  }

  // add authentication methods here
  self.register = function($data) {
    
    return $http.post(API + 'register',{
      fname:$data.fname,
      mname:$data.mname,
      lname:$data.lname,
      address:$data.address,
      identity:$data.identity,
      nationality:$data.nationality,
      dob:$data.dob,
      ban:$data.ban,
      email:$data.email,
      cNumber:$data.contactNo,
      mNumber:$data.mobileNo
    })
      .then(function(res) {
        if(res.status == "200")
          console.log(res.statusText);
      })
  }
  self.login = function(username, password) {
    return $http.post(API + 'login',{
      username:username,
      password:password
    });
  }
  self.getUnverifiedMember = function(){
    return $http.post(API + 'API/getUnverifiedMember');
  }
  self.isAuthed = function(){
    return $http.post(API + 'API/isAuthed');
  }
}
 
myApp.factory('authInterceptor', authInterceptor);
myApp.service('user', userService)
myApp.service('auth', authService)
myApp.constant('API', 'http://localhost/dealerAPI/public/')
myApp.config(function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
})
