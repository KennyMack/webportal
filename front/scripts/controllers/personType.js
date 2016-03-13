/**
 * Created by jonathan on 12/03/16.
 */
angular.module('frontApp')
  .controller('personTypeCtrl', function ($location, messages, localSave, $scope, $filter) {
      var vm = this;
      vm.personType = [];

      vm.init = function () {
        var teacher_id = localSave.getJSONValueLS('TEACHERS-ID');
        var student_id = localSave.getJSONValueLS('STUDENT-ID');
        var manager_id = localSave.getJSONValueLS('MANAGER-ID');
        var master_id = localSave.getJSONValueLS('MASTER-ID');

        if (Object.keys(teacher_id || '').length > 0) {
          vm.personType.push({
            type:'Professor',
            name: teacher_id.name,
            id: teacher_id._id
          });
        }
        if (Object.keys(student_id|| '').length > 0) {
          vm.personType.push({
            type:'Estudante',
            name: student_id.name,
            id: student_id._id
          });
        }
        if (Object.keys(manager_id|| '').length > 0) {
          vm.personType.push({
            type:'Gestor',
            name: manager_id.name,
            id: manager_id._id
          });
        }
        if (Object.keys(master_id|| '').length > 0) {
          vm.personType.push({
            type:'Administrador',
            name: master_id.name,
            id: master_id._id
          });
        }

        if (vm.personType.length === 1) {
          vm.selectedId = vm.personType[0].id;
          vm.doAccess();
        }
        else if (vm.personType.length === 0) {
          //TODO: Redirecionar para a pagina de vincular usuario
        }

      };

      vm.doAccess = function () {
        if (vm.selectedId !== -1) {
          var id = vm.selectedUser();
          localSave.setJSONValueLS('PERSON-ID',id);
          $location.path('/');
        }
        else{
          messages.alert("Selecione", "Selecione uma opção válida.", "btnAccess");
        }
      };

      vm.selectedId = -1;

      vm.selectedUser = function() {
        try {
          return $filter('filter')(vm.personType, { id: vm.selectedId })[0];
        }
        catch (e) {
          return '';
        }

      }
    });
