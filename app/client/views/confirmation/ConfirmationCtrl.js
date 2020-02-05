const swal = require('sweetalert');

angular.module('reg')
  .controller('ConfirmationCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'currentUser',
    'Utils',
    'UserService',
    function($scope, $rootScope, $state, currentUser, Utils, UserService){

      // Set up the user
      $scope.user = currentUser.data;

      $scope.pastConfirmation = Date.now() > $scope.user.status.confirmBy;

      $scope.formatTime = Utils.formatTime;

      _setupForm();

      $scope.fileName = $scope.user._id + "_" + $scope.user.profile.name.split(" ").join("_");

      // -------------------------------
      // All this just for dietary restriction checkboxes fml

     /* var dietaryRestrictions = {
        'Vegetarian': false,
        'Vegan': false,
        'Halal': false,
        'Kosher': false,
        'Nut Allergy': false
      };

      if ($scope.user.confirmation.dietaryRestrictions){
        $scope.user.confirmation.dietaryRestrictions.forEach(function(restriction){
          if (restriction in dietaryRestrictions){
            dietaryRestrictions[restriction] = true;
          }
        });
      }

      $scope.dietaryRestrictions = dietaryRestrictions;
    */
      // -------------------------------

      function _updateUser(e){
        var confirmation = $scope.user.confirmation;
        // Get the dietary restrictions as an array
        /*var drs = [];
        Object.keys($scope.dietaryRestrictions).forEach(function(key){
          if ($scope.dietaryRestrictions[key]){
            drs.push(key);
          }
        });
        confirmation.dietaryRestrictions = drs;
*/
        UserService
          .updateConfirmation($scope.user._id, confirmation)
          .then(response => {
            swal("Woo!", "You're confirmed!", "success").then(value => {
              $state.go("app.dashboard");
            });
          }, response => {
            swal("Uh oh!", "Something went wrong.", "error");
          });
      }

      function _setupForm(){
        // Semantic-UI form validation
        $('.ui.form').form({
          inline: true,
	  fields: {
            signaturePhotoRelease: {
              identifier: 'signaturePhotoRelease',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please type your digital signature.'
                }
              ]
            },
	    signatureDate: {
              identifier: 'signatureDate',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter today date.'
                }
              ]
            },
	travel: {
              identifier: 'travel',
              rules: [
                {
                  type: 'travel',
                  prompt: 'Please select your travel method.'
                }
              ]
            },
	    terms: {
              identifier: 'terms',
              rules: [
                {
                  type: 'checked',
                  prompt: 'Please agree to the Terms and Condition.'
                }
              ]
            },
          }
        });
      }

      $scope.submitForm = function(){
        if ($('.ui.form').form('is valid')){
          _updateUser();
        }
	 else {
          swal("Uh oh!", "Please Fill The Required Fields", "error");
        }
      };

    }]);
