/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.courses.name)
    .controller(frontApp.modules.courses.controllers.courses.name, [
      frontApp.modules.utils.factories.resource,
      frontApp.modules.utils.services.messages,
      frontApp.modules.courses.factories.courses,
      '$scope',
      '$filter',
      '$location',
      function (resource, messages, courses,
                $scope, $filter, $location) {
        var vm = this;

        vm.courseslist = [];
        vm.yearsList = [];

        vm.init = function () {
          courses.getCourses()
            .then(function (courses) {
              vm.courseslist = [];
              vm.yearsList = [];

              for (var i = 0, length = courses.data.length; i < length; i++) {

                var year = $filter('date')(courses.data[i]['create_at'], 'yyyy');
                console.log('year - ' + year);
                if (!yearInList(year)) {
                  vm.yearsList.push({ 'name': year });
                }
                courses.data[i]['year'] = year;
              }

              vm.courseslist = courses.data;
            },
            function (err) {
              $location.path(URLS.SERVERERROR(500));
            });

        var yearInList = function (year) {
          for (var i = 0, length = vm.yearsList.length; i < length; i++) {
            if (year == vm.yearsList[i]['name'])
              return true;
          }
          return false;
        };

        vm.getCoursesYear = function (year) {
          return $filter('filter')(vm.courseslist, {year: year});
        };

        vm.showClass = function (origin) {
          messages.dialog('../../templates/list.tpl.html'); //, classController, 'btn-class-' + origin, 'btn-class-' + origin);
        };


          /*console.log('init');
           resource.data('/courses/test').then(function(courses) {
           console.log(courses);
           }, function (err) {
           console.error(err);
           });

           resource.post('/courses/test').then(function(courses) {
           console.log(courses);
           }, function (err) {
           console.error(err);
           });*/
        };

        vm.courseslist = [
          {
            "_id": "56db94a73a8281116f5802e6",
            "identify": "abc",
            "name": "Ensino Fundamental",
            "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat impedit ipsam iusto laudantium mollitia sunt tenetur? Assumenda atque autem deleniti illum laborum, molestias mollitia obcaecati officia rem repudiandae veritatis voluptatem." +
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat impedit ipsam iusto laudantium mollitia sunt tenetur? Assumenda atque autem deleniti illum laborum, molestias mollitia obcaecati officia rem repudiandae veritatis voluptatem." +
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat impedit ipsam iusto laudantium mollitia sunt tenetur? Assumenda atque autem deleniti illum laborum, molestias mollitia obcaecati officia rem repudiandae veritatis voluptatem." +
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat impedit ipsam iusto laudantium mollitia sunt tenetur? Assumenda atque autem deleniti illum laborum, molestias mollitia obcaecati officia rem repudiandae veritatis voluptatem." +
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat impedit ipsam iusto laudantium mollitia sunt tenetur? Assumenda atque autem deleniti illum laborum, molestias mollitia obcaecati officia rem repudiandae veritatis voluptatem." +
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat impedit ipsam iusto laudantium mollitia sunt tenetur? Assumenda atque autem deleniti illum laborum, molestias mollitia obcaecati officia rem repudiandae veritatis voluptatem." +
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat impedit ipsam iusto laudantium mollitia sunt tenetur? Assumenda atque autem deleniti illum laborum, molestias mollitia obcaecati officia rem repudiandae veritatis voluptatem." +
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat impedit ipsam iusto laudantium mollitia sunt tenetur? Assumenda atque autem deleniti illum laborum, molestias mollitia obcaecati officia rem repudiandae veritatis voluptatem." +
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat impedit ipsam iusto laudantium mollitia sunt tenetur? Assumenda atque autem deleniti illum laborum, molestias mollitia obcaecati officia rem repudiandae veritatis voluptatem." +
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat impedit ipsam iusto laudantium mollitia sunt tenetur? Assumenda atque autem deleniti illum laborum, molestias mollitia obcaecati officia rem repudiandae veritatis voluptatem.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat impedit ipsam iusto laudantium mollitia sunt tenetur? Assumenda atque autem deleniti illum laborum, molestias mollitia obcaecati officia rem repudiandae veritatis voluptatem." +
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat impedit ipsam iusto laudantium mollitia sunt tenetur? Assumenda atque autem deleniti illum laborum, molestias mollitia obcaecati officia rem repudiandae veritatis voluptatem.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat impedit ipsam iusto laudantium mollitia sunt tenetur? Assumenda atque autem deleniti illum laborum, molestias mollitia obcaecati officia rem repudiandae veritatis voluptatem." +
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat impedit ipsam iusto laudantium mollitia sunt tenetur? Assumenda atque autem deleniti illum laborum, molestias mollitia obcaecati officia rem repudiandae veritatis voluptatem.",
            "__v": 3,
            "modified": "2016-03-06T23:57:46.000Z",
            "create_at": "2016-03-06T01:52:26.000Z",
            "active": 1,
            "class": [
              {
                "_id": "56dbb3bd3e1f5c9f144cb64b",
                "name": "Jonathan Henrique do Vale"
              },
              {
                "_id": "56dbb5233e1f5c9f144cb64e",
                "name": "Allan Harper"
              }
            ],
            "schedule": [
              {
                "day": 1,
                "subject": "56db96183a8281116f5802ea",
                "_id": "56dbab9d59dcd2fc0ee12b71",
                "duration": {
                  "start": "2016-12-01T10:00:00.000Z",
                  "end": "2016-12-01T11:00:00.000Z"
                }
              },
              {
                "day": 1,
                "subject": "56db962a3a8281116f5802eb",
                "_id": "56dbabc659dcd2fc0ee12b72",
                "duration": {
                  "start": "2016-12-01T11:00:01.000Z",
                  "end": "2016-12-01T12:00:00.000Z"
                }
              }
            ],
            "subjects": [
              {
                "subject": "56db962a3a8281116f5802eb",
                "teacher": "56db953e3a8281116f5802e7",
                "_id": "56dbaabd59dcd2fc0ee12b6f"
              },
              {
                "subject": "56db96183a8281116f5802ea",
                "teacher": "56db953e3a8281116f5802e7",
                "_id": "56dbaadd59dcd2fc0ee12b70"
              }
            ],
            "course_type": {
              "_id": "56db93aa3a8281116f5802e4",
              "description": "Curso de verão"
            },
            "duration": {
              "start": "2016-01-01T02:00:00.000Z",
              "end": "2016-12-01T02:00:00.000Z"
            }
          },
          {
            "_id": "56dcc49dcd8c58e24c6eacb9",
            "identify": "00002",
            "name": "Ensino Fundamental",
            "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat impedit ipsam iusto laudantium mollitia sunt tenetur? Assumenda atque autem deleniti illum laborum, molestias mollitia obcaecati officia rem repudiandae veritatis voluptatem." +
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat impedit ipsam iusto laudantium mollitia sunt tenetur? Assumenda atque autem deleniti illum laborum, molestias mollitia obcaecati officia rem repudiandae veritatis voluptatem." +
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat impedit ipsam iusto laudantium mollitia sunt tenetur? Assumenda atque autem deleniti illum laborum, molestias mollitia obcaecati officia rem repudiandae veritatis voluptatem.",
            "__v": 2,
            "modified": "2016-03-07T01:21:09.000Z",
            "create_at": "2016-03-06T23:57:45.000Z",
            "active": 1,
            "class": [
              {
                "_id": "56dbb3bd3e1f5c9f144cb64b",
                "name": "Jonathan Henrique do Vale"
              },
              {
                "_id": "56dbb5233e1f5c9f144cb64e",
                "name": "Allan Harper"
              },
              {
                "_id": "56dcd7191d040b7452d6e193",
                "name": "Mr. Bean"
              },
              {
                "_id": "56dcd7351d040b7452d6e194",
                "name": "Marcio Ortiz"
              }
            ],
            "schedule": [],
            "subjects": [],
            "course_type": {
              "_id": "56db93aa3a8281116f5802e4",
              "description": "Curso de verão"
            },
            "duration": {
              "start": "2016-01-01T02:00:00.000Z",
              "end": "2016-12-01T02:00:00.000Z"
            }
          },
          {
            "_id": "56dcd3e71d040b7452d6e191",
            "identify": "00003",
            "name": "Ensino Fundamental",
            "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat impedit ipsam iusto laudantium mollitia sunt",
            "__v": 0,
            "modified": "2016-03-07T01:05:43.000Z",
            "create_at": "2016-03-07T01:01:05.000Z",
            "active": 1,
            "class": [],
            "schedule": [],
            "subjects": [],
            "course_type": {
              "_id": "56db93aa3a8281116f5802e4",
              "description": "Curso de verão"
            },
            "duration": {
              "start": "2016-01-01T02:00:00.000Z",
              "end": "2016-12-01T02:00:00.000Z"
            }
          },
          {
            "_id": "56dcd3f71d040b7452d6e192",
            "identify": "00004",
            "description": "Ensino Fundamental 3",
            "name": "Ensino Fundamental",
            "__v": 0,
            "modified": "2016-03-07T01:05:59.000Z",
            "create_at": "2016-03-07T01:01:05.000Z",
            "active": 1,
            "class": [],
            "schedule": [],
            "subjects": [],
            "course_type": {
              "_id": "56db93aa3a8281116f5802e4",
              "description": "Curso de verão"
            },
            "duration": {
              "start": "2016-01-01T02:00:00.000Z",
              "end": "2016-12-01T02:00:00.000Z"
            }
          }
        ];

        vm.showCollapseButton = function (text) {
          return text.length > 125;
        };

        vm.getShortDescription = function (text) {
          return $filter('limitTo')(text, 125, 0);

        };

        vm.collapseDescription = function (index) {
          if (vm.expandedTextIndex !== index) {
            vm.expandedTextIndex = index;
          }
          else {
            vm.expandedTextIndex = undefined;
          }
        };

        vm.expandedTextIndex = undefined;

        vm.undefinedIndex = true;
        vm.prevIndex = undefined;
        vm.selectedUserIndex = undefined;
        vm.selectUserIndex = function (index) {
          vm.expandedTextIndex = undefined;
          if (vm.selectedUserIndex !== index) {
            vm.selectedUserIndex = index;
            vm.undefinedIndex = false;
          }
          else {
            vm.selectedUserIndex = undefined;
            vm.undefinedIndex = true;
          }
        };
      }])
    .controller('classController', [
      frontApp.modules.utils.controllers.defaultMessagesCtrl.name,
      '$scope', '$mdDialog', '$controller',
      function (DefaultMessagesCtrl, $scope, $mdDialog, $controller) {
    console.log('sa');
        DefaultMessagesCtrl.call($scope);
    //$controller(DefaultMessagesCtrl, {$scope: $scope});
    console.log('sa3');
    $scope.closeClick = function () {
      alert('sadad');
    };

    $scope.itemsList = [
      { id: 1, img: '../images/ic_person_mark1.svg', value: 'Hello' },
      { id: 1, img: '../images/ic_person_mark1.svg', value: 'Hello' },
      { id: 1, img: '../images/ic_person_mark1.svg', value: 'Hello' }
    ];


    $scope.toppings = [
      { name: 'Pepperoni', wanted: true },
      { name: 'Sausage', wanted: false },
      { name: 'Black Olives', wanted: true },
      { name: 'Green Peppers', wanted: false }
    ];
    $scope.settings = [
      { name: 'Wi-Fi', extraScreen: 'Wi-fi menu', icon: 'device:network-wifi', enabled: true },
      { name: 'Bluetooth', extraScreen: 'Bluetooth menu', icon: 'device:bluetooth', enabled: false },
    ];
    $scope.messages = [
      {id: 1, title: "Message A", selected: false},
      {id: 2, title: "Message B", selected: true},
      {id: 3, title: "Message C", selected: true},
    ];
    $scope.people = [
      { name: 'Janet Perkins', img: 'img/100-0.jpeg', newMessage: true },
      { name: 'Mary Johnson', img: 'img/100-1.jpeg', newMessage: false },
      { name: 'Peter Carlsson', img: 'img/100-2.jpeg', newMessage: false },
      { name: 'Mary Johnson', img: 'img/100-1.jpeg', newMessage: false },
      { name: 'Peter Carlsson', img: 'img/100-2.jpeg', newMessage: false },
      { name: 'Mary Johnson', img: 'img/100-1.jpeg', newMessage: false },
      { name: 'Peter Carlsson', img: 'img/100-2.jpeg', newMessage: false },
      { name: 'Mary Johnson', img: 'img/100-1.jpeg', newMessage: false },
      { name: 'Peter Carlsson', img: 'img/100-2.jpeg', newMessage: false },
      { name: 'Mary Johnson', img: 'img/100-1.jpeg', newMessage: false },
      { name: 'Peter Carlsson', img: 'img/100-2.jpeg', newMessage: false }

    ];
    $scope.goToPerson = function(person, event) {
      $mdDialog.show(
        $mdDialog.alert()
          .title('Navigating')
          .textContent('Inspect ' + person)
          .ariaLabel('Person inspect demo')
          .ok('Neat!')
          .targetEvent(event)
      );
    };
    $scope.navigateTo = function(to, event) {
      $mdDialog.show(
        $mdDialog.alert()
          .title('Navigating')
          .textContent('Imagine being taken to ' + to)
          .ariaLabel('Navigation demo')
          .ok('Neat!')
          .targetEvent(event)
      );
    };
    $scope.doPrimaryAction = function(event) {
      $mdDialog.show(
        $mdDialog.alert()
          .title('Primary Action')
          .textContent('Primary actions can be used for one click actions')
          .ariaLabel('Primary click demo')
          .ok('Awesome!')
          .targetEvent(event)
      );
    };
    $scope.doSecondaryAction = function(event) {
      $mdDialog.show(
        $mdDialog.alert()
          .title('Secondary Action')
          .textContent('Secondary actions can be used for one click actions')
          .ariaLabel('Secondary click demo')
          .ok('Neat!')
          .targetEvent(event)
      );
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  }]);
}(angular, frontApp));
