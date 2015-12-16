(function () {
  Parse.initialize("Wogz0HVdS25xKgW1RElDqOEqeIeEIC1Zva0mnyGe", "6fsjrOhrBOPvIFhNmHykkMonHp8CtVmYLzqn98OJ");

  var app = angular.module('myTwitter', ['ngMaterial', 'ngRoute', 'ngMessages']);

  //controllers
  app.controller('userCtrl', ['$scope', '$mdToast', '$rootScope', function ($scope, $mdToast, $rootScope) {
    $rootScope.user = {};
    $scope.logining = false;
    $scope.reging = false;

    var currentUser = Parse.User.current();

    if (currentUser) {
      $rootScope.user.id = currentUser.id;
      $rootScope.user.name = currentUser.getUsername();
    }

    $scope.login = function () {
      $scope.logining = true;
      Parse.User.logIn($rootScope.user.name, $rootScope.user.password, {
        success: function (user) {
          $rootScope.user.id = user.id;
          console.log('user:', user);
          $mdToast.showSimple('欢迎您, ' + $rootScope.user.name);
          $scope.logining = false;
        },
        error: function (user, error) {
          $mdToast.showSimple('登录失败: #' + error.code + ' ' + error.message);
          $scope.logining = false;
        }
      });
    };

    $scope.reg = function () {
      var user = new Parse.User();
      user.set('username', $rootScope.user.name);
      user.set('password', $rootScope.user.password);
      $scope.reging = true;
      user.signUp(null, {
        success: function (user) {
          $scope.reging = false;
          $rootScope.user.id = user.id;
          $mdToast.showSimple('欢迎您, ' + $rootScope.user.name);
        },
        error: function (user, error) {
          $scope.reging = false;
          $mdToast.showSimple('注册失败: #' + error.code + ' ' + error.message);
        }
      });
    };
  }]);

  app.controller('tweetsCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.tweets = {};
    $scope.pubing = false;

    var Tweet = Parse.Object.extend("Tweet");

    $scope.publish = function () {
      $scope.pubing = true;
      var tweet = new Tweet();
      tweet.set('text', $scope.tweets.content);
      tweet.set('user', Parse.User.current());
      tweet.save(null, {
        success: function(t) {
          $timeout(function() {
            $scope.pubing = false;
            $scope.tweets.list = $scope.tweets.list || [];
            $scope.tweets.list.push(t);
            $scope.tweets.content = '';
          }, 0);
        }
      });
    };

    $scope.loading = false;

    var loadList = function () {
      var query = new Parse.Query(Tweet);
      query.include("user");
      $scope.loading = true;
      query.find({
        success: function (results) {
          $scope.$apply(function(){
            $scope.tweets.list = results;
            $scope.loading = false;
          });
        }
      });
    };

    loadList();
  }]);

  app.controller('toolbarCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.logout = function () {
      Parse.User.logOut();
      $rootScope.user = {};
    };
  }]);
})();
