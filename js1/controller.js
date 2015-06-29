myApp.controller('login1Controller', function($scope) {
  $scope.save = function($isValid) {
    $scope.$broadcast('show-errors-check-validity');

    if ($scope.userForm.$valid) {
      alert('User saved');
      $scope.reset();
    } else {
      alert("There are invalid fields");
    }
  };

  $scope.reset = function() {
    $scope.$broadcast('show-errors-reset');
    $scope.user = {
      name: '',
      password: ''
    };
  }
});

myApp.controller('loginController', loginController);
function loginController($scope,user,auth,$state) { 
  var i = 0;
  user.isAuthed().then(function(res){
    if(res.data.code == 200){
        $state.go('home');
    }
  });
  $scope.register = function(){
    $state.go('register');
  };
  $scope.login = function() {
    $scope.submitted = true;
    if ($scope.userForm.$valid) {      
      user.login($scope.name, $scope.password)
      .then(handleRequest, handleRequest);
      $scope.token = localStorage.jwtToken;
    } else {
    }
    
  };
  function handleRequest(res) {
    debugger;
    var token = res.data ? res.data.token : null;
    if(token) { 
       $state.go('home');
       }
  
  }
  $scope.token = localStorage.jwtToken;
  $scope.logout = function(){
    delete localStorage.jwtToken;
  }
  $scope.request = function(){
    user.getQuote()
      .then(handleRequest, handleRequest)
  }
}
myApp.controller('homeController',function($state,$scope,auth,user){
    user.isAuthed().then(function(res){
      debugger;
        if(res.data.code != 200){
            $state.go('login');
        }
    });
    user.getUnverifiedMember().then(function(res){
      if(res.status != 200 ){
        $state.go('login');
      }
    });
  console.log("this in homeController");
});
myApp.controller('registerController',register);
function register($state,$scope,user){
  $scope.cancel = function(){
    $state.go('login');
  }
  $scope.register = function($valid){
    $scope.submitted = true;
    if($valid){
     user.register($scope);
    }
  }

}
