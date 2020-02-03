const angular = require("angular");
const swal = require("sweetalert");
// const formidable = require('formidable');

angular.module('reg')
  .controller('ApplicationCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$http',
    'currentUser',
    'settings',
    'Session',
    'UserService',
    function($scope, $rootScope, $state, $http, currentUser, settings, Session, UserService) {
      // Set up the user
      $scope.user = currentUser.data;

      // Is the student from S&T?
      $scope.isUmStudent = $scope.user.email.split('@')[1] == 'mst.edu';
      $scope.resume = null;

      // If so, default them to adult: true
      if ($scope.isUmStudent){
        $scope.user.profile.adult = true;
      }

      // Populate the school dropdown
      populateSchools();
      _setupForm();

      $scope.regIsClosed = Date.now() > settings.data.timeClose;

      /**
       * TODO: JANK WARNING
       */
      function populateSchools(){
        $http
          .get('/assets/schools.json')
          .then(function(res){
            var schools = res.data;
            var email = $scope.user.email.split('@')[1];

            if (schools[email]){
              $scope.user.profile.school = schools[email].school;
              $scope.autoFilledSchool = true;
            }
          });

        $http
          .get('/assets/schools.csv')
          .then(function(res){
            $scope.schools = res.data.split('\n');
            $scope.schools.push('Other');

            var content = [];

            for(i = 0; i < $scope.schools.length; i++) {
              $scope.schools[i] = $scope.schools[i].trim();
              content.push({title: $scope.schools[i]})
            }

            $('#school.ui.search')
              .search({
                source: content,
                cache: true,
                onSelect: function(result, response) {
                  $scope.user.profile.school = result.title.trim();
                }
              })
          });
      }

      function _updateUser(e){
        UserService
          .updateProfile(Session.getUserId(), $scope.user.profile)
          .then(response => {
            swal("Awesome!", "Your application has been saved.", "success").then(value => {
              $state.go("app.dashboard");
            });
          }, response => {
          	swal("Uh oh!", "Please fill out all the required fields.", "error");
	  });
      }

      function isMinor() {
        return !$scope.user.profile.adult;
      }

      function minorsAreAllowed() {
        return true;
      }

      function minorsValidation() {
        // Are minors allowed to register?
        if (isMinor() && !minorsAreAllowed()) {
          return false;
        }
        return true;
      }
      function nameValidation() {
        return true;
      }
      function phoneValidation() {
        return true;
      }
      function schoolValidation() {
        return true;
      }
      function yearValidation() {
        return true;
      }
      function genderValidation() {
        return true;
      }
      function raceValidation() {
        return true;
      }
      function participationValidation() {
        return true;
      }
      function dataValidation() {
        return true;
      }
      function codeValidation() {
        return true;
      }
      function _setupForm(){
        // Custom minors validation rule
        $.fn.form.settings.rules.allowMinors = function (value) {
          return minorsValidation();
        },
	$.fn.form.settings.rules.emptyName = function (value) {
          return nameValidation();

        },      
        $.fn.form.settings.rules.emptyPhone = function (value) {
          return phoneValidation();

        },
        $.fn.form.settings.rules.emptySchool = function (value) {
          return schoolValidation();

        };
        $.fn.form.settings.rules.emptyYear = function (value) {
          return yearValidation();

        };
        $.fn.form.settings.rules.emptyGender = function (value) {
          return genderValidation();
        };
        $.fn.form.settings.rules.emptyRace = function (value) {
          return raceValidation();

        };
        $.fn.form.settings.rules.emptyParticipation = function (value) {
          return participationValidation();

        };
        $.fn.form.settings.rules.emptyData = function (value) {
          return dataValidation();

        };
        $.fn.form.settings.rules.emptyCode = function (value) {
          return codeValidation();

        };
        // Semantic-UI form validation
        $('.ui.form').form({
          inline: true,
          fields: {
            name: {
              identifier: 'name',
              rules: [
                {
                  type: 'emptyName',
                  prompt: 'Please enter your full name.'
                }
              ]
            },
            phone: {
              identifier: 'phone',
              rules: [
                {
                  type: 'emptyPhone',
                  prompt: 'Please enter your phone number.'
                }
              ]
            },
            school: {
              identifier: 'school',
              rules: [
                {
                  type: 'emptySchool',
                  prompt: 'Please enter your school name.'
                }
              ]
            },
            year: {
              identifier: 'year',
              rules: [
                {
                  type: 'emptyYear',
                  prompt: 'Please select your graduation year.'
                }
              ]
            },
            gender: {
              identifier: 'gender',
              rules: [
                {
                  type: 'emptyGender',
                  prompt: 'Please select a gender.'
                }
              ]
            },
            race: {
              identifier: 'race',
              rules: [
                {
                  type: 'emptyRace',
                  prompt: 'Please select a race.'
                }
              ]
            },/*
		  discoveryMethod: {
              identifier: 'discoverMethod',
              rules: [
                {
                  type: 'emptyRace',
                  prompt: 'Please select a discovery method.'
                }
              ]
            },
		  fiction: {
              identifier: 'fiction',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please fill out the field above.'
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
	   game: {
              identifier: 'game',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please fill in the required field'
                }
              ]
            },*/
            participationCount: {
              identifier: 'participationCount',
              rules: [
                {
                  type: 'emptyParticipation',
                  prompt: 'Please enter your previous Hackathon count.'
                }
              ]
            },
            diet: {
              identifier: 'diet',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your dietary restrictions.'
                }
              ]
            },
            codeAgreement: {
              identifier: 'codeAgreement',
              rules: [
                {
                  type: 'emptyCode',
                  prompt: 'You must accept the Code of Conduct'
                }
              ]
            },
            dataAgreement: {
              identifier: 'dataAgreement',
              rules: [
                {
                  type: 'emptyData',
                  prompt: 'You must agree to the Privacy Policy and Terms & Conditions.'
                }
              ]
            }
          }
        });
      }

      $scope.submitForm = function(){
        if ($('.ui.form').form('is valid')){
          _updateUser();
        } else {
          swal("Uh oh!", "Please Fill The Required Fields", "error");
        }
      };

      $scope.uploadResume = function(files) {
        UserService
          .uploadResume(Session.getUserId(), files[0])
          .then(response => {
            $scope.user.profile.resume = true;
          }, response => {
            $scope.user.profile.resume = false;
          });
       }
    }]);
