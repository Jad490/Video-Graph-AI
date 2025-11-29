export const analyzeVideoWithGemini = async (apiKey, frames) => {
  const PROMPT = `
  You are a video intelligence engine. Analyze the provided video frames (labeled by timestamp).

  TASK:
  1. Generate a temporal caption log of what happens in the video.
  2. Extract a Knowledge Graph of entities (people, objects, locations) and their interactions.

  OUTPUT FORMAT (Strict JSON):
  {
    "captions": [
      { "time": number, "text": "description of event at this time" }
    ],
    "nodes": [
      { "id": "unique_id", "label": "Readable Name", "type": "person"|"object"|"location"|"animal", "group": 1-4 }
    ],
    "links": [
      { "source": "source_node_id", "target": "target_node_id", "label": "short_active_verb" }
    ]
  }

  GUIDELINES:
  - Consolidate similar nodes (e.g., don't create "Person A" and "Man" if they are the same).
  - Ensure 'source' and 'target' in links match the 'id' in nodes exactly.

  RELATIONSHIP LOGIC (CRITICAL):
  - Links must read naturally as Subject -> Verb -> Object.
  - Examples of GOOD logic:
    - "Robber" --threatens--> "Cashier" (Action is directed at target)
    - "Robber" --holds--> "Gun" (Person interacts with object)
    - "Cashier" --hands_over--> "Money" (Action performed on object)
  - Examples of BAD logic to AVOID:
    - "Robber" --threatens with--> "Cashier" (Wrong: implies Cashier is the weapon)
    - "Cashier" --gives to--> "Money" (Wrong: implies Money is the recipient)
  - Use concise active verbs: "holds", "enters", "takes", "threatens", "opens".
  `

  const contents = [
    {
      parts: [
        { text: PROMPT },
        ...frames.map(f => ({
          inlineData: {
            mimeType: 'image/jpeg',
            data: f.data
          }
        }))
      ]
    }
  ]

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.4,
          responseMimeType: 'application/json'
        }
      })
    }
  )

  if (!response.ok) {
    let err
    try {
      err = await response.json()
    } catch {
      throw new Error('API Error')
    }
    throw new Error(err.error?.message || 'API Error')
  }

  const data = await response.json()
  let textResponse = data.candidates[0].content.parts[0].text
  textResponse = textResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '')
  return JSON.parse(textResponse)
}
