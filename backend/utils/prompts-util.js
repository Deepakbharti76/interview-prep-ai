export const questionAnswerPrompt = (
  role,
  experience,
  topicsToFocus,
  numberOfQuestions,
) => {
  return `
You are a senior software engineer conducting a real technical interview.

Generate exactly ${numberOfQuestions} interview questions and answers.

Candidate Profile:
- Role: ${role}
- Experience: ${experience}
- Topics: ${topicsToFocus || "general topics for this role"}

Instructions:
- Questions should be realistic and commonly asked in interviews
- Keep difficulty according to experience level
- Keep questions clear and not overly long

Answer Rules:
- Start with **Definition**
- Use bullet points for explanation
- Keep answers short and easy to understand
- Add a small \`\`\`js code example (max 10 lines) only if needed
- Do NOT write long paragraphs

IMPORTANT:
- Return ONLY valid JSON
- No explanation outside JSON
- No markdown wrapper like \`\`\`

Format:
[
  {
    "question": "string",
    "answer": "**Definition:** ...\\n\\n**Key Points:**\\n- Point 1\\n- Point 2\\n\\n\`\`\`js\\n// example\\n\`\`\`"
  }
]
`;
};

// ================= EXPLAIN PROMPT =================

export const conceptExplainPrompt = (question) => {
  return `
You are a senior developer explaining a concept to a junior developer.

Explain this interview question clearly:
"${question}"

Instructions:
1. Start with a **one-line definition**
2. Explain in 2–3 short paragraphs
3. Use bullet points where needed
4. Add a small \`\`\`js code example if relevant (max 10 lines)
5. End with **Key Takeaway**

IMPORTANT:
- Return ONLY JSON
- No extra text outside JSON

Format:
{
  "title": "Short title (max 5 words)",
  "explanation": "**Definition:** ...\\n\\nExplanation...\\n\\n**Key Takeaway:** ..."
}
`;
};
