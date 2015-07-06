MetronicApp.controller('loginController', ['$scope','user','auth','$state','$rootScope', function($scope,user,auth,$state,$rootScope) {
  debugger;
  if($rootScope.logined != undefined){
    $state.go('dashboard');
  }
   user.isAuthed().then(function(res){
     if(res.data.code == 200){
      $rootScope.logined = true;
         $state.go('dashboard');
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
     var token = res.data ? res.data.token : null;
     if(token) { 
        $state.go('dashboard');
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
}]);

MetronicApp.controller('registerController',register);
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
};
MetronicApp.controller('dashboardController',['$scope','$state','user','$rootScope',function($scope,$state,user,$rootScope){
  console.log("this is in dashboard");
  debugger;
    user.isAuthed().then(function(res){
      if(res.data.code != 200){
          $state.go('login');
      }
    });
    //$scope.unverifiedMembers = [{"id":2,"fname":"dileep","mname":"","lname":"yadav","address":"ktm","identity":"1234","nationality":"nepales","dob":"1989","ban":"18015","email":"dileep@gmail.com","cNumber":"987","mNumber":"980","username":"","password":"$2y$10$YAX7IcvSV2QQnQdR.JfsNuJdzH.B7OhOziiJ9a9A385A4W4YwmTwS","status":"0","mtype":"0","created_at":"2015-06-30 08:04:31","updated_at":"2015-06-30 08:04:31"}];
     

}]);
MetronicApp.controller('HeaderController', ['$scope','user','$modal','$rootScope', function($scope,user,$modal,$rootScope) {
    $scope.$on('$includeContentLoaded', function() {

          user.getUnverifiedMember().then(function(res){
           debugger;
           if(res.data.members.length > 0){
                
             $rootScope.unverifiedMembers = res.data.members;
             $rootScope.isUnverifedMember = ($rootScope.unverifiedMembers.length > 0)? true : false;
           }
        });
          $rootScope.removeMember = function(id){
                delete $rootScope.unverifiedMembers[id];
          }
          $scope.open = function (position) {
                debugger;
                $scope.member = $scope.unverifiedMembers[position];
              var modalInstance = $modal.open({
                templateUrl: 'views/verifyMember.html',
                controller:'VerifyMemberController',
                
                size: 'lg',
                resolve: {
                  member: function () {
                    return $scope.member;
                  }
                }
              });

              modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
              }, function () {
                console.log('Modal dismissed at: ' + new Date());
              });
            };
        Layout.initHeader(); // init header
    });
}]);
MetronicApp.controller('VerifyMemberController',['$scope','$modalInstance','member','user','$state','$rootScope',function($scope, $modalInstance,member,user,$state,$rootScope){
  debugger;
  $scope.member = member;
  $scope.mtype = 1;
  $scope.success = false;
  $scope.fail = false;
  $scope.cancel = function () {
    debugger;
    $state.go('home');
    $modalInstance.dismiss('cancel');
  };
  $scope.send = function(isValid){
      if($scope.success){
          $scope.cancel();
      }
    debugger;
        if(isValid){
                if($scope.passwordConform === $scope.password){                   
                    $scope.error = "";
                    $scope.warning = "";
                    user.verifyMember($scope.member.id,$scope.username,$scope.password,$scope.mtype).then(function(res){
                      debugger;
                      if(res.data.code = 200){
                        $scope.success = true;
                        
                    
                      }
                      else{
                        $scope.fail = true;
                        document.getElementById('message').innerHTML = "fail";
                      }
                      
                    });
                }
                else{
                  $scope.warning = "Password doesn't match!";
                }
                  
        }
    else{
          if($scope.username == undefined){
            $scope.error = "Invalid Username!";
          }
          else{
            $scope.error = "";
          }
          if($scope.password == undefined){
               $scope.warning = "Invalid Password!";
          }
          else{
              if($scope.passwordConform === $scope.password){
                  $scope.warning = "";
              }
              else{
                $scope.warning = "Password doesn't match!";
              }
          }
      }
    }
    
    
  
 debugger;
}]);
MetronicApp.controller('homeController',['$state','$rootScope',function($state,$rootScope){
  $state.go('dashboard');
}]);
/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope','$modal', function($scope,$modal) {
  debugger;
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); 
        $scope.branch = function (position) {
              debugger;
             // $scope.member = $scope.unverifiedMembers[position];
            var modalInstance = $modal.open({
              templateUrl: 'views/branch.html',
              controller:'BranchController',
              resolve: {
                member: function () {
                  //return $scope.member;
                }
              }
            });

            modalInstance.result.then(function (selectedItem) {
              
            }, function () {
              console.log('Modal dismissed at: ' + new Date());
            });
          };
         

      });

}]);
MetronicApp.controller('BranchController',['$scope','$modalInstance',function($scope,$modalInstance){
  debugger;
  $scope.add = false;
  $scope.cancel = function(){
    $modalInstance.dismiss('cancel');
  }
  $scope.addBranch = function(){
    $scope.add = ($scope.add)?false : true ;
  }
}]);