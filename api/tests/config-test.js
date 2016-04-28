/**
 * Created by jonathan on 23/02/16.
 */
module.exports.request = require("request");
module.exports.app = require("../bin/www");
module.exports.base_url = "http://localhost:3000/";
var frisby = require('frisby');
var options = {
    request: {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmRiOGMwNzcwZWI1NjRhNmU5YzIzY2UiLCJlbWFpbCI6ImJpbGxAZ2F0ZXMuY29tIiwidXNlcm5hbWUiOiJCaWxsIiwiZGF0ZSI6IjIwMTYtMDQtMjdUMjE6MDI6NTItMDM6MDAiLCJpYXQiOjE0NjE4MDE3NzIsImV4cCI6MTQ2MTg4ODE3Mn0.h54DgqmdOp0JIgjmgkySz_3AGlmgnB4s-mUo015hLfg'
        }
    }
};
module.exports.names =[
    'Edward',
    'Jean',
    'Mand',
    'Paul',
    'Dilz',
    'Carl',
    'Guz'
];
module.exports.surnames = [
    'Ortiz',
    'Marc',
    'Paul',
    'Allen',
    'Stuart',
    'Drew',
    'Rainz'
];

module.exports.courseType = [
    'Educação Infantil',
    'Ensino Científico',
    'Ensino Fundamental A',
    'Ensino Fundamental B',
    'Ensino Fundamental C',
    'Ensino MÉDIO A',
    'Ensino MÉDIO B',
    'Ensino MÉDIO C',
    'Ensino Superior',
    'Pós-Graduação',
    'Mestrado',
    'Doutorado',
    'Profissionalizantes',
    'Técnico',
    'Técnólogo'
];

module.exports.courseName = [
    'Administração',
    'Análise de Sistemas',
    'Arquitetura e Urbanismo',
    'Ciência da Computação',
    'Ciências Contábeis',
    'Ciências Econômicas',
    'Comunicação Social',
    'Desenho Industrial',
    'Direito',
    'Educação Física',
    'Engenharia Civil',
    'Engenharia de Computação',
    'Engenharia de Controle e Automação (Mecatrônica)',
    'Engenharia de Produção Mecânica',
    'Engenharia Elétrica',
    'Engenharia Química',
    'Estudos Sociais',
    'Farmácia e Bioquímica',
    'Fisioterapia',
    'Fonoaudiologia',
    'História',
    'Letras',
    'Medicina Veterinária',
    'Marketing',
    'Matemática',
    'Moda',
    'Nutrição',
    'Odontologia',
    'Pedagogia',
    'Psicologia',
    'Processamento de Dados',
    'Propaganda e Marketing',
    'Secretariado Executivo',
    'Turismo',
    '1° Ano',
    '2° Ano',
    '3° Ano',
    '4° Ano',
    '5° Ano',
    '6° Ano',
    '7° Ano',
    '8° Ano',
    '9° Ano'
];

module.exports.subjects = [
    'Gramática',
    'Geografia',
    'Biologia',
    'Química',
    'Física',
    'Filosofia',
    'Inglês',
    'Literatura',
    'Redação',
    'História',
    'Matemática',
    'Alquimia',
    'Agroquímica',
    'Astroquímica',
    'Bioquímica',
    'Álgebra',
    'Análise',
    'Cálculo',
    'Geomática',
    'Inteligência Artificial',
    'Interação humano-computador',
    'Linguagens de Programação',
    'Mecatrônica',
    'Programação',
    'Redes',
    'Robótica',
    'Sistemas de Informação'
];

frisby.globalSetup(options);

module.exports.frisby = frisby;