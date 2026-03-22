import apiService from './services/api';

console.log('===== TEST API SERVICE =====');
console.log('Service API créé avec succès !');
console.log('Méthodes disponibles:');
console.log('- getAllUtilisateurs()');
console.log('- getUtilisateurById(id)');
console.log('- createUtilisateur(data)');
console.log('- updateUtilisateur(id, data)');
console.log('- deleteUtilisateur(id)');
console.log('===========================');

apiService.getAllUser().then(users => console.log('Users:', users));