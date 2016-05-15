/**
 * Created by jonathan on 30/04/16.
 */
'use strict';
var forms = (function () {
  return {
    personValidate: function (person) {
      return new Promise(function (resolve, reject) {
        var objectOk = 0;
        if (person.hasOwnProperty('identify'))
          objectOk++;
        if (person.hasOwnProperty('name'))
          objectOk++;
        if (person.hasOwnProperty('gender'))
          objectOk++;
        if (person.hasOwnProperty('dob'))
          objectOk++;
        if (person.hasOwnProperty('social_number'))
          objectOk++;
        if (person.hasOwnProperty('active'))
          objectOk++;


        if (objectOk !== 6)
          reject({ obj: 'Objeto não parece ser uma pessoa' });
        else {
          var objRet = {};
          if (!person.active.toString())
            objRet['name'] = 'Nome é de preenchimento obrigatório.';

          if (!person.identify.toString())
            objRet['identify'] = 'Identificador é de preenchimento obrigatório.';

          if (!person.gender.toString())
            objRet['gender'] = 'Sexo é de preenchimento obrigatório.';

          if (!person.dob.toString())
            objRet['dob'] = 'Data de nascimento é de preenchimento obrigatório.';

          if (!person.active.toString())
            objRet['active'] = 'Status é de preenchimento obrigatório.';

          if (Object.keys(objRet).length !== 0) {
            reject(objRet);
          }
          else {
            resolve(person);
          }
        }
      });
    }
  };

})();
