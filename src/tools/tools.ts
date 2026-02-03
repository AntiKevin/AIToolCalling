export const tools = [
  {
    type: 'function',
    function: {
      name: 'get_weather',
      description: 'Obtém a previsão do tempo para uma cidade específica.',
      parameters: {
        type: 'object',
        properties: {
          city: { type: 'string', description: 'O nome da cidade' },
        },
        required: ['city'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_time',
      description: 'Obtém a hora atual para uma cidade.',
      parameters: {
        type: 'object',
        properties: {
          city: { type: 'string', description: 'O nome da cidade' },
        },
        required: ['city'],
      },
    },
  }
];