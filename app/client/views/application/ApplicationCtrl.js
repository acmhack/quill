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
      // console.log(currentUser.data);

      // Is the student from S&T?
      $scope.isUmStudent = $scope.user.email.split('@')[1] == 'umsystem.edu';
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
        console.log($scope.user);
        UserService
          .updateProfile(Session.getUserId(), $scope.user.profile)
          .then(response => {
            swal("Awesome!", "Your application has been saved.", "success").then(value => {
              $state.go("app.dashboard");
            });
          }, response => {
            swal("Uh oh!", "Something went wrong.", "error");
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
      function resumeValidation() {
        return true;
      }
      function _setupForm(){
        // Custom minors validation rule
        $.fn.form.settings.rules.allowMinors = function (value) {
          return minorsValidation();
        };
        $.fn.form.settings.rules.emptyResume = function (value) {
          return resumeValidation();

        };
        // Semantic-UI form validation
        $('.ui.form').form({
          inline: true,
          fields: {
            name: {
              identifier: 'name',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your full name.'
                }
              ]
            },
            phone: {
              identifier: 'phone',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your phone number.'
                }
              ]
            },
            school: {
              identifier: 'school',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your school name.'
                }
              ]
            },
            year: {
              identifier: 'year',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select your graduation year.'
                }
              ]
            },
            gender: {
              identifier: 'gender',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select a gender.'
                }
              ]
            },
            race: {
              identifier: 'race',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select a race.'
                }
              ]
            },
            participationCount: {
              identifier: 'participationCount',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your previous Hackathon count.'
                }
              ]
            },
            resume: {
              identifier: 'resume',
              rules: [
                {
                  type: 'emptyResume',
                  prompt: 'Please upload your resume.'
                }]
            },
            linkedin: {
              identifier: 'linkedin',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your LinkedIn profile.'
                }
              ]
            },
            github: {
              identifier: 'github',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your Github profile.'
                }
              ]
            },
            ssSize: {
              identifier: 'ssSize',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your sweatshirt size.'
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
            travel: {
              identifier: 'travel',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your travel plans.'
                }
              ]
            },
            superbowl: {
              identifier: 'superbowl',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your Super Bowl choice.'
                }
              ]
            },
            game: {
              identifier: 'game',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your favorite game'
                }
              ]
            },
            discoveryMethod: {
              identifier: 'discoveryMethod',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter how you heard about PickHacks.'
                }
              ]
            },
            codeAgreement: {
              identifier: 'codeAgreement',
              rules: [
                {
                  type: 'empty',
                  prompt: 'You must accept the Code of Conduct'
                }
              ]
            },
            dataAgreement: {
              identifier: 'dataAgreement',
              rules: [
                {
                  type: 'empty',
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
