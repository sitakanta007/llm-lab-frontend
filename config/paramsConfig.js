// only prompt parameters goes here. For other parameters scroll down to SITE_CONFIG.
export const PARAMS_CONFIG = {
  temperature: {
    label: 'Temperature',
    tooltip: 'Controls the randomness of the output; higher values produce more creative and varied responses.',
    defaultRange: [0.4, 0.6],
    defaultStep: 0.05,
    sliderMin: 0,
    sliderMax: 1,
    sliderStep: 0.01,
  },
  top_p: {
    label: 'Top_p',
    tooltip: 'Limits the probability mass considered when generating text; lower values make output more focused.',
    defaultRange: [0.5, 0.7],
    defaultStep: 0.05,
    sliderMin: 0,
    sliderMax: 1,
    sliderStep: 0.01,
  },
  coherence: {
    label: 'Coherence',
    tooltip: 'Adjusts structural consistency of the response, influencing how logically and smoothly ideas flow.',
    defaultRange: [0.6, 0.8],
    defaultStep: 0.1,
    sliderMin: 0,
    sliderMax: 1,
    sliderStep: 0.01,
  },
  frequency_penalty: {
    label: 'Frequency_penalty',
    tooltip: 'Penalizes tokens that appear more frequently, reducing repetition and encouraging more varied word choices.',
    defaultRange: [0.0, 0.3],
    defaultStep: 0.05,
    sliderMin: 0,
    sliderMax: 2,
    sliderStep: 0.1,
  },
  /* presence_penalty: {
    label: 'Presence Penalty',
    tooltip: 'Controls repetitiveness in generation.',
    defaultRange: [0.2, 0.4],
    defaultStep: 0.05,
    sliderMin: 0,
    sliderMax: 1,
    sliderStep: 0.01,
  }, */
};


export const SITE_CONFIG = {
    comboLimit: 100,
    promptSubmitLabel: 'Run Experiment'
}
