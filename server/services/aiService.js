const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const analyzeLog = async (logPayload) => {
  const { service, log_level, message } = logPayload;
  const prompt = `Analyze this service log and determine if it indicates a production incident.
Service: ${service}, Level: ${log_level}, Message: ${message}
Respond in JSON ONLY: { "is_incident": true/false, "title": "...", "severity": "critical/major/minor", "probable_cause": "..." }`;
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (error) { return null; }
};

const generateIncidentSummary = async (incident, updates) => {
  const prompt = `Summarize this incident for stakeholders (2-3 sentences): ${incident.title}. Service: ${incident.service}. Timeline: ${updates.map(u => u.message).join('; ')}`;
  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) { return 'Summary unavailable.'; }
};

const suggestRootCause = async (incident, updates) => {
  const prompt = `Suggest top 3 root causes for: ${incident.title}. Timeline: ${updates.map(u => u.message).join('; ')}. Respond in JSON: { "suggestions": [{ "cause": "...", "confidence": "..." }] }`;
  try {
    const result = await model.generateContent(prompt);
    const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { suggestions: [] };
  } catch (error) { return { suggestions: [] }; }
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
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) { return 'Postmortem generation failed.'; }
};

module.exports = { analyzeLog, generateIncidentSummary, suggestRootCause, generatePostmortem, findSimilarIncidents };
