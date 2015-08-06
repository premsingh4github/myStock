	MetronicApp.factory('pubsubService',['$rootScope',pubsubService]);
	function pubsubService($rootScope){
		var branches = [];
		var stocks = [];
		function getBranches(){
			return branches;
		}

		var addBranch = function(branch){
	        branches.push(branch);
	        $rootScope.$broadcast('addBranch',{
	            branches: branches
	        });
    	}
    	function removeBranch(branchName){
    		branches.forEach(function(el,i){
    			if(el.name == branchName){
    				branches.splice(i,1);
    			}
    			//console.log(el);
    		});
    	}
    	function getStocks(){
    		return stocks;
    	}
    	function addStock(stock){
    		stocks.push(stock);
    		$rootScope.$broadcast('addStock',{
    		    stocks: stocks
    		});
    	}
		return {
		    getBranches: getBranches,
		    addBranch : addBranch,
		    removeBranch: removeBranch,
		    getStocks :getStocks,
		    addStock : addStock
		    
		};
	}