// সব AI Module call এখান থেকে হবে
const AI_BASE_URL = process.env.AI_MODULE_URL || 'http://localhost:8000'

async function callAI(endpoint, body) {
  const response = await fetch(`${AI_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  
  if (!response.ok) {
    let errorDetail = '';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || JSON.stringify(errorJson);
    } catch (e) {
      try {
        errorDetail = await response.text();
      } catch (err) {
        errorDetail = response.statusText;
      }
    }
    throw new Error(`AI Module error: ${response.status} - ${errorDetail}`);
  }
  
  return response.json()
}

module.exports = { callAI }
