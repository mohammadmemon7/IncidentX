const Groq = require('groq-sdk');

const apiKey = (process.env.GROQ_API_KEY || '').trim();
if (!apiKey || apiKey === 'your_groq_api_key_here') {
  console.warn("GROQ_API_KEY is not set or is still using the placeholder!");
}
const groq = new Groq({ apiKey });

const withRetry = async (fn, retries = 2) => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries) throw error;
      await new Promise(res => setTimeout(res, 1000 * Math.pow(2, i))); // Exponential backoff
    }
  }
};

const analyzeLog = async (logPayload) => {
  const { service, log_level, message } = logPayload;
  const prompt = `Analyze this service log and determine if it indicates a production incident.
  Service: ${service}, Level: ${log_level}, Message: ${message}
  Respond in JSON ONLY: { "is_incident": true/false, "title": "...", "severity": "critical/major/minor", "probable_cause": "..." }`;
  
  try {
    const result = await withRetry(() => groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    }));
    
    return JSON.parse(result.choices[0].message.content);
  } catch (error) { 
    console.error("AI Auto-detection error:", error);
    return null; 
  }
};

const generateIncidentSummary = async (incident, updates) => {
  const prompt = `Summarize this incident for stakeholders (2-3 sentences): ${incident.title}. Service: ${incident.service}. Timeline: ${updates.map(u => u.message).join('; ')}`;
  try {
    const result = await withRetry(() => groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
    }));
    return result.choices[0].message.content.trim();
  } catch (error) { 
    console.error("AI Summary error:", error);
    return 'Summary unavailable.'; 
  }
};

const suggestRootCause = async (incident, updates) => {
  const prompt = `Suggest top 3 root causes for: ${incident.title}. Timeline: ${updates.map(u => u.message).join('; ')}. Respond in JSON: { "suggestions": [{ "cause": "...", "confidence": "..." }] }`;
  try {
    const result = await withRetry(() => groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    }));
    return JSON.parse(result.choices[0].message.content);
  } catch (error) { 
    console.error("AI Root Cause error:", error);
    return { suggestions: [] }; 
  }
};

const findSimilarIncidents = async (incident) => {
  const Incident = require('../models/Incident');
  return await Incident.find({
    service: incident.service,
    status: 'resolved',
    _id: { $ne: incident._id }
  }).sort({ createdAt: -1 }).limit(3);
};

const generatePostmortem = async (incident, updates) => {
  const similar = await findSimilarIncidents(incident);
  const prompt = `Generate a markdown postmortem for: ${incident.title}. 
  Timeline: ${updates.map(u => u.message).join('; ')}. 
  Similar past incidents for institutional memory: ${JSON.stringify(similar.map(s => ({ title: s.title, summary: s.aiSummary })))}
  Include sections: What Happened, Root Cause, Impact, Action Items, and Lessons from History.`;
  
  try {
    const result = await withRetry(() => groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
    }));
    return result.choices[0].message.content.trim();
  } catch (error) { 
    console.error("AI Postmortem error:", error);
    return 'Postmortem generation failed.'; 
  }
};

module.exports = { analyzeLog, generateIncidentSummary, suggestRootCause, generatePostmortem, findSimilarIncidents };
