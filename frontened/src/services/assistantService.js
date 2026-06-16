import axiosInstance, { getErrorMessage } from './api'

export async function startAssistantSession(message, context = {}) {
  try {
    const { data } = await axiosInstance.post('/api/assistant/start', { 
      message,
      context,
    })
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to start assistant session'))
  }
}

export async function answerAssistantQuestion(sessionId, answer, context = {}) {
  try {
    const { data } = await axiosInstance.post('/api/assistant/answer', {
      session_id: sessionId,
      answer,
      context,
    })
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to process answer'))
  }
}
