// Rəhbərlik tərəfindən təyin olunmuş rəsmi və aktiv ID-lərin siyahısı
const ICAZELI_ADMIN_IDLERI = ["ADM-777", "ADM-999", "ADM-007"];
const ICAZELI_MUELLIM_IDLERI = ["MUL-111", "MUL-222", "MUL-333", "MUL-444"];

/**
 * Daxil edilən ID-nin rəsmi siyahıda olub-olmadığını yoxlayan funksiya
 * @param {string} id - İstifadəçinin daxil etdiyi ID nömrəsi
 * @param {string} role - İstifadəçinin seçdiyi rol (admin/muallim/telebe)
 * @returns {boolean} - İcazə varmı?
 */
function idDogrula(id, role) {
    const təmizID = id.trim().toUpperCase();
    
    if (role === 'admin') {
        return ICAZELI_ADMIN_IDLERI.includes(təmizID);
    }
    
    if (role === 'muallim') {
        return ICAZELI_MUELLIM_IDLERI.includes(təmizID);
    }
    
    // Tələbələr üçün qabaqcadan təyin olunmuş siyahı yoxdur, sərbəst keçirlər
    if (role === 'telebe') {
        return təmizID.startsWith('TEL-');
    }
    
    return false;
}