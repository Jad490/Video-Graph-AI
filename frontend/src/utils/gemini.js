export const MOCK_SCENARIO = {
  name: 'Demo Mode (No API Key)',
  captions: [
    { time: 1, text: 'A young woman in a red coat enters the frame from the left.' },
    { time: 4, text: 'She stops to check her phone near a park bench.' },
    { time: 7, text: 'A blue sedan drives past in the background.' }
  ],
  nodes: [
    { id: 'woman', label: 'Woman', type: 'person', group: 1 },
    { id: 'coat', label: 'Red Coat', type: 'object', group: 2 },
    { id: 'phone', label: 'Smartphone', type: 'object', group: 2 },
    { id: 'bench', label: 'Park Bench', type: 'object', group: 2 },
    { id: 'car', label: 'Blue Sedan', type: 'object', group: 2 }
  ],
  links: [
    { source: 'woman', target: 'coat', label: 'wearing' },
    { source: 'woman', target: 'phone', label: 'holding' },
    { source: 'woman', target: 'bench', label: 'near' },
    { source: 'car', target: 'bench', label: 'drives past' }
  ]
}
