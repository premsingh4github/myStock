MetronicApp.controller('loginController', ['$scope','user','auth','$state','$rootScope', function($scope,user,auth,$state,$rootScope) {
  
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
      //$scope.error = ""
     }
     
   };
   function handleRequest(res) {
    
    if(res.data.code == 200){
      var token = res.data ? res.data.token : null;
     if(token) { 
        $state.go('dashboard');
        }
    }
    else if(res.data.code == 500){
      $scope.error = "Invalid Credential"

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

MetronicApp.controller('RegisterController',register);
function register($state,$scope,user){
  $scope.isDone = false;
  $scope.cancel = function(){
    $state.go('login');
  }
  $scope.register = function($valid){
    $scope.submitted = true;
    if($valid){
     user.register($scope).then(function(res) {
         if(res.status == "200")
          $scope.isDone = true;
           console.log(res.statusText);
       });
    }
  }
};
MetronicApp.controller('dashboardController',['$scope','$state','user','$rootScope','pubsubService',function($scope,$state,user,$rootScope,pubsubService){
  
    user.isAuthed().then(function(res){
       
      if(res.data.code != 200){

          $state.go('login');
      }
      pubsubService.addUser(res.data.user);
    });
    //$scope.unverifiedMembers = [{"id":2,"fname":"dileep","mname":"","lname":"yadav","address":"ktm","identity":"1234","nationality":"nepales","dob":"1989","ban":"18015","email":"dileep@gmail.com","cNumber":"987","mNumber":"980","username":"","password":"$2y$10$YAX7IcvSV2QQnQdR.JfsNuJdzH.B7OhOziiJ9a9A385A4W4YwmTwS","status":"0","mtype":"0","created_at":"2015-06-30 08:04:31","updated_at":"2015-06-30 08:04:31"}];
     

}]);
MetronicApp.controller('HeaderController', ['$scope','user','$modal','$rootScope','$state','pubsubService', function($scope,user,$modal,$rootScope,$state,pubsubService) {
    $scope.$on('$includeContentLoaded', function() {
          $scope.logout = function(){
            user.logout().then(function(res){
                
                if(res.data.code == 200){
                  
                  delete $rootScope.logined;
                  delete localStorage.jwtToken;

                  $state.go("login");
                }
            });
          }
          $scope.name = "test name";
          user.getUnverifiedMember().then(function(res){
           if(res.data.members.length > 0){
             $rootScope.unverifiedMembers = res.data.members;
             $rootScope.isUnverifedMember = ($rootScope.unverifiedMembers.length > 0)? true : false;
           }
        });
          $scope.user = pubsubService.getUser();
          debugger;
          $rootScope.removeMember = function(id){
                delete $rootScope.unverifiedMembers[id];
          }
          $scope.open = function (position) {
                
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
MetronicApp.controller('HomeController',['$state','$rootScope','user','pubsubService',function($state,$rootScope,user,pubsubService){
  user.getBranch().then(function(es){
    if(es.data.code == 200){
      es.data.branches.forEach(function(ls,i){
        pubsubService.addBranch(ls);
      });
    }
  });
  user.getStocks().then(function(es){
    if(es.data.code == 200){
     
      es.data.stocks.forEach(function(ls,i){
        pubsubService.addStock(ls);
      });
    }
  });
  user.getProducts().then(function(es){
    if(es.data.code == 200){
     
      es.data.products.forEach(function(ls,i){
        pubsubService.addProduct(ls);
      });
    }
  });
  user.getMemberTypes().then(function(es){
    if(es.data.code == 200){
      es.data.memberTypes.forEach(function(ls,i){
        pubsubService.addMemberType(ls);
      });
    }
  });
  user.getMembers().then(function(es){
    if(es.data.code == 200){
      es.data.members.forEach(function(ls,i){
        pubsubService.addMember(ls);
      });
    }
  });

  $state.go('dashboard');
}]);
/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope','$modal', function($scope,$modal) {
 
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); 
        $scope.branch = function () {
             
             // $scope.member = $scope.unverifiedMembers[position];
            var modalInstance = $modal.open({
              templateUrl: 'views/branch.html',
              controller:'BranchController'
              
            });

            modalInstance.result.then(function (selectedItem) {
              
            }, function () {
              console.log('Modal dismissed at: ' + new Date());
            });
          };
         $scope.stock = function () {
             
             // $scope.member = $scope.unverifiedMembers[position];
            var modalInstance = $modal.open({
              templateUrl: 'views/stock.html',
              controller:'StockController'
            });

            modalInstance.result.then(function (selectedItem) {
              
            }, function () {
              console.log('Modal dismissed at: ' + new Date());
            });
          };
          $scope.product = function () {
              // $scope.member = $scope.unverifiedMembers[position];
             var modalInstance = $modal.open({
               templateUrl: 'views/product.html',
               controller:'ProductController'
             });

             modalInstance.result.then(function (selectedItem) {
               
             }, function () {
               console.log('Modal dismissed at: ' + new Date());
             });
           };
           $scope.member = function () {
              // $scope.member = $scope.unverifiedMembers[position];
             var modalInstance = $modal.open({
               templateUrl: 'views/member.html',
               controller:'MemberController'
             });

             modalInstance.result.then(function (selectedItem) {
               
             }, function () {
               console.log('Modal dismissed at: ' + new Date());
             });
           };

      });

}]);
MetronicApp.controller('BranchController',['$scope','$modalInstance','user','$rootScope','pubsubService',function($scope,$modalInstance,user,$rootScope,pubsubService){
  
  $scope.add = false;
   $scope.isDone = false;
   $scope.branch = null;
  $scope.cancel = function(){
    $modalInstance.dismiss('cancel');
  }
  $scope.addBranch = function(){
    $scope.add = ($scope.add)?false : true ;
  }
  $scope.branches = pubsubService.getBranches() ;
  $scope.save = function(){
    debugger;
      user.addBranch($scope.branchName,$scope.location).then(function(es){
        debugger;
        if(es.data.code == 200){
          pubsubService.addBranch(es.data.branch);
          debugger;
          $scope.branch = es.data.branch.name;
          $scope.isDone = true;
        }
      });
  }
}]);
MetronicApp.controller('StockController',['$scope','$modalInstance','user','$rootScope','pubsubService',function($scope,$modalInstance,user,$rootScope,pubsubService){
  
  $scope.add = false;
   $scope.isDone = false;
   $scope.branch = null;
  $scope.cancel = function(){
    $modalInstance.dismiss('cancel');
  }
  $scope.addBranch = function(){
    $scope.add = ($scope.add)?false : true ;
  }

  $scope.branches = pubsubService.getBranches() ;
  $scope.stocks = pubsubService.getStocks();
  $scope.products = pubsubService.getProducts();
  $scope.branchName = function(branchId){
      var name ;
    
      $scope.branches.forEach(function(el,i){
        if(el.id == branchId){
         
          name = el.name;
        }
        //console.log(el);
      });
    
    return name;
  }
  $scope.branchLocation = function(branchId){
      var name ;
      $scope.branches.forEach(function(el,i){
        if(el.id == branchId){
          name = el.location;
        }
      });
    return name;
  }
  $scope.product = function(Id){
      var name ;
      $scope.products.forEach(function(el,i){
        if(el.id == Id){
          name = el.name;
        }
      });
    return name;
  }
  $scope.save = function(){
      user.addStock($scope.branchId,$scope.productTypeId,$scope.minQuantity,$scope.onlineQuantity,$scope.deliveryCharge,$scope.lot).then(function(es){
        
        if(es.data.code == 200){
          pubsubService.addStock(es.data.stock);
          $scope.branch = es.data.stock.id;
          $scope.isDone = true;
        }
      });
  }
}]);
MetronicApp.controller('ProductController',['$scope','$modalInstance','user','$rootScope','pubsubService',function($scope,$modalInstance,user,$rootScope,pubsubService){
  
  $scope.add = false;
   $scope.isDone = false;
   $scope.branch = null;
  $scope.cancel = function(){
    $modalInstance.dismiss('cancel');
  }
  $scope.addBranch = function(){
    $scope.add = ($scope.add)?false : true ;
  }
  $scope.products = pubsubService.getProducts() ;
  $scope.save = function(){
    
      user.addProduct($scope.name).then(function(es){
        if(es.data.code == 200){
          pubsubService.addProduct(es.data.product);
          $scope.branch = es.data.product.name;
          $scope.isDone = true;
          $scope.name = null;
        }
      });
  }
}]);
MetronicApp.controller('MemberController',['$scope','$modalInstance','user','$rootScope','pubsubService',function($scope,$modalInstance,user,$rootScope,pubsubService){
  
  $scope.add = false;
   $scope.isDone = false;
   $scope.branch = null;
  $scope.cancel = function(){
    $modalInstance.dismiss('cancel');
  }
  $scope.addBranch = function(){
    $scope.add = ($scope.add)?false : true ;
  }
  $scope.products = pubsubService.getProducts() ;
  $scope.memberTypes = pubsubService.getMemberTypes();
  $scope.members = pubsubService.getMembers();
  $scope.user = pubsubService.getUser();
  debugger
  $scope.save = function(){
      user.register($scope.member).then(function(es){
        if(es.data.code == 200){
          delete $scope.member;
          pubsubService.addMember(es.data.member);
          $scope.branch = es.data.member.fname;
          $scope.isDone = true;
          $scope.name = null;
        }
      });
  }
}]);
/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope','user','$rootScope', function($scope,$user,$rootScope) {    
    $scope.$on('$includeContentLoaded', function() {
        setTimeout(function(){
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
    $user.getOnlineMember().then(function(res){
        $rootScope.members = res.data.members;
       
        localStorage.setItem('members', JSON.stringify(res.data.members));
        //localStorage.members = res.data.members;
    });
}]);
