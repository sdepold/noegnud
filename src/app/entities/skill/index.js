import shield from "./shield";
import backAttack from "./back-attack";
import shadow from "./shadow";

const availableSkills = [shield, backAttack, shadow];

export function getSkills(player, amount) {
  let skills = [];

  const validation = skill =>
    !skill.limit || skill.limit > skills.filter(s => s.type === skill.type);

  for (let i = 0; i < amount; i++) {
    const skill = getSkill(validation);
    const sprite = skill(player);

    sprite.title = skill.title;
    skills.push(sprite);
  }

  function getSkill(validation) {
    let skill;

    do {
      skill = availableSkills[~~(Math.random() * availableSkills.length)];
      if (!validation(skill)) {
        skill = null;
      }
    } while (!skill);

    return skill;
  }

  return skills;
}
