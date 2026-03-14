// utils/skillMatcher.js
export const matchSkills = (resumeSkills, companySkills) => {
  // resumeSkills are already lowercase
  const matched = companySkills.filter(skill =>
    resumeSkills.includes(skill.toLowerCase())
  );

  const score = companySkills.length > 0
    ? (matched.length / companySkills.length) * 100
    : 0;

  return {
    matched,   // array of matched skills (original case from company)
    score,
  };
};