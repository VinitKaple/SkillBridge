export const matchSkills = (resumeSkills, companySkills) => {

  const matched = companySkills.filter(skill =>
    resumeSkills.includes(skill.toLowerCase())
  );

  const score = (matched.length / companySkills.length) * 100;

  return {
    matched,
    score
  };

};