import axiosClient from './axiosClient';

// we have only 3 endpoints currently, all goes here.
export const ExperimentApi = {
  runExperiment: (prompt, combinations, mock) =>
    axiosClient.post('/generate', { prompt, combinations, mock }),

  getExperiments: (limit, offset) =>
    axiosClient.get(`/experiments?limit=${limit}&offset=${offset}`),

  getExperimentById: (id) =>
    axiosClient.get(`/experiments/${id}`),
};
