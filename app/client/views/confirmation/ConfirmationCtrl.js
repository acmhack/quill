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

	 function travelValidation() {
        return true;
      }

      
	function _setupForm(){
         $.fn.form.settings.rules.emptyTravel = function (value) {
          return travelValidation();
	};

        // Semantic-UI form validation
        $('.ui.form').form({
          inline: true,
	  fields: {
        shirt: {
              identifier: 'shirt',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please give us a shirt size!'
                }
              ]
            },    
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
                  type: 'emptyTravel',
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

       $scope.travel = function(){
	       var e = document.getElementById("travel");
	       var strUser = e.options[e.selectedIndex].value;
	       if(strUser != 'B'){
	       		document.getElementById("bus").style.display = "none";
	       		document.getElementById("abc").style.display = "none";
	       }
	       else{
		       document.getElementById("bus").style.display = "block";
		       document.getElementById("abc").style.display = "block";
	       }
       };

	$scope.hello =	function() {
                var e = document.getElementById("busRoute");
                var strUser = e.options[e.selectedIndex].value;
		if(strUser == '1'){
                        document.getElementById("abc").href="http://pickhacks2020-route1.eventbrite.com/"
			document.getElementById("abc").innerHTML = "EVENTBRITE LINK - ROUTE 1";
		}
		else if(strUser == '2'){
                        document.getElementById("abc").href="http://pickhacks2020-route2.eventbrite.com/"
			document.getElementById("abc").innerHTML="EVENTBRITE LINK - ROUTE 2"
                }
		else if(strUser == '3'){
                        document.getElementById("abc").href="http://pickhacks2020-route3.eventbrite.com/"
                	document.getElementById("abc").innerHTML="EVENTBRITE LINK - ROUTE 3"
		}
		else if(strUser == '4'){
                        document.getElementById("abc").href="http://pickhacks2020-route4.eventbrite.com/"
                	document.getElementById("abc").innerHTML="EVENTBRITE LINK - ROUTE 4"
		}
		else if(strUser == '5'){
                        document.getElementById("abc").href="http://pickhacks2020-route5.eventbrite.com/"
                	document.getElementById("abc").innerHTML="EVENTBRITE LINK - ROUTE 5"
		}
		else if(strUser == '6'){
                        document.getElementById("abc").href="http://pickhacks2020-route6.eventbrite.com/"
                	document.getElementById("abc").innerHTML="EVENTBRITE LINK - ROUTE 6"
		}
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
