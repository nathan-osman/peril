export default function (state = {}, action) {
  switch (action.type) {
    case "sync":
      return action.payload
    case "delta":
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
