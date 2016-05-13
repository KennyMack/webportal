/**
 * Created by jonathan on 12/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.auth.name)
    .controller(frontApp.modules.auth.controllers.personType.name, [
      'LOCALNAME',
      frontApp.modules.auth.imports.messages,
      frontApp.modules.auth.imports.localSave,
      '$location',
      '$scope',
      '$filter',
    function (LOCALNAME, messages, localSave,
              $location, $scope, $filter) {
      var self = this;
      self.personType = [];

      self.init = function () {
        var teacher_id = localSave.getJSONValueLS(LOCALNAME.TEACHERS_ID);
        var student_id = localSave.getJSONValueLS(LOCALNAME.STUDENT_ID);
        var manager_id = localSave.getJSONValueLS(LOCALNAME.MANAGER_ID);
        var master_id = localSave.getJSONValueLS(LOCALNAME.MASTER_ID);

        if (Object.keys(teacher_id || '').length > 0) {
          self.personType.push({
            typedesc: 'Professor',
            type: 'teacher',
            name: teacher_id.name,
            id: teacher_id._id
          });
        }
        if (Object.keys(student_id || '').length > 0) {
          self.personType.push({
            typedesc: 'Estudante',
            type: 'student',
            name: student_id.name,
            id: student_id._id
          });
        }
        if (Object.keys(manager_id || '').length > 0) {
          self.personType.push({
            typedesc: 'Gestor',
            type: 'manager',
            name: manager_id.name,
            id: manager_id._id
          });
        }
        if (Object.keys(master_id || '').length > 0) {
          self.personType.push({
            typedesc: 'Administrador',
            type: 'master',
            name: master_id.name,
            id: master_id._id
          });
        }

        if (self.personType.length === 1) {
          self.selectedId = self.personType[0].id;
          self.doAccess();
        }
        else if (self.personType.length === 0) {
          //TODO: Redirecionar para a pagina de vincular usuario
        }

      };

      self.doAccess = function () {
        if (self.selectedId !== -1) {
          var id = self.selectedUser();
          localSave.setJSONValueLS(LOCALNAME.PERSON_ID, id);
          $location.path(URLS.HOME());
        }
        else {
          messages.alert("Selecione", "Selecione uma opção válida.", "btnAccess");
        }
      };

      self.selectedId = -1;

      self.selectedUser = function () {
        try {
          return self.personType[self.selectedId]; //$filter('filter')(vm.personType, {id: vm.selectedId})[0];
        }
        catch (e) {
          return '';
        }

      }
    }]);

}(angular, frontApp));
