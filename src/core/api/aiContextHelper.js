import { matchPath } from 'react-router-dom';
import { 
  getSubjectById, 
  getTopicById,
  getLatestTopicContent,
  getQuestionBankById,
  getCodingProblem,
  getStudentProfile,
  getRoadmapForProfile
} from '../../data/repository';

export const buildAIContext = async (location) => {
  const path = location.pathname;
  let context = "The student is currently browsing StudyMapper.\n";

  try {
    const profile = await getStudentProfile();
    if (profile) {
      context += `Student Profile: ${profile.branch} branch, Year ${profile.year}, Semester ${profile.semester}. Career Goal: ${profile.career_goal} (${profile.preferred_role}).\n`;
    }

    if (path === '/') {
      context += "They are on the main Dashboard.";
    } 
    else if (path.startsWith('/subject/')) {
      const match = matchPath('/subject/:subjectId', path);
      if (match) {
        const subject = await getSubjectById(match.params.subjectId);
        if (subject) {
          context += `They are viewing the subject: ${subject.title}.`;
        }
      }
    }
    else if (path.startsWith('/topic/')) {
      const match = matchPath('/topic/:topicId', path);
      if (match) {
        const topic = await getTopicById(match.params.topicId);
        if (topic) {
          context += `They are studying a specific topic: "${topic.title}".\n`;
          // Try to fetch unit to give more context
          try {
            const Dexie = (await import('dexie')).default;
            const db = new Dexie('StudyMapperDB');
            await db.open();
            const unit = await db.table('units').get(topic.unit_id);
            if (unit) {
              context += `This topic belongs to Unit: "${unit.title}".\n`;
            }
          } catch(e){}
          
          const content = await getLatestTopicContent(topic.id);
          if (content && content.generated_json) {
            context += `Here is the current topic content summary:\n${JSON.stringify(content.generated_json, null, 2).substring(0, 1500)}...\n`;
          }
        }
      }
    }
    else if (path.startsWith('/coding/workspace/')) {
      const match = matchPath('/coding/workspace/:problemId', path);
      if (match) {
        const problem = await getCodingProblem(match.params.problemId);
        if (problem) {
          context += `They are practicing coding. Topic: ${problem.topic}, Language: ${problem.language}, Difficulty: ${problem.difficulty}.\n`;
          context += `Problem: ${problem.title}\nStatement: ${problem.statement}\n`;
          context += `Their current code:\n\`\`\`${problem.language}\n${problem.user_code || '// No code written yet'}\n\`\`\`\n`;
        }
      }
    }
    else if (path.startsWith('/roadmap')) {
      context += "They are viewing their Skill Roadmap.\n";
      if (profile) {
        const roadmap = await getRoadmapForProfile(profile.id);
        if (roadmap) {
          context += `Their current roadmap is for: ${roadmap.career_goal}.\n`;
        }
      }
    }
    else if (path.startsWith('/placement')) {
      context += "They are in the Placement Preparation section.\n";
      if (path.includes('aptitude')) context += "Practicing Aptitude questions.\n";
      if (path.includes('technical')) context += "Practicing Technical Interview questions.\n";
      if (path.includes('hr')) context += "Practicing HR Interview questions.\n";
    }
    else if (path.startsWith('/qb/')) {
      const match = matchPath('/qb/:bankId', path);
      if (match) {
         const qb = await getQuestionBankById(match.params.bankId);
         if (qb) context += `They are viewing the Question Bank: ${qb.title}.\n`;
      }
    }
  } catch (err) {
    console.error("Error building AI context:", err);
  }

  return context;
};
