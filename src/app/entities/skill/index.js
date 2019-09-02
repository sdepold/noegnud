import shield from './shield';
import backAttack from './back-attack';

const availableSkills = [shield, backAttack];

export function getSkills(player, amount) {
    let skills = [];

    for (let i = 0; i < amount; i++) {
      skills.push(availableSkills[~~(Math.random() * availableSkills.length)](player));
    }

    return skills;

}
