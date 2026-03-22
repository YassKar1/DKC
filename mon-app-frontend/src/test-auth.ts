import authService from './services/auth.service';
console.log('===== TEST AUTH SERVICE =====');
// Token de test (valide mais expiré)
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huIiwicm9sZXMiOlsiUk9MRV9VU0VSIl0sImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxNjAwMDAzNjAwfQ.2KYv62BvOM6rSn8NfPboBOabKB7hmDSXuBKbP5XDBT4'
// Test 1 : Décoder un token
try {
const decoded = authService.decodeToken(testToken);
console.log('✅Token décodé:', decoded);
console.log('   Username:', decoded.sub);
console.log('   Roles:', decoded.roles);
} catch (error: unknown) {
    if (error instanceof Error){
        console.error('❌Erreur décodage:', error.message);
    } else {
        console.error('❌Erreur décodage:', error);
    }
}
// Test 2 : Vérifier l'expiration
const isExpired = authService.isTokenExpired(testToken);
console.log('✅Token expiré?', isExpired ? 'Oui' : 'Non');
// Test 3 : Vérifier authentification
const isAuth = authService.isAuthenticated();
console.log('✅Utilisateur authentifié?', isAuth ? 'Oui' : 'Non');
console.log('============================');