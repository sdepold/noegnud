import shield from './shield';

const availableSkills = [shield];

export function getSkills(player, amount) {
    let skills = [];

    for (let i = 0; i < amount; i++) {
      skills.push(availableSkills[~~(Math.random() * availableSkills.length)](player));
    }

    return skills;

}
