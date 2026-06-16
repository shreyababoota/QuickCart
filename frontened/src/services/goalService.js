import axiosInstance, { getErrorMessage } from './api'

export async function fetchGoals() {
  try {
    const { data } = await axiosInstance.get('/api/goals/')
    return Array.isArray(data) ? data : []
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to load goals'))
  }
}

export async function createGoal({ goal_text, budget }) {
  try {
    const { data } = await axiosInstance.post('/api/goals/create', {
      goal: goal_text,
      budget: Number(budget) || 0,
    })
    return data.goal
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to create goal'))
  }
}

export async function updateGoal(goalId, patch) {
  try {
    const { data } = await axiosInstance.patch(`/api/goals/${goalId}`, patch)
    return data.goal
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to update goal'))
  }
}

export async function deleteGoal(goalId) {
  try {
    const { data } = await axiosInstance.delete(`/api/goals/${goalId}`)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to delete plan'))
  }
}

export async function fetchGoalBudget(goalId) {
  try {
    const { data } = await axiosInstance.get(`/api/goals/${goalId}/budget`)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to load budget'))
  }
}
