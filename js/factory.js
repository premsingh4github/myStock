	MetronicApp.factory('pubsubService',['$rootScope',pubsubService]);
	function pubsubService($rootScope){
		var branches = [];
		var stocks = [];
		var products = [];
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
    	function getProducts(){
    		return products;
    	}
    	function addProduct(product){
    		products.push(product);
    		$rootScope.$broadcast('addProduct',{
    		    products: products
    		});
    	}
		return {
		    getBranches: getBranches,
		    addBranch : addBranch,
		    removeBranch: removeBranch,
		    getStocks :getStocks,
		    addStock : addStock,
		    getProducts: getProducts,
		    addProduct : addProduct
		    
		};
	}