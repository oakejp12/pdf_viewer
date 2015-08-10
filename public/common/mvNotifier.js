angular.module('app').value('mvToastr', toastr);

angular.module('app').factory('myNotifier', function(myToastr){
    return {
        notify: function(msg) {
            myToastr.success(msg);
            console.log(msg);
        }
    }
});